import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { audit, clientIp, mutatePortalDatabase, newId, readPortalDatabase } from "./store";
import { randomToken, SESSION_COOKIE, sha256 } from "./security";
import type { Account } from "./types";

const SESSION_DAYS = 14;

export async function createSession(accountId: string, request: Request) {
  const token = randomToken();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await mutatePortalDatabase((database) => {
    database.sessions = database.sessions.filter((session) => new Date(session.expiresAt) > now);
    database.sessions.push({ id: newId("session"), accountId, tokenHash: sha256(token), expiresAt: expires.toISOString(), createdAt: now.toISOString(), lastUsedAt: now.toISOString(), ipAddress: clientIp(request), userAgent: request.headers.get("user-agent")?.slice(0, 300) || "unknown" });
    audit(database, request, accountId, "session.created", "account", accountId);
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", expires });
}

export async function destroySession(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await mutatePortalDatabase((database) => {
    const session = database.sessions.find((item) => item.tokenHash === sha256(token));
    database.sessions = database.sessions.filter((item) => item.tokenHash !== sha256(token));
    if (session) audit(database, request, session.accountId, "session.destroyed", "account", session.accountId);
  });
  cookieStore.delete(SESSION_COOKIE);
}

export async function currentAccount(): Promise<Account | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const database = await readPortalDatabase();
  const session = database.sessions.find((item) => item.tokenHash === sha256(token) && new Date(item.expiresAt) > new Date());
  if (!session) return null;
  return database.accounts.find((account) => account.id === session.accountId) || null;
}

export async function requireAccount(options: { verified?: boolean; admin?: boolean } = {}) {
  const account = await currentAccount();
  if (!account) redirect("/account");
  if (options.verified && !account.emailVerifiedAt) redirect("/account/verify-email");
  if (options.admin && account.role !== "admin") redirect("/account/dashboard");
  return account;
}

export async function accountFromRequest(request: Request, options: { verified?: boolean; admin?: boolean } = {}) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${SESSION_COOKIE}=([^;]+)`));
  const token = match ? decodeURIComponent(match[1]) : "";
  if (!token) return null;
  const database = await readPortalDatabase();
  const session = database.sessions.find((item) => item.tokenHash === sha256(token) && new Date(item.expiresAt) > new Date());
  if (!session) return null;
  const account = database.accounts.find((item) => item.id === session.accountId) || null;
  if (!account || (options.verified && !account.emailVerifiedAt) || (options.admin && account.role !== "admin")) return null;
  return account;
}
