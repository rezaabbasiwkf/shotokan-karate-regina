import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "After School Karate Program",
  description:
    "A safe, active, and educational After School Karate Program from Shotokan Karate Regina, with professional instruction and school partnerships.",
  alternates: { canonical: "/after-school-program" },
};

const benefits = [
  { title: "Confidence & Self-Discipline", description: "Build confidence and self-discipline through structured goals, positive coaching, and steady progress.", icon: "confidence" },
  { title: "Focus & Concentration", description: "Improve focus and concentration through purposeful movement, listening skills, and technical practice.", icon: "focus" },
  { title: "Coordination & Fitness", description: "Develop coordination, balance, mobility, and physical fitness with engaging karate activities.", icon: "fitness" },
  { title: "Practical Self-Defense", description: "Learn age-appropriate personal-safety concepts and practical self-defense skills in a controlled setting.", icon: "defense" },
  { title: "Leadership & Respect", description: "Build leadership, teamwork, respect, and responsibility through shared training experiences.", icon: "leadership" },
  { title: "A Positive Experience", description: "Enjoy a safe, active, welcoming, and positive after-school environment with professional supervision.", icon: "positive" },
] as const;

const plans = [
  {
    name: "After School Karate Program",
    price: "$60 CAD",
    recommended: false,
    features: [
      "After School Karate classes",
      "Professional Shotokan Karate instruction",
      "Safe and structured learning environment",
      "Character development",
      "Confidence and discipline training",
    ],
  },
  {
    name: "After School Program + Unlimited Dojo Training",
    price: "$120 CAD",
    recommended: true,
    features: [
      "Everything in the After School Program",
      "Unlimited training at the main dojo",
      "Full access to regular Shotokan Karate classes",
      "Additional Kata and Kumite practice",
      "Increased fitness and technical development",
      "Competition preparation opportunities",
      "Faster progress through additional weekly training",
    ],
  },
] as const;

function BenefitIllustration({ type }: { type: (typeof benefits)[number]["icon"] }) {
  const shared = "fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]";

  return (
    <svg className="h-20 w-20" viewBox="0 0 96 96" aria-hidden="true">
      <circle cx="48" cy="48" r="43" className="fill-red-950/45 stroke-red-400/20" />
      {type === "confidence" ? <g className={shared} strokeWidth="3"><circle cx="48" cy="29" r="8" /><path d="M34 70V51l14-8 14 8v19M38 51l-10-9m30 9 10-9M39 60h18M45 60v12m6-12v12" /><path className="stroke-red-400" d="m34 33 6 5m22-5-6 5" /></g> : null}
      {type === "focus" ? <g className={shared} strokeWidth="3"><circle cx="57" cy="38" r="18" /><circle cx="57" cy="38" r="10" /><circle cx="57" cy="38" r="3" className="fill-red-400 stroke-red-400" /><path d="M23 72c5-13 12-20 21-21m-11-4-10 7m18 4 8 14" /><circle cx="35" cy="38" r="6" /></g> : null}
      {type === "fitness" ? <g className={shared} strokeWidth="3"><circle cx="44" cy="26" r="7" /><path d="m41 35-9 18 15 7 7 17M34 51 20 62m25-18 13 8 18-6M44 60 30 76" /><path className="stroke-red-400" d="M17 66h13m44-24 6 7" /></g> : null}
      {type === "defense" ? <g className={shared} strokeWidth="3"><path d="M48 17c9 7 18 8 25 9v20c0 17-10 27-25 34-15-7-25-17-25-34V26c7-1 16-2 25-9Z" /><path className="stroke-red-400" d="m36 48 8 8 17-19" /></g> : null}
      {type === "leadership" ? <g className={shared} strokeWidth="3"><circle cx="48" cy="29" r="7" /><circle cx="27" cy="42" r="6" /><circle cx="69" cy="42" r="6" /><path d="M35 66c1-13 5-21 13-21s12 8 13 21M17 72c1-12 4-20 10-20 5 0 8 5 10 12m42 8c-1-12-4-20-10-20-5 0-8 5-10 12" /><path className="stroke-red-400" d="m48 13 2 5 6 .5-4.5 4 1.5 5.5-5-3-5 3 1.5-5.5-4.5-4 6-.5 2-5Z" /></g> : null}
      {type === "positive" ? <g className={shared} strokeWidth="3"><path d="M20 76V41l28-17 28 17v35M34 76V55h28v21M16 76h64" /><path className="stroke-red-400" d="M48 31v12m-6-6h12" /><path d="M25 31v-9h12m34 9v-9H59" /></g> : null}
    </svg>
  );
}

export default function AfterSchoolProgramPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="overflow-hidden bg-black">
          <Image
            src="/images/after-school-program-hero.png"
            alt="Cartoon children practising Shotokan Karate together in a bright Regina dojo"
            width={1536}
            height={1024}
            priority
            quality={95}
            className="h-auto w-full"
            sizes="100vw"
          />
          <div className="border-y border-white/10 bg-gradient-to-r from-black via-stone-950 to-red-950/35 py-10 text-center shadow-2xl shadow-black/40 sm:py-14">
            <div className="section-shell">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">A future school partnership program</p>
              <h1 className="hero-title mx-auto mt-4 max-w-5xl text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">After School Karate Program</h1>
              <p className="mx-auto mt-5 max-w-3xl text-lg font-semibold leading-8 text-red-100 sm:text-2xl">Building Confidence, Discipline, and Success Beyond the Classroom</p>
            </div>
          </div>
        </section>

        <section className="bg-stone-950 py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Program introduction" title="Active Learning After School" />
            <div className="mx-auto max-w-4xl space-y-5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-black/20 p-7 text-lg leading-8 text-stone-300 shadow-xl shadow-black/20 sm:p-10">
              <p>At <strong className="text-white">SHOTOKAN Karate Regina</strong>, we are developing a professional <strong className="text-white">After School Karate Program</strong> designed to provide children with a safe, active, and educational environment after school.</p>
              <p>Our goal is to combine professional <strong className="text-white">Shotokan Karate instruction</strong> with character development, physical fitness, confidence, discipline, leadership, and respect in a structured and supportive environment.</p>
            </div>
          </div>
        </section>

        <section className="bg-black py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Student benefits" title="Strong Skills for Karate and Life">Students will have the opportunity to grow physically, mentally, and socially through structured after-school training.</SectionHeading>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <article className="group flex min-h-72 flex-col items-center rounded-2xl border border-red-500/20 bg-gradient-to-br from-stone-900 to-stone-950 p-7 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/50 hover:shadow-2xl hover:shadow-red-950/20" key={benefit.title}>
                  <div className="text-stone-100 transition duration-300 group-hover:text-red-100"><BenefitIllustration type={benefit.icon} /></div>
                  <h2 className="hero-title mt-5 text-xl font-bold text-white">{benefit.title}</h2>
                  <p className="mt-3 leading-7 text-stone-300">{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-stone-950 py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Program fees" title="Program Fees">Flexible Monthly Options for Families</SectionHeading>
            <div className="mx-auto grid max-w-5xl items-stretch gap-6 lg:grid-cols-2">
              {plans.map((plan) => (
                <article className={`relative flex flex-col rounded-2xl border p-7 shadow-2xl transition duration-300 hover:-translate-y-1 sm:p-9 ${plan.recommended ? "border-red-400/60 bg-gradient-to-br from-red-950/55 via-stone-950 to-black shadow-red-950/25" : "border-white/10 bg-black/40 shadow-black/25"}`} key={plan.name}>
                  {plan.recommended ? <p className="mb-5 w-fit rounded-full border border-red-300/30 bg-red-600 px-4 py-1.5 text-xs font-black uppercase tracking-[0.16em] text-white">★ Best Value</p> : null}
                  <h2 className="hero-title text-2xl font-bold leading-tight text-white sm:text-3xl">{plan.name}</h2>
                  <p className="mt-6 text-4xl font-black text-white sm:text-5xl">{plan.price}<span className="ml-2 text-base font-semibold text-stone-400">/ Month</span></p>
                  {plan.recommended ? <p className="mt-5 rounded-xl border border-red-400/20 bg-red-950/30 p-4 font-bold leading-7 text-red-100">This membership includes both the After School Program and unlimited dojo training.</p> : null}
                  <ul className="mt-7 flex-1 space-y-4 text-stone-200">
                    {plan.features.map((feature) => <li className="flex gap-3 leading-6" key={feature}><span className="mt-0.5 text-red-400" aria-hidden="true">✓</span><span>{feature}</span></li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-black py-20 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(215,25,32,0.16),transparent_35rem)]" />
          <div className="section-shell relative">
            <div className="mx-auto max-w-4xl rounded-3xl border border-red-400/25 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 text-center shadow-2xl shadow-black/30 sm:p-12">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Currently partnering with</p>
              <h2 className="hero-title mt-4 text-4xl font-bold text-white sm:text-5xl">St. Jerome School</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-stone-300">We are currently providing karate instruction at St. Jerome School. As our After School Karate Program continues to grow, we look forward to partnering with additional schools throughout Regina.</p>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-red-950/55 via-stone-950 to-black py-20 sm:py-28">
          <div className="absolute -right-24 top-10 h-72 w-72 rounded-full border border-red-400/10" />
          <div className="absolute -right-10 top-24 h-48 w-48 rounded-full border border-red-400/10" />
          <div className="section-shell relative text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">School partnerships</p>
            <h2 className="hero-title mx-auto mt-4 max-w-4xl text-4xl font-bold leading-tight text-white sm:text-6xl">Bring SHOTOKAN Karate Regina to Your School</h2>
            <div className="mx-auto mt-7 max-w-3xl space-y-5 text-lg leading-8 text-stone-300">
              <p>We are currently accepting new school partnerships throughout Regina.</p>
              <p>If your school, parent council, or educational organization is interested in offering a professional After School Karate Program, we would be pleased to discuss a customized program for your students.</p>
              <p>Our goal is to provide schools with a structured program that promotes confidence, discipline, respect, leadership, physical fitness, and lifelong healthy habits.</p>
            </div>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
              <ButtonLink href="/#contact">Request Program Information</ButtonLink>
              <ButtonLink href="/#contact" variant="secondary">Contact Us Today</ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
