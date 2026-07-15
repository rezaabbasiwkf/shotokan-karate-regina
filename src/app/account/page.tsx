import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountAccess } from "@/components/account/AccountAccess";
import { currentAccount } from "@/lib/portal/auth";

export const metadata: Metadata = { title: "Register / Login", description: "Create or access your secure SHOTOKAN Karate Regina family account.", robots: { index: false, follow: false } };

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const account = await currentAccount();
  if (account) redirect(account.emailVerifiedAt ? "/account/dashboard" : "/account/verify-email");
  const { next } = await searchParams;
  return <div className="section-shell"><AccountAccess next={next} /></div>;
}
