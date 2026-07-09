import Image from "next/image";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#classes", label: "Classes" },
  { href: "#coach", label: "Coach" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/76 backdrop-blur-xl">
      <nav className="section-shell flex min-h-20 items-center justify-between gap-6">
        <a className="flex items-center" href="#home" aria-label="Home">
          <span className="leading-tight">
            <span className="block text-sm font-black uppercase tracking-[0.2em] text-white">
              Shotokan
            </span>
            <span className="block text-xs uppercase tracking-[0.18em] text-stone-400">
              Karate Regina
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <a
              className="text-xs font-bold uppercase tracking-[0.18em] text-stone-300 transition hover:text-red-300"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          className="hidden rounded-md bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500 sm:inline-flex"
          href="#contact"
        >
          Join
        </a>
      </nav>
    </header>
  );
}
