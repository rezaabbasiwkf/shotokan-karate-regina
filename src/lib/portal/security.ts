import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = "shotokan_session";
export const CSRF_COOKIE = "shotokan_csrf";
export const REGISTRATION_ACCESS_COOKIE = "shotokan_registration_access";
export const POLICY_VERSION = "2026-07-15";

export function normalizeEmail(value: string) { return value.trim().toLowerCase(); }
export function cleanText(value: unknown, maxLength = 500) { return typeof value === "string" ? value.trim().replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, maxLength) : ""; }
export function sha256(value: string) { return createHash("sha256").update(value).digest("hex"); }
export function randomToken(bytes = 32) { return randomBytes(bytes).toString("base64url"); }

export function registrationAccessCookie(token: string) {
  return { name: REGISTRATION_ACCESS_COOKIE, value: token, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30 };
}

export function passwordProblems(password: string) {
  const problems: string[] = [];
  if (password.length < 12) problems.push("Use at least 12 characters.");
  if (!/[A-Z]/.test(password)) problems.push("Add one uppercase letter.");
  if (!/[a-z]/.test(password)) problems.push("Add one lowercase letter.");
  if (!/\d/.test(password)) problems.push("Add one number.");
  if (!/[^A-Za-z0-9]/.test(password)) problems.push("Add one special character.");
  return problems;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, salt, hash] = encoded.split(":");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const derived = await scrypt(password, salt, 64) as Buffer;
  const expected = Buffer.from(hash, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export function parseCookies(request: Request) {
  return Object.fromEntries((request.headers.get("cookie") || "").split(";").map((part) => part.trim()).filter(Boolean).map((part) => {
    const separator = part.indexOf("=");
    return [decodeURIComponent(part.slice(0, separator)), decodeURIComponent(part.slice(separator + 1))];
  }));
}

export function assertCsrf(request: Request) {
  const cookies = parseCookies(request);
  const cookieToken = cookies[CSRF_COOKIE] || "";
  const headerToken = request.headers.get("x-csrf-token") || "";
  const origin = request.headers.get("origin");
  const expectedOrigin = new URL(request.url).origin;
  if (origin && origin !== expectedOrigin) throw new Error("SECURITY_CHECK_FAILED");
  if (!cookieToken || !headerToken || cookieToken.length !== headerToken.length || !timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))) throw new Error("SECURITY_CHECK_FAILED");
}

export function safeNextPath(value: unknown, fallback = "/account/dashboard") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

export function ageFromDateOfBirth(value: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date > now) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) return null;
  let age = now.getUTCFullYear() - date.getUTCFullYear();
  if (now.getUTCMonth() < date.getUTCMonth() || (now.getUTCMonth() === date.getUTCMonth() && now.getUTCDate() < date.getUTCDate())) age -= 1;
  return age;
}

export function money(cents: number) { return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100); }

export function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}
