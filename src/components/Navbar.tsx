"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#programs", label: "Classes" },
  { href: "/#about", label: "About" },
  { href: "/karate-knowledge-center", label: "Knowledge Center" },
  { href: "/account", label: "Register / Login" },
  { href: "/#events", label: "Events" },
  { href: "/after-school-program", label: "After School Program" },
  { href: "/#contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const closeMenu = () => setIsOpen(false);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/" && href === `/#${activeSection}`;
    }

    if (href === "/account") return pathname.startsWith("/account") || pathname === "/payment";

    if (href === "/karate-knowledge-center") return pathname.startsWith("/karate-knowledge-center") || pathname.startsWith("/karate-refereeing");
    return href === "/" ? pathname === "/" && !activeSection : pathname === href;
  };

  useEffect(() => {
    if (pathname !== "/") return;

    const sections = [document.getElementById("home"), ...navigationLinks
      .flatMap((link) =>
        link.href.startsWith("/#")
          ? [document.getElementById(link.href.slice(2))]
          : [],
      )]
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id === "home" ? "" : visible.target.id);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.01, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const linkClass =
    "relative flex min-h-11 items-center justify-center rounded-md px-2 py-2 text-center text-[0.6875rem] font-bold uppercase tracking-[0.11em] text-stone-300 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/5 hover:text-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400";

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <nav
        className="section-shell flex min-h-20 items-center justify-between gap-4"
        aria-label="Main navigation"
      >
        <Link
          className="flex min-w-0 shrink-0 items-center gap-3"
          href="/"
          aria-label="Shotokan Karate Regina home"
          onClick={closeMenu}
        >
          <span className="relative flex h-11 w-11 shrink-0 overflow-hidden rounded-full border border-red-400/40 bg-white sm:h-12 sm:w-12">
            <Image src="/images/logo.PNG" alt="" fill className="object-cover" sizes="48px" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-black uppercase tracking-[0.16em] text-white">Shotokan</span>
            <span className="block text-xs uppercase tracking-[0.14em] text-stone-400">Karate Regina</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-1 xl:flex">
          {navigationLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                className={`${linkClass} ${active ? "bg-white/5 text-red-300 after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-red-500" : ""}`}
                href={link.href}
                key={link.href}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/15 text-white transition duration-200 hover:border-red-400/60 hover:bg-white/5 hover:text-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 xl:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="relative h-5 w-6" aria-hidden="true">
            <span className={`absolute left-0 top-0.5 h-0.5 w-6 bg-current transition ${isOpen ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`absolute left-0 top-2.5 h-0.5 w-6 bg-current transition ${isOpen ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-[1.125rem] h-0.5 w-6 bg-current transition ${isOpen ? "-translate-y-2 -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {isOpen ? (
        <div id="mobile-navigation" className="border-t border-white/10 bg-stone-950/98 px-5 py-4 shadow-2xl shadow-black/50 xl:hidden">
          <div className="mx-auto grid max-w-2xl gap-1" role="menu">
            {navigationLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  className={`${linkClass} justify-start px-4 text-left text-xs ${active ? "bg-red-950/35 text-red-300" : ""}`}
                  href={link.href}
                  key={link.href}
                  role="menuitem"
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
