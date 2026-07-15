import { after, NextResponse } from "next/server";
import { sendDirectRegistrationEmails } from "@/lib/portal/email";
import { rateLimited } from "@/lib/portal/rate-limit";
import { ageFromDateOfBirth, assertCsrf, cleanText, POLICY_VERSION, registrationAccessCookie, sha256 } from "@/lib/portal/security";
import { audit, clientIp, mutatePortalDatabase, newId } from "@/lib/portal/store";
import type { Registration } from "@/lib/portal/types";
import { apiError, emailPattern, phonePattern, validationResponse } from "@/lib/portal/validation";

export const runtime = "nodejs";

function createReference(existing: Set<string>) {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const candidate = `REG-${year}-${Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0")}`;
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("REFERENCE_GENERATION_FAILED");
}

function checked(value: unknown) { return value === true; }

export async function POST(request: Request) {
  try { assertCsrf(request); }
  catch { return apiError("Your secure form session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  try {
    const ip = clientIp(request);
    if (await rateLimited(`registration:${ip}`, 10, 60 * 60_000)) return apiError("Too many registration attempts were submitted from this connection. Please try again later.", 429, "RATE_LIMITED");
    const payload = await request.json().catch(() => null) as Record<string, unknown> | null;
    if (!payload) return apiError("The registration request did not contain valid JSON.", 400, "INVALID_JSON");
    if (cleanText(payload.website)) return apiError("The registration was rejected.", 400, "SPAM_DETECTED");

    const submissionId = cleanText(payload.submissionId, 100);
    const fullName = cleanText(payload.fullName, 160), dateOfBirth = cleanText(payload.dateOfBirth, 10), gender = cleanText(payload.gender, 40);
    const phone = cleanText(payload.phone, 40), email = cleanText(payload.email, 254).toLowerCase(), homeAddress = cleanText(payload.homeAddress, 500);
    const emergencyContactName = cleanText(payload.emergencyContactName, 160), emergencyContactPhone = cleanText(payload.emergencyContactPhone, 40);
    const guardianName = cleanText(payload.guardianName, 160), guardianPhone = cleanText(payload.guardianPhone, 40), guardianEmail = cleanText(payload.guardianEmail, 254).toLowerCase();
    const previousProgram = cleanText(payload.previousProgram, 3), referralSource = cleanText(payload.referralSource, 300);
    const hasMedicalConditionValue = cleanText(payload.hasMedicalCondition, 3), medicalDetails = cleanText(payload.medicalDetails, 2000);
    const participantSignature = cleanText(payload.participantSignature, 160), guardianSignature = cleanText(payload.guardianSignature, 160);
    const errors: Record<string, string> = {};
    const age = ageFromDateOfBirth(dateOfBirth);
    if (!fullName) errors.fullName = "Please enter the participant’s full name.";
    if (age === null) errors.dateOfBirth = "Please enter a valid date of birth.";
    else if (age < 5) errors.dateOfBirth = "Participants must be at least five years old.";
    if (!gender) errors.gender = "Please select a gender.";
    if (!phone) errors.phone = "Please enter a phone number."; else if (!phonePattern.test(phone)) errors.phone = "Please enter a valid phone number.";
    if (!email) errors.email = "Please enter an email address."; else if (!emailPattern.test(email)) errors.email = "Please enter a valid email address.";
    if (!homeAddress) errors.homeAddress = "Please enter the home address.";
    if (!emergencyContactName) errors.emergencyContactName = "Please enter an emergency contact name.";
    if (!emergencyContactPhone) errors.emergencyContactPhone = "Please enter an emergency contact phone number."; else if (!phonePattern.test(emergencyContactPhone)) errors.emergencyContactPhone = "Please enter a valid phone number.";
    if (age !== null && age < 18) {
      if (!guardianName) errors.guardianName = "Please enter the parent or guardian’s full name.";
      if (!guardianPhone) errors.guardianPhone = "Please enter the parent or guardian’s phone number."; else if (!phonePattern.test(guardianPhone)) errors.guardianPhone = "Please enter a valid phone number.";
      if (!guardianEmail) errors.guardianEmail = "Please enter the parent or guardian’s email address."; else if (!emailPattern.test(guardianEmail)) errors.guardianEmail = "Please enter a valid email address.";
      if (!guardianSignature) errors.guardianSignature = "A parent or guardian signature is required for participants under 18.";
    }
    if (previousProgram !== "Yes" && previousProgram !== "No") errors.previousProgram = "Please select Yes or No.";
    if (!referralSource) errors.referralSource = "Please tell us how you heard about the academy.";
    if (hasMedicalConditionValue !== "Yes" && hasMedicalConditionValue !== "No") errors.hasMedicalCondition = "Please select Yes or No.";
    if (hasMedicalConditionValue === "Yes" && !medicalDetails) errors.medicalDetails = "Please provide relevant medical details.";
    if (!checked(payload.attendanceCommitment)) errors.attendanceCommitment = "You must agree to attend regularly and follow academy requirements.";
    const consents: Array<[string, string]> = [["informationConfirmed", "Please confirm that the information is accurate."], ["riskAcknowledged", "You must acknowledge the risks of physical activity."], ["rulesAccepted", "You must agree to academy rules and safety guidelines."], ["emergencyTreatmentAuthorized", "Emergency medical authorization is required."], ["refundPolicyAccepted", "You must acknowledge the Refund Policy."], ["liabilityWaiverAccepted", "You must accept the Liability Waiver."]];
    for (const [name, message] of consents) if (!checked(payload[name])) errors[name] = message;
    if (!participantSignature) errors.participantSignature = "Please type the participant’s electronic signature.";
    if (!submissionId) errors.submissionId = "Please refresh the page and submit the form again.";
    if (Object.keys(errors).length) return validationResponse(errors);

    const accessToken = sha256(`registration-access:${submissionId}`);
    const saved = await mutatePortalDatabase((database) => {
      const duplicate = database.registrations.find((item) => item.submissionId === submissionId);
      if (duplicate) return { registration: duplicate, duplicate: true };
      const now = new Date().toISOString();
      const registration: Registration = {
        id: newId("registration"), registrationReference: "", submissionId, accessTokenHash: sha256(accessToken), fullName, dateOfBirth, calculatedAge: age!, gender, phone, email, homeAddress,
        emergencyContactName, emergencyContactPhone, guardianName: age! < 18 ? guardianName : "", guardianPhone: age! < 18 ? guardianPhone : "", guardianEmail: age! < 18 ? guardianEmail : "",
        previousProgram: previousProgram as "Yes" | "No", referralSource, hasMedicalCondition: hasMedicalConditionValue === "Yes", medicalDetails: hasMedicalConditionValue === "Yes" ? medicalDetails : "", attendanceCommitment: true,
        informationConfirmed: true, riskAcknowledged: true, rulesAccepted: true, emergencyTreatmentAuthorized: true, mediaPermission: checked(payload.mediaPermission), refundPolicyAccepted: true, liabilityWaiverAccepted: true,
        participantSignature, guardianSignature: age! < 18 ? guardianSignature : "", consentedAt: now, consentVersion: POLICY_VERSION, consentIpAddress: ip, registrationStatus: "Pending Payment", paymentStatus: "Not Paid", paymentReference: "", paymentReceiptId: null,
        adminEmailStatus: "Pending", participantEmailStatus: "Pending", tuitionCents: 6000, createdAt: now, updatedAt: now,
      };
      database.registrations.push(registration);
      registration.registrationReference = createReference(new Set([...database.registrations.map((item) => item.registrationReference), ...database.enrollments.map((item) => item.registrationReference)].filter(Boolean)));
      audit(database, request, null, "registration.created", "registration", registration.id, registration.registrationReference);
      return { registration, duplicate: false };
    });
    const paymentPath = `/payment?reference=${encodeURIComponent(saved.registration.registrationReference)}`;
    const baseUrl = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    if (!saved.duplicate) after(async () => {
      const result = await sendDirectRegistrationEmails(saved.registration, `${baseUrl}${paymentPath}`);
      await mutatePortalDatabase((database) => { const item = database.registrations.find((entry) => entry.id === saved.registration.id); if (item) { item.adminEmailStatus = result.admin.sent ? "Sent" : result.admin.reason === "missing-resend-config" ? "Skipped" : "Failed"; item.participantEmailStatus = result.participant.sent ? "Sent" : result.participant.reason === "missing-resend-config" ? "Skipped" : "Failed"; item.updatedAt = new Date().toISOString(); } });
    });
    const response = NextResponse.json({ success: true, registrationReference: saved.registration.registrationReference, paymentUrl: paymentPath });
    response.cookies.set(registrationAccessCookie(accessToken));
    return response;
  } catch (error) {
    const errorReference = `REG-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    console.error(errorReference, error);
    return Response.json({ success: false, code: "SERVER_ERROR", message: "We could not complete your registration due to a technical issue.", errorReference }, { status: 500 });
  }
}
