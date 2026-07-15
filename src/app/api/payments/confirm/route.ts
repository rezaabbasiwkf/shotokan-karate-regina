import { after } from "next/server";
import { accountFromRequest } from "@/lib/portal/auth";
import { sendDirectPaymentSubmittedEmail, sendPaymentSubmittedEmail } from "@/lib/portal/email";
import { assertCsrf, cleanText, parseCookies, REGISTRATION_ACCESS_COOKIE, sha256 } from "@/lib/portal/security";
import { audit, mutatePortalDatabase, newId } from "@/lib/portal/store";
import { apiError, validationResponse } from "@/lib/portal/validation";

export const runtime = "nodejs";
const allowedTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  try {
    const account = await accountFromRequest(request, { verified: true });
    const accessToken = parseCookies(request)[REGISTRATION_ACCESS_COOKIE] || "";
    const form = await request.formData().catch(() => null);
    if (!form) return apiError("The payment form could not be read.", 400, "INVALID_FORM");
    const reference = cleanText(form.get("registrationReference"), 40).toUpperCase(), transactionReference = cleanText(form.get("transactionReference"), 120), receipt = form.get("receipt");
    const errors: Record<string, string> = {};
    if (!reference) errors.registrationReference = "The registration reference is missing.";
    if (!transactionReference) errors.transactionReference = "Please enter the transaction reference from your PayPal receipt.";
    let receiptData: { fileName: string; contentType: string; size: number; dataBase64: string } | null = null;
    if (receipt instanceof File && receipt.size > 0) {
      if (receipt.size > 2 * 1024 * 1024) errors.receipt = "Receipt files must be 2 MB or smaller.";
      else if (!allowedTypes.has(receipt.type)) errors.receipt = "Upload a JPG, PNG, or PDF receipt.";
      else receiptData = { fileName: receipt.name.slice(0, 180).replace(/[\r\n]/g, ""), contentType: receipt.type, size: receipt.size, dataBase64: Buffer.from(await receipt.arrayBuffer()).toString("base64") };
    }
    if (Object.keys(errors).length) return validationResponse(errors);
    const saved = await mutatePortalDatabase((database) => {
      const enrollment = account ? database.enrollments.find((item) => item.registrationReference === reference && item.accountId === account.id) : undefined;
      const registration = accessToken ? database.registrations.find((item) => item.registrationReference === reference && item.accessTokenHash === sha256(accessToken)) : undefined;
      if (!enrollment && !registration) throw new Error("REGISTRATION_NOT_FOUND");
      if ((enrollment?.paymentStatus || registration?.paymentStatus) === "Confirmed") throw new Error("ALREADY_CONFIRMED");
      const recordId = enrollment?.id || registration!.id;
      if (database.payments.some((item) => (enrollment ? item.enrollmentId === recordId : item.registrationId === recordId) && item.status === "Pending Verification")) throw new Error("ALREADY_SUBMITTED");
      let receiptId: string | null = null;
      if (receiptData) { receiptId = newId("receipt"); database.receipts.push({ id: receiptId, accountId: account?.id || "", registrationId: registration?.id, ...receiptData, createdAt: new Date().toISOString() }); }
      const now = new Date().toISOString();
      const payment = { id: newId("payment"), enrollmentId: enrollment?.id || "", registrationId: registration?.id, accountId: account?.id || "", amountCents: enrollment?.tuitionCents || registration!.tuitionCents, transactionReference, receiptId, status: "Pending Verification" as const, submittedAt: now, verifiedAt: null, verifiedByAccountId: null };
      database.payments.push(payment);
      if (enrollment) { enrollment.paymentStatus = "Pending Verification"; enrollment.enrollmentStatus = "Payment Submitted"; enrollment.updatedAt = now; }
      if (registration) { registration.paymentStatus = "Pending Verification"; registration.registrationStatus = "Payment Submitted"; registration.paymentReference = transactionReference; registration.paymentReceiptId = receiptId; registration.updatedAt = now; }
      audit(database, request, account?.id || null, "payment.submitted", enrollment ? "enrollment" : "registration", recordId, reference);
      const student = enrollment ? database.students.find((item) => item.id === enrollment.studentId) : undefined;
      return { enrollment, registration, student, payment };
    });
    const base = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const receiptUrl = saved.payment.receiptId ? `${base}/api/receipts/${saved.payment.receiptId}` : null;
    if (saved.registration) after(() => sendDirectPaymentSubmittedEmail(saved.registration!, saved.payment, receiptUrl).then(() => undefined));
    else if (account && saved.enrollment && saved.student) after(() => sendPaymentSubmittedEmail(account, saved.student!, saved.enrollment!, saved.payment, receiptUrl).then(() => undefined));
    return Response.json({ success: true, message: "Your payment information was submitted and is pending administrator verification.", nextUrl: saved.registration ? `/registration-complete?reference=${encodeURIComponent(reference)}` : "/account/dashboard" });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    if (reason === "REGISTRATION_NOT_FOUND") return apiError("The payment page could not be loaded for this registration reference.", 404, reason);
    if (reason === "ALREADY_CONFIRMED") return apiError("This payment has already been confirmed.", 409, reason);
    if (reason === "ALREADY_SUBMITTED") return apiError("Payment information has already been submitted and is pending verification.", 409, reason);
    const errorReference = `PAYMENT-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`; console.error(errorReference, error);
    return Response.json({ success: false, code: "SERVER_ERROR", message: "Payment information could not be saved.", errorReference }, { status: 500 });
  }
}
