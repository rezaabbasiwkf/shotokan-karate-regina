import { destroySession } from "@/lib/portal/auth";
import { assertCsrf } from "@/lib/portal/security";
import { apiError } from "@/lib/portal/validation";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  await destroySession(request);
  return Response.json({ success: true, nextUrl: "/account" });
}
