import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { PortalDatabase } from "./types";

const DATABASE_FILE = path.join(process.cwd(), "data", path.basename(process.env.PORTAL_DATABASE_FILE || "portal-database.json"));
const KV_KEY = "shotokan:portal:v1";
const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;

function createDatabase(): PortalDatabase {
  const now = new Date().toISOString();
  return {
    version: 0,
    accounts: [],
    students: [],
    emergency_contacts: [],
    classes: [{
      id: "class-general-shotokan",
      name: "SHOTOKAN Karate – All Levels",
      minAge: 5,
      maxAge: null,
      skillLevel: "All Levels",
      day: "Wednesday",
      startTime: "4:00 PM",
      endTime: "5:00 PM",
      location: "1751 Broad Street, Regina, SK",
      instructor: "Coach Reza Abbasi",
      capacity: 30,
      tuitionCents: 6000,
      registrationStatus: "Open",
      enrollmentPeriod: "Current Session",
      createdAt: now,
      updatedAt: now,
    }],
    class_sessions: [{ id: "session-current", classId: "class-general-shotokan", name: "Current Session", startDate: null, endDate: null, active: true }],
    enrollments: [],
    registrations: [],
    payments: [],
    waiver_acceptances: [],
    email_delivery_logs: [],
    trial_requests: [],
    sessions: [],
    secure_tokens: [],
    receipts: [],
    audit_logs: [],
    rate_limits: [],
    knowledge_resources: [],
    knowledge_articles: [],
  };
}

function normalizeDatabase(value: unknown): PortalDatabase {
  const fresh = createDatabase();
  if (!value || typeof value !== "object") return fresh;
  const stored = value as Partial<PortalDatabase>;
  return {
    ...fresh,
    ...stored,
    classes: stored.classes?.length ? stored.classes : fresh.classes,
    class_sessions: stored.class_sessions?.length ? stored.class_sessions : fresh.class_sessions,
    knowledge_resources: stored.knowledge_resources || [],
    knowledge_articles: stored.knowledge_articles || [],
  };
}

async function kv(command: string[]) {
  if (!kvUrl || !kvToken) return null;
  const response = await fetch(`${kvUrl}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${kvToken}`, "Content-Type": "application/json" },
    body: JSON.stringify([command]),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Database service returned ${response.status}.`);
  const payload = await response.json() as Array<{ result?: unknown; error?: string }>;
  if (payload[0]?.error) throw new Error(`Database service error: ${payload[0].error}`);
  return payload[0]?.result;
}

async function localRead() {
  await mkdir(path.dirname(DATABASE_FILE), { recursive: true });
  try { return normalizeDatabase(JSON.parse(await readFile(DATABASE_FILE, "utf8"))); }
  catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw new Error("The local portal database could not be read.", { cause: error });
    const database = createDatabase();
    await writeFile(DATABASE_FILE, JSON.stringify(database, null, 2), "utf8");
    return database;
  }
}

async function localWrite(database: PortalDatabase) {
  await mkdir(path.dirname(DATABASE_FILE), { recursive: true });
  await writeFile(DATABASE_FILE, JSON.stringify(database, null, 2), "utf8");
}

export async function readPortalDatabase() {
  if ((!kvUrl || !kvToken) && process.env.NODE_ENV === "production") throw new Error("Portal database configuration is missing.");
  const stored = await kv(["GET", KV_KEY]);
  if (stored === null && (!kvUrl || !kvToken)) return localRead();
  if (typeof stored !== "string") return createDatabase();
  return normalizeDatabase(JSON.parse(stored));
}

let localMutation = Promise.resolve();

export async function mutatePortalDatabase<T>(mutation: (database: PortalDatabase) => T | Promise<T>): Promise<T> {
  if (!kvUrl || !kvToken) {
    if (process.env.NODE_ENV === "production") throw new Error("Portal database configuration is missing.");
    let resolveResult!: (value: T) => void;
    let rejectResult!: (reason: unknown) => void;
    const result = new Promise<T>((resolve, reject) => { resolveResult = resolve; rejectResult = reject; });
    localMutation = localMutation.then(async () => {
      try {
        const database = await localRead();
        const value = await mutation(database);
        database.version += 1;
        await localWrite(database);
        resolveResult(value);
      } catch (error) { rejectResult(error); }
    });
    await localMutation;
    return result;
  }

  const compareAndSet = `local current=redis.call('GET',KEYS[1]); if not current then if ARGV[1]~='0' then return 0 end else local decoded=cjson.decode(current); if tostring(decoded.version)~=ARGV[1] then return 0 end end; redis.call('SET',KEYS[1],ARGV[2]); return 1`;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const database = await readPortalDatabase();
    const expectedVersion = database.version;
    const value = await mutation(database);
    database.version = expectedVersion + 1;
    const saved = await kv(["EVAL", compareAndSet, "1", KV_KEY, String(expectedVersion), JSON.stringify(database)]);
    if (Number(saved) === 1) return value;
  }
  throw new Error("The database was busy. Please submit again.");
}

export function newId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "not-recorded";
}

export function audit(database: PortalDatabase, request: Request, accountId: string | null, action: string, entityType: string, entityId: string, details = "") {
  database.audit_logs.unshift({ id: newId("audit"), accountId, action, entityType, entityId, ipAddress: clientIp(request), details, createdAt: new Date().toISOString() });
  database.audit_logs = database.audit_logs.slice(0, 5000);
}
