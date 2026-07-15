import { after } from "next/server";
import { accountFromRequest } from "@/lib/portal/auth";
import { sendDirectRegistrationConfirmedEmail, sendEnrollmentConfirmedEmail } from "@/lib/portal/email";
import { assertCsrf, cleanText } from "@/lib/portal/security";
import { audit, mutatePortalDatabase, readPortalDatabase } from "@/lib/portal/store";
import { apiError } from "@/lib/portal/validation";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure admin session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  const admin = await accountFromRequest(request, { verified: true, admin: true });
  if (!admin) return apiError("Administrator access is required.", 403, "ADMIN_REQUIRED");
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const id = cleanText(payload.enrollmentId || payload.registrationId, 80), action = cleanText(payload.action, 20), recordType = cleanText(payload.recordType, 30);
  if (!id) return apiError("The registration identifier is missing.");
  try {
    if (recordType === "direct-registration") {
      if (action === "confirm") {
        const registration = await mutatePortalDatabase((database) => {
          const item = database.registrations.find((entry) => entry.id === id); if (!item) throw new Error("NOT_FOUND");
          const payment = database.payments.filter((entry) => entry.registrationId === item.id).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
          if (!payment || payment.status !== "Pending Verification") throw new Error("PAYMENT_NOT_PENDING");
          const now = new Date().toISOString(); payment.status = "Confirmed"; payment.verifiedAt = now; payment.verifiedByAccountId = admin.id; item.paymentStatus = "Confirmed"; item.registrationStatus = "Active"; item.updatedAt = now;
          audit(database, request, admin.id, "payment.confirmed", "registration", item.id, item.registrationReference); return item;
        });
        after(() => sendDirectRegistrationConfirmedEmail(registration).then(() => undefined));
        return Response.json({ success: true, message: "Payment confirmed and registration activated." });
      }
      if (action === "resend") {
        const registration = (await readPortalDatabase()).registrations.find((entry) => entry.id === id && entry.paymentStatus === "Confirmed");
        if (!registration) return apiError("A confirmed registration was not found.", 404, "NOT_FOUND");
        after(() => sendDirectRegistrationConfirmedEmail(registration).then(() => undefined));
        return Response.json({ success: true, message: "Confirmation email queued." });
      }
    }
    if (action === "confirm") {
      const saved = await mutatePortalDatabase((database) => {
        const enrollment = database.enrollments.find((item) => item.id === id); if (!enrollment) throw new Error("NOT_FOUND");
        const payment = database.payments.filter((item) => item.enrollmentId === enrollment.id).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0];
        if (!payment || payment.status !== "Pending Verification") throw new Error("PAYMENT_NOT_PENDING");
        const now = new Date().toISOString(); payment.status = "Confirmed"; payment.verifiedAt = now; payment.verifiedByAccountId = admin.id; enrollment.paymentStatus = "Confirmed"; enrollment.enrollmentStatus = "Active"; enrollment.updatedAt = now;
        audit(database, request, admin.id, "payment.confirmed", "enrollment", enrollment.id, enrollment.registrationReference); return enrollment;
      });
      const database = await readPortalDatabase(), account = database.accounts.find((item) => item.id === saved.accountId), student = database.students.find((item) => item.id === saved.studentId), karateClass = database.classes.find((item) => item.id === saved.classId);
      if (account && student && karateClass) after(() => sendEnrollmentConfirmedEmail(account, student, karateClass, saved).then(() => undefined));
      return Response.json({ success: true, message: "Payment confirmed and enrollment activated." });
    }
    if (action === "resend") {
      const database = await readPortalDatabase(), enrollment = database.enrollments.find((item) => item.id === id && item.paymentStatus === "Confirmed");
      if (!enrollment) return apiError("A confirmed enrollment was not found.", 404, "NOT_FOUND");
      const account = database.accounts.find((item) => item.id === enrollment.accountId), student = database.students.find((item) => item.id === enrollment.studentId), karateClass = database.classes.find((item) => item.id === enrollment.classId);
      if (!account || !student || !karateClass) return apiError("Enrollment data is incomplete.", 500, "INCOMPLETE_DATA");
      after(() => sendEnrollmentConfirmedEmail(account, student, karateClass, enrollment).then(() => undefined));
      return Response.json({ success: true, message: "Confirmation email queued." });
    }
    return apiError("Unknown administrator action.");
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    if (reason === "NOT_FOUND") return apiError("Registration not found.", 404, reason);
    if (reason === "PAYMENT_NOT_PENDING") return apiError("No payment is awaiting verification.", 409, reason);
    const errorReference = `ADMIN-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; console.error(errorReference, error);
    return Response.json({ success: false, code: "SERVER_ERROR", message: "The administrator action could not be completed.", errorReference }, { status: 500 });
  }
}
