"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CoachCertification, CertificationCategory, CertificationScope } from "@/data/coach-certifications";

type Filter = "All Certifications" | CertificationCategory | CertificationScope;
const filtersInOrder: Filter[] = ["All Certifications", "Instructor", "Coaching", "Referee", "Federation", "Professional Development", "International", "National", "Provincial", "Regional", "Club"];

function matches(item: CoachCertification, filter: Filter) {
  return filter === "All Certifications" || item.category === filter || item.scope === filter;
}

function Meta({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div><dt className="text-[.65rem] font-black uppercase tracking-[.16em] text-stone-500">{label}</dt><dd className="mt-1 text-sm font-semibold text-stone-100">{value}</dd></div>;
}

export function CertificationGallery({ certifications }: { certifications: CoachCertification[] }) {
  const [filter, setFilter] = useState<Filter>("All Certifications");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const shown = useMemo(() => certifications.filter((item) => matches(item, filter)), [certifications, filter]);
  const filters = filtersInOrder.filter((name) => name === "All Certifications" || certifications.some((item) => matches(item, name)));
  const index = shown.findIndex((item) => item.id === selectedId);
  const selected = index < 0 ? null : shown[index];
  const close = () => { setSelectedId(null); setZoom(1); };
  const move = (direction: -1 | 1) => {
    if (index < 0 || shown.length < 2) return;
    setSelectedId(shown[(index + direction + shown.length) % shown.length].id);
    setZoom(1);
  };

  useEffect(() => {
    if (!selected) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    addEventListener("keydown", key);
    return () => { document.body.style.overflow = overflow; removeEventListener("keydown", key); };
  });

  return <>
    <div className="mb-8 flex flex-wrap gap-2" aria-label="Certification filters">
      {filters.map((name) => <button key={name} type="button" onClick={() => setFilter(name)} aria-pressed={filter === name} className={`min-h-11 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[.1em] ${filter === name ? "border-red-500 bg-red-600 text-white" : "border-white/15 bg-white/[.04] text-stone-300 hover:border-red-400/50"}`}>{name}</button>)}
    </div>
    <p className="mb-5 text-sm text-stone-400" aria-live="polite">Showing {shown.length} {shown.length === 1 ? "certification" : "certifications"}</p>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {shown.map((item) => <article key={item.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-stone-950 shadow-xl shadow-black/25 transition hover:-translate-y-1 hover:border-red-400/40">
        <button type="button" onClick={() => setSelectedId(item.id)} className="block w-full bg-white p-2" aria-label={`View certificate: ${item.englishTitle}`}>
          <span className="relative block aspect-[4/3] overflow-hidden bg-white"><Image src={item.certificateImage} alt={item.certificateAlt} fill className="object-contain transition group-hover:scale-[1.01]" sizes="(min-width:1024px) 33vw,(min-width:768px) 50vw,100vw" /></span>
        </button>
        <div className="p-5">
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-red-950 px-2.5 py-1 text-[.65rem] font-black uppercase tracking-wider text-red-200">{item.category}</span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[.65rem] font-black uppercase tracking-wider text-stone-300">{item.scope}</span>{item.featured && <span className="rounded-full bg-amber-400/15 px-2.5 py-1 text-[.65rem] font-black uppercase tracking-wider text-amber-200">Featured</span>}</div>
          <h3 className="hero-title mt-4 text-xl font-bold leading-snug text-white">{item.englishTitle}</h3>
          <p className="mt-2 text-sm font-semibold text-stone-300">{item.issuingOrganization}</p>
          <dl className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4"><Meta label="Type" value={item.certificateType} /><Meta label="Level" value={item.certificationLevel} /><Meta label="Year" value={item.gregorianDate || item.issueDate} /><Meta label="Country" value={item.country} /></dl>
          <button type="button" onClick={() => setSelectedId(item.id)} className="mt-5 min-h-11 text-sm font-black uppercase tracking-[.12em] text-red-300 hover:text-red-200">View Certificate →</button>
        </div>
      </article>)}
    </div>

    {selected && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 sm:p-5" role="dialog" aria-modal="true" aria-labelledby="certification-title" onMouseDown={(event) => event.currentTarget === event.target && close()}>
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-white/15 bg-stone-950 lg:grid lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-h-0 flex-1 overflow-auto bg-stone-900 p-3 lg:h-[calc(100dvh-2.5rem)]"><div className="relative mx-auto min-h-[70vh] origin-top" style={{ width: `${zoom * 100}%`, minWidth: "100%" }}><Image src={selected.certificateImage} alt={selected.certificateAlt} fill priority quality={95} className="object-contain" sizes="75vw" /></div></div>
        <aside className="max-h-[48dvh] overflow-y-auto border-t border-white/10 p-5 lg:max-h-none lg:border-l lg:border-t-0">
          <div className="flex items-start justify-between gap-4"><p className="text-xs font-black uppercase tracking-[.2em] text-red-300">Verified professional credential</p><button type="button" onClick={close} className="h-11 w-11 shrink-0 rounded-full border border-white/20 text-2xl text-white" aria-label="Close">×</button></div>
          <h2 id="certification-title" className="hero-title mt-3 text-2xl font-bold text-white">{selected.englishTitle}</h2>
          <div className="mt-4 rounded-lg border border-white/10 bg-white/[.04] p-3"><p className="text-[.65rem] font-black uppercase tracking-wider text-stone-500">Original title · {selected.certificateLanguage}</p><p dir="rtl" className="mt-2 text-stone-200">{selected.originalTitle}</p></div>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-5"><Meta label="Organization" value={selected.issuingOrganization} /><Meta label="Type" value={selected.certificateType} /><Meta label="Level" value={selected.certificationLevel} /><Meta label="Original date" value={selected.issueDate} /><Meta label="Gregorian date" value={selected.gregorianDate} /><Meta label="Expiry" value={selected.expiryDate} /><Meta label="Scope" value={selected.scope} /><Meta label="Location" value={[selected.city, selected.province, selected.country].filter(Boolean).join(", ")} /></dl>
          <p className="mt-5 text-sm leading-6 text-stone-300">{selected.englishDescription}</p>
          <div className="mt-6 grid grid-cols-2 gap-2"><button type="button" onClick={() => setZoom((z) => Math.max(1, z - .25))} disabled={zoom === 1} className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white disabled:opacity-35">Zoom out</button><button type="button" onClick={() => setZoom((z) => Math.min(2.5, z + .25))} disabled={zoom === 2.5} className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white disabled:opacity-35">Zoom in</button><button type="button" onClick={() => move(-1)} className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white">← Previous</button><button type="button" onClick={() => move(1)} className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white">Next →</button><button type="button" onClick={() => document.documentElement.requestFullscreen?.()} className="col-span-2 min-h-11 rounded-md border border-white/15 text-sm font-bold text-white">Full screen</button></div>
        </aside>
      </div>
    </div>}
  </>;
}
