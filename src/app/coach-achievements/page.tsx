import type { Metadata } from "next";
import Image from "next/image";
import { AchievementGallery } from "@/components/AchievementGallery";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { visibleCoachAchievements } from "@/data/coach-achievements";

export const metadata: Metadata = {
  title: "Coach Reza Abbasi Championships & Karate Achievements",
  description: "Official championship certificates and verified World, International, National, University and Provincial karate results for Coach Reza Abbasi in Regina.",
  alternates: { canonical: "/coach-achievements" },
  keywords: ["Coach Reza Abbasi Karate Achievements", "Karate Champion Regina", "Shotokan Karate Champion", "Kumite Championship", "International Karate Medalist", "National Karate Champion", "University Karate Olympiad", "Karate Coach Regina"],
  openGraph: {
    title: "Coach Reza Abbasi – Championships & Achievements",
    description: "A verified archive of Coach Reza Abbasi’s karate championship certificates and results.",
    url: "/coach-achievements",
    images: [{ url: "/images/coach-achievements/2015-world-men-championship-gold.jpg", width: 1900, height: 1268, alt: "Coach Reza Abbasi 2015 World Championship gold medal record." }],
  },
};

const featured = visibleCoachAchievements.filter((item) => item.featured).slice(0, 4);

export default function CoachAchievementsPage() {
  return <>
    <Navbar />
    <main className="overflow-hidden bg-black pt-20">
      <section className="relative min-h-[34rem] overflow-hidden border-b border-white/10">
        <Image src="/images/athlete-development.jpg" alt="Karate athlete preparing for championship competition" fill priority className="object-cover object-[center_38%]" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        <div className="section-shell relative flex min-h-[34rem] items-center py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[.28em] text-red-300">Coach Reza Abbasi · Verified competitive archive</p>
            <h1 className="hero-title mt-4 text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">Championships &amp; Achievements</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-200 sm:text-xl">Original competition certificates, preserved as issued, with concise English translations and verified results.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink href="#certificate-gallery">View certificates</ButtonLink><ButtonLink href="/#coach" variant="secondary">Coach profile</ButtonLink></div>
          </div>
        </div>
      </section>

      {featured.length > 0 && <section className="bg-stone-950 py-20">
        <div className="section-shell">
          <p className="text-xs font-black uppercase tracking-[.28em] text-amber-300">Featured achievements</p>
          <h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">Major Competitive Results</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((item) => <article key={item.id} className={`rounded-2xl border p-5 ${item.competitionLevel === "World" ? "border-amber-400/50 bg-amber-400/[.07]" : "border-red-400/25 bg-white/[.04]"}`}>
              <p className="text-[.65rem] font-black uppercase tracking-[.18em] text-red-300">{item.competitionLevel} · {item.yearLabel}</p>
              <h3 className="mt-3 text-lg font-bold leading-6 text-white">{item.englishTitle}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-400">{item.competitionName}</p>
            </article>)}
          </div>
        </div>
      </section>}

      <section id="certificate-gallery" className="border-t border-white/10 bg-stone-950 py-20 sm:py-24">
        <div className="section-shell">
          <p className="text-xs font-black uppercase tracking-[.28em] text-red-300">Official documents</p>
          <h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">Championship Certificate Gallery</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-400">Records are ordered World, International, National and Provincial, then newest first. University events are included under National Competitions.</p>
          <div className="mt-10"><AchievementGallery achievements={visibleCoachAchievements} /></div>
          <div className="rounded-xl border border-white/10 bg-black/50 p-5 text-sm leading-6 text-stone-400">
            <strong className="text-stone-200">Translation and privacy note:</strong> Persian certificates remain unchanged. English text is a summary, not a replacement of the official document. A supplied record containing a birth date and identification number is intentionally unpublished until a privacy-safe redacted copy is available.
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
