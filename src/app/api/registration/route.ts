import { after, NextResponse } from "next/server";
import { findRecentRegistrationByEmail, saveRegistration, updateRegistration } from "@/lib/registration-store";
import { sendRegistrationNotification, sendRegistrationReceivedEmail } from "@/lib/email";

type Payload = Record<string, unknown>;
const phonePattern = /^[+\d][\d\s().-]{6,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function rateLimited(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now(); const entry = rateLimit.get(key);
  if (!entry || entry.resetAt < now) { rateLimit.set(key, { count: 1, resetAt: now + 60_000 }); return false; }
  entry.count += 1; return entry.count > 8;
}

function ageFromDateOfBirth(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  if (today.getMonth() < date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())) age -= 1;
  return age;
}

function validationError(fieldErrors: Record<string, string>) {
  return NextResponse.json({ success: false, code: "VALIDATION_ERROR", message: "Please correct the highlighted fields.", fieldErrors }, { status: 400 });
}

function stringField(payload: Payload, name: string) { return typeof payload[name] === "string" ? payload[name].trim() : ""; }

export async function POST(request: Request) {
  if (rateLimited(request)) return NextResponse.json({ success: false, code: "RATE_LIMITED", message: "Please wait a moment before submitting again." }, { status: 429 });
  let payload: Payload;
  try { payload = (await request.json()) as Payload; } catch { return NextResponse.json({ success: false, code: "INVALID_REQUEST", message: "Please submit the registration form again." }, { status: 400 }); }

  if (stringField(payload, "website")) return NextResponse.json({ success: false, code: "SPAM_DETECTED", message: "This registration could not be submitted." }, { status: 400 });

  const errors: Record<string, string> = {};
  const required = ["fullName", "dateOfBirth", "gender", "phoneNumber", "emailAddress", "homeAddress", "emergencyContactName", "emergencyContactPhone", "similarProgramsBefore", "heardAbout", "medicalCondition", "attendRegularly"];
  const friendlyNames: Record<string, string> = { fullName: "full name", dateOfBirth: "date of birth", gender: "gender", phoneNumber: "phone number", emailAddress: "email address", homeAddress: "home address", emergencyContactName: "emergency contact name", emergencyContactPhone: "emergency contact phone number", similarProgramsBefore: "previous program participation", heardAbout: "how you heard about us", medicalCondition: "medical conditions", attendRegularly: "attendance commitment" };
  required.forEach((field) => { if (!stringField(payload, field)) errors[field] = `Please enter ${friendlyNames[field]}.`; });

  const age = ageFromDateOfBirth(payload.dateOfBirth);
  if (age === null || age < 5) errors.dateOfBirth = "Participants must be at least 5 years old.";
  if (stringField(payload, "emailAddress") && !emailPattern.test(stringField(payload, "emailAddress"))) errors.emailAddress = "Please enter a valid email address.";
  if (stringField(payload, "phoneNumber") && !phonePattern.test(stringField(payload, "phoneNumber"))) errors.phoneNumber = "Please enter a valid phone number.";
  if (stringField(payload, "emergencyContactPhone") && !phonePattern.test(stringField(payload, "emergencyContactPhone"))) errors.emergencyContactPhone = "Please enter a valid emergency contact phone number.";
  if (!["Female", "Male", "Non-binary", "Prefer not to say"].includes(stringField(payload, "gender"))) errors.gender = "Please select a gender option.";
  if (!["Yes", "No"].includes(stringField(payload, "similarProgramsBefore"))) errors.similarProgramsBefore = "Please select Yes or No.";
  if (!["Yes", "No"].includes(stringField(payload, "medicalCondition"))) errors.medicalCondition = "Please select Yes or No.";
  if (stringField(payload, "medicalCondition") === "Yes" && !stringField(payload, "medicalDetails")) errors.medicalDetails = "Please provide relevant details.";
  if (!["Yes", "No"].includes(stringField(payload, "attendRegularly"))) errors.attendRegularly = "Please select Yes or No.";
  if (stringField(payload, "heardAbout") === "Other" && !stringField(payload, "heardAboutOther")) errors.heardAboutOther = "Please provide details.";
  if ((age ?? 18) < 18) {
    if (!stringField(payload, "parentGuardianName")) errors.parentGuardianName = "Please enter a parent or guardian name.";
    if (!phonePattern.test(stringField(payload, "parentGuardianPhone"))) errors.parentGuardianPhone = "Please enter a valid parent or guardian phone number.";
    if (!emailPattern.test(stringField(payload, "parentGuardianEmail"))) errors.parentGuardianEmail = "Please enter a valid parent or guardian email address.";
    if (!stringField(payload, "parentGuardianSignature")) errors.parentGuardianSignature = "Parent or guardian signature is required.";
  }
  (["informationAccurate", "understandsRisks", "followsRules", "authorizeEmergencyTreatment", "feesNonRefundable", "acceptsWaiver"] as const).forEach((field) => { if (!payload[field]) errors[field] = "This acknowledgement is required."; });
  if (!stringField(payload, "participantSignature")) errors.participantSignature = "Please enter your electronic signature.";
  if (Object.keys(errors).length) return validationError(errors);

  const allowedFields = ["fullName", "dateOfBirth", "gender", "phoneNumber", "emailAddress", "homeAddress", "emergencyContactName", "emergencyContactPhone", "parentGuardianName", "parentGuardianPhone", "parentGuardianEmail", "similarProgramsBefore", "heardAbout", "heardAboutOther", "medicalCondition", "medicalDetails", "attendRegularly", "informationAccurate", "understandsRisks", "followsRules", "authorizeEmergencyTreatment", "photoPermission", "feesNonRefundable", "acceptsWaiver", "participantSignature", "parentGuardianSignature"];
  const normalizedPayload: Record<string, unknown> = Object.fromEntries(allowedFields.map((key) => [key, typeof payload[key] === "string" ? String(payload[key]).trim() : Boolean(payload[key])]));
  normalizedPayload.age = age;
  normalizedPayload.program = "SHOTOKAN Karate Regina General Registration";
  normalizedPayload.registrationStatus = "Pending Payment";
  normalizedPayload.paymentStatus = "Not Paid";

  try {
    if (await findRecentRegistrationByEmail(stringField(payload, "emailAddress"))) {
      return NextResponse.json({ success: false, code: "DUPLICATE_REGISTRATION", message: "A registration with this email address was recently submitted." }, { status: 409 });
    }
    const submission = await saveRegistration(normalizedPayload);
    after(async () => {
      const emailResults = await Promise.allSettled([sendRegistrationNotification(submission), sendRegistrationReceivedEmail(submission)]);
      const adminEmailSent = emailResults[0].status === "fulfilled" && emailResults[0].value.sent;
      const participantEmailSent = emailResults[1].status === "fulfilled" && emailResults[1].value.sent;
      await updateRegistration(submission.id, { adminRegistrationEmailStatus: adminEmailSent ? "Sent" : "Failed", participantRegistrationEmailStatus: participantEmailSent ? "Sent" : "Failed" }).catch((error) => console.error("Registration email status update failed", error));
      emailResults.forEach((result, index) => {
        if (result.status === "rejected") console.error(index === 0 ? "Registration administrator email failed" : "Registration participant email failed", result.reason);
      });
    });
    const paymentUrl = `/payment?reference=${encodeURIComponent(submission.id)}`;
    return NextResponse.json({ success: true, registrationReference: submission.id, paymentUrl, submission: { id: submission.id, fullName: submission.fullName } });
  } catch (error) {
    console.error("Registration storage failed", error);
    const errorReference = `REG-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    console.error(errorReference, "Registration storage failed", error);
    return NextResponse.json({ success: false, code: "SERVER_ERROR", message: "We could not complete your registration due to a technical issue.", errorReference }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, code: "METHOD_NOT_ALLOWED", message: "This endpoint does not provide public registration records." }, { status: 405 });
}
