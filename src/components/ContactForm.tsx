"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Website inquiry from ${form.get("name")}`);
    const body = encodeURIComponent(`Name: ${form.get("name")}\nEmail: ${form.get("email")}\n\n${form.get("message")}`);
    window.location.href = `mailto:info@shotokan-karate-regina.com?subject=${subject}&body=${body}`;
    setSent(true);
  };
  return <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-black/45 p-6 sm:p-8">
    <h3 className="text-2xl font-black uppercase text-white">Send an inquiry</h3>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <input required name="name" placeholder="Your name" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-red-400" />
      <input required type="email" name="email" placeholder="Email address" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-red-400" />
      <textarea required name="message" rows={5} placeholder="How can we help?" className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-red-400 sm:col-span-2" />
    </div>
    <button className="mt-5 rounded-md bg-red-600 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white hover:bg-red-500" type="submit">Send inquiry</button>
    {sent ? <p className="mt-3 text-sm text-stone-400">Your email app will open to send this message.</p> : null}
  </form>;
}
