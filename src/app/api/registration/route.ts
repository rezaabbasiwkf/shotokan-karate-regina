import { NextResponse } from "next/server";
import { saveRegistration, getRegistrations } from "@/lib/registration-store";

function normalizeField(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }
  return value;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const honeypot = typeof payload.website === "string" ? payload.website : "";

    if (honeypot) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 });
    }

    if (!payload.humanCheck) {
      return NextResponse.json({ error: "Please confirm you are not submitting this automatically." }, { status: 400 });
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "program",
      "gender",
      "phoneNumber",
      "emailAddress",
      "homeAddress",
      "addressCity",
      "addressProvince",
      "emergencyContactName",
      "emergencyContactPhone",
      "similarProgramsBefore",
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

    if (!payload.acceptsTerms || !payload.acceptsWaiver) {
      return NextResponse.json({ error: "Please accept the registration terms and waiver." }, { status: 400 });
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
    const allowedPrograms = ["Kids Karate", "Teen Karate", "Adult Karate", "Beginner Program", "Advanced Training", "Practical Self-Defense"];
    if (!allowedPrograms.includes(String(payload.program || ""))) {
      return NextResponse.json({ error: "Please select a valid program." }, { status: 400 });
    }
    if (age < 18 && !String(payload.parentGuardianName || "").trim()) {
      return NextResponse.json({ error: "A parent or guardian name is required for students under 18." }, { status: 400 });
    }

    const normalizedPayload = Object.fromEntries(
      Object.entries(payload).map(([key, value]) => [key, normalizeField(value)]),
    );
    normalizedPayload.age = age;
    normalizedPayload.fullName = `${String(payload.firstName).trim()} ${String(payload.lastName).trim()}`;

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
