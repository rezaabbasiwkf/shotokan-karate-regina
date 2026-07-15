import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { ContactForm } from "@/components/ContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";

const karatePrograms = [
  { title: "Kids Shotokan Karate", audience: "Ages 5+", description: "Build focus, coordination, confidence, discipline, and strong Shotokan fundamentals through safe and structured training.", illustration: "kids-shotokan.webp", illustrationAlt: "Young karate student practicing a basic Shotokan stance" },
  { title: "Teen Shotokan Karate", audience: "Teens", description: "Develop Kata, Kumite, fitness, technical skill, discipline, leadership, and a confident competitive mindset.", illustration: "teen-shotokan.webp", illustrationAlt: "Teen karate athlete practicing a controlled Kumite technique" },
  { title: "Adult Shotokan Karate", audience: "Adults", description: "Improve technique, Kata, Kumite, fitness, practical ability, confidence, and long-term personal development.", illustration: "adult-shotokan.webp", illustrationAlt: "Adult karate practitioner performing a strong Shotokan technique" },
  { title: "Competition Training", audience: "Athlete Pathway", description: "Professional competition-focused coaching for athletes preparing for provincial, national, and international events.", illustration: "competition-training.webp", illustrationAlt: "High-performance karate athlete preparing for competition on a tatami" },
];

const coreValues = [
  ["Professional Shotokan Karate", "Authentic Shotokan principles, precise technique, discipline, respect, and continuous improvement.", "professional-shotokan.png"],
  ["Olympic-Style Karate", "Modern sport-karate development grounded in strong fundamentals and professional coaching.", "olympic-style-karate.png"],
  ["Kata", "Develop technical precision, balance, power, rhythm, focus, and confident performance.", "kata.png"],
  ["Kumite", "Build timing, distance, movement, strategy, control, and competition-ready decision-making.", "kumite.png"],
];

const coachHighlights = [
  ["🥋", "5th Dan Shotokan Karate Instructor"],
  ["🏅", "Official Kumite Coach – Saskatchewan Provincial Karate Team"],
  ["🎓", "Certified Level 1 Karate Coach"],
  ["⚖️", "Official Karate Federation Referee"],
  ["👨‍🏫", "15+ Years of Professional Coaching Experience"],
  ["🥇", "Gold Medalist – 2015 World Championship"],
];

const athleteHighlights = [
  ["Advanced Kata", "advanced-kata.png"], ["Advanced Kumite", "advanced-kumite.png"],
  ["Competition Strategy", "competition-strategy.png"], ["Athletic Conditioning", "athletic-conditioning.png"],
  ["Performance Analysis", "performance-analysis.png"], ["Competition Rules", "competition-rules.png"],
  ["Mental Preparation", "mental-preparation.png"], ["Individual Athlete Coaching", "individual-coaching.png"],
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
        <section className="relative min-h-[52rem] overflow-hidden pt-16 sm:min-h-[48rem] lg:min-h-[52rem]">
          <Image src="/images/hero-group-straight.jpg" alt="Shotokan Karate Regina students and instructors" fill priority quality={90} className="-translate-y-[4.5rem] scale-[1.2] object-cover object-[center_42%] sm:scale-[1.23] sm:object-[center_40%] lg:scale-[1.25] lg:object-[center_38%]" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/5 to-black/85" />
          <div className="section-shell relative z-10 min-h-[calc(52rem-4rem)] sm:min-h-[calc(48rem-4rem)] lg:min-h-[calc(52rem-4rem)]">
            <div className="absolute inset-x-5 top-14 text-center">
              <p className="mb-3 inline-flex rounded-md border border-red-400/40 bg-red-950/60 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-red-100 backdrop-blur-sm">Professional · Competition-Focused · Olympic-Style</p>
              <h1 className="hero-title mx-auto flex flex-col items-center font-bold text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                <span className="text-[clamp(1rem,2.8vw,2.6rem)] leading-none">Welcome to</span>
                <span className="mt-1 whitespace-nowrap text-[clamp(1.05rem,6.1vw,5.4rem)] leading-[0.95]">SHOTOKAN Karate Regina</span>
              </h1>
              <p className="hero-title mx-auto mt-3 max-w-5xl text-[1.25rem] font-bold leading-tight text-red-100 sm:text-[1.6rem] lg:max-w-none lg:whitespace-nowrap lg:text-[1.25rem] xl:text-[1.45rem]">Develop Confidence, Discipline, and Excellence Through Professional Shotokan Karate</p>
            </div>
            <div className="absolute inset-x-4 bottom-2 mx-auto w-fit max-w-[calc(100%-2rem)] rounded-xl border border-white/10 bg-gradient-to-br from-black/75 via-black/55 to-black/25 p-4 text-center shadow-xl shadow-black/30 backdrop-blur-[2px] sm:inset-x-6 sm:bottom-3 sm:max-w-[calc(100%-3rem)] sm:p-5">
              <p className="mx-auto max-w-xl text-xs font-normal leading-5 text-stone-100 sm:text-sm sm:leading-6 lg:max-w-none lg:text-[0.8125rem]">SHOTOKAN Karate Regina is a professional karate academy dedicated to developing confident individuals, skilled martial artists, and competitive athletes through high-quality Shotokan Karate instruction. Whether you are beginning your martial arts journey or preparing for provincial, national, and international competition, our structured programs and experienced coaching provide the foundation for long-term success.</p>
              <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row"><ButtonLink href="/register">Start Your Karate Journey</ButtonLink><ButtonLink href="#programs" variant="secondary">Explore Karate Programs</ButtonLink></div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-stone-950 py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="The Shotokan standard" title="Why Choose SHOTOKAN Karate Regina">Our primary mission is developing skilled karate practitioners through professional, supportive instruction in authentic Shotokan Karate.</SectionHeading>
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
              {coreValues.map(([title, description, illustration]) => <article className="flex min-h-56 flex-col rounded-2xl border border-red-500/25 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/45 hover:shadow-2xl hover:shadow-red-950/20" key={title}><div className="relative mx-auto h-20 w-20 shrink-0 overflow-hidden rounded-xl"><Image src={`/images/feature-cards/${illustration}`} alt="" fill className="object-cover" sizes="80px" /></div><h3 className="hero-title mt-4 text-2xl font-bold leading-tight text-white lg:text-[1.65rem]">{title}</h3><p className="mt-3 max-w-xl text-[0.9375rem] leading-6 text-stone-300">{description}</p></article>)}
            </div>
            <blockquote className="mx-auto mt-14 max-w-4xl border-l-2 border-red-500 px-6 py-3 text-center"><p className="hero-title text-balance text-2xl font-bold leading-relaxed text-white sm:text-3xl">“Training the body. Strengthening the mind. Building character for life.”</p></blockquote>
          </div>
        </section>

        <section id="programs" className="bg-black py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Professional karate programs" title="Shotokan Training for Every Stage">Build precise technique, discipline, athletic ability, and confidence through a structured Shotokan Karate pathway.</SectionHeading>
            <div className="grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-4">
              {karatePrograms.map((program) => <article className={`flex min-h-80 flex-col items-center rounded-2xl border bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-950/20 ${program.title === "Competition Training" ? "border-red-400/55 hover:border-red-300/75" : "border-red-500/25 hover:border-red-400/45"}`} key={program.title}><div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"><Image src={`/images/program-cards/${program.illustration}`} alt={program.illustrationAlt} fill className="object-cover" sizes="96px" /></div><div className="mt-3 h-0.5 w-12 bg-red-500" /><p className="mt-3 text-[0.6875rem] font-black uppercase tracking-[0.16em] text-red-300">{program.audience}</p><h3 className="hero-title mt-2 text-2xl font-bold leading-tight text-white lg:text-[1.65rem]">{program.title}</h3><p className="mt-3 text-[0.9375rem] leading-6 text-stone-300">{program.description}</p></article>)}
            </div>
            <article className="mx-auto mt-8 max-w-4xl rounded-xl border border-white/10 bg-stone-950 p-6 sm:flex sm:items-center sm:justify-between sm:gap-8"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-stone-400">Additional program</p><h3 className="mt-2 text-2xl font-black text-white">Practical Self-Defense</h3><p className="mt-2 max-w-2xl leading-7 text-stone-400">Practical self-defense training designed to improve awareness, confidence, and personal safety in real-world situations.</p></div><div className="mt-5 shrink-0 sm:mt-0"><ButtonLink href="/self-defense" variant="secondary">Learn More</ButtonLink></div></article>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"><ButtonLink href="/register">Register Now</ButtonLink><ButtonLink href="#events" variant="secondary">View Class Schedule</ButtonLink></div>
          </div>
        </section>

        <section id="athlete-development" className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-black to-red-950/35 py-20">
          <div className="section-shell">
            <div className="text-center lg:text-left">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Competitive Pathway</p>
              <h2 className="hero-title mt-3 font-bold leading-tight">
                <span className="block text-3xl text-white sm:text-4xl lg:whitespace-nowrap lg:text-[2.75rem]">High Performance Athlete Development</span>
                <span className="mt-2 block text-lg text-red-100 sm:text-xl lg:whitespace-nowrap lg:text-2xl">Preparing Athletes for Provincial, National &amp; International Competition</span>
              </h2>
            </div>
            <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.55fr_0.75fr]">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-red-400/30 shadow-2xl shadow-black/50 lg:order-2">
                <Image src="/images/athlete-development.jpg" alt="Shotokan Karate athlete training for high-level competition" fill className="object-cover object-center" sizes="(min-width: 1024px) 34vw, (min-width: 640px) 384px, 100vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <p className="absolute inset-x-4 bottom-4 text-center text-xs font-black uppercase tracking-[0.16em] text-white">Kata · Kumite · Competition Training</p>
              </div>
              <div className="lg:order-1">
                <p className="max-w-4xl leading-7 text-stone-300">Dedicated athletes receive professional competition-focused Shotokan Karate coaching designed to develop technical excellence, competitive performance, athletic discipline, and the skills required to succeed at provincial, national, and international levels.</p>
                <div className="mt-6 grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {athleteHighlights.map(([item, illustration]) => <article className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-red-500/25 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-3 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/45 hover:shadow-2xl hover:shadow-red-950/20" key={item}><div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl"><Image src={`/images/athlete-cards/${illustration}`} alt="" fill className="object-cover" sizes="80px" /></div><h3 className="mt-3 text-sm font-bold leading-5 text-stone-100">{item}</h3></article>)}
                </div>
                <div className="mt-6"><ButtonLink href="/register">Begin the Athlete Pathway</ButtonLink></div>
              </div>
            </div>
          </div>
        </section>

        <section id="coach" className="relative overflow-hidden bg-stone-950 py-24">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.025)_50%,transparent_100%),radial-gradient(circle_at_15%_35%,rgba(215,25,32,0.16),transparent_28rem)]" />
          <div className="section-shell relative">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
              <div className="relative mx-auto aspect-[37/27] w-full max-w-xl overflow-hidden rounded-2xl border border-red-400/30 bg-black shadow-2xl shadow-black/50 ring-1 ring-white/5">
                <Image src="/images/coach-reza-portrait.jpg" alt="Coach Reza Abbasi performing a karate kick in a traditional dojo" fill className="object-cover object-center" sizes="(min-width: 1024px) 44vw, (min-width: 640px) 576px, calc(100vw - 2rem)" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Professional Instruction</p>
                <h2 className="hero-title mt-3 text-4xl font-bold text-white sm:text-6xl">Coach Reza Abbasi</h2>
                <div className="mt-5 space-y-4 text-base leading-7 text-stone-300 sm:text-lg sm:leading-8">
                  <p><strong className="text-white">Coach Reza Abbasi</strong> is a <strong className="text-white">5th Dan Shotokan Karate Instructor</strong>, <strong className="text-white">Certified Level 1 Karate Coach</strong>, <strong className="text-white">Official Karate Federation Referee</strong>, and an <strong className="text-white">Official Kumite Coach of the Saskatchewan Provincial Karate Team</strong>. With more than <strong className="text-white">15 years of coaching experience</strong>, he has dedicated his career to developing athletes through professional Shotokan Karate instruction, technical excellence in Kata and Kumite, character development, and high-performance competition training.</p>
                  <p>Coach Reza Abbasi works with students of all ages and skill levels, guiding them from their first class to advanced competition while helping dedicated athletes prepare for provincial, national, and international events.</p>
                </div>
              </div>
            </div>
            <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-2 lg:grid-cols-3">
              {coachHighlights.map(([icon, highlight]) => <article className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-red-500/25 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-4 text-center shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/45 hover:shadow-2xl hover:shadow-red-950/20" key={highlight}><span className="text-3xl" aria-hidden="true">{icon}</span><h3 className="mt-3 text-base font-bold leading-6 text-white">{highlight}</h3></article>)}
            </div>
          </div>
        </section>

        <section id="events" className="bg-black py-24"><div className="section-shell"><SectionHeading eyebrow="Class schedule" title="Professional Shotokan Karate Training">Current class times for kids, teens, and adults at all levels.</SectionHeading><div className="overflow-x-auto rounded-2xl border border-white/10 bg-stone-950"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-white/[0.06] text-xs font-black uppercase tracking-[0.14em] text-red-200"><tr><th className="px-5 py-4">Program</th><th className="px-5 py-4">Age / Level</th><th className="px-5 py-4">Day</th><th className="px-5 py-4">Time</th><th className="px-5 py-4">Location</th></tr></thead><tbody className="text-stone-200"><tr><td className="px-5 py-5 font-bold text-white">Shotokan Karate</td><td className="px-5 py-5">Kids, teens & adults · all levels</td><td className="px-5 py-5">Wednesday</td><td className="px-5 py-5">4:00 PM – 5:00 PM</td><td className="px-5 py-5">1751 Broad Street, Regina, SK</td></tr></tbody></table></div></div></section>

        <section id="gallery" className="bg-stone-950 py-24"><div className="section-shell"><SectionHeading eyebrow="Karate gallery" title="Kata, Kumite & Competition Training">See professional Shotokan Karate training and our Regina dojo community in action.</SectionHeading><Gallery /></div></section>

        <section id="reviews" className="bg-black py-24"><div className="section-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"><SectionHeading eyebrow="Reviews" title="What Our Karate Community Says">We welcome genuine feedback from students and families training with Shotokan Karate Regina.</SectionHeading><div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-stone-950 p-6 text-center"><div className="mx-auto aspect-square max-w-56 rounded-xl bg-white p-3"><Image src="/images/googleReview.PNG" alt="Google Review QR code" width={360} height={360} className="h-full w-full object-contain" /></div><p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-white">Leave a Google Review</p></div></div></section>

        <section id="faq" className="bg-stone-950 py-24"><div className="section-shell"><SectionHeading eyebrow="Karate FAQ" title="Questions Before Your First Class?">Find practical answers about Shotokan training, tuition, registration, and your first visit.</SectionHeading><FaqAccordion /></div></section>

        <section id="contact" className="bg-black py-24"><div className="section-shell"><SectionHeading eyebrow="Contact" title="Talk to SHOTOKAN Karate Regina">Ask about professional karate classes, athlete development, registration, or your first visit.</SectionHeading><div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">{contactItems.map(([label, value]) => <article className="rounded-lg border border-white/10 bg-stone-950 p-5" key={label}><p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">{label}</p><p className="mt-3 font-semibold leading-7 text-white">{value}</p></article>)}</div><div className="mt-10 grid gap-5 lg:grid-cols-2"><div className="rounded-2xl border border-white/10 bg-stone-950 p-6 sm:p-8"><h3 className="text-2xl font-black uppercase text-white">Visit or contact us</h3><div className="mt-6 space-y-4 text-stone-300"><a className="block hover:text-red-300" href="https://maps.google.com/?q=1751+Broad+Street,+Regina,+SK" target="_blank" rel="noreferrer">1751 Broad Street, Regina, SK · Open in Google Maps</a><a className="block hover:text-red-300" href="tel:+13065703125">Coach Reza Abbasi · 306-570-3125</a><a className="block hover:text-red-300" href="mailto:info@shotokan-karate-regina.com">info@shotokan-karate-regina.com</a><a className="block hover:text-red-300" href="https://www.instagram.com/shotokan_karate_yqr" target="_blank" rel="noreferrer">Instagram · @shotokan_karate_yqr</a></div></div><ContactForm /></div></div></section>

        <section id="self-defense" className="bg-stone-950 py-16">
          <div className="section-shell">
            <article className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-stone-900 to-black shadow-2xl shadow-black/30">
              <header className="bg-black px-6 py-4 text-center">
                <div className="relative mx-auto h-16 w-16"><Image src="/favicon-round.png" alt="SHOTOKAN Karate Regina logo" fill className="object-contain" sizes="64px" /></div>
              </header>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <div className="grid items-center gap-6 p-6 sm:p-7 md:grid-cols-[15rem_1fr]">
                <div className="relative mx-auto aspect-[4/3] w-full max-w-60 overflow-hidden rounded-xl border border-red-400/25 shadow-xl shadow-black/40">
                  <Image src="/images/coach.JPG" alt="Coach Reza Abbasi demonstrating karate" fill className="object-cover object-center" sizes="240px" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-red-300">Specialized Training</p>
                  <h2 className="hero-title mt-2 text-3xl font-bold text-white sm:text-4xl">Practical Self-Defense</h2>
                  <p className="mt-3 text-[0.9375rem] leading-6 text-stone-300">Practical private self-defense training designed to improve awareness, confidence, decision-making, and personal safety in real-world situations.</p>
                  <p className="mt-3 text-[0.9375rem] leading-6 text-stone-300">Training is delivered in a safe and professionally structured environment under the guidance of <strong className="text-white">Coach Reza Abbasi</strong>.</p>
                  <h3 className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-white">Key Benefits</h3>
                  <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm text-stone-300 sm:grid-cols-2">
                    {["Private and personalized instruction", "Practical self-defense techniques", "Situational awareness", "Confidence under pressure", "Safe and controlled training", "Improved fitness and mental resilience"].map((benefit) => <li className="flex gap-2" key={benefit}><span className="text-red-400" aria-hidden="true">•</span><span>{benefit}</span></li>)}
                  </ul>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/self-defense">Learn More</ButtonLink><ButtonLink href="tel:+13065703125" variant="secondary">Contact Coach Reza</ButtonLink></div>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="relative overflow-hidden bg-red-950/30 py-24 text-center"><div className="section-shell"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Registration</p><h2 className="hero-title mx-auto mt-4 max-w-4xl text-4xl font-bold text-white sm:text-6xl">Begin Professional Shotokan Karate Training</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-300">Join Shotokan Karate Regina and build skill, discipline, confidence, and athletic potential through professional coaching.</p><div className="mt-8"><ButtonLink href="/register">Register Now</ButtonLink></div></div></section>
      </main>
      <Footer />
    </>
  );
}
