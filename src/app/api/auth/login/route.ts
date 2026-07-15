import { createSession } from "@/lib/portal/auth";
import { rateLimited } from "@/lib/portal/rate-limit";
import { assertCsrf, cleanText, normalizeEmail, safeNextPath, verifyPassword } from "@/lib/portal/security";
import { clientIp, readPortalDatabase } from "@/lib/portal/store";
import { apiError, validationResponse } from "@/lib/portal/validation";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh the page and try again.", 403, "CSRF_FAILED"); }
  const ip = clientIp(request);
  if (await rateLimited(`login:${ip}`, 10, 15 * 60_000)) return apiError("Too many login attempts. Please wait 15 minutes or reset your password.", 429, "RATE_LIMITED");
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const email = normalizeEmail(cleanText(payload.email, 254));
  const password = typeof payload.password === "string" ? payload.password : "";
  const errors: Record<string, string> = {};
  if (!email) errors.email = "Please enter your email address.";
  if (!password) errors.password = "Please enter your password.";
  if (Object.keys(errors).length) return validationResponse(errors);
  const database = await readPortalDatabase();
  const account = database.accounts.find((item) => item.email === email);
  if (!account || !(await verifyPassword(password, account.passwordHash))) return apiError("The email address or password is incorrect.", 401, "INVALID_CREDENTIALS");
  await createSession(account.id, request);
  return Response.json({ success: true, nextUrl: safeNextPath(payload.next, account.emailVerifiedAt ? "/account/dashboard" : "/account/verify-email") });
}
