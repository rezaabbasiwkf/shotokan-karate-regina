import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PdfReader } from "@/components/PdfReader";
import { findKnowledgeResource, getPublishedKnowledgeContent } from "@/lib/knowledge/store";

type PageProps = { params: Promise<{ slug: string }> };

const topicReferences: Record<string, Array<[string, string]>> = {
  "wkf-kumite-competition-rules-2026-01": [
    ["Competition area and equipment", "Articles 1–2, pages 3–8"],
    ["Competition organization and referee panel", "Articles 3–4, pages 9–17"],
    ["Bout duration, match operation, and scoring", "Articles 5–8, pages 18–22"],
    ["Behaviour, warnings, penalties, and injuries", "Articles 9–11, pages 23–30"],
    ["Decisions, protests, and Video Review", "Articles 12–14, pages 31–39"],
    ["Officials’ powers and duties", "Article 15, pages 40–42"],
  ],
  "wkf-kata-competition-rules-2026": [
    ["Competition area and official attire", "Articles 1–2, pages 3–7"],
    ["Competition organization", "Article 3, pages 8–12"],
    ["Judging panel and evaluation", "Articles 4–5, pages 13–18"],
    ["Operation of matches and official protest", "Articles 6–7, pages 19–22"],
    ["Eligibility, adaptations, and appendices", "Articles 8–10 and appendices, pages 23–30"],
  ],
  "wkf-para-karate-competition-rules-2026": [
    ["Competition, categories, and sport classes", "Articles 1–2, pages 4–7"],
    ["Competition area and official attire", "Articles 3–4, pages 8–16"],
    ["Organization and judging panel", "Articles 5–6, pages 17–20"],
    ["Evaluation and match operation", "Articles 7–8, pages 21–26"],
    ["Protests, adaptations, and appendices", "Articles 9–11 and appendices, pages 27–34"],
  ],
};

function formatDate(value: string) {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en-CA", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resource = await findKnowledgeResource((await params).slug);
  if (!resource) return {};
  return {
    title: resource.title,
    description: resource.short_description,
    alternates: { canonical: `/karate-refereeing/resources/${resource.slug}` },
    openGraph: { title: resource.title, description: resource.short_description, url: `/karate-refereeing/resources/${resource.slug}`, type: "article" },
  };
}

export default async function ResourceDetailPage({ params }: PageProps) {
  const resource = await findKnowledgeResource((await params).slug);
  if (!resource) notFound();
  const { resources } = await getPublishedKnowledgeContent();
  const related = resources.filter((item) => item.id !== resource.id && (resource.related_resources.includes(item.id) || item.document_category === resource.document_category)).slice(0, 3);
  const pdfSource = resource.blob_pathname ? `/api/knowledge-documents/${resource.id}` : resource.pdf_file;
  const topics = topicReferences[resource.slug] || [];
  const isOfficialRule = resource.document_type === "Official rule document";
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Article", headline: resource.title, description: resource.short_description, datePublished: resource.publication_date, dateModified: resource.revision_date || resource.updatedAt, author: { "@type": "Organization", name: resource.author_or_source }, publisher: { "@type": "Organization", name: "SHOTOKAN Karate Regina" }, mainEntityOfPage: `https://shotokan-karate-regina.vercel.app/karate-refereeing/resources/${resource.slug}` },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://shotokan-karate-regina.vercel.app/" },
        { "@type": "ListItem", position: 2, name: "Knowledge Center", item: "https://shotokan-karate-regina.vercel.app/karate-knowledge-center" },
        { "@type": "ListItem", position: 3, name: "Refereeing Resources", item: "https://shotokan-karate-regina.vercel.app/karate-refereeing/resources" },
        { "@type": "ListItem", position: 4, name: resource.title, item: `https://shotokan-karate-regina.vercel.app/karate-refereeing/resources/${resource.slug}` },
      ] },
    ],
  };

  return <><Navbar /><main className="min-h-screen bg-stone-950 pb-24 pt-20"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><header className="border-b border-white/10 bg-black py-12 sm:py-16"><div className="section-shell"><nav aria-label="Breadcrumb" className="text-sm text-stone-400"><ol className="flex flex-wrap gap-2"><li><Link href="/">Home</Link></li><li aria-hidden="true">/</li><li><Link href="/karate-knowledge-center">Knowledge Center</Link></li><li aria-hidden="true">/</li><li><Link href="/karate-refereeing/resources">Resources</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-stone-200">{resource.title}</li></ol></nav><p className="mt-10 text-xs font-black uppercase tracking-[0.24em] text-red-300">{resource.document_category} · {resource.document_type}</p><h1 className="hero-title mt-4 max-w-5xl text-4xl font-bold text-white sm:text-6xl">{resource.title}</h1><p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">{resource.short_description}</p></div></header><section className="py-12"><div className="section-shell"><div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"><div><PdfReader title={resource.title} source={pdfSource} pageCount={resource.page_count} allowDownload={resource.allow_download} allowPrint={resource.allow_print} /><p className="mt-4 text-sm leading-6 text-stone-500">This viewer preserves the supplied PDF as issued. Download and print controls are hidden because redistribution permission has not been recorded for this document.</p></div><aside className="rounded-2xl border border-white/10 bg-black/40 p-5 lg:self-start"><h2 className="text-lg font-black text-white">Document record</h2><dl className="mt-5 space-y-4 text-sm">{[["Category", resource.document_category],["Source", resource.author_or_source],["Issuing organization",resource.issuing_organization],["Edition / version",resource.edition_or_version],["Published",formatDate(resource.publication_date)],["Effective",formatDate(resource.effective_date)],["Revision",formatDate(resource.revision_date)],["Last reviewed",formatDate(resource.last_reviewed)],["Language",resource.language],["Length",`${resource.page_count} pages`]].map(([label,value])=><div key={label} className="border-b border-white/10 pb-3 last:border-0"><dt className="text-stone-500">{label}</dt><dd className="mt-1 font-semibold text-stone-200">{value}</dd></div>)}</dl><a href={resource.source_url} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.12em] text-red-300">Visit issuing organization <span className="ml-2" aria-hidden="true">↗</span></a></aside></div>
          <article className="mx-auto mt-16 max-w-4xl"><p className="text-xs font-black uppercase tracking-[0.22em] text-red-300">Structured document guide</p><h2 className="hero-title mt-3 text-3xl font-bold text-white">About This Document</h2><p className="mt-5 text-lg leading-8 text-stone-300">This page records the supplied document’s source, version, dates, and subject area. It does not replace the official PDF or add an interpretation to its wording.</p>{isOfficialRule ? <section className="mt-10 rounded-xl border border-red-400/25 bg-red-950/15 p-6"><p className="text-xs font-black uppercase tracking-[0.18em] text-red-300">Official Rule</p><h3 className="mt-2 text-2xl font-bold text-white">Official competition rule document</h3><p className="mt-3 leading-7 text-stone-300">Consult the embedded source document for the complete official wording. No wording from the rules has been rewritten as coaching guidance on this page.</p></section> : <section className="mt-10 rounded-xl border border-white/10 bg-black/35 p-6"><h3 className="text-2xl font-bold text-white">Source document scope</h3><p className="mt-3 leading-7 text-stone-300">The document is identified as {resource.document_type.toLowerCase()} issued by {resource.issuing_organization}. Review the complete PDF for its original context and instructions.</p></section>}{topics.length ? <section className="mt-12"><h2 className="hero-title text-3xl font-bold text-white">Document Topics and Page References</h2><div className="mt-6 overflow-hidden rounded-xl border border-white/10"><table className="w-full text-left text-sm"><thead className="bg-white/[0.06] text-xs uppercase tracking-[0.12em] text-red-200"><tr><th className="px-4 py-3">Topic</th><th className="px-4 py-3">Reference</th></tr></thead><tbody className="divide-y divide-white/10">{topics.map(([topic,reference])=><tr key={topic}><td className="px-4 py-4 font-semibold text-white">{topic}</td><td className="px-4 py-4 text-stone-400">{reference}</td></tr>)}</tbody></table></div></section> : null}<section className="mt-12"><h2 className="hero-title text-3xl font-bold text-white">Source and Copyright</h2><p className="mt-4 leading-7 text-stone-300">This third-party document is attributed to {resource.issuing_organization}. SHOTOKAN Karate Regina does not claim ownership, remove official attribution, or present the document as original academy content.</p></section></article>
          {related.length ? <section className="mt-16"><h2 className="hero-title text-3xl font-bold text-white">Related Resources</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{related.map((item)=><Link key={item.id} href={`/karate-refereeing/resources/${item.slug}`} className="rounded-xl border border-white/10 bg-black/35 p-5 transition hover:border-red-400/40"><p className="text-xs font-black uppercase tracking-[0.14em] text-red-300">{item.document_category}</p><h3 className="mt-2 font-bold leading-6 text-white">{item.title}</h3><p className="mt-3 text-sm text-stone-500">{item.edition_or_version}</p></Link>)}</div></section> : null}
          <div className="mt-12 rounded-xl border border-red-400/25 bg-red-950/20 p-6 text-stone-300"><strong className="text-white">Competition rules and procedures may be updated by the relevant governing organizations. Visitors should always confirm that they are consulting the latest applicable official rules.</strong></div></div></section></main><Footer /></>;
}
