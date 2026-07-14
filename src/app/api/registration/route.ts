import { NextResponse } from "next/server";
import { saveRegistration, getRegistrations } from "@/lib/registration-store";

function normalizeField(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
}

async function verifyRecaptcha(token: string) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { success: true };
  }

  const result = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ secret, response: token }),
  });

  const data = (await result.json()) as { success?: boolean };
  return data;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const recaptchaToken = typeof payload.recaptchaToken === "string" ? payload.recaptchaToken : "";
    const honeypot = typeof payload.website === "string" ? payload.website : "";

    if (honeypot) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }

    const hasGoogleCaptchaKey = Boolean(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY);
    if (hasGoogleCaptchaKey && !recaptchaToken) {
      return NextResponse.json({ error: "Please complete the anti-spam verification." }, { status: 400 });
    }

    if (hasGoogleCaptchaKey) {
      const verification = await verifyRecaptcha(recaptchaToken);
      if (!verification.success) {
        return NextResponse.json({ error: "Anti-spam verification failed." }, { status: 400 });
      }
    } else if (!payload.humanCheck) {
      return NextResponse.json({ error: "Please confirm you are not submitting this automatically." }, { status: 400 });
    }

    const requiredFields = [
      "fullName",
      "dateOfBirth",
      "gender",
      "phoneNumber",
      "emailAddress",
      "homeAddress",
      "emergencyContactName",
      "emergencyContactPhone",
      "similarProgramsBefore",
      "motivation",
      "heardAbout",
      "healthDetails",
      "medicationDetails",
      "goals",
      "nextGoals",
      "attendRegularly",
      "participantName",
      "participantSignature",
      "date",
    ];

    const missing = requiredFields.filter((field) => {
      const value = payload[field];
      return typeof value !== "string" || !value.trim();
    });

    if (missing.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 });
    }

    if (!/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ][ -]?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(String(payload.postalCode || "").trim())) {
      return NextResponse.json({ error: "Please enter a valid Canadian postal code." }, { status: 400 });
    }

    const age = typeof payload.age === "number"
      ? payload.age
      : Number(String(payload.age || "").trim());
    if (!Number.isInteger(age)) {
      return NextResponse.json({ error: "Please enter a valid age." }, { status: 400 });
    }
    if (age < 4 || age > 100) {
      return NextResponse.json({ error: "Age must be between 4 and 100." }, { status: 400 });
    }

    const allowedGenders = ["Female", "Male", "Non-binary", "Prefer not to say"];
    if (!allowedGenders.includes(String(payload.gender || ""))) {
      return NextResponse.json({ error: "Please select a valid gender." }, { status: 400 });
    }

    const normalizedPayload = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, normalizeField(value)]),
    );
    normalizedPayload.age = age;

    const submission = await saveRegistration(normalizedPayload);
    return NextResponse.json({
      message: "Registration received. Continue to payment.",
      submission,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration could not be completed." }, { status: 500 });
  }
}

export async function GET() {
  const registrations = await getRegistrations();
  return NextResponse.json(registrations);
}
