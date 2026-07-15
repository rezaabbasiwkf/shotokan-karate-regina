import { cleanText, normalizeEmail } from "./security";

export type FieldErrors = Record<string, string>;
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phonePattern = /^[+\d][\d\s().-]{6,}$/;

export function field(payload: Record<string, unknown>, name: string, maxLength = 300) { return cleanText(payload[name], maxLength); }
export function emailField(payload: Record<string, unknown>, name: string) { return normalizeEmail(field(payload, name, 254)); }
export function required(errors: FieldErrors, value: string, name: string, message: string) { if (!value) errors[name] = message; }
export function validEmail(errors: FieldErrors, value: string, name = "email") { if (value && !emailPattern.test(value)) errors[name] = "Please enter a valid email address."; }
export function validPhone(errors: FieldErrors, value: string, name: string) { if (value && !phonePattern.test(value)) errors[name] = "Please enter a valid phone number."; }

export function validationResponse(fieldErrors: FieldErrors, message = "Please correct the highlighted fields.") {
  return Response.json({ success: false, code: "VALIDATION_ERROR", message, fieldErrors }, { status: 400 });
}

export function apiError(message: string, status = 400, code = "REQUEST_FAILED") {
  return Response.json({ success: false, code, message }, { status });
}
