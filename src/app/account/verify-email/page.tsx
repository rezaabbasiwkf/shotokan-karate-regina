import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAccount } from "@/lib/portal/auth";
import { ResendVerification } from "@/components/account/ResendVerification";

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const account = await requireAccount();
  if (account.emailVerifiedAt) redirect("/account/students/new");
  const { error } = await searchParams;
  return <div className="section-shell"><section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-black/45 p-8 text-center sm:p-12"><p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">Email verification</p><h1 className="hero-title mt-4 text-4xl font-bold text-white">Check Your Email</h1><p className="mt-5 leading-8 text-stone-300">We sent a secure verification link to <strong className="text-white">{account.email}</strong>. Verify your address before adding a student.</p>{error ? <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-red-100">That verification link is missing, invalid, or expired. Request a new link below.</p> : null}<p className="mt-6 text-sm text-stone-400">The link expires after 24 hours. Email delivery may take a few minutes.</p><ResendVerification/><Link href="/account/dashboard" className="mt-5 inline-flex min-h-12 items-center justify-center rounded-md border border-white/20 px-6 text-sm font-black uppercase tracking-[0.12em] text-white">View Account Dashboard</Link></section></div>;
}
