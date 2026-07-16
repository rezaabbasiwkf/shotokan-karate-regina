import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { KnowledgeResourceLibrary } from "@/components/KnowledgeResourceLibrary";
import { Navbar } from "@/components/Navbar";
import { getPublishedKnowledgeContent } from "@/lib/knowledge/store";

export const metadata: Metadata = {
  title: "Karate Refereeing PDF Learning Library",
  description: "Search and read verified karate refereeing, Kata, Kumite, Para Karate, competition procedure, and training documents.",
  alternates: { canonical: "/karate-refereeing/resources" },
};

export default async function RefereeingResourcesPage() {
  const { resources, articles } = await getPublishedKnowledgeContent();
  return <><Navbar /><main className="min-h-screen bg-stone-950 pb-24 pt-20"><section className="border-b border-white/10 bg-black py-16 sm:py-20"><div className="section-shell"><nav aria-label="Breadcrumb" className="text-sm text-stone-400"><ol className="flex flex-wrap gap-2"><li><Link href="/">Home</Link></li><li aria-hidden="true">/</li><li><Link href="/karate-knowledge-center">Knowledge Center</Link></li><li aria-hidden="true">/</li><li><Link href="/karate-refereeing">Refereeing</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-white">Resources</li></ol></nav><p className="mt-10 text-xs font-black uppercase tracking-[0.28em] text-red-300">PDF learning library</p><h1 className="hero-title mt-4 text-4xl font-bold text-white sm:text-6xl">Karate Refereeing Resources</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-stone-300">Search verified documents by subject, category, title, keyword, or extracted PDF text. Each record identifies its source, version, effective date, and review status.</p></div></section><section className="py-16"><div className="section-shell"><KnowledgeResourceLibrary resources={resources} articles={articles} /><div className="mt-12 rounded-xl border border-red-400/25 bg-red-950/20 p-6 text-stone-300"><strong className="text-white">Competition rules and procedures may be updated by the relevant governing organizations. Visitors should always confirm that they are consulting the latest applicable official rules.</strong></div></div></section></main><Footer /></>;
}
