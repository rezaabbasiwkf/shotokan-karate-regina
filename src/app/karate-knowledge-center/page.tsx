import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { KnowledgeResourceLibrary } from "@/components/KnowledgeResourceLibrary";
import { Navbar } from "@/components/Navbar";
import { getPublishedKnowledgeContent } from "@/lib/knowledge/store";

export const metadata: Metadata = {
  title: { absolute: "Karate Knowledge Center | SHOTOKAN Karate Regina" },
  description: "Explore educational resources about karate refereeing, Kata, Kumite, Para Karate, competition rules, coaching, and athlete development from SHOTOKAN Karate Regina.",
  alternates: { canonical: "/karate-knowledge-center" },
  keywords: ["karate referee", "karate judging", "karate competition rules", "WKF karate rules", "karate competition education", "Shotokan Karate Regina"],
  openGraph: {
    title: "Karate Knowledge Center | SHOTOKAN Karate Regina",
    description: "Professional karate education, competition knowledge, and refereeing resources.",
    url: "/karate-knowledge-center",
    images: [{ url: "/images/athlete-development.jpg", width: 1200, height: 1500, alt: "Karate athlete development and competition education" }],
  },
};

const categories = [
  ["Karate Refereeing Education", "Rules, judging procedures, competition standards, and verified educational resources.", "/karate-refereeing", "Available"],
  ["Kata Rules and Evaluation", "A future learning area for verified Kata rules and evaluation resources.", "", "Coming Soon"],
  ["Kumite Rules and Match Management", "A future learning area for verified Kumite rules and match-management resources.", "", "Coming Soon"],
  ["Para Karate", "A future learning area for verified Para Karate education and competition resources.", "", "Coming Soon"],
  ["Karate Terminology", "A future reference for verified competition and karate terminology.", "", "Coming Soon"],
  ["Competition Preparation", "A future resource area for athletes, families, coaches, and competition teams.", "", "Coming Soon"],
  ["Coaching Resources", "A future library for verified professional coaching resources.", "", "Coming Soon"],
  ["Athlete Development", "A future learning area supporting long-term athlete development.", "", "Coming Soon"],
  ["Sports Psychology", "A future resource area for verified performance-psychology education.", "", "Coming Soon"],
  ["Training and Performance Tips", "A future library for reviewed training and performance guidance.", "", "Coming Soon"],
] as const;

export default async function KnowledgeCenterPage() {
  const { resources, articles } = await getPublishedKnowledgeContent();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "CollectionPage", name: "Karate Knowledge Center", description: metadata.description, url: "https://shotokan-karate-regina.vercel.app/karate-knowledge-center" },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://shotokan-karate-regina.vercel.app/" },
        { "@type": "ListItem", position: 2, name: "Karate Knowledge Center", item: "https://shotokan-karate-regina.vercel.app/karate-knowledge-center" },
      ] },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="overflow-hidden bg-black pt-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="relative border-b border-white/10 bg-stone-950 py-20 sm:py-28">
          <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(215,25,32,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(215,25,32,0.12)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="section-shell relative">
            <nav aria-label="Breadcrumb" className="text-sm text-stone-400"><ol className="flex flex-wrap gap-2"><li><Link className="hover:text-red-300" href="/">Home</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="text-stone-200">Knowledge Center</li></ol></nav>
            <p className="mt-12 text-xs font-black uppercase tracking-[0.28em] text-red-300">Education · Competition · Professional development</p>
            <h1 className="hero-title mt-4 text-5xl font-bold text-white sm:text-7xl">Karate Knowledge Center</h1>
            <p className="hero-title mt-5 text-xl font-bold text-red-100 sm:text-2xl">Professional Karate Education, Competition Knowledge, and Refereeing Resources</p>
            <p className="mt-7 max-w-4xl text-lg leading-8 text-stone-300">The SHOTOKAN Karate Regina Knowledge Center provides educational resources for karate athletes, coaches, referees, parents, and competition officials. Explore professional information about karate refereeing, Kata, Kumite, Para Karate, competition preparation, coaching, terminology, and athlete development.</p>
          </div>
        </section>

        <section className="bg-black py-20 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.26em] text-red-300">Learning areas</p><h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">Explore the Knowledge Center</h2><p className="mt-5 text-lg leading-8 text-stone-400">The refereeing library is available now. Additional categories will open only when reviewed educational material is ready.</p></div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {categories.map(([title, description, href, status], index) => {
                const content = <><div className="flex items-start justify-between gap-4"><span className="text-sm font-black text-red-300">{String(index + 1).padStart(2, "0")}</span><span className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] ${status === "Available" ? "border-red-400/40 bg-red-950/40 text-red-200" : "border-white/10 text-stone-500"}`}>{status}</span></div><h3 className="hero-title mt-8 text-2xl font-bold text-white">{title}</h3><p className="mt-3 leading-7 text-stone-400">{description}</p>{href ? <p className="mt-6 text-sm font-black uppercase tracking-[0.14em] text-red-300">Open learning area <span aria-hidden="true">→</span></p> : null}</>;
                return href ? <Link key={title} href={href} className="min-h-64 rounded-2xl border border-red-400/30 bg-gradient-to-br from-red-950/25 to-stone-950 p-6 transition hover:-translate-y-1 hover:border-red-300/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400">{content}</Link> : <article key={title} className="min-h-64 rounded-2xl border border-white/10 bg-stone-950 p-6">{content}</article>;
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-stone-950 py-20 sm:py-24">
          <div className="section-shell">
            <div className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[0.26em] text-red-300">Searchable library</p><h2 className="hero-title mt-3 text-3xl font-bold text-white sm:text-5xl">Find a Rule or Resource</h2><p className="mt-5 text-lg leading-8 text-stone-400">Search titles, descriptions, keywords, categories, and extracted text from the supplied PDFs.</p></div>
            <div className="mt-10"><KnowledgeResourceLibrary resources={resources} articles={articles} compact /></div>
          </div>
        </section>

        <section className="bg-red-950/20 py-16"><div className="section-shell"><div className="rounded-2xl border border-red-400/25 bg-black/55 p-6 sm:p-8"><h2 className="text-xl font-black text-white">Rules update notice</h2><p className="mt-3 max-w-4xl leading-7 text-stone-300"><strong>Competition rules and procedures may be updated by the relevant governing organizations. Visitors should always confirm that they are consulting the latest applicable official rules.</strong></p></div></div></section>
      </main>
      <Footer />
    </>
  );
}
