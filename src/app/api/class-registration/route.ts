import { rateLimited } from "@/lib/portal/rate-limit";
import { assertCsrf, cleanText } from "@/lib/portal/security";
import { clientIp } from "@/lib/portal/store";
import { apiError } from "@/lib/portal/validation";

const formSubmitEndpoint = "https://formsubmit.co/ajax/shotokan.karate.regina@gmail.com";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh the page and try again.", 403, "CSRF_FAILED"); }
  const ip = clientIp(request);
  if (await rateLimited(`class-registration:${ip}`, 4, 60 * 60_000)) return apiError("Too many registration attempts were received. Please try again later or call 306-519-5711.", 429, "RATE_LIMITED");

  const form = await request.formData().catch(() => null);
  if (!form) return apiError("The registration form could not be read.", 400, "INVALID_FORM");
  if (cleanText(form.get("_honey"))) return Response.json({ success: true });
  if (!cleanText(form.get("Full Name"), 160) || !cleanText(form.get("email"), 254)) return apiError("Please enter the participant name and email address.", 400, "MISSING_REQUIRED_FIELDS");
  const siteOrigin = new URL(request.url).origin;
  const registrationUrl = `${siteOrigin}/register`;
  form.set("_url", registrationUrl);

  try {
    const response = await fetch(formSubmitEndpoint, { method: "POST", body: form, headers: { Accept: "application/json", Origin: siteOrigin, Referer: registrationUrl }, cache: "no-store" });
    const payload = await response.json().catch(() => ({})) as { success?: boolean | string; message?: string };
    if (!response.ok || payload.success === false || payload.success === "false") return apiError(payload.message || "The email service could not accept your registration. Please call 306-519-5711.", 502, "EMAIL_SERVICE_FAILED");
    return Response.json({ success: true, message: "Your registration was sent successfully." });
  } catch {
    return apiError("The email service is temporarily unavailable. Please try again or call 306-519-5711.", 502, "EMAIL_SERVICE_UNAVAILABLE");
  }
}
