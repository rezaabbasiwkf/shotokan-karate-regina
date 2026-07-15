import { after } from "next/server";
import { sendPasswordResetEmail } from "@/lib/portal/email";
import { rateLimited } from "@/lib/portal/rate-limit";
import { assertCsrf, cleanText, normalizeEmail, randomToken, sha256 } from "@/lib/portal/security";
import { clientIp, mutatePortalDatabase, newId, readPortalDatabase } from "@/lib/portal/store";
import { apiError } from "@/lib/portal/validation";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  const ip = clientIp(request);
  if (await rateLimited(`password-request:${ip}`, 5, 15 * 60_000)) return apiError("Too many reset requests. Please wait 15 minutes.", 429, "RATE_LIMITED");
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const email = normalizeEmail(cleanText(payload.email, 254));
  const database = await readPortalDatabase();
  const account = database.accounts.find((item) => item.email === email);
  let developmentResetUrl = "";
  if (account) {
    const rawToken = randomToken();
    const now = new Date();
    await mutatePortalDatabase((mutable) => {
      mutable.secure_tokens = mutable.secure_tokens.filter((item) => !(item.accountId === account.id && item.type === "password-reset" && !item.usedAt));
      mutable.secure_tokens.push({ id: newId("token"), accountId: account.id, type: "password-reset", tokenHash: sha256(rawToken), expiresAt: new Date(now.getTime() + 60 * 60_000).toISOString(), usedAt: null, createdAt: now.toISOString() });
    });
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin}/reset-password?token=${encodeURIComponent(rawToken)}`;
    developmentResetUrl = resetUrl;
    after(() => sendPasswordResetEmail(account, resetUrl).then(() => undefined));
  }
  return Response.json({ success: true, message: "If an account matches that email, a password-reset link has been sent.", ...(process.env.NODE_ENV !== "production" && developmentResetUrl ? { resetUrl: developmentResetUrl } : {}) });
}
