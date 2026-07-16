import type { Metadata } from "next";
import Image from "next/image";
import { AchievementGallery } from "@/components/AchievementGallery";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { visibleCoachAchievements } from "@/data/coach-achievements";

export const metadata: Metadata = {
  title: "Coach Reza Abbasi – Championships & Achievements",
  description:
    "Explore Coach Reza Abbasi’s championship history, official certificates, medals, and competitive milestones across youth, junior, and adult divisions.",
  alternates: { canonical: "/coach-achievements" },
  openGraph: {
    title: "Coach Reza Abbasi – Championships & Achievements",
    description:
      "A visual archive of Coach Reza Abbasi’s championship certificates and professional karate milestones.",
    url: "/coach-achievements",
    images: [
      {
        url: "/images/coach-achievements/2015-world-men-championship-gold.jpg",
        width: 1900,
        height: 1268,
        alt: "Coach Reza Abbasi’s 2015 championship certificate",
      },
    ],
  },
};

const featuredAchievements = [
  {
    title: "Gold Medalist – 2015 World Championship",
    label: "Competitive result",
    icon: "medal",
  },
  { title: "5th Dan Shotokan Karate Instructor", label: "Technical rank", icon: "rank" },
  {
    title: "Official Kumite Coach – Saskatchewan Provincial Karate Team",
    label: "Provincial coaching",
    icon: "team",
  },
  { title: "Official Karate Federation Referee", label: "Competition official", icon: "referee" },
  { title: "Certified Level 1 Karate Coach", label: "Coach certification", icon: "certificate" },
  { title: "15+ Years of Coaching Experience", label: "Professional experience", icon: "experience" },
];

const careerStages = [
  {
    stage: "Youth",
    title: "Youth Competitive Career",
    description:
      "Championship certificates, medals, tournament records, and photographs from Coach Reza Abbasi’s early competitive years will be organized here as records become available.",
  },
  {
    stage: "Junior",
    title: "Junior Competitive Career",
    description:
      "Certificates and achievements from the junior and young-athlete stages will be documented here with verified competition details.",
  },
  {
    stage: "Adult",
    title: "Adult Competitive Career",
    description:
      "Senior-level championship achievements, medals, official documents, and major competitive milestones are preserved in this stage of the archive.",
  },
] as const;

function AchievementIcon({ name }: { name: string }) {
  if (name === "medal") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="m15 5 9 14L33 5h7L29 22H19L8 5h7Z" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="31" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="m24 25 2 4 4 .6-3 3 .7 4.4-3.7-2-3.7 2 .7-4.4-3-3 4-.6 2-4Z" fill="currentColor" />
      </svg>
    );
  }

  if (name === "rank") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M7 17h34v14H7zM13 17V9m22 8V9M13 31v8m22-8v8" stroke="currentColor" strokeWidth="2" />
        <path d="M20 17v14m8-14v14" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "team") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <circle cx="24" cy="16" r="6" stroke="currentColor" strokeWidth="2" />
        <circle cx="10" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="38" cy="20" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M13 39c0-8 4-13 11-13s11 5 11 13M3 37c0-6 3-10 8-10 2 0 4 .7 5 2m29 8c0-6-3-10-8-10-2 0-4 .7-5 2" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "referee") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M14 7h20l5 8-6 5v21H15V20l-6-5 5-8Z" stroke="currentColor" strokeWidth="2" />
        <path d="m19 7 5 7 5-7M18 25h12" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (name === "certificate") {
    return (
      <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
        <path d="M9 6h30v30H9zM16 14h16M16 21h16M16 28h9" stroke="currentColor" strokeWidth="2" />
        <path d="m31 32 3 9 3-4 4 1-3-9" stroke="currentColor" strokeWidth="2" />
        <circle cx="33" cy="28" r="5" fill="#d71920" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="17" stroke="currentColor" strokeWidth="2" />
      <path d="M24 14v11l8 5M18 5h12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function CoachAchievementsPage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-black pt-20">
        <section className="relative min-h-[38rem] overflow-hidden border-b border-white/10">
          <Image
            src="/images/athlete-development.jpg"
            alt="Karate athlete preparing for high-performance competition"
            fill
            priority
            className="object-cover object-[center_38%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/35" />
          <div className="section-shell relative flex min-h-[38rem] items-end pb-16 pt-20 sm:items-center sm:pb-20 sm:pt-24">
            <div className="max-w-4xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                Coach Reza Abbasi · Competitive archive
              </p>
              <h1 className="hero-title mt-4 text-balance text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl">
                A Career Built Through Competition, Discipline, and Excellence
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-200 sm:text-xl">
                Explore Coach Reza Abbasi’s championship history, official certificates, medals,
                and competitive milestones across youth, junior, and adult divisions.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="#certificate-gallery">Explore the archive</ButtonLink>
                <ButtonLink href="/#coach" variant="secondary">Back to coach profile</ButtonLink>
              </div>
            </div>
          </div>
        </section>

        <section className="relative bg-stone-950 py-20 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                Featured achievements
              </p>
              <h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">
                Competitive and Professional Milestones
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-400">
                A concise record of verified competitive results, coaching credentials, and service
                to high-performance karate.
              </p>
            </div>
            <div className="mt-10 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredAchievements.map((achievement) => (
                <article
                  key={achievement.title}
                  className="flex min-h-40 items-start gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-5 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/40"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-400/30 bg-red-950/45 text-red-200">
                    <AchievementIcon name={achievement.icon} />
                  </span>
                  <div>
                    <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-stone-500">
                      {achievement.label}
                    </p>
                    <h3 className="mt-2 text-lg font-bold leading-6 text-white">{achievement.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-black py-20 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                Career timeline
              </p>
              <h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">
                A Competitive Career in Three Stages
              </h2>
            </div>
            <div className="relative mt-12 grid gap-5 lg:grid-cols-3">
              <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-gradient-to-r from-red-700 via-red-400 to-red-700 lg:block" />
              {careerStages.map((item, index) => {
                const count = visibleCoachAchievements.filter(
                  (achievement) => achievement.career_stage === item.stage,
                ).length;
                return (
                  <article
                    key={item.stage}
                    className="relative rounded-2xl border border-white/10 bg-stone-950 p-6"
                  >
                    <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-500 bg-black font-black text-white shadow-[0_0_0_7px_rgba(215,25,32,0.1)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-red-300">
                      {item.stage} division
                    </p>
                    <h3 className="hero-title mt-2 text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-4 leading-7 text-stone-400">{item.description}</p>
                    <p className="mt-5 border-t border-white/10 pt-4 text-sm font-semibold text-stone-300">
                      {count > 0
                        ? `${count} verified ${count === 1 ? "record" : "records"} currently published`
                        : "Archive records for this stage will be added soon"}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="certificate-gallery" className="bg-stone-950 py-20 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
                Official documents
              </p>
              <h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">
                Championship Certificate Gallery
              </h2>
              <p className="mt-5 text-lg leading-8 text-stone-400">
                Select a certificate to inspect the complete document, review verified details, and
                use the zoom controls for closer reading.
              </p>
            </div>
            <div className="mt-10">
              <AchievementGallery achievements={visibleCoachAchievements} />
            </div>
            <div className="mt-10 rounded-xl border border-white/10 bg-black/50 p-5 text-sm leading-6 text-stone-400">
              <p>
                <strong className="text-stone-200">Archive integrity:</strong> Published details are
                transcribed only from available records or verified coaching credentials. Documents
                are reviewed for private identification, addresses, birth dates, personal contact
                details, and unrelated signatures before publication.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
