import { assertCsrf, hashPassword, passwordProblems, sha256 } from "@/lib/portal/security";
import { mutatePortalDatabase } from "@/lib/portal/store";
import { apiError, validationResponse } from "@/lib/portal/validation";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const token = typeof payload.token === "string" ? payload.token : "";
  const password = typeof payload.password === "string" ? payload.password : "";
  const confirmPassword = typeof payload.confirmPassword === "string" ? payload.confirmPassword : "";
  const errors: Record<string, string> = {};
  const problems = passwordProblems(password);
  if (problems.length) errors.password = problems.join(" ");
  if (password !== confirmPassword) errors.confirmPassword = "The passwords do not match.";
  if (Object.keys(errors).length) return validationResponse(errors);
  const passwordHash = await hashPassword(password);
  const changed = await mutatePortalDatabase((database) => {
    const secureToken = database.secure_tokens.find((item) => item.type === "password-reset" && item.tokenHash === sha256(token) && !item.usedAt && new Date(item.expiresAt) > new Date());
    if (!secureToken) return false;
    const account = database.accounts.find((item) => item.id === secureToken.accountId);
    if (!account) return false;
    const now = new Date().toISOString();
    account.passwordHash = passwordHash;
    account.updatedAt = now;
    secureToken.usedAt = now;
    database.sessions = database.sessions.filter((item) => item.accountId !== account.id);
    return true;
  });
  if (!changed) return apiError("This password-reset link is invalid or has expired. Request a new link.", 400, "INVALID_TOKEN");
  return Response.json({ success: true, message: "Your password has been changed. You can now log in.", nextUrl: "/account" });
}
