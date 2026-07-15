import { mutatePortalDatabase } from "./store";

export async function rateLimited(key: string, limit: number, windowMs: number) {
  const now = new Date();
  return mutatePortalDatabase((database) => {
    database.rate_limits = database.rate_limits.filter((entry) => new Date(entry.resetAt) > now);
    const entry = database.rate_limits.find((item) => item.key === key);
    if (!entry) {
      database.rate_limits.push({ key, count: 1, resetAt: new Date(now.getTime() + windowMs).toISOString() });
      return false;
    }
    entry.count += 1;
    return entry.count > limit;
  });
}
