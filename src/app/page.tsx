import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";

const karatePrograms = [
  { title: "Kids Shotokan Karate", audience: "Ages 5+", description: "Build focus, coordination, confidence, and strong Shotokan fundamentals." },
  { title: "Teen Shotokan Karate", audience: "Teens", description: "Develop Kata, Kumite, fitness, discipline, and a confident competitive mindset." },
  { title: "Adult Shotokan Karate", audience: "Adults", description: "Train in authentic technique, Kata, Kumite, fitness, and lifelong personal development." },
  { title: "Competition Training", audience: "Athlete pathway", description: "Advanced Olympic-style coaching for provincial, national, and international competition." },
];

const coreValues = [
  ["Professional Shotokan Karate", "Authentic Shotokan principles, precise technique, discipline, respect, and continuous improvement."],
  ["Olympic-Style Karate", "Modern sport-karate development grounded in strong fundamentals and professional coaching."],
  ["Kata", "Develop technical precision, balance, power, rhythm, focus, and confident performance."],
  ["Kumite", "Build timing, distance, movement, strategy, control, and competition-ready decision-making."],
];

const coachHighlights = [
  "5th Dan Shotokan Karate instructor",
  "Certified Level 1 Karate coach",
  "Official Karate Federation referee",
  "15+ years of coaching experience",
  "Gold Medalist at the 2015 World Championship",
];

const contactItems = [
  ["Class Time", "Every Wednesday, 4:00 PM - 5:00 PM"],
  ["Location", "1751 Broad Street, Regina, SK"],
  ["Monthly Fee", "$60 / month"],
  ["Family Discount", "$50 / person / month"],
  ["Trial Class", "First week free"],
  ["Coach Reza Abbasi", "306-570-3125"],
  ["Registration", "Moha Ebrahimi, 306-519-5711"],
  ["Instagram", "@shotokan_karate_yqr"],
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="home">
        <section className="relative min-h-[52rem] overflow-hidden pt-20 sm:min-h-[48rem] lg:min-h-[52rem]">
          <Image src="/images/hero-group-straight.jpg" alt="Shotokan Karate Regina students and instructors" fill priority className="scale-[1.08] object-cover object-center sm:scale-[1.1] lg:scale-[1.12]" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-black/85" />
          <div className="section-shell relative z-10 min-h-[calc(52rem-5rem)] sm:min-h-[calc(48rem-5rem)] lg:min-h-[calc(52rem-5rem)]">
            <div className="absolute inset-x-5 top-0 text-center">
              <p className="mb-3 inline-flex rounded-md border border-red-400/40 bg-red-950/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-red-100 backdrop-blur-sm">Professional · Competition-Focused · Olympic-Style</p>
              <h1 className="hero-title mx-auto text-[clamp(2.2rem,6.9vw,6.4rem)] font-bold leading-[0.95] text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">SHOTOKAN Karate Regina</h1>
              <p className="hero-title mx-auto mt-4 max-w-4xl text-xl font-bold text-red-100 sm:text-[1.85rem]">Professional Shotokan Karate Training in Regina</p>
            </div>
            <div className="absolute inset-x-4 bottom-2 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-xl border border-white/10 bg-gradient-to-br from-black/75 via-black/55 to-black/25 p-4 text-center shadow-xl shadow-black/30 backdrop-blur-[2px] sm:inset-x-6 sm:bottom-3 sm:max-w-[calc(100%-3rem)] sm:p-5">
              <p className="mx-auto max-w-xl text-xs font-normal leading-5 text-stone-100 sm:text-sm sm:leading-6 lg:max-w-none lg:whitespace-nowrap lg:text-[0.8125rem]">Professional coaching in Shotokan Karate, Kata, Kumite, and competition training for students of every level—from first class to high-performance athlete.</p>
              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink href="/register">Start Your Karate Journey</ButtonLink><ButtonLink href="#programs" variant="secondary">Explore Karate Programs</ButtonLink></div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-stone-950 py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="The Shotokan standard" title="Why Choose SHOTOKAN Karate Regina">Our primary mission is developing skilled karate practitioners through professional, supportive instruction in authentic Shotokan Karate.</SectionHeading>
            <div className="grid gap-5 md:grid-cols-2">
              {coreValues.map(([title, description]) => <article className="rounded-2xl border border-red-500/25 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-7 shadow-2xl shadow-black/25 sm:p-8" key={title}><div className="h-1 w-20 bg-red-500" /><h3 className="hero-title mt-6 text-3xl font-bold text-white sm:text-4xl">{title}</h3><p className="mt-4 max-w-xl leading-7 text-stone-300">{description}</p></article>)}
            </div>
            <blockquote className="mx-auto mt-14 max-w-4xl border-l-2 border-red-500 px-6 py-3 text-center"><p className="hero-title text-balance text-2xl font-bold leading-relaxed text-white sm:text-3xl">“Training the body. Strengthening the mind. Building character for life.”</p></blockquote>
          </div>
        </section>

        <section id="programs" className="bg-black py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Professional karate programs" title="Shotokan Training for Every Stage">Build precise technique, discipline, athletic ability, and confidence through a structured Shotokan Karate pathway.</SectionHeading>
            <div className="grid gap-7 md:grid-cols-2">
              {karatePrograms.map((program) => <article className="flex min-h-64 flex-col rounded-2xl border border-red-500/25 bg-gradient-to-b from-stone-900 to-black p-7 sm:p-8" key={program.title}><p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">{program.audience}</p><h3 className="hero-title mt-6 text-3xl font-bold leading-tight text-white sm:text-4xl">{program.title}</h3><p className="mt-4 leading-7 text-stone-300">{program.description}</p></article>)}
            </div>
            <article className="mx-auto mt-8 max-w-4xl rounded-xl border border-white/10 bg-stone-950 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Additional program</p><h3 className="mt-2 text-2xl font-black text-white">Practical Self-Defense</h3><p className="mt-2 max-w-2xl leading-7 text-stone-400">Practical self-defense training designed to improve awareness, confidence, and personal safety in real-world situations.</p></div><div className="mt-5 shrink-0 sm:mt-0"><ButtonLink href="/self-defense" variant="secondary">Learn More</ButtonLink></div></article>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"><ButtonLink href="/register">Register for Karate</ButtonLink><ButtonLink href="#schedule" variant="secondary">View Class Schedule</ButtonLink></div>
          </div>
        </section>

        <section id="athlete-development" className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-black to-red-950/35 py-24">
          <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Competitive pathway</p><h2 className="hero-title mt-4 text-4xl font-bold leading-tight text-white sm:text-6xl">High Performance Athlete Development</h2><p className="mt-5 text-xl font-bold text-red-100">Preparing athletes for Provincial Championships, National Championships, and International Competition.</p><p className="mt-6 max-w-2xl leading-8 text-stone-300">Dedicated students progress through professional Olympic-style Karate coaching focused on technical excellence, performance, and competitive readiness.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{["Advanced Kata", "Advanced Kumite", "Competition strategy", "Athletic conditioning", "Mental preparation", "Performance analysis", "Competition rules", "Individual athlete coaching"].map((item) => <div className="rounded-lg border border-white/10 bg-white/[0.05] p-4 font-bold text-stone-100" key={item}>{item}</div>)}</div></div>
            <div><div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-red-400/30 shadow-2xl shadow-black/50"><Image src="/images/class.jpg" alt="Shotokan Karate athletes developing Kata and Kumite competition skills" fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><p className="absolute bottom-6 left-6 text-sm font-black uppercase tracking-[0.18em] text-white">Kata · Kumite · Competition Training</p></div><div className="mt-6"><ButtonLink href="/register">Begin the Athlete Pathway</ButtonLink></div></div>
          </div>
        </section>

        <section id="coach" className="bg-stone-950 py-24"><div className="section-shell grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]"><div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl"><Image src="/images/coach.JPG" alt="Coach Reza Abbasi, professional Shotokan Karate instructor" fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" /></div><div><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Professional instruction</p><h2 className="hero-title mt-4 text-4xl font-bold text-white sm:text-6xl">Coach Reza Abbasi</h2><p className="mt-5 text-lg leading-8 text-stone-300">Coach Reza Abbasi is a 5th Dan Shotokan Karate instructor, official Karate Federation referee, and certified Level 1 Karate coach with more than 15 years of experience. His coaching develops strong fundamentals, Kata and Kumite excellence, character, and competition-ready athletes.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{coachHighlights.map((highlight) => <div className="rounded-md border border-white/10 bg-white/[0.045] px-4 py-3 text-sm font-bold text-stone-100" key={highlight}>{highlight}</div>)}</div></div></div></section>

        <section id="schedule" className="bg-black py-24"><div className="section-shell"><SectionHeading eyebrow="Class schedule" title="Professional Shotokan Karate Training">Current class times for kids, teens, and adults at all levels.</SectionHeading><div className="overflow-x-auto rounded-2xl border border-white/10 bg-stone-950"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[0.06] text-xs font-black uppercase tracking-[0.14em] text-red-200"><tr><th className="px-5 py-4">Program</th><th className="px-5 py-4">Age / Level</th><th className="px-5 py-4">Day</th><th className="px-5 py-4">Time</th><th className="px-5 py-4">Location</th></tr></thead><tbody className="text-stone-200"><tr><td className="px-5 py-5 font-bold text-white">Shotokan Karate</td><td className="px-5 py-5">Kids, teens & adults · all levels</td><td className="px-5 py-5">Wednesday</td><td className="px-5 py-5">4:00 PM – 5:00 PM</td><td className="px-5 py-5">1751 Broad Street, Regina, SK</td></tr></tbody></table></div></div></section>

        <section id="gallery" className="bg-stone-950 py-24"><div className="section-shell"><SectionHeading eyebrow="Karate gallery" title="Kata, Kumite & Competition Training">See professional Shotokan Karate training and our Regina dojo community in action.</SectionHeading><Gallery /></div></section>

        <section id="reviews" className="bg-black py-24"><div className="section-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"><SectionHeading eyebrow="Reviews" title="What Our Karate Community Says">We welcome genuine feedback from students and families training with Shotokan Karate Regina.</SectionHeading><div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-stone-950 p-6 text-center"><div className="mx-auto aspect-square max-w-56 rounded-xl bg-white p-3"><Image src="/images/googleReview.PNG" alt="Google Review QR code" width={360} height={360} className="h-full w-full object-contain" /></div><p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-white">Leave a Google Review</p></div></div></section>

        <section id="faq" className="bg-stone-950 py-24"><div className="section-shell"><SectionHeading eyebrow="Karate FAQ" title="Questions Before Your First Class?">Find practical answers about Shotokan training, tuition, registration, and your first visit.</SectionHeading><FaqAccordion /></div></section>

        <section id="contact" className="bg-black py-24"><div className="section-shell"><SectionHeading eyebrow="Contact" title="Talk to SHOTOKAN Karate Regina">Ask about professional karate classes, athlete development, registration, or your first visit.</SectionHeading><div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">{contactItems.map(([label, value]) => <article className="rounded-lg border border-white/10 bg-stone-950 p-5" key={label}><p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">{label}</p><p className="mt-3 font-semibold leading-7 text-white">{value}</p></article>)}</div><div className="mt-10 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-stone-950 p-6 sm:p-8"><h3 className="text-2xl font-black uppercase text-white">Visit or contact us</h3><div className="mt-6 space-y-4 text-stone-300"><a className="block hover:text-red-300" href="https://maps.google.com/?q=1751+Broad+Street,+Regina,+SK" target="_blank" rel="noreferrer">1751 Broad Street, Regina, SK · Open in Google Maps</a><a className="block hover:text-red-300" href="tel:+13065703125">Coach Reza Abbasi · 306-570-3125</a><a className="block hover:text-red-300" href="mailto:info@shotokan-karate-regina.com">info@shotokan-karate-regina.com</a><a className="block hover:text-red-300" href="https://www.instagram.com/shotokan_karate_yqr" target="_blank" rel="noreferrer">Instagram · @shotokan_karate_yqr</a></div></div><ContactForm /></div></div></section>

        <section id="self-defense" className="bg-stone-950 py-16"><div className="section-shell"><div className="mx-auto grid max-w-5xl items-center gap-8 rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8 lg:grid-cols-[0.35fr_0.65fr]"><div className="relative mx-auto aspect-[3/4] w-full max-w-56 overflow-hidden rounded-xl grayscale-[25%]"><Image src="/images/self-defense.JPG" alt="Practical self-defense training" fill className="object-cover" sizes="224px" /></div><div><p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Complementary training option</p><h2 className="mt-3 text-3xl font-black text-white">Practical Self-Defense</h2><p className="mt-4 leading-7 text-stone-300">In addition to our professional Shotokan Karate program, we also offer practical self-defense training designed to improve confidence, awareness, and personal safety.</p><div className="mt-6"><ButtonLink href="/self-defense" variant="secondary">Learn More</ButtonLink></div></div></div></div></section>

        <section className="relative overflow-hidden bg-red-950/30 py-24 text-center"><div className="section-shell"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Registration</p><h2 className="hero-title mx-auto mt-4 max-w-4xl text-4xl font-bold text-white sm:text-6xl">Begin Professional Shotokan Karate Training</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-300">Join Shotokan Karate Regina and build skill, discipline, confidence, and athletic potential through professional coaching.</p><div className="mt-8"><ButtonLink href="/register">Register Now</ButtonLink></div></div></section>
      </main>
      <Footer />
    </>
  );
}
