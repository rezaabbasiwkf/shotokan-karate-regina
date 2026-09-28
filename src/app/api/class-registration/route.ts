import { assertCsrf, cleanText } from "@/lib/portal/security";
import { apiError } from "@/lib/portal/validation";

const formSubmitEndpoint = "https://formsubmit.co/ajax/shotokan.karate.regina@gmail.com";

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure form session expired. Refresh the page and try again.", 403, "CSRF_FAILED"); }
  const form = await request.formData().catch(() => null);
  if (!form) return apiError("The registration form could not be read.", 400, "INVALID_FORM");
  if (cleanText(form.get("_honey"))) return Response.json({ success: true });
  if (!cleanText(form.get("Full Name"), 160) || !cleanText(form.get("email"), 254)) return apiError("Please enter the participant name and email address.", 400, "MISSING_REQUIRED_FIELDS");
  const siteOrigin = new URL(request.url).origin;
  const registrationUrl = `${siteOrigin}/register`;
  form.set("_url", registrationUrl);

  // FormSubmit's AJAX endpoint is most reliable with a traditional encoded
  // form body. Keep every submitted field (including repeated checkboxes).
  const body = new URLSearchParams();
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") body.append(key, value);
  }

  try {
    const response = await fetch(formSubmitEndpoint, {
      method: "POST",
      body,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Origin: siteOrigin,
        Referer: registrationUrl,
      },
      cache: "no-store",
    });
    const responseText = await response.text();
    const payload = (() => {
      try { return JSON.parse(responseText) as { success?: boolean | string; message?: string }; }
      catch { return {} as { success?: boolean | string; message?: string }; }
    })();
    if (!response.ok || payload.success === false || payload.success === "false") {
      const message = payload.message || "FormSubmit has not activated this registration form yet. Please open the newest activation email sent to shotokan.karate.regina@gmail.com and select Activate Form.";
      return apiError(message, 502, "EMAIL_SERVICE_FAILED");
    }
    return Response.json({ success: true, message: "Your registration was sent successfully." });
  } catch {
    return apiError("The email service is temporarily unavailable. Please try again or call 306-519-5711.", 502, "EMAIL_SERVICE_UNAVAILABLE");
  }
}
