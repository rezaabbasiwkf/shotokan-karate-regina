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
  { label: "Class Time", value: "Every Wednesday, 4:00 PM - 5:00 PM" },
  { label: "Location", value: "1751 Broad Street, Regina, SK" },
  { label: "Monthly Fee", value: "$60 / month" },
  { label: "Family Discount", value: "$50 / person / month" },
  { label: "Trial Class", value: "First week free" },
  { label: "Coach Reza Abbasi", value: "306-570-3125" },
  { label: "Moha Ebrahimi", value: "Registration & Coordination, 306-519-5711" },
  { label: "Instagram", value: "@shotokan_karate_yqr" },
];

const socialQrCodes = [
  {
    label: "WhatsApp",
    description: "Ask about classes or registration",
    src: "/images/Whatsapp.PNG",
    alt: "WhatsApp QR code for Shotokan Karate Regina",
  },
  {
    label: "Instagram",
    description: "Follow training updates",
    src: "/images/Instagram.JPG",
    alt: "Instagram QR code for Shotokan Karate Regina",
  },
  {
    label: "Google Review",
    description: "Share your experience",
    src: "/images/googleReview.PNG",
    alt: "Google Review QR code for Shotokan Karate Regina",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home">
        <section className="relative min-h-[52rem] overflow-hidden pt-20 sm:min-h-[48rem] lg:min-h-[52rem]">
          <Image
            src="/images/hero-group-straight.jpg"
            alt="Shotokan Karate Regina students and instructors"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-x-0 top-20 h-48 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <div className="section-shell relative z-10 min-h-[calc(52rem-5rem)] sm:min-h-[calc(48rem-5rem)] lg:min-h-[calc(52rem-5rem)]">
            <div className="absolute inset-x-5 top-9 text-center sm:top-12">
              <p className="mb-4 inline-flex rounded-md border border-red-400/40 bg-red-950/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-red-100 backdrop-blur-sm">
                Approved by Karate Canada
              </p>
              <h1 className="hero-title mx-auto whitespace-nowrap text-[clamp(1.35rem,4.7vw,5.25rem)] font-bold leading-none text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                SHOTOKAN Karate Regina
              </h1>
            </div>

            <div className="absolute inset-x-5 bottom-6 mx-auto max-w-3xl rounded-2xl border border-white/10 bg-black/35 p-5 text-center shadow-2xl shadow-black/30 backdrop-blur-[2px] sm:bottom-10 sm:p-7">
              <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200 sm:text-xl">
                Professional Shotokan Karate classes in Regina for students who want to build discipline, confidence, focus, fitness, and practical self-defense under the guidance of Coach Reza Abbasi.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                <ButtonLink href="/register">Join a Class</ButtonLink>
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
              eyebrow="Professional training"
              title="A disciplined, welcoming place to grow"
            >
              Shotokan Karate Regina offers structured professional training for beginners and experienced practitioners in a positive, safe, and motivating environment.
            </SectionHeading>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["Discipline", "Students train with focus, respect, and steady effort."],
                ["Confidence", "Classes help students develop strength inside and outside the dojo."],
                ["Fitness", "Professional karate training builds coordination, conditioning, and resilience."],
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
                His teaching focuses on professional Shotokan values, practical self-defense, and the personal growth that comes from steady training in discipline, confidence, respect, focus, and fitness.
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
                Students train in a setting built around technical progress, motivation, practical self-defense, and the values of professional Shotokan Karate.
              </SectionHeading>
            </div>
            <div className="grid gap-5 sm:grid-cols-1">
              <div className="relative min-h-[28rem] overflow-hidden rounded-lg border border-white/10">
                <Image
                  src="/images/class.jpg"
                  alt="Shotokan Karate students practicing in a professional training session"
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

            <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            <div className="mx-auto mt-14 max-w-4xl border-t border-white/10 pt-12">
              <h3 className="text-center text-2xl font-black uppercase text-white sm:text-3xl">
                Stay connected
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-center leading-7 text-stone-300">
                Scan a code to message us, follow class updates, or leave a review.
              </p>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {socialQrCodes.map((code) => (
                  <article className="rounded-2xl border border-white/10 bg-black/55 p-5 text-center shadow-xl shadow-black/20" key={code.label}>
                    <div className="mx-auto flex aspect-square w-full max-w-52 items-center justify-center rounded-xl bg-white p-3">
                      <Image src={code.src} alt={code.alt} width={320} height={320} className="h-full w-full object-contain" />
                    </div>
                    <h4 className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-white">{code.label}</h4>
                    <p className="mt-2 text-sm leading-6 text-stone-400">{code.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <ButtonLink href="/register">Join now</ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
