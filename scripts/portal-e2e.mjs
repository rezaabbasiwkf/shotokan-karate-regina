import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const port = 3417;
const base = `http://127.0.0.1:${port}`;
const databaseFile = path.join(process.cwd(), "data", "portal-e2e.json");
await mkdir(path.dirname(databaseFile), { recursive: true });
await rm(databaseFile, { force: true });

const nextCli = path.join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
const server = spawn(process.execPath, [nextCli, "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, PORTAL_DATABASE_FILE: "portal-e2e.json", ADMIN_EMAILS: "portal-admin@example.com", NEXT_PUBLIC_SITE_URL: base },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

class BrowserSession {
  cookies = new Map();
  csrf = "";
  update(response) {
    const values = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [response.headers.get("set-cookie")].filter(Boolean);
    for (const value of values) {
      const [pair] = value.split(";"); const index = pair.indexOf("=");
      const name = pair.slice(0, index), cookieValue = pair.slice(index + 1);
      if (cookieValue) this.cookies.set(name, cookieValue); else this.cookies.delete(name);
    }
  }
  async request(route, options = {}) {
    const headers = new Headers(options.headers || {});
    if (this.cookies.size) headers.set("cookie", [...this.cookies].map(([key, value]) => `${key}=${value}`).join("; "));
    if (options.method && options.method !== "GET" && this.csrf) headers.set("x-csrf-token", this.csrf);
    const response = await fetch(route.startsWith("http") ? route : `${base}${route}`, { ...options, headers, redirect: options.redirect || "manual" });
    this.update(response); return response;
  }
  async readJson(response) { const text = await response.text(); if (!text.trim()) throw new Error(`Empty JSON response from ${response.url} (${response.status})`); try { return JSON.parse(text); } catch { throw new Error(`Invalid JSON response from ${response.url} (${response.status})`); } }
  async initialize() { const response = await this.request("/api/auth/csrf"); const data = await this.readJson(response); this.csrf = data.csrfToken; assert(response.ok && this.csrf, "CSRF initialization"); }
  async json(route, method, body) { const response = await this.request(route, { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); const data = await this.readJson(response); return { response, data }; }
}

function assert(condition, label) { if (!condition) throw new Error(`FAILED: ${label}`); console.log(`PASS: ${label}`); }
async function waitForServer() { for (let attempt = 0; attempt < 60; attempt += 1) { try { const response = await fetch(`${base}/account`); if (response.ok) return; } catch {} await new Promise((resolve) => setTimeout(resolve, 500)); } throw new Error(`Server did not start.\n${serverOutput}`); }

async function createAndVerify(session, email, firstName, lastName) {
  await session.initialize();
  const signup = await session.json("/api/auth/signup", "POST", { firstName, lastName, email, phone: "306-555-0199", homeAddress: "100 Test Street, Regina, SK S4P 0A1", password: "SecurePortal!2026", confirmPassword: "SecurePortal!2026", emergencyName: "Emergency Helper", emergencyPhone: "306-555-0188", emergencyRelationship: "Family friend", acceptPrivacy: "yes", website: "" });
  assert(signup.response.ok && signup.data.verificationUrl, `create ${email}`);
  const verification = await session.request(signup.data.verificationUrl);
  assert(verification.status === 307, `verify ${email}`);
}

function directRegistration(overrides = {}) {
  return { submissionId: crypto.randomUUID(), fullName: "Direct Minor", dateOfBirth: "2015-05-20", gender: "Female", phone: "306-555-0144", email: "direct@example.com", homeAddress: "200 Test Avenue, Regina, SK", emergencyContactName: "Emergency Person", emergencyContactPhone: "306-555-0155", guardianName: "Direct Parent", guardianPhone: "306-555-0166", guardianEmail: "parent@example.com", previousProgram: "No", referralSource: "School", hasMedicalCondition: "Yes", medicalDetails: "Mild seasonal allergy", attendanceCommitment: true, informationConfirmed: true, riskAcknowledged: true, rulesAccepted: true, emergencyTreatmentAuthorized: true, mediaPermission: false, refundPolicyAccepted: true, liabilityWaiverAccepted: true, participantSignature: "Direct Minor", guardianSignature: "Direct Parent", website: "", ...overrides };
}

try {
  await waitForServer();
  const family = new BrowserSession();
  await createAndVerify(family, "family@example.com", "Family", "Account");
  const duplicate = new BrowserSession(); await duplicate.initialize();
  const duplicateResult = await duplicate.json("/api/auth/signup", "POST", { firstName: "Duplicate", lastName: "Account", email: "family@example.com", phone: "306-555-0199", homeAddress: "100 Test Street, Regina, SK", password: "SecurePortal!2026", confirmPassword: "SecurePortal!2026", emergencyName: "Emergency Helper", emergencyPhone: "306-555-0188", emergencyRelationship: "Friend", acceptPrivacy: "yes" });
  assert(duplicateResult.response.status === 409 && duplicateResult.data.code === "DUPLICATE_EMAIL", "duplicate email rejected");

  const minor = await family.json("/api/students", "POST", { fullName: "Minor Student", dateOfBirth: "2015-05-20", gender: "Female", phone: "", email: "", previousExperience: "None", medicalChoice: "No", medicalDetails: "", photoVideoPermission: "yes", acceptsWaiver: "yes", electronicSignature: "Family Account" });
  assert(minor.response.ok && minor.data.studentId, "parent adds minor student");
  const adult = await family.json("/api/students", "POST", { fullName: "Adult Student", dateOfBirth: "1990-01-10", gender: "Male", phone: "306-555-0123", email: "adult@example.com", previousExperience: "Two years of karate", medicalChoice: "No", medicalDetails: "", photoVideoPermission: "", acceptsWaiver: "yes", electronicSignature: "Adult Student" });
  assert(adult.response.ok && adult.data.studentId, "multiple students and adult profile");
  const duplicateStudent = await family.json("/api/students", "POST", { fullName: "Minor Student", dateOfBirth: "2015-05-20", gender: "Female", previousExperience: "None", medicalChoice: "No", acceptsWaiver: "yes", electronicSignature: "Family Account" });
  assert(duplicateStudent.response.status === 409, "duplicate student rejected");

  const enrollment = await family.json("/api/enrollments", "POST", { studentId: minor.data.studentId, classId: "class-general-shotokan" });
  assert(enrollment.response.ok && /^REG-\d{4}-\d{6}$/.test(enrollment.data.registrationReference), "enrollment saved with reference");
  const duplicateEnrollment = await family.json("/api/enrollments", "POST", { studentId: minor.data.studentId, classId: "class-general-shotokan" });
  assert(duplicateEnrollment.response.status === 409 && duplicateEnrollment.data.code === "DUPLICATE_ENROLLMENT", "duplicate enrollment rejected");
  await new Promise((resolve) => setTimeout(resolve, 500));
  const capacityDatabase = JSON.parse(await readFile(databaseFile, "utf8")); capacityDatabase.classes[0].capacity = 1; await writeFile(databaseFile, JSON.stringify(capacityDatabase, null, 2));
  const fullClass = await family.json("/api/enrollments", "POST", { studentId: adult.data.studentId, classId: "class-general-shotokan" });
  assert(fullClass.response.status === 409 && fullClass.data.code === "CLASS_FULL", "full class rejected");
  capacityDatabase.classes[0].capacity = 30; await writeFile(databaseFile, JSON.stringify(capacityDatabase, null, 2));
  const validDatabase = await readFile(databaseFile, "utf8"); await writeFile(databaseFile, "{");
  const databaseFailure = await family.json("/api/enrollments", "POST", { studentId: adult.data.studentId, classId: "class-general-shotokan" });
  assert(databaseFailure.response.status === 500 && databaseFailure.data.message.includes("REG-ERROR-"), "database failure returns traceable real error");
  await writeFile(databaseFile, validDatabase);
  const paymentForm = new FormData(); paymentForm.set("registrationReference", enrollment.data.registrationReference); paymentForm.set("transactionReference", "PAYPAL-TEST-123");
  const paymentResponse = await family.request("/api/payments", { method: "POST", body: paymentForm }); const paymentData = await paymentResponse.json();
  assert(paymentResponse.ok && paymentData.nextUrl === "/account/dashboard", "payment submitted for manual verification");
  const dashboardBefore = await family.request("/account/dashboard"); assert(dashboardBefore.ok && (await dashboardBefore.text()).includes("Pending Verification"), "family sees pending payment");
  await new Promise((resolve) => setTimeout(resolve, 500));
  const emailDatabase = JSON.parse(await readFile(databaseFile, "utf8")); assert(emailDatabase.email_delivery_logs.some((item) => item.status === "Skipped"), "failed/unconfigured email does not block saved registration");

  const forgot = await family.json("/api/auth/forgot-password", "POST", { email: "family@example.com" }); assert(forgot.response.ok && forgot.data.resetUrl, "password reset requested");
  const resetToken = new URL(forgot.data.resetUrl).searchParams.get("token");
  const reset = await family.json("/api/auth/reset-password", "POST", { token: resetToken, password: "UpdatedPortal!2026", confirmPassword: "UpdatedPortal!2026" }); assert(reset.response.ok, "password reset completed");

  const trialSession = new BrowserSession(); await trialSession.initialize();
  const trial = await trialSession.json("/api/trial-requests", "POST", { parentParticipantName: "Trial Parent", studentName: "Trial Student", dateOfBirth: "2014-04-12", phone: "306-555-0177", email: "trial@example.com", previousExperience: "None", preferredClassDate: "2026-08-05", additionalNotes: "First visit", website: "" });
  assert(trial.response.ok, "trial request saved without payment");

  const direct = new BrowserSession(); await direct.initialize();
  const tooYoung = await direct.json("/api/registrations", "POST", directRegistration({ submissionId: crypto.randomUUID(), dateOfBirth: "2023-01-01" }));
  assert(tooYoung.response.status === 400 && tooYoung.data.fieldErrors.dateOfBirth === "Participants must be at least five years old.", "minimum age enforced server-side");
  const invalidEmail = await direct.json("/api/registrations", "POST", directRegistration({ submissionId: crypto.randomUUID(), email: "invalid" }));
  assert(invalidEmail.response.status === 400 && invalidEmail.data.fieldErrors.email, "invalid registration email returns field error");
  const missingWaiver = await direct.json("/api/registrations", "POST", directRegistration({ submissionId: crypto.randomUUID(), liabilityWaiverAccepted: false }));
  assert(missingWaiver.response.status === 400 && missingWaiver.data.fieldErrors.liabilityWaiverAccepted, "missing waiver returns field error");
  const directPayload = directRegistration();
  const directSaved = await direct.json("/api/registrations", "POST", directPayload);
  assert(directSaved.response.ok && /^REG-\d{4}-\d{6}$/.test(directSaved.data.registrationReference), "simplified minor registration saved with reference");
  const duplicateClick = await direct.json("/api/registrations", "POST", directPayload);
  assert(duplicateClick.response.ok && duplicateClick.data.registrationReference === directSaved.data.registrationReference, "duplicate click is idempotent");
  const summary = await direct.request(`/api/registrations/${directSaved.data.registrationReference}/summary`); const summaryData = await direct.readJson(summary);
  assert(summary.ok && summaryData.registration.participantName === "Direct Minor" && !JSON.stringify(summaryData).includes("medicalDetails"), "private registration summary exposes only payment-safe fields");
  const anonymousSummary = await new BrowserSession().request(`/api/registrations/${directSaved.data.registrationReference}/summary`);
  assert(anonymousSummary.status === 404, "registration reference alone cannot reveal private data");
  const paymentPage = await direct.request(directSaved.data.paymentUrl); const paymentHtml = await paymentPage.text();
  assert(paymentPage.ok && paymentHtml.includes("PayPal QR code") && paymentHtml.includes("Direct Minor"), "payment page loads with PayPal QR code");
  const directPayment = new FormData(); directPayment.set("registrationReference", directSaved.data.registrationReference); directPayment.set("transactionReference", "PAYPAL-DIRECT-456"); directPayment.set("receipt", new File(["test receipt"], "receipt.pdf", { type: "application/pdf" }));
  const directPaymentResponse = await direct.request("/api/payments/confirm", { method: "POST", body: directPayment }); const directPaymentData = await direct.readJson(directPaymentResponse);
  assert(directPaymentResponse.ok && directPaymentData.nextUrl.includes("/registration-complete"), "direct payment and private receipt submitted");
  const completePage = await direct.request(directPaymentData.nextUrl); assert(completePage.ok && (await completePage.text()).includes("pending verification"), "final confirmation accurately reports pending verification");
  const adultDirect = new BrowserSession(); await adultDirect.initialize();
  const adultDirectSaved = await adultDirect.json("/api/registrations", "POST", directRegistration({ submissionId: crypto.randomUUID(), fullName: "Direct Adult", dateOfBirth: "1990-01-10", email: "adult-direct@example.com", guardianName: "", guardianPhone: "", guardianEmail: "", guardianSignature: "", hasMedicalCondition: "No", medicalDetails: "" }));
  assert(adultDirectSaved.response.ok, "adult registers without guardian or medical details");

  const admin = new BrowserSession(); await createAndVerify(admin, "portal-admin@example.com", "Portal", "Admin");
  const database = JSON.parse(await readFile(databaseFile, "utf8"));
  const savedEnrollment = database.enrollments.find((item) => item.registrationReference === enrollment.data.registrationReference);
  const confirmation = await admin.json("/api/admin/registration", "POST", { enrollmentId: savedEnrollment.id, action: "confirm" });
  assert(confirmation.response.ok, "administrator confirms payment");
  const databaseWithDirect = JSON.parse(await readFile(databaseFile, "utf8")); const savedDirect = databaseWithDirect.registrations.find((item) => item.registrationReference === directSaved.data.registrationReference);
  const directConfirmation = await admin.json("/api/admin/registration", "POST", { registrationId: savedDirect.id, recordType: "direct-registration", action: "confirm" });
  assert(directConfirmation.response.ok, "administrator verifies direct payment");
  const confirmedSummaryResponse = await direct.request(`/api/registrations/${directSaved.data.registrationReference}/summary`); const confirmedSummary = await direct.readJson(confirmedSummaryResponse);
  assert(confirmedSummary.registration.paymentStatus === "Confirmed" && confirmedSummary.registration.registrationStatus === "Active", "verified direct registration becomes active");
  const adminPage = await admin.request("/admin"); assert(adminPage.ok, "administrator dashboard access");
  const familyLogin = new BrowserSession(); await familyLogin.initialize();
  const login = await familyLogin.json("/api/auth/login", "POST", { email: "family@example.com", password: "UpdatedPortal!2026" }); assert(login.response.ok, "family logs back in with new password");
  const dashboardAfter = await familyLogin.request("/account/dashboard"); assert(dashboardAfter.ok && (await dashboardAfter.text()).includes("Active"), "family sees active enrollment");
  console.log("Portal end-to-end tests passed.");
} finally {
  server.kill();
  await new Promise((resolve) => setTimeout(resolve, 500));
  await rm(databaseFile, { force: true });
}
