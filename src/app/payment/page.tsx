import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PaymentConfirmation } from "@/components/PaymentConfirmation";
import { getRegistration } from "@/lib/registration-store";

export const metadata: Metadata = {
  title: "Payment",
  description: "Complete Shotokan Karate Regina tuition payment after submitting your registration.",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ registration?: string; reference?: string }>;
}) {
  const { registration, reference } = await searchParams;
  const registrationId = reference || registration;
  let participantName: string | undefined;
  if (registrationId) {
    try { participantName = String((await getRegistration(registrationId))?.fullName || "") || undefined; } catch { /* The payment page remains usable even if storage is temporarily unavailable. */ }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-950"><PaymentConfirmation registrationId={registrationId} participantName={participantName} /></main>
      <Footer />
    </>
  );
}
