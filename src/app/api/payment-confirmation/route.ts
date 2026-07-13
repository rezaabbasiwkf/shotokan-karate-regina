import { NextResponse } from "next/server";
import { sendPaymentConfirmationEmail } from "@/lib/email";
import { confirmRegistrationPayment, markRegistrationConfirmationEmailSent } from "@/lib/registration-store";

export async function POST(request: Request) {
  try {
    const { registrationId } = (await request.json()) as { registrationId?: string };

    if (!registrationId) {
      return NextResponse.json({ error: "A registration reference is required." }, { status: 400 });
    }

    const registration = await confirmRegistrationPayment(registrationId);
    if (!registration) {
      return NextResponse.json({ error: "Registration not found. Please submit the form again." }, { status: 404 });
    }

    if (!registration.confirmationEmailSentAt) {
      await sendPaymentConfirmationEmail(registration);
      await markRegistrationConfirmationEmailSent(registrationId);
    }

    return NextResponse.json({ message: "Payment confirmation received. Check your email for next steps." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Payment confirmation could not be completed." }, { status: 500 });
  }
}
