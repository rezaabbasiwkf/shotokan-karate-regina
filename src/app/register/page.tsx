import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SimplifiedRegistrationForm } from "@/components/SimplifiedRegistrationForm";

export const metadata: Metadata = { title: "Student Registration", description: "Register for SHOTOKAN Karate Regina training.", robots: { index: false, follow: false } };

export default function RegisterPage() { return <><Navbar /><main className="min-h-screen bg-stone-950 pt-20"><section className="section-shell py-12 sm:py-16"><div className="mx-auto max-w-5xl"><div className="mb-10 text-center"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Secure online registration</p><h1 className="hero-title mt-4 text-4xl font-bold text-white sm:text-5xl">Student Registration</h1><p className="mx-auto mt-4 max-w-2xl leading-7 text-stone-400">Complete the form below. Participants must be at least five years old; parent or guardian information appears automatically for minors.</p></div><SimplifiedRegistrationForm /></div></section></main><Footer /></> }
