import { accountFromRequest } from "@/lib/portal/auth";
import { ageFromDateOfBirth, assertCsrf, cleanText, POLICY_VERSION } from "@/lib/portal/security";
import { audit, clientIp, mutatePortalDatabase, newId } from "@/lib/portal/store";
import { apiError, emailPattern, phonePattern, validationResponse } from "@/lib/portal/validation";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  const account = await accountFromRequest(request, { verified: true });
  if (!account) return apiError("Please log in and verify your email before adding a student.", 401, "AUTH_REQUIRED");
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const fullName = cleanText(payload.fullName, 160);
  const dateOfBirth = cleanText(payload.dateOfBirth, 10);
  const gender = cleanText(payload.gender, 40);
  const phone = cleanText(payload.phone, 40);
  const email = cleanText(payload.email, 254).toLowerCase();
  const previousExperience = cleanText(payload.previousExperience, 1200);
  const medicalChoice = cleanText(payload.medicalChoice, 3);
  const medicalDetails = cleanText(payload.medicalDetails, 1600);
  const electronicSignature = cleanText(payload.electronicSignature, 160);
  const age = ageFromDateOfBirth(dateOfBirth);
  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Please enter the student’s full name.";
  if (age === null) errors.dateOfBirth = "Please enter a valid date of birth."; else if (age < 5) errors.dateOfBirth = "Students must be at least five years old.";
  if (!["Female", "Male", "Non-binary", "Prefer not to say"].includes(gender)) errors.gender = "Please select a gender option.";
  if (phone && !phonePattern.test(phone)) errors.phone = "Please enter a valid student phone number or leave it blank.";
  if (email && !emailPattern.test(email)) errors.email = "Please enter a valid student email address or leave it blank.";
  if (!previousExperience) errors.previousExperience = "Please describe previous karate or martial arts experience, or enter “None”.";
  if (!["Yes", "No"].includes(medicalChoice)) errors.medicalChoice = "Please select Yes or No.";
  if (medicalChoice === "Yes" && !medicalDetails) errors.medicalDetails = "Please provide relevant medical, injury, allergy, or limitation details.";
  if (!payload.acceptsWaiver) errors.acceptsWaiver = "You must accept the Liability Waiver.";
  if (!electronicSignature) errors.electronicSignature = "Please enter the required electronic signature.";
  if (Object.keys(errors).length) return validationResponse(errors);

  const studentId = newId("student");
  const now = new Date().toISOString();
  try {
    await mutatePortalDatabase((database) => {
      if (database.students.some((item) => item.accountId === account.id && item.fullName.toLowerCase() === fullName.toLowerCase() && item.dateOfBirth === dateOfBirth)) throw new Error("DUPLICATE_STUDENT");
      database.students.push({ id: studentId, accountId: account.id, fullName, dateOfBirth, gender, phone, email, previousExperience, hasMedicalConditions: medicalChoice === "Yes", medicalDetails: medicalChoice === "Yes" ? medicalDetails : "", guardianName: age !== null && age < 18 ? `${account.firstName} ${account.lastName}` : "", guardianPhone: age !== null && age < 18 ? account.phone : "", guardianEmail: age !== null && age < 18 ? account.email : "", photoVideoPermission: Boolean(payload.photoVideoPermission), electronicSignature, createdAt: now, updatedAt: now });
      database.waiver_acceptances.push({ id: newId("consent"), accountId: account.id, studentId, consentType: "liability-waiver", accepted: true, version: POLICY_VERSION, acceptedAt: now, ipAddress: clientIp(request) });
      database.waiver_acceptances.push({ id: newId("consent"), accountId: account.id, studentId, consentType: "photo-video-consent", accepted: Boolean(payload.photoVideoPermission), version: POLICY_VERSION, acceptedAt: now, ipAddress: clientIp(request) });
      audit(database, request, account.id, "student.created", "student", studentId);
    });
    return Response.json({ success: true, studentId, nextUrl: `/account/enroll?student=${encodeURIComponent(studentId)}` });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_STUDENT") return apiError("This student is already attached to your family account.", 409, "DUPLICATE_STUDENT");
    const reference = `STUDENT-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; console.error(reference, error);
    return apiError(`The student could not be saved. Error reference: ${reference}.`, 500, "SERVER_ERROR");
  }
}
