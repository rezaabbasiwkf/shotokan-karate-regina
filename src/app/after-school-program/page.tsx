import type { Metadata } from "next";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "After School Program",
  description: "After School Program at Shotokan Karate Regina. Program details are coming soon.",
  alternates: { canonical: "/after-school-program" },
};

const highlights = [
  "Professional Karate Training",
  "Homework Support",
  "Physical Activity",
  "Confidence & Leadership",
  "Safe Supervision",
  "Healthy Environment",
];

function PlaceholderLines({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          className={`h-3 rounded-full bg-white/[0.07] ${index === count - 1 ? "w-2/3" : "w-full"}`}
          key={index}
        />
      ))}
    </div>
  );
}

export default function AfterSchoolProgramPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="relative overflow-hidden bg-stone-950 py-16 sm:py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(215,25,32,0.18),transparent_32rem)]" />
          <div className="section-shell relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">New program</p>
              <h1 className="hero-title mt-4 text-5xl font-bold leading-tight text-white sm:text-7xl">After School Program</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-stone-300">Program subtitle and enrollment details will be added soon.</p>
            </div>
            <div
              className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-dashed border-red-400/35 bg-gradient-to-br from-white/[0.07] to-black/20 shadow-2xl shadow-black/40"
              role="img"
              aria-label="After School Program hero image placeholder"
            >
              <div className="text-center text-stone-500">
                <svg className="mx-auto h-12 w-12" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <rect x="5" y="7" width="38" height="34" rx="4" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17" cy="19" r="4" stroke="currentColor" strokeWidth="2" />
                  <path d="m9 36 10-10 7 7 5-5 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em]">Hero image placeholder</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-black py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Program overview" title="Overview">Program information will be added here.</SectionHeading>
            <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-stone-950 p-7 sm:p-10">
              <PlaceholderLines count={4} />
            </div>
          </div>
        </section>

        <section className="bg-stone-950 py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Program highlights" title="What the Program Will Offer" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map((highlight) => (
                <article className="min-h-52 rounded-2xl border border-white/10 bg-black/30 p-6 shadow-xl shadow-black/15" key={highlight}>
                  <div className="h-1 w-12 rounded-full bg-red-500" />
                  <h2 className="mt-6 text-xl font-black text-white">{highlight}</h2>
                  <div className="mt-6"><PlaceholderLines count={2} /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Daily schedule" title="Daily Timetable">The complete daily schedule will be added here.</SectionHeading>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-stone-950">
              <div className="grid grid-cols-3 gap-4 border-b border-white/10 bg-white/[0.04] p-5">
                {['Time', 'Activity', 'Details'].map((heading) => <div className="text-xs font-black uppercase tracking-[0.16em] text-red-300" key={heading}>{heading}</div>)}
              </div>
              <div className="space-y-5 p-6 sm:p-8"><PlaceholderLines count={4} /></div>
            </div>
          </div>
        </section>

        <section className="bg-stone-950 py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Registration information" title="Registration Details">Enrollment information and requirements will be added here.</SectionHeading>
            <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
              {["Enrollment details", "Program requirements"].map((item) => (
                <article className="rounded-2xl border border-white/10 bg-black/30 p-7" key={item}>
                  <h2 className="text-lg font-black text-white">{item}</h2>
                  <div className="mt-6"><PlaceholderLines count={3} /></div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-black py-20 sm:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
            <div className="mx-auto max-w-4xl space-y-4">
              {[1, 2, 3].map((item) => (
                <div className="flex min-h-16 items-center justify-between rounded-xl border border-white/10 bg-stone-950 px-6" aria-hidden="true" key={item}>
                  <div className="h-3 w-2/3 rounded-full bg-white/[0.07]" />
                  <span className="text-2xl text-red-300">+</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-red-950/25 py-20 text-center sm:py-24">
          <div className="section-shell">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Contact</p>
            <h2 className="hero-title mx-auto mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">Questions About the Program?</h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-stone-300">More information will be available soon.</p>
            <div className="mt-8"><ButtonLink href="mailto:info@shotokan-karate-regina.com">Contact Us</ButtonLink></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
