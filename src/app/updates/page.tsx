import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { publicPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = publicPageMetadata({
  title: "Academy Updates, Class Schedule & Tuition",
  description: "Current Shotokan Karate Regina class schedule, tuition, family discount, location, registration contacts, and academy announcements.",
  path: "/updates",
});

const details = [
  ["Wednesdays", "5:00 PM – 6:00 PM"],
  ["Sundays", "5:00 PM – 6:00 PM"],
  ["Location", "1751 Broad Street, Regina, SK"],
  ["Monthly tuition", "$80 per month"],
  ["Family discount", "$70 per person, per month"],
  ["Student levels", "All ages and skill levels"],
];

export default function UpdatesPage() {
  const structuredData = { "@context": "https://schema.org", "@type": "WebPage", name: "Current Shotokan Karate Regina Program Update", url: `${SITE_URL}/updates`, description: "Classes are held Wednesdays and Sundays from 5:00 PM to 6:00 PM at 1751 Broad Street in Regina. Tuition is $80 per month, with a $70 per-person family rate.", about: { "@id": `${SITE_URL}/#academy` } };
  return <><Navbar /><main className="min-h-screen bg-stone-950 pt-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <header className="border-b border-white/10 bg-gradient-to-br from-black via-stone-950 to-red-950/40 py-16 sm:py-20"><div className="section-shell grid items-center gap-8 lg:grid-cols-[1fr_auto]"><div><p className="text-xs font-black uppercase tracking-[.28em] text-red-300">Academy announcements</p><h1 className="hero-title mt-4 text-4xl font-bold text-white sm:text-6xl">Updates &amp; Current Information</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-stone-300">Find the latest confirmed class schedule, tuition, location, registration contacts, and program information for SHOTOKAN Karate Regina.</p></div><div className="relative mx-auto h-36 w-36 overflow-hidden rounded-full border border-red-400/30 bg-white shadow-2xl"><Image src="/images/logo.PNG" alt="SHOTOKAN Karate Regina logo" fill className="object-cover" sizes="144px" /></div></div></header>
    <section className="py-16"><div className="section-shell"><article className="overflow-hidden rounded-3xl border border-red-400/25 bg-black shadow-2xl shadow-black/40"><div className="border-b border-white/10 bg-red-950/30 px-6 py-5 sm:px-8"><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Current program update</p><h2 className="hero-title mt-2 text-3xl font-bold text-white">Two Weekly Classes · New Schedule &amp; Tuition</h2></div><div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3">{details.map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><p className="text-xs font-black uppercase tracking-[.16em] text-red-300">{label}</p><p className="mt-2 text-xl font-bold leading-7 text-white">{value}</p></div>)}</div><div className="grid gap-8 border-t border-white/10 p-6 sm:p-8 lg:grid-cols-2"><div><h3 className="text-2xl font-black text-white">Program benefits</h3><ul className="mt-4 space-y-3 text-stone-300">{["Practical self-defence training", "Improve fitness, focus, confidence, and self-discipline", "Build a stronger body, stronger mind, and better you"].map((item) => <li key={item} className="flex gap-3"><span className="font-black text-red-400">✓</span><span>{item}</span></li>)}</ul></div><div><h3 className="text-2xl font-black text-white">Registration &amp; coordination</h3><p className="mt-4 text-stone-300">Moha Ebrahimi</p><a className="mt-2 block text-2xl font-black text-red-300 hover:text-red-200" href="tel:+13065195711">306-519-5711</a><div className="mt-6"><Link href="/register" className="inline-flex min-h-12 items-center rounded-md bg-red-600 px-6 text-sm font-black uppercase tracking-[.12em] text-white hover:bg-red-500">Register for Class</Link></div></div></div></article>
      <section className="mt-10 grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 bg-black/40 p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-red-300">Head instructor</p><h2 className="hero-title mt-2 text-3xl font-bold text-white">Reza Abbasi</h2><ul className="mt-5 space-y-3 text-stone-300"><li>World Champion (2015)</li><li>Provincial Kumite Coach — Saskatchewan</li><li>Official Karate Canada Referee</li></ul><a href="tel:+13065703125" className="mt-5 inline-block font-black text-red-300">306-570-3125</a></article><article className="rounded-2xl border border-white/10 bg-black/40 p-6"><p className="text-xs font-black uppercase tracking-[.18em] text-red-300">Stay connected</p><h2 className="hero-title mt-2 text-3xl font-bold text-white">Follow the Academy</h2><p className="mt-5 text-stone-300">Follow training, event, and program announcements on Instagram.</p><a href="https://www.instagram.com/shotokan_karate_yqr" target="_blank" rel="noreferrer" className="mt-5 inline-block font-black text-red-300">@shotokan_karate_yqr</a></article></section>
    </div></section>
  </main><Footer /></>;
}
