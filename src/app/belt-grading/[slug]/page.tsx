import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PdfReader } from "@/components/PdfReader";
import { beltSteps, gradingBySlug, gradingDocument, gradingLevels } from "@/data/belt-grading";

export function generateStaticParams() { return gradingLevels.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const level = gradingBySlug((await params).slug);
  if (!level) return {};
  return { title: `${level.title} Karate Belt Requirements | Shotokan Karate Regina`, description: `Official ${level.rank} Shotokan karate belt test requirements for ${level.title}: Kihon, Kata, Kumite and examination notes in Regina.` };
}

function Card({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[.07] to-white/[.02] p-6"><h2 className="hero-title text-2xl font-bold text-white">{title}</h2><ol className="mt-5 space-y-3">{items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3 leading-7 text-stone-300"><span className="mt-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-950 text-xs font-black text-red-200">{index + 1}</span><span>{item}</span></li>)}</ol></section>;
}

export default async function BeltPage({ params }: { params: Promise<{ slug: string }> }) {
  const level = gradingBySlug((await params).slug);
  if (!level) notFound();
  const index = gradingLevels.indexOf(level);
  const schema = { "@context": "https://schema.org", "@type": "LearningResource", name: `${level.title} Official Grading Requirements`, educationalLevel: level.rank, provider: { "@type": "Organization", name: "SHOTOKAN Karate Regina" }, isPartOf: { "@type": "CreativeWork", name: gradingDocument.title }, url: `https://shotokan-karate-regina.vercel.app/belt-grading/${level.slug}` };
  return <><Navbar /><main className="pt-20">
    <div className="section-shell py-5 text-sm text-stone-400"><Link href="/">Home</Link> <span aria-hidden="true">/</span> <Link href="/belt-grading">Belt Grading</Link> <span aria-hidden="true">/</span> <span className="text-white">{level.title}</span></div>
    <section className="border-y border-white/10 bg-gradient-to-br from-black via-stone-950 to-red-950/30 py-12"><div className="section-shell grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]"><div><p className="text-xs font-black uppercase tracking-[.24em] text-red-300">{level.rank} · PDF page {level.page}</p><h1 className="hero-title mt-4 text-4xl font-bold text-white sm:text-6xl">{level.title}</h1><p className="mt-4 text-xl font-bold text-red-100">Official Grading Requirements</p>{level.tenure ? <p className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-stone-300">Tenure: {level.tenure}</p> : null}</div><div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-red-400/25 bg-white shadow-2xl"><Image src={`/images/belt-grading/${level.image}`} alt={level.imageAlt} fill priority className="object-contain" sizes="(min-width:1024px) 50vw, 100vw" /></div></div></section>
    <nav aria-label="Belt progression" className="overflow-x-auto border-b border-white/10 bg-black py-5"><ol className="section-shell flex min-w-max items-center gap-2">{beltSteps.map((step, i) => <li key={step} className={`rounded-full border px-3 py-2 text-xs font-bold ${i === index || i === index + 1 ? "border-red-400 bg-red-950/50 text-white" : "border-white/10 text-stone-500"}`}>{step}</li>)}</ol></nav>
    <section className="bg-stone-950 py-14"><div className="section-shell grid gap-5 lg:grid-cols-2"><Card title="Kihon" items={level.kihon} /><Card title="Kata" items={level.kata} /><Card title="Kumite" items={level.kumite} />{level.notes?.length ? <Card title="Examination Notes" items={level.notes} /> : null}</div></section>
    <section className="bg-black py-14"><div className="section-shell"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="hero-title text-3xl font-bold text-white">Official Grading Document</h2><p className="text-sm text-stone-400">This level: official PDF page {level.page} of {gradingDocument.pageCount}</p></div><div className="mt-7"><PdfReader title={gradingDocument.title} source={gradingDocument.source} pageCount={gradingDocument.pageCount} allowDownload allowPrint initialPage={level.page} /></div></div></section>
    <nav className="border-t border-white/10 bg-stone-950 py-10" aria-label="Grading level navigation"><div className="section-shell flex flex-col gap-3 sm:flex-row sm:justify-between">{index > 0 ? <Link className="inline-flex min-h-12 items-center rounded-md border border-white/15 px-5 font-bold" href={`/belt-grading/${gradingLevels[index - 1].slug}`}>← Previous Belt</Link> : <span />}<Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-600 px-5 font-bold text-white" href="/belt-grading">Back to Belt Grading Overview</Link>{index < gradingLevels.length - 1 ? <Link className="inline-flex min-h-12 items-center justify-end rounded-md border border-white/15 px-5 font-bold" href={`/belt-grading/${gradingLevels[index + 1].slug}`}>Next Belt →</Link> : <span />}</div></nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
  </main><Footer /></>;
}
