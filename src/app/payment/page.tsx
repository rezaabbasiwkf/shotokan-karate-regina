import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PaymentConfirmation } from "@/components/PaymentConfirmation";

export const metadata: Metadata = {
  title: "Payment",
  description: "Complete Shotokan Karate Regina tuition payment after submitting your registration.",
  robots: { index: false, follow: false },
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ registration?: string }>;
}) {
  const { registration } = await searchParams;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-stone-950"><PaymentConfirmation registrationId={registration} /></main>
      <Footer />
    </>
  );
}
