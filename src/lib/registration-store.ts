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
