import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type RegistrationSubmission = {
  id: string;
  createdAt: string;
  [key: string]: unknown;
};

const REGISTRATIONS_FILE = path.join(process.cwd(), "data", "registrations.json");

async function ensureStore() {
  await mkdir(path.dirname(REGISTRATIONS_FILE), { recursive: true });
  try {
    await readFile(REGISTRATIONS_FILE, "utf8");
  } catch {
    await writeFile(REGISTRATIONS_FILE, "[]", "utf8");
  }
}

export async function saveRegistration(data: Record<string, unknown>) {
  await ensureStore();
  const raw = await readFile(REGISTRATIONS_FILE, "utf8");
  const existing = JSON.parse(raw) as RegistrationSubmission[];
  const submission: RegistrationSubmission = {
    id: `reg-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };

  existing.unshift(submission);
  await writeFile(REGISTRATIONS_FILE, JSON.stringify(existing, null, 2), "utf8");
  return submission;
}

export async function getRegistrations() {
  await ensureStore();
  const raw = await readFile(REGISTRATIONS_FILE, "utf8");
  return JSON.parse(raw) as RegistrationSubmission[];
}

export async function confirmRegistrationPayment(id: string) {
  await ensureStore();
  const raw = await readFile(REGISTRATIONS_FILE, "utf8");
  const registrations = JSON.parse(raw) as RegistrationSubmission[];
  const registration = registrations.find((item) => item.id === id);

  if (!registration) {
    return null;
  }

  if (!registration.paymentConfirmedAt) {
    registration.paymentConfirmedAt = new Date().toISOString();
    registration.paymentStatus = "payment-confirmed";
    await writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");
  }

  return registration;
}

export async function markRegistrationConfirmationEmailSent(id: string) {
  await ensureStore();
  const raw = await readFile(REGISTRATIONS_FILE, "utf8");
  const registrations = JSON.parse(raw) as RegistrationSubmission[];
  const registration = registrations.find((item) => item.id === id);

  if (!registration) {
    return null;
  }

  registration.confirmationEmailSentAt = new Date().toISOString();
  await writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");
  return registration;
}
