import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { publicPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata = publicPageMetadata({
  title: "Karate Classes in Regina: Schedule & Fees",
  description: "Find Shotokan karate classes for kids, teens and adults in Regina. Wednesday and Sunday, 5–6 PM, at 1751 Broad Street. $80/month; family rate $70/person.",
  path: "/classes",
});

const programs = [
  { id: "kids", title: "Kids karate", text: "Children develop coordination, focus, confidence and Shotokan fundamentals through structured instruction. Contact the academy to discuss the appropriate starting option for your child." },
  { id: "teens", title: "Teen karate", text: "Teen students work on technique, Kata, Kumite, fitness and discipline. Training provides a pathway from learning the basics to developing more advanced skills." },
  { id: "adults", title: "Adult karate", text: "Adults can begin their martial arts journey or continue their Shotokan training. Classes focus on technique, fitness, practical ability and personal development." },
  { id: "competition", title: "Competition training", text: "Athletes can discuss competition-focused Kata and Kumite coaching with Reza Abbasi. Ask the coach about a training pathway appropriate to your experience and goals." },
];

const questions = [
  ["Where are the karate classes in Regina?", "Classes take place at 1751 Broad Street, Regina, Saskatchewan. Contact the academy before your first visit to confirm attendance and any arrival details."],
  ["When are classes held?", "The regular class schedule is Wednesdays and Sundays from 5:00 PM to 6:00 PM. Check the Updates page or contact the academy for any schedule changes."],
  ["How much do classes cost?", "Monthly tuition is $80. The family discount is $70 per person, per month. Ask registration and coordination about your family's enrollment."],
  ["Do I need previous karate experience?", "No. The academy welcomes beginners and experienced students. Speak with the coach about your current experience and training goals."],
  ["Are there karate programs for children and adults?", "The academy offers programs for kids, teens and adults. Please contact the academy to confirm the best starting option and enrollment requirements for the participant."],
  ["How do I register or ask a question?", "Use the student registration form or call Moha Ebrahimi for registration and coordination at 306-519-5711. For training questions, contact Coach Reza Abbasi at 306-570-3125."],
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/classes#webpage`,
      url: `${SITE_URL}/classes`,
      name: "Karate Classes in Regina: Schedule & Fees",
      description: metadata.description,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/classes#training` },
      inLanguage: "en-CA",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/classes#training`,
      name: "Shotokan karate classes in Regina",
      serviceType: "Shotokan karate instruction",
      url: `${SITE_URL}/classes`,
      provider: { "@id": `${SITE_URL}/#academy` },
      areaServed: { "@type": "City", name: "Regina" },
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Wednesday", "Sunday"],
        opens: "17:00",
        closes: "18:00",
      },
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/classes#schedule`,
        price: "80",
        priceCurrency: "CAD",
        description: "Monthly tuition $80. Family discount $70 per person, per month.",
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Karate Classes", item: `${SITE_URL}/classes` },
      ],
    },
  ],
};

export default function ClassesPage() {
  return <><Navbar /><main className="poster-theme bg-stone-950 pt-20">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className="border-b border-white/10 bg-gradient-to-br from-black via-stone-950 to-red-950/30 py-12 sm:py-20">
      <div className="section-shell">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-stone-400"><ol className="flex flex-wrap gap-2"><li><Link href="/" className="hover:text-red-300">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-white">Karate Classes</li></ol></nav>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[.24em] text-red-300">Kids · Teens · Adults · All skill levels</p>
            <h1 className="hero-title mt-4 text-balance text-4xl font-bold text-white sm:text-6xl">Karate Classes in Regina</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">Learn Shotokan karate with Coach Reza Abbasi at 1751 Broad Street. Explore beginner and experienced-student training, Kata, Kumite and a competition-focused athlete pathway.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink href="#schedule">View Schedule &amp; Fees</ButtonLink><ButtonLink href="tel:+13065195711" variant="secondary">Call Registration</ButtonLink></div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10"><Image src="/images/class.jpg" alt="Students training at Shotokan Karate Regina" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" /></div>
        </div>
      </div>
    </header>

    <section id="schedule" className="scroll-mt-24 py-14 sm:py-20"><div className="section-shell">
      <h2 className="hero-title text-3xl font-bold text-white sm:text-4xl">Class schedule, location &amp; tuition</h2>
      <p className="mt-4 max-w-3xl leading-7 text-stone-300">Plan your visit using the academy&apos;s current program information. Please confirm your first class with registration and coordination.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-5 sm:p-8">
          <table className="w-full text-left text-sm sm:text-base"><caption className="mb-5 text-left text-xl font-bold text-white">Weekly karate classes</caption><thead><tr className="border-b border-white/15 text-stone-400"><th scope="col" className="py-3 pr-4">Day</th><th scope="col" className="py-3">Time</th></tr></thead><tbody className="text-white"><tr className="border-b border-white/10"><th scope="row" className="py-4 pr-4 font-semibold">Wednesday</th><td className="py-4">5:00–6:00 PM</td></tr><tr><th scope="row" className="py-4 pr-4 font-semibold">Sunday</th><td className="py-4">5:00–6:00 PM</td></tr></tbody></table>
          <address className="mt-5 border-t border-white/10 pt-5 not-italic text-stone-300">1751 Broad Street<br />Regina, Saskatchewan<br /><a className="mt-3 inline-flex min-h-11 items-center font-bold text-red-300 hover:underline" href="https://maps.google.com/?q=1751+Broad+Street,+Regina,+SK" target="_blank" rel="noreferrer">Open location in Google Maps</a></address>
        </div>
        <div className="rounded-2xl border border-red-400/25 bg-red-950/15 p-5 sm:p-8"><h3 className="text-xl font-bold text-white">Monthly tuition</h3><dl className="mt-6 space-y-6"><div><dt className="text-stone-400">Standard tuition</dt><dd className="mt-1 text-3xl font-black text-white">$80 <span className="text-base font-normal text-stone-300">CAD / month</span></dd></div><div><dt className="text-stone-400">Family discount</dt><dd className="mt-1 text-3xl font-black text-white">$70 <span className="text-base font-normal text-stone-300">CAD / person / month</span></dd></div></dl><p className="mt-6 leading-7 text-stone-300">Moha Ebrahimi handles registration and coordination. Call <a href="tel:+13065195711" className="font-bold text-red-300 hover:underline">306-519-5711</a> to discuss enrollment.</p><Link href="/updates" className="mt-4 inline-flex min-h-11 items-center font-bold text-red-300 hover:underline">Check academy updates →</Link></div>
      </div>
    </div></section>

    <section className="border-y border-white/10 bg-black/40 py-14 sm:py-20"><div className="section-shell"><h2 className="hero-title text-3xl font-bold text-white sm:text-4xl">Find your Shotokan training pathway</h2><div className="mt-8 grid gap-5 md:grid-cols-2">{programs.map((program) => <article id={program.id} key={program.id} className="scroll-mt-28 rounded-2xl border border-white/10 bg-stone-950 p-6"><h3 className="text-2xl font-bold text-white">{program.title}</h3><p className="mt-4 leading-7 text-stone-300">{program.text}</p></article>)}</div><p className="mt-8 max-w-4xl leading-7 text-stone-300">Shotokan instruction develops fundamentals alongside Kata and Kumite. Students can review the <Link href="/belt-grading" className="font-semibold text-red-300 underline underline-offset-4">official belt grading requirements</Link>, while the <Link href="/karate-knowledge-center" className="font-semibold text-red-300 underline underline-offset-4">Karate Knowledge Center</Link> provides the academy&apos;s educational resources. <Link href="/self-defense" className="font-semibold text-red-300 underline underline-offset-4">Practical self-defense</Link> is also available as an additional program.</p></div></section>

    <section className="py-14 sm:py-20"><div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Head instructor</p><h2 className="hero-title mt-3 text-3xl font-bold text-white">Train with Reza Abbasi</h2><ul className="mt-5 space-y-3 leading-7 text-stone-300"><li>World Champion (2015)</li><li>Provincial Kumite Coach — Saskatchewan</li><li>Official Karate Canada Referee</li></ul><Link href="/coach-certifications" className="mt-5 inline-flex min-h-11 items-center font-semibold text-red-300 hover:underline">View coaching certifications →</Link><p className="mt-3 leading-7 text-stone-300">Discuss training goals with Coach Reza at <a href="tel:+13065703125" className="font-semibold text-red-300 hover:underline">306-570-3125</a>.</p></div><div><h2 className="hero-title text-3xl font-bold text-white">Before your first class</h2><ol className="mt-5 space-y-4 leading-7 text-stone-300"><li><span className="mr-2 font-black text-red-300">1.</span>Contact registration to discuss the participant&apos;s age, experience and preferred starting date.</li><li><span className="mr-2 font-black text-red-300">2.</span>Confirm the class and review the student registration and consent information.</li><li><span className="mr-2 font-black text-red-300">3.</span>Ask the academy about clothing, uniform and equipment requirements for your first visit.</li></ol><div className="mt-7 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/register">Open Registration Form</ButtonLink><ButtonLink href="mailto:shotokan.karate.regina@gmail.com" variant="secondary">Email the Academy</ButtonLink></div></div></div></section>

    <section className="border-t border-white/10 bg-black/40 py-14 sm:py-20"><div className="section-shell"><h2 className="hero-title mb-8 text-center text-3xl font-bold text-white sm:text-4xl">Karate class questions</h2><div className="mx-auto max-w-4xl space-y-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-xl border border-white/10 bg-stone-950"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold text-white focus-visible:outline-2 focus-visible:outline-red-400">{question}<span aria-hidden="true" className="text-xl text-red-300 group-open:rotate-45">+</span></summary><p className="border-t border-white/10 p-5 leading-7 text-stone-300">{answer}</p></details>)}</div></div></section>
  </main><Footer /></>;
}
