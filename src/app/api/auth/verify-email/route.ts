import { NextResponse } from "next/server";
import { mutatePortalDatabase } from "@/lib/portal/store";
import { sha256 } from "@/lib/portal/security";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";
  if (!token) return NextResponse.redirect(new URL("/account/verify-email?error=missing", request.url));
  const result = await mutatePortalDatabase((database) => {
    const secureToken = database.secure_tokens.find((item) => item.type === "email-verification" && item.tokenHash === sha256(token) && !item.usedAt);
    if (!secureToken || new Date(secureToken.expiresAt) <= new Date()) return false;
    const account = database.accounts.find((item) => item.id === secureToken.accountId);
    if (!account) return false;
    const now = new Date().toISOString();
    account.emailVerifiedAt = account.emailVerifiedAt || now;
    account.updatedAt = now;
    secureToken.usedAt = now;
    return true;
  });
  return NextResponse.redirect(new URL(result ? "/account/students/new?verified=1" : "/account/verify-email?error=invalid", request.url));
}
