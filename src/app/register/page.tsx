import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { StudentRegistrationForm } from "@/components/StudentRegistrationForm";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Register for Shotokan Karate Regina classes and submit your student enrollment form before proceeding to tuition payment.",
  alternates: {
    canonical: "/register",
  },
};

const contactItems = [
  { label: "Class Time", value: "Every Wednesday, 4:00 PM - 5:00 PM" },
  { label: "Location", value: "1751 Broad Street, Regina, SK" },
  { label: "Monthly Fee", value: "$60 / month" },
  { label: "Family Discount", value: "$50 / person / month" },
  { label: "Trial Class", value: "First week free" },
  { label: "Coach Reza Abbasi", value: "306-570-3125" },
  { label: "Moha Ebrahimi", value: "Registration & Coordination, 306-519-5711" },
  { label: "Instagram", value: "@shotokan_karate_yqr" },
];

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="bg-stone-950 pb-24 pt-28">
        <section className="section-shell">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-black via-stone-950 to-black p-8 shadow-2xl shadow-black/35 sm:p-10 lg:p-14">
            <div className="mx-auto max-w-4xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                  Student enrollment
                </p>
                <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
                  Register for Shotokan Karate Regina
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
                  Complete this secure registration form to reserve your place in class and provide the information needed for your first training session.
                </p>
                <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
                  {contactItems.map((item) => (
                    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4" key={item.label}>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold leading-7 text-white">
                        {item.value}
                      </p>
                    </article>
                  ))}
                </div>
            </div>
          </div>
        </section>

        <section className="section-shell mt-10">
          <StudentRegistrationForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
