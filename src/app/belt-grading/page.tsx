import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BeltGradingSearch } from "@/components/BeltGradingSearch";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { gradingLevels } from "@/data/belt-grading";

export const metadata: Metadata = {
  title: "Karate Belt Grading Requirements | Shotokan Karate Regina",
  description: "Official Shotokan Karate Regina belt examination curriculum, karate grading requirements, Kata, Kihon and Kumite syllabus.",
};

export default function BeltGradingOverview() {
  return <><Navbar /><main className="pt-20">
    <section className="border-b border-white/10 bg-gradient-to-br from-black via-stone-950 to-red-950/35 py-20"><div className="section-shell text-center"><p className="text-xs font-black uppercase tracking-[.25em] text-red-300">Official examination curriculum</p><h1 className="hero-title mt-4 text-4xl font-bold text-white sm:text-6xl">Karate Belt Grading Requirements</h1><p className="mx-auto mt-5 max-w-3xl text-xl font-bold text-red-100">Official SHOTOKAN Karate Regina Belt Examination Curriculum</p><p className="mx-auto mt-5 max-w-3xl leading-8 text-stone-300">This section contains the official grading requirements used by SHOTOKAN Karate Regina. Students can review the required techniques before attending their grading examination. All syllabus wording is transcribed from Coach Reza Abbasi’s official May 2026 grading document.</p></div></section>
    <section className="bg-stone-950 py-16"><div className="section-shell"><BeltGradingSearch /></div></section>
    <section className="bg-black py-16"><div className="section-shell"><h2 className="hero-title text-3xl font-bold text-white">Complete grading pathway</h2><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{gradingLevels.map((level) => <article key={level.slug} className="overflow-hidden rounded-2xl border border-white/10 bg-stone-950"><div className="relative aspect-[4/3] bg-white"><Image src={`/images/belt-grading/${level.image}`} alt={level.imageAlt} fill className="object-contain" sizes="(min-width:1024px) 33vw, 50vw" /></div><div className="p-5"><p className="text-xs font-black uppercase tracking-[.18em] text-red-300">{level.rank} · Official page {level.page}</p><h2 className="hero-title mt-2 text-xl font-bold text-white">{level.title}</h2>{level.tenure ? <p className="mt-2 text-sm text-stone-400">Minimum tenure: {level.tenure}</p> : null}<Link href={`/belt-grading/${level.slug}`} className="mt-5 inline-flex min-h-11 items-center rounded-md bg-red-600 px-4 font-bold text-white hover:bg-red-500">View requirements →</Link></div></article>)}</div></div></section>
  </main><Footer /></>;
}
