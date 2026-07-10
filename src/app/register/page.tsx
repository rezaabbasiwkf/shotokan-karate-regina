import Image from "next/image";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { StudentRegistrationForm } from "@/components/StudentRegistrationForm";

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

const qrCodes = [
  {
    label: "WhatsApp",
    description: "Register or ask about classes",
    src: "/images/Whatsapp.PNG",
    alt: "WhatsApp registration QR code for Shotokan Karate Regina",
  },
  {
    label: "PayPal",
    description: "Scan for payment",
    src: "/images/Paypal.JPG",
    alt: "PayPal QR code for Shotokan Karate Regina",
  },
  {
    label: "Instagram",
    description: "Follow training updates",
    src: "/images/Instagram.JPG",
    alt: "Instagram QR code for Shotokan Karate Regina",
  },
  {
    label: "Google Review",
    description: "Leave a review",
    src: "/images/googleReview.PNG",
    alt: "Google review QR code for Shotokan Karate Regina",
  },
];

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="bg-stone-950 pb-24 pt-28">
        <section className="section-shell">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-black via-stone-950 to-black p-8 shadow-2xl shadow-black/35 sm:p-10 lg:p-14">
            <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                  Student enrollment
                </p>
                <h1 className="mt-4 text-4xl font-black uppercase leading-tight text-white sm:text-5xl">
                  Register for Shotokan Karate Regina
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
                  Complete this secure registration form to reserve your place in class and provide the information needed for your first training session.
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
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

              <div className="rounded-3xl border border-white/10 bg-stone-950/80 p-6 shadow-2xl shadow-black/30 sm:p-8">
                <SectionHeading eyebrow="Quick access" title="Connect and pay">
                  Scan the QR codes below for quick access to registration, payment, social updates, and reviews.
                </SectionHeading>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {qrCodes.map((code) => (
                    <article className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center" key={code.label}>
                      <div className="mx-auto flex aspect-square max-w-40 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white p-3">
                        <Image
                          src={code.src}
                          alt={code.alt}
                          width={220}
                          height={220}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <h3 className="mt-4 text-sm font-black uppercase tracking-[0.16em] text-white">
                        {code.label}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-stone-400">{code.description}</p>
                    </article>
                  ))}
                </div>
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
