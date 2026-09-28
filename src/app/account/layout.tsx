import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <><Navbar /><main className="min-h-screen bg-stone-950 pb-24 pt-28">{children}</main><Footer /></>;
}
