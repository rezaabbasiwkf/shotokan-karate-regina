"use client";

import Image from "next/image";
import { useState } from "react";

const photos = [
  { src: "/images/hero-group-straight.jpg", alt: "Shotokan Karate Regina group training photo", label: "Shotokan community" },
  { src: "/images/class.jpg", alt: "Shotokan Karate Regina training session", label: "Training session" },
  { src: "/images/coach.JPG", alt: "Coach Reza Abbasi", label: "Coach Reza Abbasi" },
];

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null);
  return <>
    <div className="grid gap-5 md:grid-cols-3">{photos.map((photo, index) => (
      <button type="button" className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 text-left shadow-xl shadow-black/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400" key={photo.src} onClick={() => setSelected(index)}>
        <Image src={photo.src} alt={photo.alt} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 100vw" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-12 text-sm font-black uppercase tracking-[0.14em] text-white">{photo.label}</span>
      </button>
    ))}</div>
    {selected !== null ? <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-5" role="dialog" aria-modal="true" aria-label="Expanded gallery image" onClick={() => setSelected(null)}>
      <button type="button" className="absolute right-5 top-5 rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-white" onClick={() => setSelected(null)}>Close</button>
      <div className="relative h-[80vh] w-full max-w-6xl" onClick={(event) => event.stopPropagation()}><Image src={photos[selected].src} alt={photos[selected].alt} fill className="object-contain" sizes="100vw" /></div>
    </div> : null}
  </>;
}
