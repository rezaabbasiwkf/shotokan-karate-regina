import { after } from "next/server";
import { accountFromRequest } from "@/lib/portal/auth";
import { sendEnrollmentEmails } from "@/lib/portal/email";
import { assertCsrf } from "@/lib/portal/security";
import { audit, mutatePortalDatabase, newId } from "@/lib/portal/store";
import { apiError, validationResponse } from "@/lib/portal/validation";

function registrationReference(existing: Set<string>) {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const candidate = `REG-${year}-${Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0")}`;
    if (!existing.has(candidate)) return candidate;
  }
  throw new Error("REFERENCE_GENERATION_FAILED");
}

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  let account;
  try { account = await accountFromRequest(request, { verified: true }); }
  catch (error) { const reference = `REG-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; console.error(reference, error); return apiError(`The server could not load your account. Error reference: ${reference}.`, 500, "SERVER_ERROR"); }
  if (!account) return apiError("Please log in and verify your email before enrolling.", 401, "AUTH_REQUIRED");
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const studentId = typeof payload.studentId === "string" ? payload.studentId : "";
  const classId = typeof payload.classId === "string" ? payload.classId : "";
  const errors: Record<string, string> = {};
  if (!studentId) errors.studentId = "Please add at least one student before enrolling.";
  if (!classId) errors.classId = "Please select a class.";
  if (Object.keys(errors).length) return validationResponse(errors);
  try {
    const saved = await mutatePortalDatabase((database) => {
      const student = database.students.find((item) => item.id === studentId && item.accountId === account.id);
      if (!student) throw new Error("STUDENT_NOT_FOUND");
      const karateClass = database.classes.find((item) => item.id === classId);
      if (!karateClass || karateClass.registrationStatus === "Closed") throw new Error("CLASS_CLOSED");
      const classSession = database.class_sessions.find((item) => item.classId === classId && item.active);
      if (!classSession) throw new Error("NO_ACTIVE_SESSION");
      if (database.enrollments.some((item) => item.studentId === studentId && item.classId === classId && item.classSessionId === classSession.id && item.enrollmentStatus !== "Cancelled")) throw new Error("DUPLICATE_ENROLLMENT");
      const occupied = database.enrollments.filter((item) => item.classId === classId && item.classSessionId === classSession.id && item.enrollmentStatus !== "Cancelled").length;
      if (occupied >= karateClass.capacity) throw new Error("CLASS_FULL");
      const waiver = database.waiver_acceptances.filter((item) => item.accountId === account.id && item.studentId === studentId && item.consentType === "liability-waiver" && item.accepted).sort((a,b)=>b.acceptedAt.localeCompare(a.acceptedAt))[0];
      if (!waiver) throw new Error("WAIVER_REQUIRED");
      const now = new Date().toISOString();
      const enrollment = { id: newId("enrollment"), registrationReference: "", accountId: account.id, studentId, classId, classSessionId: classSession.id, enrollmentStatus: "Pending Payment" as const, paymentStatus: "Not Paid" as const, waiverAcceptedAt: waiver.acceptedAt, tuitionCents: karateClass.tuitionCents, createdAt: now, updatedAt: now };
      database.enrollments.push(enrollment);
      enrollment.registrationReference = registrationReference(new Set(database.enrollments.map((item) => item.registrationReference).filter(Boolean)));
      audit(database, request, account.id, "enrollment.created", "enrollment", enrollment.id, enrollment.registrationReference);
      const contact = database.emergency_contacts.find((item) => item.accountId === account.id);
      if (!contact) throw new Error("EMERGENCY_CONTACT_REQUIRED");
      return { enrollment, student, karateClass, contact };
    });
    after(() => sendEnrollmentEmails(account, saved.student, saved.contact, saved.karateClass, saved.enrollment).then(() => undefined));
    return Response.json({ success: true, registrationReference: saved.enrollment.registrationReference, paymentUrl: `/payment?reference=${encodeURIComponent(saved.enrollment.registrationReference)}`, reviewUrl: `/account/enroll/confirmation?reference=${encodeURIComponent(saved.enrollment.registrationReference)}` });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    if (reason === "STUDENT_NOT_FOUND") return apiError("The selected student could not be found in your family account.", 404, reason);
    if (reason === "CLASS_CLOSED" || reason === "NO_ACTIVE_SESSION") return apiError("This class is not currently accepting registrations.", 409, reason);
    if (reason === "DUPLICATE_ENROLLMENT") return apiError("This student is already enrolled in this class.", 409, reason);
    if (reason === "CLASS_FULL") return apiError("This class is currently full.", 409, reason);
    if (reason === "WAIVER_REQUIRED") return apiError("You must accept the Liability Waiver before enrolling.", 409, reason);
    const reference = `REG-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; console.error(reference, error);
    return apiError(`The server could not save this enrollment. Error reference: ${reference}.`, 500, "SERVER_ERROR");
  }
}
