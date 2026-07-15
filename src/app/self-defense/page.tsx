import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Practical Self-Defense",
  description: "Practical self-defense training in Regina offered as a complementary program by Shotokan Karate Regina.",
  alternates: { canonical: "/self-defense" },
};

const benefits = ["Greater situational awareness", "Confidence under pressure", "Practical personal-safety skills", "Stronger decision-making", "Improved fitness and coordination", "Safe, controlled practice"];
const questions = [
  ["Do I need karate experience?", "No. The program is accessible to beginners, while experienced martial artists can develop additional practical applications."],
  ["Who can participate?", "Children, teenagers, and adults can benefit. Contact us so we can recommend the most appropriate training option for your age and experience."],
  ["Is the training safe?", "Yes. Skills are introduced progressively and practised in a respectful, controlled environment with professional supervision."],
  ["What should I wear?", "Comfortable athletic clothing is suitable for your first visit. We will explain any equipment or uniform requirements before ongoing training."],
  ["How do I get started?", "Use the registration button to begin enrollment, or contact the academy to discuss the program before your first visit."],
];

export default function SelfDefensePage() {
  return <><Navbar /><main className="pt-20">
    <section className="relative overflow-hidden bg-stone-950 py-20 sm:py-28"><div className="section-shell grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"><div><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">An additional Shotokan Karate Regina program</p><h1 className="hero-title mt-4 text-5xl font-bold leading-tight text-white sm:text-7xl">Practical Self-Defense</h1><p className="mt-6 max-w-2xl text-xl leading-8 text-stone-300">In addition to our professional Shotokan Karate program, we offer practical self-defense training designed to improve confidence, awareness, and personal safety.</p><div className="mt-8 flex flex-col gap-4 sm:flex-row"><ButtonLink href="/account">Register</ButtonLink><ButtonLink href="#self-defense-contact" variant="secondary">Contact</ButtonLink></div></div><div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl border border-white/10 shadow-2xl"><Image src="/images/self-defense.JPG" alt="Coach Reza Abbasi demonstrating practical martial arts training" fill priority className="object-cover" sizes="(min-width: 1024px) 38vw, 90vw" /></div></div></section>

    <section className="bg-black py-24"><div className="section-shell"><SectionHeading eyebrow="Program overview" title="Awareness, Confidence & Personal Safety">Self-defense is a valuable complement to professional Karate training. Sessions focus on useful principles that students can understand, practise safely, and apply to everyday personal-safety decisions.</SectionHeading><div className="grid gap-5 md:grid-cols-3">{benefits.map((benefit) => <article className="rounded-xl border border-white/10 bg-stone-950 p-6" key={benefit}><div className="h-1 w-12 bg-red-500" /><h2 className="mt-5 text-xl font-black text-white">{benefit}</h2></article>)}</div></div></section>

    <section className="bg-stone-950 py-24"><div className="section-shell grid gap-8 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 bg-black/35 p-7 sm:p-9"><p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">Training philosophy</p><h2 className="hero-title mt-4 text-3xl font-bold text-white sm:text-4xl">Practical, Responsible, Controlled</h2><p className="mt-5 leading-8 text-stone-300">Training begins with awareness, avoidance, boundaries, and sound decision-making. Physical skills are taught progressively in a safe and respectful setting. The goal is not aggression—it is helping students respond calmly, create safety, and seek help when needed.</p></article><article className="rounded-2xl border border-white/10 bg-black/35 p-7 sm:p-9"><p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">Who it is for</p><h2 className="hero-title mt-4 text-3xl font-bold text-white sm:text-4xl">Training for Everyday People</h2><p className="mt-5 leading-8 text-stone-300">The program can support children, teenagers, adults, complete beginners, and experienced martial artists. Instruction is adapted to age, ability, and experience so each student can learn with confidence.</p></article></div></section>

    <section className="bg-black py-24"><div className="section-shell"><SectionHeading eyebrow="Self-defense FAQ" title="Common Questions">Learn what to expect before your first self-defense session.</SectionHeading><div className="mx-auto max-w-4xl space-y-3">{questions.map(([question, answer]) => <article className="rounded-xl border border-white/10 bg-stone-950 p-6" key={question}><h2 className="text-lg font-black text-white">{question}</h2><p className="mt-3 leading-7 text-stone-300">{answer}</p></article>)}</div></div></section>

    <section id="self-defense-contact" className="bg-red-950/25 py-24 text-center"><div className="section-shell"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Take the next step</p><h2 className="hero-title mx-auto mt-4 max-w-3xl text-4xl font-bold text-white sm:text-5xl">Ask About Practical Self-Defense Training</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-stone-300">Register when you are ready, or contact Shotokan Karate Regina to find the right training option.</p><div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row"><ButtonLink href="/account">Register</ButtonLink><ButtonLink href="mailto:info@shotokan-karate-regina.com" variant="secondary">Contact</ButtonLink></div></div></section>
  </main><Footer /></>;
}
