import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SimplifiedRegistrationForm } from "@/components/SimplifiedRegistrationForm";
import { publicPageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...publicPageMetadata({
    title: "Register for Karate Classes in Regina",
    description: "Complete the SHOTOKAN Karate Regina student registration and enrollment form for professional kids, teen, and adult karate classes in Regina, Saskatchewan.",
    path: "/register",
  }),
  robots: { index: true, follow: true },
};

export default function RegisterPage() { return <><Navbar /><main className="poster-theme min-h-screen bg-stone-950 pt-20"><section className="border-b border-white/10 bg-gradient-to-br from-black via-stone-950 to-red-950/30"><div className="section-shell py-12 text-center sm:py-16"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Register for class</p><h1 className="hero-title mt-4 text-4xl font-bold text-white sm:text-5xl">Student Registration &amp; Enrollment Form</h1><p className="mx-auto mt-4 max-w-3xl leading-7 text-stone-300">Thank you for your interest in SHOTOKAN Karate Regina. Please complete this registration form accurately. Required fields must be completed before submission.</p></div></section><section className="section-shell py-12 sm:py-16"><div className="mx-auto max-w-6xl"><SimplifiedRegistrationForm /></div></section></main><Footer /></> }
