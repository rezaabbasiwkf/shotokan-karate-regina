"use client";

import { useRef, useState } from "react";

export function PdfReader({
  title,
  source,
  pageCount,
  allowDownload,
  allowPrint,
}: {
  title: string;
  source: string;
  pageCount: number;
  allowDownload: boolean;
  allowPrint: boolean;
}) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const readerRef = useRef<HTMLDivElement>(null);
  const viewerSource = `${source}#page=${page}&zoom=${zoom}&toolbar=0&navpanes=0`;

  async function enterFullScreen() {
    if (readerRef.current?.requestFullscreen) await readerRef.current.requestFullscreen();
  }

  function printDocument() {
    const frame = readerRef.current?.querySelector("iframe") as HTMLIFrameElement | null;
    frame?.contentWindow?.print();
  }

  return (
    <div ref={readerRef} className="overflow-hidden rounded-2xl border border-white/15 bg-stone-950 shadow-2xl shadow-black/35">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-black p-3" aria-label="PDF controls">
        <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page === 1} className="min-h-11 rounded-md border border-white/15 px-3 text-sm font-bold text-white disabled:opacity-35">← Previous</button>
        <label className="flex min-h-11 items-center gap-2 rounded-md border border-white/15 px-3 text-sm text-stone-300">
          Page
          <input aria-label="PDF page number" className="w-14 bg-transparent text-center font-bold text-white outline-none" type="number" min={1} max={pageCount} value={page} onChange={(event) => setPage(Math.min(pageCount, Math.max(1, Number(event.target.value) || 1)))} />
          of {pageCount}
        </label>
        <button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={page === pageCount} className="min-h-11 rounded-md border border-white/15 px-3 text-sm font-bold text-white disabled:opacity-35">Next →</button>
        <button type="button" onClick={() => setZoom((value) => Math.max(50, value - 25))} className="min-h-11 rounded-md border border-white/15 px-3 text-sm font-bold text-white" aria-label="Zoom PDF out">−</button>
        <span className="min-w-14 text-center text-sm text-stone-300">{zoom}%</span>
        <button type="button" onClick={() => setZoom((value) => Math.min(200, value + 25))} className="min-h-11 rounded-md border border-white/15 px-3 text-sm font-bold text-white" aria-label="Zoom PDF in">+</button>
        <button type="button" onClick={enterFullScreen} className="min-h-11 rounded-md border border-white/15 px-3 text-sm font-bold text-white">Full screen</button>
        {allowPrint ? <button type="button" onClick={printDocument} className="min-h-11 rounded-md border border-white/15 px-3 text-sm font-bold text-white">Print</button> : null}
        {allowDownload ? <a href={source} download className="inline-flex min-h-11 items-center rounded-md bg-red-600 px-3 text-sm font-bold text-white">Download</a> : null}
      </div>
      <iframe key={viewerSource} src={viewerSource} title={`${title} PDF reader`} className="h-[68dvh] min-h-[32rem] w-full bg-white" />
      <noscript><p className="p-5 text-stone-300">JavaScript is required for page and zoom controls.</p></noscript>
    </div>
  );
}
