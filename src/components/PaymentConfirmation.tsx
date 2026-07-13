"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export function PaymentConfirmation({ registrationId }: { registrationId?: string }) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [transactionReference, setTransactionReference] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const confirmPayment = async () => {
    if (!registrationId) {
      setMessage({ type: "error", text: "Your registration reference is missing. Please complete the registration form again." });
      return;
    }

    setIsConfirming(true);
    setMessage(null);
    try {
      const response = await fetch("/api/payment-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, transactionReference }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Payment confirmation could not be completed.");
      }
      setMessage({ type: "success", text: data.message });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Payment confirmation could not be completed." });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <section className="section-shell py-28 sm:py-32">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-black via-stone-950 to-black p-6 text-center shadow-2xl shadow-black/40 sm:p-10 lg:p-14">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Step 2 of 2 · Tuition payment</p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-white sm:text-5xl">Complete your enrollment</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
          Scan this PayPal QR code with your phone to pay your tuition. When the payment is complete, select the confirmation button below and we’ll email your registration details and next steps.
        </p>

        <div className="mx-auto mt-8 w-full max-w-sm rounded-3xl border border-white/10 bg-white p-5 shadow-xl shadow-black/30 sm:p-7">
          <Image
            src="/images/Paypal.JPG"
            alt="PayPal QR code for Shotokan Karate Regina tuition payment"
            width={600}
            height={600}
            priority
            className="h-auto w-full object-contain"
          />
        </div>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-400">
          Monthly tuition is $60, or $50 per person per month for families. Keep your PayPal receipt for your records.
        </p>

        <label className="mx-auto mt-7 block max-w-xl text-left text-sm font-semibold text-stone-200">
          <span>PayPal transaction reference (optional)</span>
          <input
            value={transactionReference}
            onChange={(event) => setTransactionReference(event.target.value)}
            placeholder="Enter the transaction ID from your PayPal receipt"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-red-400"
          />
        </label>

        {message ? (
          <div className={`mx-auto mt-7 max-w-xl rounded-xl border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-red-500/30 bg-red-500/10 text-red-100"}`}>
            {message.text}
          </div>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={confirmPayment}
            disabled={isConfirming || message?.type === "success"}
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-600 px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isConfirming ? "Submitting..." : message?.type === "success" ? "Confirmation submitted" : "Submit payment confirmation"}
          </button>
          <Link href="/register" className="inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:border-red-300/60">
            Back to registration
          </Link>
        </div>
      </div>
    </section>
  );
}
