"use client";

import Link from "next/link";
import { useState } from "react";
import { portalFetch } from "@/lib/client/portal-fetch";
import { safelyReadJson } from "@/lib/client/safe-json";

type Mode = "create" | "login";
type Message = { type: "error" | "success"; text: string } | null;
const input = "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-stone-500 focus:border-red-400";

export function AccountAccess({ next }: { next?: string }) {
  const [mode, setMode] = useState<Mode>("create");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<Message>(null);
  const [busy, setBusy] = useState(false);
  const strength = [password.length >= 12, /[A-Z]/.test(password), /[a-z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  const error = (name: string) => errors[name] ? <p id={`${name}-error`} className="mt-2 text-sm font-semibold text-red-300">{errors[name]}</p> : null;
  const fieldClass = (name: string) => `${input} ${errors[name] ? "border-red-400" : ""}`;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setErrors({}); setMessage(null);
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    if (mode === "login") payload.next = next || "/account/dashboard";
    try {
      const response = await portalFetch(mode === "create" ? "/api/auth/signup" : "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await safelyReadJson<{ message?: string; fieldErrors?: Record<string, string>; nextUrl?: string }>(response);
      if (!response.ok) { setErrors(data.fieldErrors || {}); throw new Error(data.message || "The request could not be completed."); }
      window.location.assign(data.nextUrl || "/account/dashboard");
    } catch (caught) { setMessage({ type: "error", text: caught instanceof Error ? caught.message : "The request could not be completed." }); }
    finally { setBusy(false); }
  }

  return <div className="mx-auto max-w-5xl">
    <div className="mb-8 text-center"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Secure family portal</p><h1 className="hero-title mt-4 text-4xl font-bold text-white sm:text-6xl">Register / Login</h1><p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-stone-300">Create one family account to manage students, enrollments, payment status, and trial-class requests.</p></div>
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="rounded-3xl border border-white/10 bg-black/45 p-6 shadow-2xl shadow-black/30 sm:p-9">
        <div className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
          <button type="button" className={`min-h-12 rounded-lg text-sm font-black uppercase tracking-[0.12em] transition ${mode === "create" ? "bg-red-600 text-white" : "text-stone-300 hover:text-white"}`} onClick={() => { setMode("create"); setErrors({}); setMessage(null); }}>Create an Account</button>
          <button type="button" className={`min-h-12 rounded-lg text-sm font-black uppercase tracking-[0.12em] transition ${mode === "login" ? "bg-red-600 text-white" : "text-stone-300 hover:text-white"}`} onClick={() => { setMode("login"); setErrors({}); setMessage(null); }}>Log In</button>
        </div>
        {mode === "create" ? <p className="mt-6 rounded-xl border border-red-400/20 bg-red-950/20 p-4 text-sm leading-7 text-red-100"><strong>Account holder:</strong> If the student is under 18, the account must be created by a parent or legal guardian. Adult students may create their own account.</p> : null}
        {message ? <div role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{message.text}</div> : null}
        {Object.keys(errors).length ? <div role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100"><p className="font-bold">Please correct these fields:</p><ul className="mt-2 list-disc space-y-1 pl-5">{Object.values(errors).map((item) => <li key={item}>{item}</li>)}</ul></div> : null}
        <form className="mt-6 grid gap-5 sm:grid-cols-2" onSubmit={submit} noValidate>
          {mode === "create" ? <>
            <label className="text-sm font-semibold text-stone-200">First name<input name="firstName" autoComplete="given-name" className={fieldClass("firstName")} aria-invalid={Boolean(errors.firstName)} />{error("firstName")}</label>
            <label className="text-sm font-semibold text-stone-200">Last name<input name="lastName" autoComplete="family-name" className={fieldClass("lastName")} aria-invalid={Boolean(errors.lastName)} />{error("lastName")}</label>
          </> : null}
          <label className="text-sm font-semibold text-stone-200 sm:col-span-2">Email address <span className="font-normal text-stone-400">(your login username)</span><input name="email" type="email" autoComplete="email" className={fieldClass("email")} aria-invalid={Boolean(errors.email)} />{error("email")}</label>
          {mode === "create" ? <>
            <label className="text-sm font-semibold text-stone-200 sm:col-span-2">Mobile phone number<input name="phone" inputMode="tel" autoComplete="tel" className={fieldClass("phone")} aria-invalid={Boolean(errors.phone)} />{error("phone")}</label>
            <label className="text-sm font-semibold text-stone-200 sm:col-span-2">Complete home address<input name="homeAddress" autoComplete="street-address" className={fieldClass("homeAddress")} aria-invalid={Boolean(errors.homeAddress)} />{error("homeAddress")}</label>
          </> : null}
          <label className="text-sm font-semibold text-stone-200 sm:col-span-2">Password<div className="relative"><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "create" ? "new-password" : "current-password"} value={mode === "create" ? password : undefined} onChange={mode === "create" ? (event) => setPassword(event.target.value) : undefined} className={`${fieldClass("password")} pr-20`} aria-invalid={Boolean(errors.password)} /><button type="button" className="absolute right-3 top-1/2 mt-1 -translate-y-1/2 text-xs font-bold text-red-200" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button></div>{error("password")}</label>
          {mode === "create" ? <>
            <div className="sm:col-span-2"><div className="flex gap-2" aria-label={`Password strength ${strength} of 5`}>{[1,2,3,4,5].map((level) => <span className={`h-1.5 flex-1 rounded-full ${strength >= level ? "bg-red-500" : "bg-white/10"}`} key={level} />)}</div><ul className="mt-3 grid gap-x-5 text-xs leading-6 text-stone-400 sm:grid-cols-2"><li>At least 12 characters</li><li>One uppercase letter</li><li>One lowercase letter</li><li>One number</li><li>One special character</li></ul></div>
            <label className="text-sm font-semibold text-stone-200 sm:col-span-2">Confirm password<input name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" className={fieldClass("confirmPassword")} aria-invalid={Boolean(errors.confirmPassword)} />{error("confirmPassword")}</label>
            <div className="sm:col-span-2"><h2 className="text-xl font-black text-white">Emergency Contact</h2><p className="mt-1 text-sm text-stone-400">Use someone other than the primary account holder whenever possible.</p></div>
            <label className="text-sm font-semibold text-stone-200 sm:col-span-2">Emergency contact full name<input name="emergencyName" className={fieldClass("emergencyName")} aria-invalid={Boolean(errors.emergencyName)} />{error("emergencyName")}</label>
            <label className="text-sm font-semibold text-stone-200">Emergency phone<input name="emergencyPhone" inputMode="tel" className={fieldClass("emergencyPhone")} aria-invalid={Boolean(errors.emergencyPhone)} />{error("emergencyPhone")}</label>
            <label className="text-sm font-semibold text-stone-200">Relationship to student<input name="emergencyRelationship" className={fieldClass("emergencyRelationship")} aria-invalid={Boolean(errors.emergencyRelationship)} />{error("emergencyRelationship")}</label>
            <label className={`flex gap-3 rounded-xl border p-4 text-sm text-stone-200 sm:col-span-2 ${errors.acceptPrivacy ? "border-red-400" : "border-white/10"}`}><input name="acceptPrivacy" value="yes" type="checkbox" className="mt-1 h-4 w-4" /><span>I agree to the <Link className="text-red-300 underline" href="/privacy">Privacy Policy</Link> and <Link className="text-red-300 underline" href="/terms">Terms of Service</Link>.</span></label>{error("acceptPrivacy")}
            <input name="website" className="absolute left-[-9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          </> : null}
          <button disabled={busy} className="min-h-13 rounded-md bg-red-600 px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-red-500 disabled:opacity-60 sm:col-span-2">{busy ? "Please wait…" : mode === "create" ? "Create an Account" : "Log In"}</button>
        </form>
        {mode === "login" ? <p className="mt-5 text-center text-sm"><Link className="text-red-300 hover:text-red-200" href="/forgot-password">Forgot Password?</Link></p> : null}
      </section>
      <aside className="rounded-3xl border border-red-400/20 bg-gradient-to-br from-red-950/40 to-black/40 p-7 sm:p-9"><p className="text-xs font-black uppercase tracking-[0.24em] text-red-300">New to the academy?</p><h2 className="hero-title mt-4 text-3xl font-bold text-white">Register or Try a Class</h2><p className="mt-4 leading-7 text-stone-300">Use the streamlined student form without creating an account, or request a trial class with no payment.</p><Link href="/register" className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-red-600 px-5 text-center text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-500">Student Registration</Link><Link href="/trial-class" className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-md border border-white/20 px-5 text-center text-sm font-black uppercase tracking-[0.12em] text-white transition hover:border-red-300 hover:bg-white/5">Request a Trial Class</Link></aside>
    </div>
  </div>;
}
