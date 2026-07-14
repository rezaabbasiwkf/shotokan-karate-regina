import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type RegistrationSubmission = { id: string; createdAt: string; [key: string]: unknown };
const REGISTRATIONS_FILE = path.join(process.cwd(), "data", "registrations.json");
const KV_KEY = "shotokan:registrations";
const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;

async function localRead() { await mkdir(path.dirname(REGISTRATIONS_FILE), { recursive: true }); try { return JSON.parse(await readFile(REGISTRATIONS_FILE, "utf8")) as RegistrationSubmission[]; } catch { await writeFile(REGISTRATIONS_FILE, "[]", "utf8"); return []; } }
async function localWrite(registrations: RegistrationSubmission[]) { await mkdir(path.dirname(REGISTRATIONS_FILE), { recursive: true }); await writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8"); }
async function kv(command: string[][]) {
  if (!kvUrl || !kvToken) return null;
  const response = await fetch(`${kvUrl}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${kvToken}`, "Content-Type": "application/json" }, body: JSON.stringify(command) });
  if (!response.ok) throw new Error("Registration storage service is temporarily unavailable. Please try again.");
  return await response.json() as Array<{ result?: unknown }>;
}
async function readStore() { const response = await kv([["GET", KV_KEY]]); if (!response) return localRead(); const result = response[0]?.result; return typeof result === "string" ? JSON.parse(result) as RegistrationSubmission[] : []; }
async function writeStore(registrations: RegistrationSubmission[]) { const response = await kv([["SET", KV_KEY, JSON.stringify(registrations)]]); if (!response) await localWrite(registrations); }

export async function saveRegistration(data: Record<string, unknown>) { const registrations = await readStore(); const year = new Date().getFullYear(); const reference = `REG-${year}-${crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase()}`; const submission: RegistrationSubmission = { id: reference, createdAt: new Date().toISOString(), ...data }; registrations.unshift(submission); await writeStore(registrations); return submission; }
export async function getRegistrations() { return readStore(); }
export async function getRegistration(id: string) { return (await readStore()).find((item) => item.id === id) ?? null; }
export async function findRecentRegistrationByEmail(email: string) { const cutoff = Date.now() - 15 * 60 * 1000; return (await readStore()).find((item) => String(item.emailAddress || "").toLowerCase() === email.toLowerCase() && new Date(item.createdAt).getTime() > cutoff) ?? null; }
export async function updateRegistration(id: string, changes: Record<string, unknown>) { const registrations = await readStore(); const registration = registrations.find((item) => item.id === id); if (!registration) return null; Object.assign(registration, changes, { updatedAt: new Date().toISOString() }); await writeStore(registrations); return registration; }
export async function submitPaymentConfirmation(id: string, transactionReference?: string) { const registrations = await readStore(); const registration = registrations.find((item) => item.id === id); if (!registration) return null; if (!registration.paymentConfirmationSubmittedAt) { registration.paymentConfirmationSubmittedAt = new Date().toISOString(); registration.paymentStatus = "Pending Verification"; registration.registrationStatus = "Payment Submitted"; registration.transactionReference = transactionReference || ""; registration.updatedAt = new Date().toISOString(); await writeStore(registrations); } return registration; }
export async function confirmRegistrationPayment(id: string) { const registrations = await readStore(); const registration = registrations.find((item) => item.id === id); if (!registration) return null; registration.paymentConfirmedAt = registration.paymentConfirmedAt || new Date().toISOString(); registration.paymentStatus = "Confirmed"; registration.registrationStatus = "Completed"; registration.updatedAt = new Date().toISOString(); await writeStore(registrations); return registration; }
export async function markRegistrationConfirmationEmailSent(id: string) { const registrations = await readStore(); const registration = registrations.find((item) => item.id === id); if (!registration) return null; registration.confirmationEmailSentAt = new Date().toISOString(); await writeStore(registrations); return registration; }
