"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import searchIndexData from "@/data/refereeing-search-index.json";
import type { KnowledgeArticle, KnowledgeResource } from "@/lib/knowledge/types";

type SearchPage = { page: number; text: string };
const searchIndex = searchIndexData as Record<string, SearchPage[]>;

function searchableText(resource: KnowledgeResource) {
  const fileName = resource.pdf_file.split("/").pop() || "";
  const extracted = (searchIndex[fileName] || []).map((page) => page.text).join(" ");
  return [
    resource.title,
    resource.short_description,
    resource.document_category,
    resource.document_type,
    resource.issuing_organization,
    resource.edition_or_version,
    ...resource.keywords,
    extracted,
  ]
    .join(" ")
    .toLowerCase();
}

function formatDate(value: string) {
  if (!value) return "Not specified";
  return new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(
    new Date(`${value}T00:00:00Z`),
  );
}

export function KnowledgeResourceLibrary({
  resources,
  articles = [],
  compact = false,
}: {
  resources: KnowledgeResource[];
  articles?: KnowledgeArticle[];
  compact?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All resources");
  const normalizedQuery = query.trim().toLowerCase();
  const categories = useMemo(
    () => ["All resources", ...Array.from(new Set(resources.map((item) => item.document_category)))],
    [resources],
  );

  const filteredResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          (category === "All resources" || resource.document_category === category) &&
          (!normalizedQuery || searchableText(resource).includes(normalizedQuery)),
      ),
    [resources, category, normalizedQuery],
  );

  const filteredArticles = useMemo(
    () =>
      articles.filter((article) => {
        const text = [article.title, article.summary, article.category, ...article.keywords, ...article.sections.map((section) => section.body)]
          .join(" ")
          .toLowerCase();
        return (category === "All resources" || article.category === category) && (!normalizedQuery || text.includes(normalizedQuery));
      }),
    [articles, category, normalizedQuery],
  );

  const visibleResources = compact ? filteredResources.slice(0, 6) : filteredResources;
  const total = filteredResources.length + filteredArticles.length;

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-black/45 p-4 sm:p-6">
        <label htmlFor={`knowledge-search-${compact ? "compact" : "library"}`} className="text-sm font-black uppercase tracking-[0.16em] text-white">
          Search the Knowledge Center
        </label>
        <div className="relative mt-3">
          <svg className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-500" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="m16 16 5 5" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            id={`knowledge-search-${compact ? "compact" : "library"}`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Kata scoring, penalties, Senshu, Video Review…"
            className="min-h-12 w-full rounded-lg border border-white/15 bg-stone-950 py-3 pl-12 pr-4 text-base text-white outline-none placeholder:text-stone-600 focus:border-red-400 focus:ring-2 focus:ring-red-500/25"
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2" aria-label="Resource category filters">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`min-h-11 shrink-0 rounded-full border px-4 text-xs font-black uppercase tracking-[0.1em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${category === item ? "border-red-500 bg-red-600 text-white" : "border-white/15 text-stone-300 hover:border-red-400/50"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-stone-400" aria-live="polite">
        {normalizedQuery ? `${total} result${total === 1 ? "" : "s"} for “${query.trim()}”` : `${resources.length} verified documents available`}
      </p>

      {filteredArticles.map((article) => (
        <article key={article.id} className="mt-4 rounded-xl border border-white/10 bg-stone-950 p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-red-300">Article · {article.category}</p>
          <h3 className="hero-title mt-2 text-xl font-bold text-white">{article.title}</h3>
          <p className="mt-3 leading-6 text-stone-400">{article.summary}</p>
          <Link href={`/karate-refereeing/articles/${article.slug}`} className="mt-4 inline-flex min-h-11 items-center text-sm font-black uppercase tracking-[0.13em] text-red-300">Read article <span className="ml-2" aria-hidden="true">→</span></Link>
        </article>
      ))}

      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visibleResources.map((resource) => (
          <article key={resource.id} className="flex min-h-72 flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent p-5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-red-400/40">
            <div className="flex items-start justify-between gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/25 bg-red-950/40 text-red-200" aria-hidden="true">
                <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none"><path d="M7 3h12l6 6v20H7V3Z" stroke="currentColor" strokeWidth="2"/><path d="M19 3v7h6M11 17h10M11 22h10" stroke="currentColor" strokeWidth="2"/></svg>
              </span>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.12em] text-stone-400">{resource.page_count} pages</span>
            </div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.15em] text-red-300">{resource.document_category}</p>
            <h3 className="hero-title mt-2 text-xl font-bold leading-snug text-white">{resource.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-400">{resource.short_description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4 text-sm">
              <div><dt className="text-stone-500">Version</dt><dd className="mt-1 font-semibold text-stone-200">{resource.edition_or_version}</dd></div>
              <div><dt className="text-stone-500">Last reviewed</dt><dd className="mt-1 font-semibold text-stone-200">{formatDate(resource.last_reviewed)}</dd></div>
            </dl>
            <Link href={`/karate-refereeing/resources/${resource.slug}`} className="mt-auto pt-6 text-sm font-black uppercase tracking-[0.14em] text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400">
              Read document <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>

      {!total ? (
        <div className="mt-5 rounded-xl border border-dashed border-white/15 p-10 text-center text-stone-400">
          No published resources match this search. Try a broader topic or another category.
        </div>
      ) : null}

      {compact && filteredResources.length > visibleResources.length ? (
        <div className="mt-8 text-center">
          <Link className="inline-flex min-h-12 items-center justify-center rounded-md bg-red-600 px-6 text-sm font-bold uppercase tracking-[0.16em] text-white hover:bg-red-500" href="/karate-refereeing/resources">
            View all resources
          </Link>
        </div>
      ) : null}
    </div>
  );
}
