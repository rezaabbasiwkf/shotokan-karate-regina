import { mutatePortalDatabase, newId } from "./store";
import { escapeHtml, money } from "./security";
import type { Account, EmergencyContact, Enrollment, KarateClass, Payment, Registration, Student, TrialRequest } from "./types";

const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.REGISTRATION_EMAIL || "reza.abbasi.wkf@gmail.com";
const fromEmail = process.env.EMAIL_FROM_ADDRESS || process.env.RESEND_FROM || "SHOTOKAN Karate Regina <onboarding@resend.dev>";

async function deliver(type: string, recipient: string, subject: string, html: string, relatedId: string) {
  const logId = newId("email");
  const now = new Date().toISOString();
  await mutatePortalDatabase((database) => database.email_delivery_logs.unshift({ id: logId, type, recipient, subject, relatedId, status: "Pending", providerMessageId: "", error: "", createdAt: now, updatedAt: now }));
  const apiKey = process.env.EMAIL_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) {
    await mutatePortalDatabase((database) => { const log = database.email_delivery_logs.find((item) => item.id === logId); if (log) Object.assign(log, { status: "Skipped", error: "RESEND_API_KEY is not configured.", updatedAt: new Date().toISOString() }); });
    return { sent: false, reason: "missing-resend-config" };
  }
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: fromEmail, to: [recipient], subject, html }) });
    const result = await response.json().catch(() => ({})) as { id?: string; message?: string };
    if (!response.ok) throw new Error(result.message || `Email provider returned ${response.status}.`);
    await mutatePortalDatabase((database) => { const log = database.email_delivery_logs.find((item) => item.id === logId); if (log) Object.assign(log, { status: "Sent", providerMessageId: result.id || "", updatedAt: new Date().toISOString() }); });
    return { sent: true };
  } catch (error) {
    await mutatePortalDatabase((database) => { const log = database.email_delivery_logs.find((item) => item.id === logId); if (log) Object.assign(log, { status: "Failed", error: error instanceof Error ? error.message : "Email delivery failed.", updatedAt: new Date().toISOString() }); });
    console.error(`Email delivery failed (${type}, ${relatedId})`, error);
    return { sent: false, reason: "delivery-failed" };
  }
}

export function sendNewAccountEmails(account: Account, verificationUrl: string) {
  const created = new Date(account.createdAt).toLocaleString("en-CA", { timeZone: "America/Regina" });
  return Promise.allSettled([
    deliver("new-account-admin", adminEmail, "New Family Account – SHOTOKAN Karate Regina", `<h2>New family account</h2><p><strong>Account holder:</strong> ${escapeHtml(account.firstName)} ${escapeHtml(account.lastName)}</p><p><strong>Email:</strong> ${escapeHtml(account.email)}</p><p><strong>Phone:</strong> ${escapeHtml(account.phone)}</p><p><strong>Created:</strong> ${escapeHtml(created)}</p>`, account.id),
    sendVerificationEmail(account, verificationUrl),
  ]);
}

export function sendVerificationEmail(account: Account, verificationUrl: string) {
  return deliver("verify-email", account.email, "Verify Your Email – SHOTOKAN Karate Regina", `<h2>Welcome to SHOTOKAN Karate Regina</h2><p>Please verify your family account before adding students or enrolling.</p><p><a href="${escapeHtml(verificationUrl)}">Verify my email address</a></p><p>This secure link expires in 24 hours.</p>`, account.id);
}

export function sendPasswordResetEmail(account: Account, resetUrl: string) {
  return deliver("password-reset", account.email, "Reset Your Password – SHOTOKAN Karate Regina", `<h2>Password reset requested</h2><p><a href="${escapeHtml(resetUrl)}">Reset your password</a></p><p>This link expires in one hour. If you did not request it, no action is required.</p>`, account.id);
}

export function sendEnrollmentEmails(account: Account, student: Student, contact: EmergencyContact, karateClass: KarateClass, enrollment: Enrollment) {
  const schedule = `${karateClass.day}, ${karateClass.startTime}–${karateClass.endTime}`;
  return Promise.allSettled([
    deliver("new-enrollment-admin", adminEmail, `New Student Enrollment – ${student.fullName} – ${enrollment.registrationReference}`, `<h2>New student enrollment</h2><p><strong>Reference:</strong> ${escapeHtml(enrollment.registrationReference)}</p><p><strong>Account holder:</strong> ${escapeHtml(account.firstName)} ${escapeHtml(account.lastName)} (${escapeHtml(account.email)}, ${escapeHtml(account.phone)})</p><p><strong>Student:</strong> ${escapeHtml(student.fullName)}, DOB ${escapeHtml(student.dateOfBirth)}, ${escapeHtml(student.gender)}</p><p><strong>Class:</strong> ${escapeHtml(karateClass.name)}</p><p><strong>Schedule:</strong> ${escapeHtml(schedule)}</p><p><strong>Emergency contact:</strong> ${escapeHtml(contact.fullName)} – ${escapeHtml(contact.phone)} (${escapeHtml(contact.relationship)})</p><p><strong>Medical information:</strong> ${escapeHtml(student.hasMedicalConditions ? student.medicalDetails : "None reported")}</p><p><strong>Waiver accepted:</strong> ${escapeHtml(enrollment.waiverAcceptedAt)}</p><p><strong>Payment status:</strong> ${escapeHtml(enrollment.paymentStatus)}</p>`, enrollment.id),
    deliver("registration-received-family", account.email, "Registration Received – SHOTOKAN Karate Regina", `<h2>Registration received</h2><p><strong>Student:</strong> ${escapeHtml(student.fullName)}</p><p><strong>Reference:</strong> ${escapeHtml(enrollment.registrationReference)}</p><p><strong>Class:</strong> ${escapeHtml(karateClass.name)}</p><p><strong>Schedule:</strong> ${escapeHtml(schedule)}</p><p><strong>Tuition:</strong> ${escapeHtml(money(enrollment.tuitionCents))}</p><p>Please sign in to your <a href="${escapeHtml((process.env.NEXT_PUBLIC_SITE_URL || "https://shotokan-karate-regina.vercel.app") + "/account/dashboard")}">family account</a> and continue to payment.</p>`, enrollment.id),
  ]);
}

export function sendPaymentSubmittedEmail(account: Account, student: Student, enrollment: Enrollment, payment: Payment, receiptUrl: string | null) {
  return deliver("payment-submitted-admin", adminEmail, `Payment Submitted – ${student.fullName} – ${enrollment.registrationReference}`, `<h2>Payment submitted</h2><p><strong>Reference:</strong> ${escapeHtml(enrollment.registrationReference)}</p><p><strong>Student:</strong> ${escapeHtml(student.fullName)}</p><p><strong>Account:</strong> ${escapeHtml(account.email)}</p><p><strong>Transaction reference:</strong> ${escapeHtml(payment.transactionReference)}</p>${receiptUrl ? `<p><a href="${escapeHtml(receiptUrl)}">View private receipt</a></p>` : ""}<p><strong>Submitted:</strong> ${escapeHtml(payment.submittedAt)}</p>`, enrollment.id);
}

export function sendEnrollmentConfirmedEmail(account: Account, student: Student, karateClass: KarateClass, enrollment: Enrollment) {
  return deliver("enrollment-confirmed-family", account.email, "Enrollment Confirmed – SHOTOKAN Karate Regina", `<h2>Enrollment confirmed</h2><p><strong>Student:</strong> ${escapeHtml(student.fullName)}</p><p><strong>Reference:</strong> ${escapeHtml(enrollment.registrationReference)}</p><p><strong>Class:</strong> ${escapeHtml(karateClass.name)}</p><p><strong>Location:</strong> ${escapeHtml(karateClass.location)}</p><p><strong>Schedule:</strong> ${escapeHtml(`${karateClass.day}, ${karateClass.startTime}–${karateClass.endTime}`)}</p><p><strong>Start date:</strong> Your confirmed start date will be coordinated by the academy.</p><p><strong>What to bring:</strong> Water bottle and a positive attitude.</p><p><strong>Clothing:</strong> Comfortable athletic clothing is suitable until uniform guidance is provided.</p><p>Questions? Contact Coach Reza Abbasi at 306-570-3125 or info@shotokan-karate-regina.com.</p>`, enrollment.id);
}

export function sendTrialRequestEmails(request: TrialRequest) {
  return Promise.allSettled([
    deliver("trial-request-admin", adminEmail, `Trial Class Request – ${request.studentName}`, `<h2>New trial class request</h2><p><strong>Parent/participant:</strong> ${escapeHtml(request.parentParticipantName)}</p><p><strong>Student:</strong> ${escapeHtml(request.studentName)}</p><p><strong>DOB:</strong> ${escapeHtml(request.dateOfBirth)}</p><p><strong>Phone:</strong> ${escapeHtml(request.phone)}</p><p><strong>Email:</strong> ${escapeHtml(request.email)}</p><p><strong>Experience:</strong> ${escapeHtml(request.previousExperience)}</p><p><strong>Preferred date:</strong> ${escapeHtml(request.preferredClassDate)}</p><p><strong>Notes:</strong> ${escapeHtml(request.additionalNotes || "None")}</p>`, request.id),
    deliver("trial-request-family", request.email, "Trial Class Request Received – SHOTOKAN Karate Regina", `<h2>We received your trial class request</h2><p>Thank you, ${escapeHtml(request.parentParticipantName)}. We will contact you about a suitable class for ${escapeHtml(request.studentName)}.</p><p>No payment is required for this request.</p>`, request.id),
  ]);
}

export async function sendDirectRegistrationEmails(registration: Registration, paymentUrl: string) {
  const created = new Date(registration.createdAt).toLocaleString("en-CA", { timeZone: "America/Regina" });
  const guardian = registration.guardianName ? `${registration.guardianName}, ${registration.guardianPhone}, ${registration.guardianEmail}` : "Not applicable";
  const consent = `Information: ${registration.informationConfirmed}; Risk: ${registration.riskAcknowledged}; Rules: ${registration.rulesAccepted}; Emergency treatment: ${registration.emergencyTreatmentAuthorized}; Media: ${registration.mediaPermission}; Refund policy: ${registration.refundPolicyAccepted}; Liability waiver: ${registration.liabilityWaiverAccepted}`;
  const results = await Promise.all([
    deliver("direct-registration-admin", adminEmail, `New Student Registration – ${registration.fullName} – ${registration.registrationReference}`, `<h2>New student registration</h2><p><strong>Reference:</strong> ${escapeHtml(registration.registrationReference)}</p><p><strong>Date and time:</strong> ${escapeHtml(created)}</p><p><strong>Participant:</strong> ${escapeHtml(registration.fullName)}</p><p><strong>Date of birth / age:</strong> ${escapeHtml(registration.dateOfBirth)} / ${registration.calculatedAge}</p><p><strong>Gender:</strong> ${escapeHtml(registration.gender)}</p><p><strong>Phone / email:</strong> ${escapeHtml(registration.phone)} / ${escapeHtml(registration.email)}</p><p><strong>Home address:</strong> ${escapeHtml(registration.homeAddress)}</p><p><strong>Emergency contact:</strong> ${escapeHtml(registration.emergencyContactName)} / ${escapeHtml(registration.emergencyContactPhone)}</p><p><strong>Guardian:</strong> ${escapeHtml(guardian)}</p><p><strong>Previous program:</strong> ${escapeHtml(registration.previousProgram)}</p><p><strong>Referral:</strong> ${escapeHtml(registration.referralSource)}</p><p><strong>Medical information:</strong> ${escapeHtml(registration.hasMedicalCondition ? registration.medicalDetails : "None reported")}</p><p><strong>Attendance commitment:</strong> ${registration.attendanceCommitment}</p><p><strong>Consent:</strong> ${escapeHtml(consent)}</p><p><strong>Participant signature:</strong> ${escapeHtml(registration.participantSignature)}</p><p><strong>Guardian signature:</strong> ${escapeHtml(registration.guardianSignature || "Not applicable")}</p><p><strong>Status:</strong> ${escapeHtml(registration.registrationStatus)} / ${escapeHtml(registration.paymentStatus)}</p>`, registration.id),
    deliver("direct-registration-family", registration.email, "Registration Received – SHOTOKAN Karate Regina", `<h2>Registration received</h2><p>Thank you, ${escapeHtml(registration.fullName)}.</p><p><strong>Reference:</strong> ${escapeHtml(registration.registrationReference)}</p><p><strong>Status:</strong> Pending Payment</p><p>Continue securely to the <a href="${escapeHtml(paymentUrl)}">payment page</a>. Questions? Contact Coach Reza Abbasi at 306-570-3125.</p>`, registration.id),
  ]);
  return { admin: results[0], participant: results[1] };
}

export function sendDirectPaymentSubmittedEmail(registration: Registration, payment: Payment, receiptUrl: string | null) {
  return deliver("direct-payment-submitted-admin", adminEmail, `Payment Submitted – ${registration.fullName} – ${registration.registrationReference}`, `<h2>Payment submitted</h2><p><strong>Reference:</strong> ${escapeHtml(registration.registrationReference)}</p><p><strong>Participant:</strong> ${escapeHtml(registration.fullName)}</p><p><strong>Transaction reference:</strong> ${escapeHtml(payment.transactionReference)}</p>${receiptUrl ? `<p><a href="${escapeHtml(receiptUrl)}">View private receipt</a></p>` : ""}<p><strong>Submitted:</strong> ${escapeHtml(payment.submittedAt)}</p>`, registration.id);
}

export function sendDirectRegistrationConfirmedEmail(registration: Registration) {
  return deliver("direct-registration-confirmed-family", registration.email, "Registration Confirmed – SHOTOKAN Karate Regina", `<h2>Registration confirmed</h2><p><strong>Participant:</strong> ${escapeHtml(registration.fullName)}</p><p><strong>Reference:</strong> ${escapeHtml(registration.registrationReference)}</p><p><strong>Payment:</strong> Confirmed</p><p><strong>Registration:</strong> Active</p><p>Bring a water bottle and wear comfortable athletic clothing until uniform guidance is provided. The academy will contact you with training details and next steps.</p><p>Questions? Contact Coach Reza Abbasi at 306-570-3125.</p>`, registration.id);
}
