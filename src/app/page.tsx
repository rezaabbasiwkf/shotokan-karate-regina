import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { Gallery } from "@/components/Gallery";
import { FaqAccordion } from "@/components/FaqAccordion";
import { ContactForm } from "@/components/ContactForm";

const programs = [
  { title: "Kids Karate", audience: "Ages 5+", icon: "◉", description: "Build focus, coordination, confidence, and respectful Shotokan fundamentals." },
  { title: "Teen Karate", audience: "Teens", icon: "◆", description: "Develop technique, fitness, discipline, and a strong, confident mindset." },
  { title: "Adult Karate", audience: "Adults", icon: "◈", description: "Train for fitness, traditional technique, practical self-defense, and personal growth." },
  { title: "Competitive Athlete Development", audience: "Competitive pathway", icon: "★", description: "Advanced coaching for athletes pursuing tournament readiness and higher-level competition." },
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

const coreValues = [
  {
    icon: "🥋",
    title: "Traditional Shotokan Karate",
    description: "Train according to authentic Shotokan Karate principles, emphasizing correct technique, discipline, respect, and continuous improvement.",
  },
  {
    icon: "🛡",
    title: "Practical Self-Defense",
    description: "Develop practical self-defense skills, situational awareness, and confidence to respond effectively in real-life situations.",
  },
  {
    icon: "🌟",
    title: "Character Development",
    description: "Build confidence, discipline, focus, leadership, respect, perseverance, and a strong mindset that extends beyond the dojo.",
  },
  {
    icon: "💪",
    title: "Health & Fitness",
    description: "Improve strength, flexibility, coordination, endurance, balance, and overall physical and mental well-being through structured karate training.",
  },
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
            className="object-cover object-center scale-[1.08] sm:scale-[1.1] lg:scale-[1.12]"
            sizes="100vw"
          />
          <div className="absolute inset-x-0 top-20 h-48 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

          <div className="section-shell relative z-10 min-h-[calc(52rem-5rem)] sm:min-h-[calc(48rem-5rem)] lg:min-h-[calc(52rem-5rem)]">
            <div className="absolute inset-x-5 top-14 text-center sm:top-16">
              <p className="mb-4 inline-flex rounded-md border border-red-400/40 bg-red-950/50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-red-100 backdrop-blur-sm">
                Approved by Karate Canada
              </p>
              <h1 className="hero-title mx-auto whitespace-nowrap text-[clamp(1.25rem,5.5vw,6.25rem)] font-bold leading-none text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
                SHOTOKAN Karate Regina
              </h1>
            </div>

            <div className="absolute inset-x-5 bottom-6 mx-auto max-w-5xl rounded-2xl border border-white/10 bg-black/35 p-5 text-center shadow-2xl shadow-black/30 backdrop-blur-[2px] sm:p-7 lg:bottom-3">
              <p className="mx-auto max-w-5xl text-lg leading-8 text-stone-200 sm:text-xl">
                Professional Shotokan Karate classes in Regina for students who want to build discipline, confidence, focus, fitness, and practical self-defense under the guidance of Coach Reza Abbasi.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                <ButtonLink href="/register">Start Your Karate Journey</ButtonLink>
                <ButtonLink href="#programs" variant="secondary">
                  View Programs
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="bg-stone-950 py-24">
          <div className="section-shell">
            <SectionHeading
              eyebrow="The Shotokan standard"
              title="Why train with Shotokan Karate Regina?"
            >
              At SHOTOKAN Karate Regina, we believe karate is more than learning techniques—it is a lifelong journey of discipline, confidence, respect, and personal growth. Under the leadership of Coach Reza Abbasi, students of all ages train in a professional, welcoming, and supportive environment.
            </SectionHeading>

            <div className="grid gap-5 md:grid-cols-2">
              {coreValues.map((value) => (
                <article
                  className="group rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-7 shadow-2xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-red-400/40 hover:shadow-red-950/20 sm:p-8"
                  key={value.title}
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/25 bg-red-950/35 text-2xl shadow-lg shadow-black/20" aria-hidden="true">
                      {value.icon}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-red-500/55 to-transparent" />
                  </div>
                  <h3 className="mt-6 text-xl font-black uppercase text-white sm:text-2xl">
                    {value.title}
                  </h3>
                  <p className="mt-3 max-w-xl leading-7 text-stone-300">{value.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-16 border-y border-white/10 py-12 sm:py-14">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Leadership & experience</p>
                  <h3 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">Coach Reza Abbasi</h3>
                </div>
                <p className="max-w-xl leading-7 text-stone-300">Experienced instruction, recognized credentials, and a lifelong commitment to the standards of Shotokan Karate.</p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {coachHighlights.map((highlight, index) => (
                  <article className="rounded-xl border border-white/10 bg-black/35 p-5 transition hover:border-red-400/35 hover:bg-white/[0.045]" key={highlight}>
                    <p className="text-2xl font-black text-red-300">0{index + 1}</p>
                    <p className="mt-3 text-sm font-bold leading-6 text-stone-100">{highlight}</p>
                  </article>
                ))}
              </div>
            </div>

            <blockquote className="mx-auto mt-14 max-w-4xl border-l-2 border-red-500 px-6 py-3 text-center sm:px-10">
              <p className="hero-title text-balance text-2xl font-bold leading-relaxed text-white sm:text-3xl">
                “Training the body. Strengthening the mind. Building character for life.”
              </p>
            </blockquote>

            <div className="mt-12 flex justify-center">
              <ButtonLink href="/register">Start Your Karate Journey Today</ButtonLink>
            </div>
          </div>
        </section>

        <section id="programs" className="bg-black py-24">
          <div className="section-shell">
            <SectionHeading
              eyebrow="Programs"
              title="Training for every stage of the journey"
            >
              From first-time beginners to advanced practitioners, the program supports students as they build strong fundamentals, technical skill, and personal discipline through Shotokan Karate.
            </SectionHeading>

            <div className="grid gap-7 md:grid-cols-2 xl:gap-8">
              {programs.map(({ title, audience, icon, description }) => (
                <article
                  className="flex min-h-64 flex-col rounded-2xl border border-red-500/20 bg-gradient-to-b from-stone-900 to-black p-7 transition duration-300 hover:-translate-y-1 hover:border-red-400/45 hover:shadow-xl hover:shadow-red-950/20 sm:p-8"
                  key={title}
                >
                  <div className="flex items-start justify-between gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/30 bg-red-500/10 text-xl text-red-200" aria-hidden="true">{icon}</div><p className="pt-1 text-right text-xs font-black uppercase tracking-[0.18em] text-red-300">{audience}</p></div>
                  <h3 className="hero-title mt-7 text-3xl font-bold leading-tight text-white">{title}</h3>
                  <p className="mt-4 max-w-xl leading-7 text-stone-300">{description}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"><ButtonLink href="/register">Register Now</ButtonLink><ButtonLink href="#schedule" variant="secondary">View Class Schedule</ButtonLink></div>
          </div>
        </section>

        <section id="self-defense" className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-black to-red-950/30 py-24">
          <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(215,25,32,0.13),transparent_68%)] lg:block" />
          <div className="section-shell relative z-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl shadow-black/60 lg:mx-0">
              <Image src="/images/self-defense.JPG" alt="Coach Reza Abbasi demonstrating focused martial arts training" width={864} height={1152} className="h-auto w-full object-cover" sizes="(min-width: 1024px) 40vw, (min-width: 640px) 65vw, 92vw" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/65 to-transparent" />
              <p className="absolute bottom-6 left-6 right-6 text-xs font-black uppercase tracking-[0.18em] text-white">Awareness · readiness · confidence</p>
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Essential training</p>
              <h2 className="hero-title mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">Practical Self-Defense</h2>
              <p className="mt-4 text-lg font-bold text-red-100">Build Confidence. Stay Aware. Protect Yourself.</p>
              <p className="mt-6 max-w-2xl leading-8 text-stone-300">At SHOTOKAN Karate Regina, self-defense is taught through practical, realistic, professionally structured training designed for everyday situations. Students build awareness, sound decision-making, and safe defensive skills in a respectful environment led by Coach Reza Abbasi.</p>
              <div id="self-defense-benefits" className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Real-World Self-Defense Skills", "Situational Awareness", "Confidence Under Pressure", "Safe & Controlled Training", "Practical Defensive Techniques", "Increased Fitness", "Mental Resilience", "Professional Instruction"].map((benefit) => <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.045] p-4 text-sm font-bold text-stone-100" key={benefit}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-red-400/35 bg-red-500/10 text-xs text-red-200" aria-hidden="true">◆</span>{benefit}</div>)}
              </div>
              <p className="mt-7 text-sm leading-7 text-stone-400">Suitable for children, teenagers, adults, beginners, and experienced martial artists.</p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row"><ButtonLink href="/register">Register Today</ButtonLink><ButtonLink href="#self-defense-benefits" variant="secondary">Learn More</ButtonLink></div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-stone-950 via-black to-red-950/35 py-24">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(215,25,32,0.18),transparent_65%)] lg:block" />
          <div className="section-shell relative z-10 grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Competitive pathway</p>
              <h2 className="hero-title mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">High Performance Athlete Development</h2>
              <p className="mt-4 text-lg font-bold text-red-100">Preparing Athletes for Provincial, National, and International Competition</p>
              <p className="mt-6 max-w-2xl leading-8 text-stone-300">At SHOTOKAN Karate Regina, dedicated students can progress through a structured high-performance pathway designed to prepare them for competitive karate.</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Olympic-style Shotokan Karate", "Advanced Kata and Kumite development", "Competition strategy and tactical training", "Physical conditioning and athletic performance", "Mental preparation and competition mindset", "Performance analysis and continuous improvement", "Referee rules and competition standards", "Individual coaching for competitive athletes"].map((item) => <div className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm font-bold leading-6 text-stone-100" key={item}><span className="text-red-300" aria-hidden="true">◆</span>{item}</div>)}
              </div>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-stone-400">For athletes who demonstrate technical ability, discipline, and competitive readiness, coaching can prepare them for local tournaments, provincial and national championships, and international competition. Higher-level opportunities depend on performance, eligibility, and governing-body selection criteria.</p>
            </div>
            <div className="space-y-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/50"><Image src="/images/class.jpg" alt="Shotokan Karate Regina training session" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" /><p className="absolute bottom-5 left-5 text-xs font-black uppercase tracking-[0.18em] text-white">Focused training. Measurable progress.</p></div>
              <article className="rounded-2xl border border-red-400/30 bg-black/55 p-7 shadow-xl shadow-red-950/20"><p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">Athlete pathway</p><h3 className="hero-title mt-3 text-3xl font-bold text-white">From Beginner to High Performance Athlete</h3><p className="mt-4 leading-7 text-stone-300">Whether your goal is personal development, competition success, or pursuing opportunities at the provincial, national, or international level, SHOTOKAN Karate Regina provides professional coaching to help you reach your highest potential.</p><div className="mt-6"><ButtonLink href="/register">Start Your Training Path</ButtonLink></div></article>
            </div>
          </div>
        </section>

        <section id="schedule" className="bg-stone-950 py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Schedule" title="A clear weekly training schedule">Current class times and program information for Shotokan Karate Regina.</SectionHeading>
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/45">
              <table className="min-w-[720px] w-full text-left text-sm">
                <thead className="bg-white/[0.06] text-xs font-black uppercase tracking-[0.14em] text-red-200"><tr><th className="px-5 py-4">Program</th><th className="px-5 py-4">Age / Level</th><th className="px-5 py-4">Day</th><th className="px-5 py-4">Time</th><th className="px-5 py-4">Location</th></tr></thead>
                <tbody className="divide-y divide-white/10 text-stone-200"><tr><td className="px-5 py-5 font-bold text-white">Shotokan Karate</td><td className="px-5 py-5">Kids, teens & adults · all levels</td><td className="px-5 py-5">Wednesday</td><td className="px-5 py-5">4:00 PM – 5:00 PM</td><td className="px-5 py-5">1751 Broad Street, Regina, SK</td></tr></tbody>
              </table>
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

        <section id="gallery" className="bg-black py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Gallery" title="Life at the dojo">A glimpse of the Shotokan Karate Regina training community. Select a photograph to view it in full.</SectionHeading>
            <Gallery />
          </div>
        </section>

        <section id="reviews" className="bg-stone-950 py-24">
          <div className="section-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div><SectionHeading eyebrow="Reviews" title="Your experience matters">We welcome genuine feedback from students and families. Scan the Google Review code to share your experience with the Shotokan Karate Regina community.</SectionHeading></div>
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-black/45 p-6 text-center"><div className="mx-auto aspect-square max-w-56 rounded-xl bg-white p-3"><Image src="/images/googleReview.PNG" alt="Google Review QR code for Shotokan Karate Regina" width={360} height={360} className="h-full w-full object-contain" /></div><p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-white">Leave a Google Review</p><p className="mt-2 text-sm leading-6 text-stone-400">Thank you for sharing genuine feedback.</p></div>
          </div>
        </section>

        <section id="faq" className="bg-black py-24"><div className="section-shell"><SectionHeading eyebrow="FAQ" title="Questions before your first class?">Find practical answers about training, tuition, registration, and your first visit.</SectionHeading><FaqAccordion /></div></section>

        <section id="contact" className="bg-stone-950 py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Contact" title="Talk to the Shotokan Karate Regina team">
              Ask about classes, registration, or your first visit. Every contact option below works directly on mobile devices.
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

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/45 p-6 sm:p-8"><h3 className="text-2xl font-black uppercase text-white">Visit or contact us</h3><div className="mt-6 space-y-4 text-stone-300"><a className="block transition hover:text-red-300" href="https://maps.google.com/?q=1751+Broad+Street,+Regina,+SK" target="_blank" rel="noreferrer">1751 Broad Street, Regina, SK · Open in Google Maps</a><a className="block transition hover:text-red-300" href="tel:+13065703125">Coach Reza Abbasi · 306-570-3125</a><a className="block transition hover:text-red-300" href="mailto:info@shotokan-karate-regina.com">info@shotokan-karate-regina.com</a><a className="block transition hover:text-red-300" href="https://www.instagram.com/shotokan_karate_yqr" target="_blank" rel="noreferrer">Instagram · @shotokan_karate_yqr</a><p>Business hours: Wednesday, 4:00 PM – 5:00 PM</p></div></div>
              <ContactForm />
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
              <div className="mt-8"><ButtonLink href="/register">Train with Coach Reza</ButtonLink></div>
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
