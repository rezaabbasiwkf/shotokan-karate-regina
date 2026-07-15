import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PaymentConfirmation } from "@/components/PaymentConfirmation";
import { currentAccount } from "@/lib/portal/auth";
import { money, REGISTRATION_ACCESS_COOKIE, sha256 } from "@/lib/portal/security";
import { readPortalDatabase } from "@/lib/portal/store";

export const metadata: Metadata = { title: "Payment", description: "Submit tuition payment information securely.", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference } = await searchParams;
  if (!reference) notFound();
  const account = await currentAccount(), database = await readPortalDatabase();
  const enrollment = account?.emailVerifiedAt ? database.enrollments.find((item) => item.registrationReference === reference && item.accountId === account.id) : undefined;
  if (enrollment) {
    const student = database.students.find((item) => item.id === enrollment.studentId), karateClass = database.classes.find((item) => item.id === enrollment.classId);
    if (!student || !karateClass) notFound();
    return <><Navbar /><main className="min-h-screen bg-stone-950 pt-20"><PaymentConfirmation registrationReference={enrollment.registrationReference} studentName={student.fullName} className={karateClass.name} tuition={money(enrollment.tuitionCents)} paymentStatus={enrollment.paymentStatus} /></main><Footer /></>;
  }
  const accessToken = (await cookies()).get(REGISTRATION_ACCESS_COOKIE)?.value || "";
  const registration = accessToken ? database.registrations.find((item) => item.registrationReference === reference && item.accessTokenHash === sha256(accessToken)) : undefined;
  if (!registration) notFound();
  return <><Navbar /><main className="min-h-screen bg-stone-950 pt-20"><PaymentConfirmation registrationReference={registration.registrationReference} studentName={registration.fullName} className="SHOTOKAN Karate Training" tuition={money(registration.tuitionCents)} paymentStatus={registration.paymentStatus} returnUrl="/register" /></main><Footer /></>;
}
