import { after } from "next/server";
import { createSession } from "@/lib/portal/auth";
import { sendNewAccountEmails } from "@/lib/portal/email";
import { rateLimited } from "@/lib/portal/rate-limit";
import { assertCsrf, cleanText, hashPassword, normalizeEmail, passwordProblems, randomToken, sha256 } from "@/lib/portal/security";
import { audit, clientIp, mutatePortalDatabase, newId } from "@/lib/portal/store";
import { apiError, emailPattern, phonePattern, validationResponse } from "@/lib/portal/validation";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh the page and try again.", 403, "CSRF_FAILED"); }
  const ip = clientIp(request);
  if (await rateLimited(`signup:${ip}`, 5, 15 * 60_000)) return apiError("Too many account attempts. Please wait 15 minutes and try again.", 429, "RATE_LIMITED");
  let payload: Record<string, unknown>;
  try { payload = await request.json() as Record<string, unknown>; } catch { return apiError("The account form could not be read. Please submit it again."); }
  if (cleanText(payload.website)) return apiError("The account request was rejected.", 400, "SPAM_DETECTED");

  const firstName = cleanText(payload.firstName, 80);
  const lastName = cleanText(payload.lastName, 80);
  const email = normalizeEmail(cleanText(payload.email, 254));
  const phone = cleanText(payload.phone, 40);
  const homeAddress = cleanText(payload.homeAddress, 300);
  const password = typeof payload.password === "string" ? payload.password : "";
  const confirmPassword = typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";
  const emergencyName = cleanText(payload.emergencyName, 160);
  const emergencyPhone = cleanText(payload.emergencyPhone, 40);
  const emergencyRelationship = cleanText(payload.emergencyRelationship, 80);
  const errors: Record<string, string> = {};
  if (!firstName) errors.firstName = "Please enter the account holder’s first name.";
  if (!lastName) errors.lastName = "Please enter the account holder’s last name.";
  if (!email) errors.email = "Please enter the account holder’s email address."; else if (!emailPattern.test(email)) errors.email = "Please enter a valid email address.";
  if (!phone) errors.phone = "Please enter the account holder’s phone number."; else if (!phonePattern.test(phone)) errors.phone = "Please enter a valid mobile phone number.";
  if (!homeAddress) errors.homeAddress = "Please enter the complete home address.";
  const passwordIssues = passwordProblems(password);
  if (passwordIssues.length) errors.password = passwordIssues.join(" ");
  if (confirmPassword !== password) errors.confirmPassword = "The passwords do not match.";
  if (!emergencyName) errors.emergencyName = "Please enter an emergency contact name.";
  if (!emergencyPhone) errors.emergencyPhone = "Please enter an emergency contact phone number."; else if (!phonePattern.test(emergencyPhone)) errors.emergencyPhone = "Please enter a valid emergency contact phone number.";
  if (!emergencyRelationship) errors.emergencyRelationship = "Please enter the emergency contact’s relationship to the student.";
  if (!payload.acceptPrivacy) errors.acceptPrivacy = "You must accept the Privacy Policy and Terms of Service.";
  if (Object.keys(errors).length) return validationResponse(errors);

  const passwordHash = await hashPassword(password);
  const accountId = newId("account");
  const verificationToken = randomToken();
  const now = new Date();
  const adminEmails = (process.env.ADMIN_EMAILS || process.env.REGISTRATION_EMAIL || "reza.abbasi.wkf@gmail.com").split(",").map(normalizeEmail);
  try {
    const account = await mutatePortalDatabase((database) => {
      if (database.accounts.some((item) => item.email === email)) throw new Error("DUPLICATE_EMAIL");
      const created = { id: accountId, firstName, lastName, email, phone, homeAddress, passwordHash, role: adminEmails.includes(email) ? "admin" as const : "family" as const, emailVerifiedAt: null, createdAt: now.toISOString(), updatedAt: now.toISOString() };
      database.accounts.push(created);
      database.emergency_contacts.push({ id: newId("contact"), accountId, fullName: emergencyName, phone: emergencyPhone, relationship: emergencyRelationship, createdAt: now.toISOString(), updatedAt: now.toISOString() });
      database.secure_tokens.push({ id: newId("token"), accountId, type: "email-verification", tokenHash: sha256(verificationToken), expiresAt: new Date(now.getTime() + 24 * 60 * 60_000).toISOString(), usedAt: null, createdAt: now.toISOString() });
      for (const consentType of ["privacy-policy", "terms-of-service"] as const) database.waiver_acceptances.push({ id: newId("consent"), accountId, studentId: "", consentType, accepted: true, version: "2026-07-15", acceptedAt: now.toISOString(), ipAddress: ip });
      audit(database, request, accountId, "account.created", "account", accountId);
      return created;
    });
    await createSession(account.id, request);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const verificationUrl = `${siteUrl}/api/auth/verify-email?token=${encodeURIComponent(verificationToken)}`;
    after(() => sendNewAccountEmails(account, verificationUrl).then(() => undefined));
    return Response.json({ success: true, nextUrl: "/account/verify-email", ...(process.env.NODE_ENV !== "production" ? { verificationUrl } : {}) });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_EMAIL") return apiError("An account already exists for this email address. Log in or reset your password.", 409, "DUPLICATE_EMAIL");
    const reference = `ACCOUNT-ERROR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    console.error(reference, error);
    return apiError(`The account could not be created. Error reference: ${reference}.`, 500, "SERVER_ERROR");
  }
}
