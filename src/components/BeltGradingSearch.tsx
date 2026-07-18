"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { gradingLevels } from "@/data/belt-grading";

export function BeltGradingSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return gradingLevels;
    return gradingLevels.filter((level) => JSON.stringify(level).toLowerCase().includes(needle));
  }, [query]);

  return (
    <div>
      <label htmlFor="grading-search" className="text-sm font-bold text-white">Search the official syllabus</label>
      <input id="grading-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “Heian”, “mae geri”, “kumite”…" className="mt-3 min-h-12 w-full rounded-xl border border-white/15 bg-black px-4 text-white outline-none placeholder:text-stone-500 focus:border-red-400" />
      <p className="mt-3 text-sm text-stone-400" aria-live="polite">{results.length} grading {results.length === 1 ? "level" : "levels"} found</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((level) => <Link key={level.slug} href={`/belt-grading/${level.slug}`} className="rounded-xl border border-white/10 bg-white/[.04] p-4 transition hover:-translate-y-0.5 hover:border-red-400/50"><span className="text-xs font-black uppercase tracking-[.16em] text-red-300">{level.rank} · PDF page {level.page}</span><span className="mt-2 block font-bold text-white">{level.title}</span><span className="mt-2 block text-sm text-stone-400">{level.kata[0]}</span></Link>)}
      </div>
      {!results.length ? <p className="mt-5 rounded-xl border border-white/10 p-5 text-stone-300">No syllabus item matches that search.</p> : null}
    </div>
  );
}
