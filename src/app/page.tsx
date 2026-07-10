import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";

const classFeatures = [
  "Beginner to advanced Shotokan training",
  "Specialized competition training programs",
  "Practical self-defense skills",
  "Official belt testing through Karate Canada",
  "Programs for kids, teens, and adults",
];

const coachHighlights = [
  "5th Dan Shotokan Karate instructor",
  "Certified Level 1 Karate coach",
  "Official Karate Federation referee",
  "15+ years of coaching experience",
  "Gold Medalist at the 2015 World Championship",
];

const contactItems = [
  { label: "Class Time", value: "Every Wednesday, 5:00 PM - 6:00 PM" },
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

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home">
        <section className="relative min-h-[92vh] overflow-hidden pt-20">
          <Image
            src="/images/class.jpg"
            alt="Students training at Shotokan Karate Regina"
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

          <div className="section-shell relative z-10 flex min-h-[calc(92vh-5rem)] items-center py-20">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-md border border-red-400/40 bg-red-950/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-red-100">
                Approved by Karate Canada
              </p>
              <h1 className="text-balance text-5xl font-black uppercase leading-[0.95] text-white sm:text-6xl lg:text-7xl">
                Shotokan Karate Regina
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200 sm:text-xl">
                Traditional Shotokan Karate classes in Regina for students who want to build discipline, confidence, focus, fitness, and practical self-defense under the guidance of Coach Reza Abbasi.
              </p>
              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <ButtonLink href="#contact">Join a Class</ButtonLink>
                <ButtonLink href="#coach" variant="secondary">
                  Meet the Coach
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-stone-950 py-24">
          <div className="section-shell">
            <SectionHeading
              eyebrow="Traditional training"
              title="A disciplined, welcoming place to grow"
            >
              Shotokan Karate Regina offers structured traditional training for beginners and experienced practitioners in a positive, safe, and motivating environment.
            </SectionHeading>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["Discipline", "Students train with focus, respect, and steady effort."],
                ["Confidence", "Classes help students develop strength inside and outside the dojo."],
                ["Fitness", "Traditional karate training builds coordination, conditioning, and resilience."],
              ].map(([title, copy]) => (
                <article
                  className="rounded-lg border border-white/10 bg-white/[0.045] p-7 shadow-2xl shadow-black/30"
                  key={title}
                >
                  <div className="mb-5 h-1 w-14 rounded-full bg-red-500" />
                  <h3 className="text-xl font-black uppercase text-white">
                    {title}
                  </h3>
                  <p className="mt-3 leading-7 text-stone-300">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="classes" className="bg-black py-24">
          <div className="section-shell">
            <SectionHeading
              eyebrow="Classes"
              title="Training for kids, teens, and adults"
            >
              From first-time beginners to advanced practitioners, the program supports students as they build strong fundamentals, technical skill, and personal discipline through Shotokan Karate.
            </SectionHeading>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
              {classFeatures.map((feature) => (
                <article
                  className="rounded-lg border border-red-500/20 bg-gradient-to-b from-stone-900 to-black p-6"
                  key={feature}
                >
                  <p className="text-sm font-bold uppercase leading-6 tracking-[0.12em] text-stone-100">
                    {feature}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="coach" className="bg-stone-950 py-24">
          <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-stone-900 shadow-2xl shadow-black/40">
              <Image
                src="/images/coach.JPG"
                alt="Coach Reza Abbasi, Shotokan Karate instructor"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-red-300">
                Coach
              </p>
              <h2 className="text-balance text-4xl font-black uppercase text-white sm:text-5xl">
                Coach Reza Abbasi
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-300">
                Coach Reza Abbasi is a 5th Dan Shotokan Karate instructor, official Karate Federation referee, and certified Level 1 Karate coach with more than 15 years of experience teaching martial artists in Regina.
              </p>
              <p className="mt-4 text-lg leading-8 text-stone-300">
                His teaching focuses on traditional Shotokan values, practical self-defense, and the personal growth that comes from steady training in discipline, confidence, respect, focus, and fitness.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {coachHighlights.map((highlight) => (
                  <div
                    className="rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-stone-100"
                    key={highlight}
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-24">
          <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <SectionHeading
                eyebrow="Training environment"
                title="Focused practice, strong community"
              >
                Students train in a setting built around technical progress, motivation, practical self-defense, and the values of traditional Shotokan Karate.
              </SectionHeading>
            </div>
            <div className="grid gap-5 sm:grid-cols-1">
              <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/images/class.jpg"
                  alt="Shotokan Karate students practicing in a traditional training session"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-stone-950 py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Register" title="Join a class in Regina">
              Contact the Shotokan Karate Regina team to learn about classes, registration, and training opportunities in Regina.
            </SectionHeading>

            <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {contactItems.map((item) => (
                <article
                  className="rounded-lg border border-white/10 bg-black/55 p-5"
                  key={item.label}
                >
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">
                    {item.label}
                  </p>
                  <p className="mt-3 text-base font-semibold leading-7 text-white">
                    {item.value}
                  </p>
                </article>
              ))}
            </div>

            <div className="mx-auto mt-12 max-w-6xl">
              <div className="mb-6 flex flex-col gap-2 text-center">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">
                  Scan to connect
                </p>
                <h3 className="text-2xl font-black uppercase text-white">
                  Registration, payment, social, and reviews
                </h3>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {qrCodes.map((code) => (
                  <article
                    className="rounded-lg border border-white/10 bg-black/55 p-5 text-center shadow-2xl shadow-black/25"
                    key={code.label}
                  >
                    <div className="mx-auto flex aspect-square max-w-48 items-center justify-center overflow-hidden rounded-md bg-white p-3">
                      <Image
                        src={code.src}
                        alt={code.alt}
                        width={220}
                        height={220}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <h4 className="mt-5 text-lg font-black uppercase tracking-[0.12em] text-white">
                      {code.label}
                    </h4>
                    <p className="mt-2 text-sm font-semibold leading-6 text-stone-400">
                      {code.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
            {/* Add email, website, or extra social links here if they become available. */}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
