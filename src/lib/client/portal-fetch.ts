let csrfToken = "";
import { safelyReadJson } from "./safe-json";

async function token() {
  if (csrfToken) return csrfToken;
  const response = await fetch("/api/auth/csrf", { credentials: "same-origin", cache: "no-store" });
  const data = await safelyReadJson<{ csrfToken?: string }>(response);
  if (!response.ok || !data.csrfToken) throw new Error("The security check could not be initialized. Please refresh and try again.");
  csrfToken = data.csrfToken;
  return csrfToken;
}

export async function portalFetch(input: string, init: RequestInit = {}) {
  const csrf = await token();
  return fetch(input, { ...init, credentials: "same-origin", headers: { ...init.headers, "x-csrf-token": csrf } });
}
