"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#programs", label: "Programs" },
  { href: "/#schedule", label: "Schedule" },
  { href: "/#coach", label: "Coach" },
  { href: "/#gallery", label: "Gallery" },
];

const secondaryLinks = [
  { href: "/self-defense", label: "Self-Defense" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const allLinks = [...primaryLinks, ...secondaryLinks];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const closeMenu = () => setIsOpen(false);
  const isActive = (href: string) => href === "/self-defense" ? pathname === href : pathname === "/" && (href === "/" ? !activeSection : href === `/#${activeSection}`);

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = allLinks.flatMap((link) => link.href.startsWith("/#") ? [document.getElementById(link.href.slice(2))] : []).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0.01, 0.2, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const linkClass = "rounded-md px-2 py-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-300 transition hover:bg-white/5 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav className="section-shell flex min-h-20 items-center justify-between gap-3" aria-label="Main navigation">
        <Link className="flex min-w-0 items-center gap-3" href="/" aria-label="Shotokan Karate Regina home" onClick={closeMenu}>
          <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-red-400/40 bg-white sm:h-12 sm:w-12">
            <Image src="/images/logo.PNG" alt="" fill className="object-cover" sizes="48px" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-black uppercase tracking-[0.16em] text-white">Shotokan</span>
            <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">Karate Regina</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {primaryLinks.map((link) => (
            <Link className={`${linkClass} ${isActive(link.href) ? "bg-white/5 text-red-300" : ""}`} href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <div className="relative">
            <button type="button" className={linkClass} aria-expanded={isMoreOpen} aria-haspopup="menu" onClick={() => setIsMoreOpen((open) => !open)}>
              More <span aria-hidden="true">⌄</span>
            </button>
            {isMoreOpen ? (
              <div className="absolute right-0 top-full mt-2 w-40 rounded-xl border border-white/10 bg-stone-950 p-2 shadow-2xl shadow-black/50" role="menu">
                {secondaryLinks.map((link) => <Link className={`block ${linkClass}`} href={link.href} key={link.href} role="menuitem" onClick={() => setIsMoreOpen(false)}>{link.label}</Link>)}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link className="inline-flex rounded-md bg-red-600 px-3 py-3 text-xs font-black uppercase tracking-[0.13em] text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-300 sm:px-4" href="/register" onClick={closeMenu}>
            Register
          </Link>
          <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-white transition hover:border-red-400/60 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 xl:hidden" aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={() => setIsOpen((open) => !open)}>
            <span className="text-xl" aria-hidden="true">{isOpen ? "×" : "☰"}</span>
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div id="mobile-navigation" className="border-t border-white/10 bg-stone-950/98 px-5 py-4 shadow-2xl shadow-black/50 xl:hidden">
          <div className="mx-auto grid max-w-2xl gap-1" role="menu">
            {allLinks.map((link) => <Link className={`min-h-12 ${linkClass} flex items-center`} href={link.href} key={link.href} role="menuitem" onClick={closeMenu}>{link.label}</Link>)}
            <Link className="mt-2 inline-flex min-h-12 items-center justify-center rounded-md bg-red-600 px-4 text-xs font-black uppercase tracking-[0.15em] text-white" href="/register" onClick={closeMenu}>Register now</Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
