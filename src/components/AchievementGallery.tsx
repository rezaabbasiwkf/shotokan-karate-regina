"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CoachAchievement } from "@/data/coach-achievements";

type FilterName =
  | "All"
  | "Youth"
  | "Junior"
  | "Adult"
  | "Kata"
  | "Kumite"
  | "Provincial"
  | "National"
  | "International"
  | "Gold Medal"
  | "Silver Medal"
  | "Bronze Medal"
  | "Certificates and Awards";

const filterOrder: FilterName[] = [
  "All",
  "Youth",
  "Junior",
  "Adult",
  "Kata",
  "Kumite",
  "Provincial",
  "National",
  "International",
  "Gold Medal",
  "Silver Medal",
  "Bronze Medal",
  "Certificates and Awards",
];

function matchesFilter(achievement: CoachAchievement, filter: FilterName) {
  if (filter === "All") return true;
  return (
    achievement.career_stage === filter ||
    achievement.category === filter ||
    achievement.competition_level === filter ||
    achievement.record_type === filter ||
    achievement.placement === filter
  );
}

function Detail({ label, value }: { label: string; value?: string | number }) {
  if (!value) return null;

  return (
    <div>
      <dt className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-stone-100">{value}</dd>
    </div>
  );
}

export function AchievementGallery({ achievements }: { achievements: CoachAchievement[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterName>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const filters = useMemo(
    () =>
      filterOrder.filter(
        (filter) =>
          filter === "All" || achievements.some((achievement) => matchesFilter(achievement, filter)),
      ),
    [achievements],
  );

  const filtered = useMemo(
    () => achievements.filter((achievement) => matchesFilter(achievement, activeFilter)),
    [achievements, activeFilter],
  );
  const selectedIndex = filtered.findIndex((achievement) => achievement.id === selectedId);
  const selected = selectedIndex >= 0 ? filtered[selectedIndex] : null;

  const close = () => {
    setSelectedId(null);
    setZoom(1);
  };

  const move = (direction: -1 | 1) => {
    if (filtered.length < 2 || selectedIndex < 0) return;
    const nextIndex = (selectedIndex + direction + filtered.length) % filtered.length;
    setSelectedId(filtered[nextIndex].id);
    setZoom(1);
  };

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  if (!achievements.length) {
    return (
      <div className="rounded-2xl border border-dashed border-red-400/35 bg-stone-950 px-6 py-16 text-center">
        <p className="mx-auto max-w-2xl text-lg leading-8 text-stone-300">
          Coach Reza Abbasi’s championship certificates and competitive achievements will be added
          to this page soon.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter achievement records">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            className={`min-h-11 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 ${
              activeFilter === filter
                ? "border-red-500 bg-red-600 text-white"
                : "border-white/15 bg-white/[0.04] text-stone-300 hover:border-red-400/50 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <p className="mb-5 text-sm text-stone-400" aria-live="polite">
        Showing {filtered.length} {filtered.length === 1 ? "record" : "records"}
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((achievement) => (
          <article
            key={achievement.id}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-stone-950 shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-1 hover:border-red-400/40"
          >
            <button
              type="button"
              onClick={() => setSelectedId(achievement.id)}
              className="block w-full cursor-zoom-in bg-white p-2 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-red-500"
              aria-label={`Enlarge ${achievement.title} certificate`}
            >
              <span className="relative block aspect-[19/13] overflow-hidden bg-white">
                <Image
                  src={achievement.certificate_image}
                  alt={achievement.certificate_alt}
                  fill
                  className="object-contain transition duration-300 group-hover:scale-[1.015]"
                  sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 100vw"
                />
              </span>
            </button>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {[achievement.career_stage, achievement.competition_level, achievement.placement].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-red-400/25 bg-red-950/35 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-red-200"
                    >
                      {tag}
                    </span>
                  ),
                )}
              </div>
              <h3 className="hero-title mt-4 text-xl font-bold leading-snug text-white">
                {achievement.title}
              </h3>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                <Detail label="Year" value={achievement.year} />
                <Detail label="Division" value={achievement.division} />
                {achievement.category !== "Not specified" ? (
                  <Detail label="Category" value={achievement.category} />
                ) : null}
                <Detail label="Location" value={achievement.location} />
              </dl>
              <p className="mt-4 text-sm leading-6 text-stone-400">{achievement.description}</p>
              <button
                type="button"
                onClick={() => setSelectedId(achievement.id)}
                className="mt-5 min-h-11 text-sm font-black uppercase tracking-[0.14em] text-red-300 transition hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-400"
              >
                Inspect certificate <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-2 sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="achievement-dialog-title"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) close();
          }}
        >
          <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-7xl flex-col overflow-hidden rounded-xl border border-white/15 bg-stone-950 shadow-2xl sm:max-h-[calc(100dvh-2.5rem)] lg:grid lg:grid-cols-[minmax(0,1fr)_23rem]">
            <div className="relative min-h-0 flex-1 overflow-auto bg-stone-900 p-2 sm:p-4 lg:h-[calc(100dvh-2.5rem)]">
              <div
                className="relative mx-auto aspect-[19/13] min-h-[18rem] max-h-full origin-top transition-transform duration-200"
                style={{ width: `${zoom * 100}%`, minWidth: "100%" }}
              >
                <Image
                  src={selected.certificate_image}
                  alt={selected.certificate_alt}
                  fill
                  priority
                  quality={95}
                  className="object-contain"
                  sizes="(min-width: 1024px) 75vw, 100vw"
                />
              </div>
            </div>

            <aside className="max-h-[46dvh] overflow-y-auto border-t border-white/10 p-4 sm:p-6 lg:max-h-none lg:border-l lg:border-t-0">
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-red-300">
                  Official record
                </p>
                <button
                  type="button"
                  onClick={close}
                  autoFocus
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-2xl text-white transition hover:border-red-400 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red-400"
                  aria-label="Close certificate viewer"
                >
                  ×
                </button>
              </div>
              <h2 id="achievement-dialog-title" className="hero-title mt-3 text-2xl font-bold text-white">
                {selected.title}
              </h2>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
                <Detail label="Year" value={selected.year} />
                <Detail label="Stage" value={selected.career_stage} />
                <Detail label="Division" value={selected.division} />
                {selected.category !== "Not specified" ? (
                  <Detail label="Category" value={selected.category} />
                ) : null}
                <Detail label="Placement" value={selected.placement} />
                <Detail label="Location" value={selected.location} />
                <Detail label="Organization" value={selected.organization} />
              </dl>
              <p className="mt-5 text-sm leading-6 text-stone-300">{selected.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.max(1, value - 0.25))}
                  disabled={zoom === 1}
                  className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Zoom out
                </button>
                <button
                  type="button"
                  onClick={() => setZoom((value) => Math.min(2, value + 0.25))}
                  disabled={zoom === 2}
                  className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Zoom in
                </button>
                <button
                  type="button"
                  onClick={() => move(-1)}
                  disabled={filtered.length < 2}
                  className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={() => move(1)}
                  disabled={filtered.length < 2}
                  className="min-h-11 rounded-md border border-white/15 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"
                >
                  Next →
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-stone-500">Zoom {Math.round(zoom * 100)}%</p>
            </aside>
          </div>
        </div>
      ) : null}
    </>
  );
}
