import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getPublishedKnowledgeContent } from "@/lib/knowledge/store";

type PageProps = { params: Promise<{ slug: string }> };

async function findArticle(slug: string) {
  const { articles } = await getPublishedKnowledgeContent();
  return articles.find((item) => item.slug === slug) || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await findArticle((await params).slug);
  return article ? { title: article.title, description: article.summary, alternates: { canonical: `/karate-refereeing/articles/${article.slug}` } } : {};
}

export default async function KnowledgeArticlePage({ params }: PageProps) {
  const article = await findArticle((await params).slug);
  if (!article) notFound();
  const structuredData = { "@context": "https://schema.org", "@type": "Article", headline: article.title, description: article.summary, datePublished: article.createdAt, dateModified: article.updatedAt, author: { "@type": article.author_or_source === "SHOTOKAN Karate Regina" ? "Organization" : "Person", name: article.author_or_source }, publisher: { "@type": "Organization", name: "SHOTOKAN Karate Regina" } };
  return <><Navbar /><main className="min-h-screen bg-stone-950 pb-24 pt-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="border-b border-white/10 bg-black py-16"><div className="section-shell"><nav aria-label="Breadcrumb" className="text-sm text-stone-400"><ol className="flex flex-wrap gap-2"><li><Link href="/">Home</Link></li><li aria-hidden="true">/</li><li><Link href="/karate-knowledge-center">Knowledge Center</Link></li><li aria-hidden="true">/</li><li><Link href="/karate-refereeing">Refereeing</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-white">{article.title}</li></ol></nav><p className="mt-10 text-xs font-black uppercase tracking-[0.22em] text-red-300">{article.category} · Educational article</p><h1 className="hero-title mt-4 max-w-5xl text-4xl font-bold text-white sm:text-6xl">{article.title}</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">{article.summary}</p><dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-500"><div><dt className="inline">Author: </dt><dd className="inline text-stone-300">{article.author_or_source}</dd></div><div><dt className="inline">Revision: </dt><dd className="inline text-stone-300">{article.revision_date || "Not specified"}</dd></div><div><dt className="inline">Last reviewed: </dt><dd className="inline text-stone-300">{article.last_reviewed || "Not specified"}</dd></div></dl></div></header><div className="section-shell"><div className="mx-auto grid max-w-5xl gap-10 py-14 lg:grid-cols-[15rem_1fr]"><aside><h2 className="text-sm font-black uppercase tracking-[0.16em] text-white">Contents</h2><ol className="mt-4 space-y-3 text-sm text-stone-400">{article.sections.map((section)=><li key={section.id}><a className="hover:text-red-300" href={`#${section.id}`}>{section.heading}</a></li>)}</ol></aside><article className="min-w-0 space-y-12">{article.sections.map((section)=><section id={section.id} key={section.id} className="scroll-mt-28"><p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">{section.label}</p><h2 className="hero-title mt-3 text-3xl font-bold text-white">{section.heading}</h2>{section.page_reference ? <p className="mt-2 text-sm text-stone-500">Source reference: {section.page_reference}</p> : null}<div className="mt-5 whitespace-pre-wrap text-lg leading-8 text-stone-300">{section.body}</div></section>)}</article></div><div className="rounded-xl border border-red-400/25 bg-red-950/20 p-6 text-stone-300"><strong className="text-white">Competition rules and procedures may be updated by the relevant governing organizations. Visitors should always confirm that they are consulting the latest applicable official rules.</strong></div></div></main><Footer /></>;
}
