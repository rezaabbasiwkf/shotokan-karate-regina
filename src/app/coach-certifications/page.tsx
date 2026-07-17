import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { CertificationGallery } from "@/components/CertificationGallery";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { visibleCoachCertifications } from "@/data/coach-certifications";

export const metadata: Metadata = {
  title: "Coach Reza Abbasi – Coaching Certifications & Professional Qualifications",
  description: "Verified karate coaching qualifications, instructor training, professional coaching licenses and continuing education earned by Coach Reza Abbasi.",
  alternates: { canonical: "/coach-certifications" },
  keywords: ["Karate Coach Certification", "Karate Coaching Qualifications", "Shotokan Karate Instructor", "Karate Coaching License", "Karate Referee Certification", "Karate Instructor Canada", "Karate Coach Regina", "Karate Coaching Credentials"],
};

const featured = visibleCoachCertifications.filter((item) => item.featured);

export default function CoachCertificationsPage() {
  return <>
    <Navbar />
    <main className="overflow-hidden bg-black pt-20">
      <section className="relative min-h-[34rem] overflow-hidden border-b border-white/10">
        <Image src="/images/coach-reza-portrait.jpg" alt="Coach Reza Abbasi in a traditional karate dojo" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/45" />
        <div className="section-shell relative flex min-h-[34rem] items-center py-20">
          <div className="max-w-4xl"><p className="text-xs font-black uppercase tracking-[.28em] text-red-300">Coach Reza Abbasi · Professional credentials</p><h1 className="hero-title mt-4 text-4xl font-bold leading-tight text-white sm:text-6xl lg:text-7xl">Professional Coaching Qualifications</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-stone-200 sm:text-xl">Official coaching certifications, instructor qualifications, referee credentials, coaching education, and professional development earned throughout Coach Reza Abbasi’s martial arts career.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><ButtonLink href="#certification-gallery">View certifications</ButtonLink><ButtonLink href="/#coach" variant="secondary">Coach profile</ButtonLink></div></div>
        </div>
      </section>

      <section className="bg-stone-950 py-20"><div className="section-shell"><div className="max-w-4xl"><p className="text-xs font-black uppercase tracking-[.28em] text-red-300">Verified professional education</p><h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">Professional Credibility Through Education</h2><p className="mt-5 text-lg leading-8 text-stone-400">This archive presents verified coaching qualifications and professional certifications obtained through recognized federations, instructor development, coaching education, and approved training. Competitive medals and championship results remain in the separate Achievements archive.</p></div>
      {featured.length > 0 && <div className="mt-10 grid gap-4 md:grid-cols-2">{featured.map((item) => <article key={item.id} className="rounded-2xl border border-amber-400/30 bg-amber-400/[.06] p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-amber-200">Featured · {item.scope}</p><h3 className="mt-3 text-xl font-bold text-white">{item.englishTitle}</h3><p className="mt-3 text-sm leading-6 text-stone-400">{item.issuingOrganization}</p></article>)}</div>}</div></section>

      <section id="certification-gallery" className="border-t border-white/10 bg-black py-20 sm:py-24"><div className="section-shell"><p className="text-xs font-black uppercase tracking-[.28em] text-red-300">Official documentation</p><h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">Coaching Certifications &amp; Qualifications</h2><p className="mt-5 max-w-3xl text-lg leading-8 text-stone-400">Credentials are ordered by certification scope and newest first. Select a document to inspect the privacy-reviewed certificate and its verified English summary.</p><div className="mt-10"><CertificationGallery certifications={visibleCoachCertifications} /></div><div className="mt-10 rounded-xl border border-white/10 bg-stone-950 p-5 text-sm leading-6 text-stone-400"><strong className="text-stone-200">Privacy and translation note:</strong> Original documents are retained unchanged outside the public website. Published derivatives conceal personal identification numbers and birth dates only. Federation seals, public official signatures, course details and credential information remain visible. English descriptions summarize the supplied document and do not replace it.</div></div></section>
    </main>
    <Footer />
  </>;
}
