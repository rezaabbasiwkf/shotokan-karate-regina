import { NextResponse } from "next/server";
import { getRegistrations, saveRegistration } from "@/lib/registration-store";
import { sendRegistrationNotification, sendRegistrationReceivedEmail } from "@/lib/email";

type Payload = Record<string, unknown>;
const phonePattern = /^[+\d][\d\s().-]{6,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ageFromDateOfBirth(value: unknown) {
  if (typeof value !== "string" || !value) return null;
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  if (today.getMonth() < date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() < date.getDate())) age -= 1;
  return age;
}

function validationError(fieldErrors: Record<string, string>) {
  return NextResponse.json({ success: false, code: "VALIDATION_ERROR", message: "Please correct the highlighted fields.", fieldErrors }, { status: 400 });
}

function stringField(payload: Payload, name: string) { return typeof payload[name] === "string" ? payload[name].trim() : ""; }

export async function POST(request: Request) {
  let payload: Payload;
  try { payload = (await request.json()) as Payload; } catch { return NextResponse.json({ success: false, code: "INVALID_REQUEST", message: "Please submit the registration form again." }, { status: 400 }); }

  if (stringField(payload, "website")) return NextResponse.json({ success: false, code: "SPAM_DETECTED", message: "This registration could not be submitted." }, { status: 400 });

  const errors: Record<string, string> = {};
  const required = ["fullName", "dateOfBirth", "gender", "phoneNumber", "emailAddress", "homeAddress", "emergencyContactName", "emergencyContactPhone", "similarProgramsBefore", "heardAbout", "medicalCondition", "attendRegularly"];
  const friendlyNames: Record<string, string> = { fullName: "full name", dateOfBirth: "date of birth", gender: "gender", phoneNumber: "phone number", emailAddress: "email address", homeAddress: "home address", emergencyContactName: "emergency contact name", emergencyContactPhone: "emergency contact phone number", similarProgramsBefore: "previous program participation", heardAbout: "how you heard about us", medicalCondition: "medical conditions", attendRegularly: "attendance commitment" };
  required.forEach((field) => { if (!stringField(payload, field)) errors[field] = `Please enter ${friendlyNames[field]}.`; });

  const age = ageFromDateOfBirth(payload.dateOfBirth);
  if (age === null || age < 5) errors.dateOfBirth = "Participants must be at least 5 years old.";
  if (stringField(payload, "emailAddress") && !emailPattern.test(stringField(payload, "emailAddress"))) errors.emailAddress = "Please enter a valid email address.";
  if (stringField(payload, "phoneNumber") && !phonePattern.test(stringField(payload, "phoneNumber"))) errors.phoneNumber = "Please enter a valid phone number.";
  if (stringField(payload, "emergencyContactPhone") && !phonePattern.test(stringField(payload, "emergencyContactPhone"))) errors.emergencyContactPhone = "Please enter a valid emergency contact phone number.";
  if (!["Female", "Male", "Non-binary", "Prefer not to say"].includes(stringField(payload, "gender"))) errors.gender = "Please select a gender option.";
  if (!["Yes", "No"].includes(stringField(payload, "similarProgramsBefore"))) errors.similarProgramsBefore = "Please select Yes or No.";
  if (!["Yes", "No"].includes(stringField(payload, "medicalCondition"))) errors.medicalCondition = "Please select Yes or No.";
  if (stringField(payload, "medicalCondition") === "Yes" && !stringField(payload, "medicalDetails")) errors.medicalDetails = "Please provide relevant details.";
  if (!["Yes", "No"].includes(stringField(payload, "attendRegularly"))) errors.attendRegularly = "Please select Yes or No.";
  if (stringField(payload, "heardAbout") === "Other" && !stringField(payload, "heardAboutOther")) errors.heardAboutOther = "Please provide details.";
  if ((age ?? 18) < 18) {
    if (!stringField(payload, "parentGuardianName")) errors.parentGuardianName = "Please enter a parent or guardian name.";
    if (!stringField(payload, "parentGuardianContact")) errors.parentGuardianContact = "Please enter a parent or guardian phone number or email.";
    if (!stringField(payload, "parentGuardianSignature")) errors.parentGuardianSignature = "Parent or guardian signature is required.";
  }
  (["informationAccurate", "understandsRisks", "followsRules", "authorizeEmergencyTreatment", "feesNonRefundable", "acceptsWaiver"] as const).forEach((field) => { if (!payload[field]) errors[field] = "This acknowledgement is required."; });
  if (!stringField(payload, "participantSignature")) errors.participantSignature = "Please enter your electronic signature.";
  if (Object.keys(errors).length) return validationError(errors);

  const normalizedPayload = Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value]));
  normalizedPayload.age = age;
  normalizedPayload.program = "SHOTOKAN Karate Regina General Registration";
  normalizedPayload.paymentStatus = "pending-payment";

  try {
    const submission = await saveRegistration(normalizedPayload);
    const emailResults = await Promise.allSettled([sendRegistrationNotification(submission), sendRegistrationReceivedEmail(submission)]);
    emailResults.forEach((result, index) => {
      if (result.status === "rejected") console.error(index === 0 ? "Registration administrator email failed" : "Registration participant email failed", result.reason);
    });
    const paymentUrl = `/payment?reference=${encodeURIComponent(submission.id)}`;
    return NextResponse.json({ success: true, registrationReference: submission.id, paymentUrl, submission: { id: submission.id, fullName: submission.fullName } });
  } catch (error) {
    console.error("Registration storage failed", error);
    return NextResponse.json({ success: false, code: "SERVICE_UNAVAILABLE", message: "The registration service is temporarily unavailable. Please try again." }, { status: 503 });
  }
}

export async function GET() {
  try { return NextResponse.json(await getRegistrations()); } catch { return NextResponse.json({ success: false, code: "SERVICE_UNAVAILABLE", message: "The registration service is temporarily unavailable. Please try again." }, { status: 503 }); }
}
