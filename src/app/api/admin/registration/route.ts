import { NextResponse } from "next/server";
import { sendPaymentConfirmationEmail } from "@/lib/email";
import { confirmRegistrationPayment, getRegistration, markRegistrationConfirmationEmailSent } from "@/lib/registration-store";

export async function POST(request: Request) {
  try {
    const { registrationId, action } = (await request.json()) as { registrationId?: string; action?: "confirm" | "resend" };
    if (!registrationId || !action) return NextResponse.json({ error: "Registration and action are required." }, { status: 400 });

    const registration = action === "confirm"
      ? await confirmRegistrationPayment(registrationId)
      : await getRegistration(registrationId);
    if (!registration) return NextResponse.json({ error: "Registration not found." }, { status: 404 });

    const email = await sendPaymentConfirmationEmail(registration);
    if (email.sent) await markRegistrationConfirmationEmailSent(registrationId);
    return NextResponse.json({ message: email.sent ? action === "confirm" ? "Payment verified and confirmation email sent." : "Confirmation email resent." : action === "confirm" ? "Payment verified. Email delivery is not configured yet." : "Email delivery is not configured yet." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "The registration update could not be completed." }, { status: 500 });
  }
}
