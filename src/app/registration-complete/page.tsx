import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { REGISTRATION_ACCESS_COOKIE, sha256 } from "@/lib/portal/security";
import { readPortalDatabase } from "@/lib/portal/store";

export const metadata: Metadata = { title: "Registration Submitted", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function Page({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference } = await searchParams, token = (await cookies()).get(REGISTRATION_ACCESS_COOKIE)?.value || "";
  const registration = reference && token ? (await readPortalDatabase()).registrations.find((item) => item.registrationReference === reference && item.accessTokenHash === sha256(token)) : undefined;
  if (!registration || registration.paymentStatus === "Not Paid") notFound();
  return <><Navbar /><main className="flex min-h-screen items-center bg-stone-950 px-4 pb-16 pt-28 text-white"><section className="mx-auto max-w-3xl rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-950/25 to-black p-7 text-center shadow-2xl sm:p-12"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Reference {registration.registrationReference}</p><h1 className="hero-title mt-5 text-4xl font-bold sm:text-5xl">Registration Submitted Successfully</h1><p className="mt-6 text-lg leading-8 text-stone-300">Thank you. Your registration and payment information have been received. Your payment is pending verification, and a confirmation email has been sent to you.</p><p className="mt-5 rounded-xl border border-amber-300/20 bg-amber-950/20 p-4 text-sm text-amber-100">Payment status: {registration.paymentStatus}. The academy will confirm enrollment after administrator verification.</p><Link href="/" className="mt-8 inline-flex min-h-12 items-center justify-center rounded-md bg-red-600 px-7 text-sm font-black uppercase tracking-[0.12em] hover:bg-red-500">Return Home</Link></section></main><Footer /></>;
}
