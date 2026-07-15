import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-10">
      <div className="section-shell flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-full border border-red-400/40 bg-white">
            <Image
              src="/images/logo.PNG"
              alt="Shotokan Karate Regina logo"
              fill
              className="object-cover"
              sizes="48px"
            />
          </span>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
              Shotokan Karate Regina
            </p>
            <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
              A branch of Shotokan Karate Saskatoon
            </p>
          </div>
        </div>
        <div className="text-sm text-stone-500">
          <p>Copyright {new Date().getFullYear()} Shotokan Karate Regina. All rights reserved.</p>
          <nav className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-end" aria-label="Legal policies">
            <a className="hover:text-red-300" href="/privacy">Privacy</a><a className="hover:text-red-300" href="/liability-waiver">Liability Waiver</a><a className="hover:text-red-300" href="/refund-policy">Refund Policy</a><a className="hover:text-red-300" href="/photo-video-consent">Photo & Video Consent</a><a className="hover:text-red-300" href="/terms">Terms</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
