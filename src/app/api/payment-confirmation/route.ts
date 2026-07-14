import { NextResponse } from "next/server";
import { submitPaymentConfirmation } from "@/lib/registration-store";
import { sendPaymentReceivedNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { registrationId, transactionReference } = (await request.json()) as { registrationId?: string; transactionReference?: string };

    if (!registrationId) {
      return NextResponse.json({ error: "A registration reference is required." }, { status: 400 });
    }
    if (!transactionReference?.trim()) {
      return NextResponse.json({ error: "Please enter the transaction reference from your PayPal receipt." }, { status: 400 });
    }

    const registration = await submitPaymentConfirmation(registrationId, transactionReference?.trim());
    if (!registration) {
      return NextResponse.json({ error: "Registration not found. Please submit the form again." }, { status: 404 });
    }

    try { await sendPaymentReceivedNotification(registration); } catch (emailError) { console.error("Payment notification email failed", emailError); }

    return NextResponse.json({ message: "Payment confirmation received. Your payment status is Pending Verification. The club will verify it and email your final registration details." });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Payment confirmation could not be completed." }, { status: 500 });
  }
}
