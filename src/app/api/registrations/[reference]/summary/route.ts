import { accountFromRequest } from "@/lib/portal/auth";
import { parseCookies, REGISTRATION_ACCESS_COOKIE, sha256 } from "@/lib/portal/security";
import { readPortalDatabase } from "@/lib/portal/store";
import { apiError } from "@/lib/portal/validation";

export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  try {
    const { reference } = await params, database = await readPortalDatabase(), account = await accountFromRequest(request);
    const enrollment = account ? database.enrollments.find((item) => item.registrationReference === reference && item.accountId === account.id) : undefined;
    if (enrollment) {
      const student = database.students.find((item) => item.id === enrollment.studentId), karateClass = database.classes.find((item) => item.id === enrollment.classId);
      if (!student || !karateClass) return apiError("Registration data is incomplete.", 500, "INCOMPLETE_DATA");
      return Response.json({ success: true, registration: { participantName: student.fullName, registrationReference: enrollment.registrationReference, tuitionCents: enrollment.tuitionCents, registrationStatus: enrollment.enrollmentStatus, paymentStatus: enrollment.paymentStatus, training: karateClass.name } });
    }
    const token = parseCookies(request)[REGISTRATION_ACCESS_COOKIE] || "";
    const registration = token ? database.registrations.find((item) => item.registrationReference === reference && item.accessTokenHash === sha256(token)) : undefined;
    if (!registration) return apiError("Registration not found.", 404, "NOT_FOUND");
    return Response.json({ success: true, registration: { participantName: registration.fullName, registrationReference: registration.registrationReference, tuitionCents: registration.tuitionCents, registrationStatus: registration.registrationStatus, paymentStatus: registration.paymentStatus, training: "SHOTOKAN Karate Training" } });
  } catch (error) {
    const errorReference = `SUMMARY-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; console.error(errorReference, error);
    return Response.json({ success: false, code: "SERVER_ERROR", message: "The registration summary could not be loaded.", errorReference }, { status: 500 });
  }
}
