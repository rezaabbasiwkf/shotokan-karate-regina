"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ageFromDob } from "@/lib/client/registration-date";

const verifiedFormId = process.env.NEXT_PUBLIC_FORMSUBMIT_FORM_ID?.trim();
const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID?.trim();
const formEndpoint = formspreeId
  ? `https://formspree.io/f/${encodeURIComponent(formspreeId)}`
  : `https://formsubmit.co/ajax/${verifiedFormId ? encodeURIComponent(verifiedFormId) : "shotokan.karate.regina@gmail.com"}`;
const registrationUrl = "https://www.karateyqr.com/register";

const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-base text-white outline-none transition placeholder:text-stone-600 focus:border-red-400 focus:ring-2 focus:ring-red-500/20";
const sectionClass = "rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 sm:p-8";

function SectionTitle({ number, children }: { number: number; children: React.ReactNode }) {
  return <legend className="mb-6 w-full border-l-4 border-red-600 bg-black px-4 py-3 text-base font-black uppercase tracking-[.08em] text-white">Section {number}: {children}</legend>;
}

function ChoiceField({ label, name, choices = ["Yes", "No"], className = "" }: { label: string; name: string; choices?: string[]; className?: string }) {
  return <fieldset className={className}>
    <legend className="text-sm font-semibold text-stone-200">{label}</legend>
    <div className="mt-3 flex flex-wrap gap-3">
      {choices.map((choice) => <label key={choice} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-sm text-stone-200 has-checked:border-red-400 has-checked:bg-red-950/30">
        <input required type="radio" name={name} value={choice} className="h-5 w-5 accent-red-600" />{choice}
      </label>)}
    </div>
  </fieldset>;
}

export function SimplifiedRegistrationForm() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const birthDateRef = useRef<HTMLInputElement>(null);
  const age = useMemo(() => ageFromDob(dateOfBirth), [dateOfBirth]);
  const isMinor = age !== "" && Number(age) < 18;

  useEffect(() => {
    const today = new Date();
    birthDateRef.current?.setAttribute("max", `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`);
  }, []);

  useEffect(() => {
    if (status) {
      statusRef.current?.focus({ preventScroll: true });
      statusRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setBusy(true);
    setStatus(null);
    try {
      const formData = new FormData(form);
      const submittedAge = ageFromDob(String(formData.get("Date of Birth") || ""));
      if (!submittedAge) throw new Error("Please enter a valid date of birth that is not in the future.");
      if (Number(submittedAge) < 18 && ["Parent or Guardian Name", "Final Parent Guardian Name", "Parent Guardian Signature"].some((name) => !String(formData.get(name) || "").trim())) {
        throw new Error("A parent or guardian must complete their name and signature for participants under 18.");
      }
      formData.set("Age", submittedAge);
      if (!formData.has("Photo Video Permission")) formData.set("Photo Video Permission", "Not granted");
      formData.set("_url", registrationUrl);
      if (formspreeId) {
        formData.set("_gotcha", String(formData.get("_honey") || ""));
        formData.delete("_honey");
        formData.delete("_template");
        formData.delete("_url");
      }
      const fields: Record<string, string | string[]> = {};
      for (const [key, value] of formData.entries()) {
        if (typeof value !== "string") continue;
        const current = fields[key];
        if (current === undefined) fields[key] = value;
        else if (Array.isArray(current)) current.push(value);
        else fields[key] = [current, value];
      }
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: formspreeId ? { Accept: "application/json" } : { "Content-Type": "application/json", Accept: "application/json" },
        referrer: new URL("/register", window.location.origin).href,
        referrerPolicy: "no-referrer-when-downgrade",
        body: formspreeId ? formData : JSON.stringify(fields),
      });
      const responseText = await response.text();
      const result = (() => {
        try {
          const parsed = JSON.parse(responseText);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
          return parsed as { success?: string | boolean; ok?: boolean; message?: string; errors?: { message?: string }[] };
        } catch { return null; }
      })();
      if (!result) throw new Error("The registration service returned an unexpected response. Please try again or call 306-570-3125.");
      const accepted = formspreeId
        ? response.ok && result.ok !== false && !result.errors?.length
        : response.ok && (result.success === true || result.success === "true");
      if (!accepted) {
        if (/needs activation/i.test(result.message || "")) throw new Error("Online registration is temporarily unavailable. Please call 306-570-3125 to register.");
        throw new Error(result.errors?.map((item) => item.message).filter(Boolean).join(" ") || result.message || "Your registration could not be sent. Please try again or call 306-570-3125.");
      }
      form.reset();
      setDateOfBirth("");
      setStatus({ kind: "success", text: "Thank you. Your registration has been sent to SHOTOKAN Karate Regina. We will contact you about the next step." });
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof TypeError ? "The registration service could not be reached. Please try again or call 306-570-3125." : error instanceof Error ? error.message : "Your registration could not be sent. Please try again or call 306-570-3125." });
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="space-y-8">
    <input type="hidden" name="_subject" value="New Student Registration — SHOTOKAN Karate Regina" />
    <input type="hidden" name="_template" value="table" />
    <input type="text" name="_honey" className="absolute -left-[9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {status ? <div ref={statusRef} tabIndex={-1} role={status.kind === "error" ? "alert" : "status"} className={`scroll-mt-28 rounded-2xl border p-5 outline-none ${status.kind === "success" ? "border-green-500/40 bg-green-950/30 text-green-100" : "border-red-500/40 bg-red-950/30 text-red-100"}`}><p className="font-bold">{status.text}</p></div> : null}

    <div className="grid items-start gap-8 lg:grid-cols-2">
      <fieldset className={sectionClass}><SectionTitle number={1}>Personal Information</SectionTitle><div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-stone-200 sm:col-span-2">1. Full Name<input required name="Full Name" autoComplete="name" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">2. Date of Birth<input ref={birthDateRef} required name="Date of Birth" type="date" value={dateOfBirth} onInput={(event) => setDateOfBirth(event.currentTarget.value)} onChange={(event) => setDateOfBirth(event.target.value)} className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">3. Age<input name="Age" value={age} readOnly aria-live="polite" className={`${inputClass} cursor-not-allowed opacity-80`} /></label>
        <ChoiceField label="4. Gender" name="Gender" choices={["Male", "Female", "Prefer not to say"]} className="sm:col-span-2" />
        <label className="text-sm font-semibold text-stone-200">5. Phone Number<input required name="Phone Number" type="tel" autoComplete="tel" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">6. Email Address<input required name="email" type="email" autoComplete="email" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200 sm:col-span-2">7. Home Address<textarea required name="Home Address" autoComplete="street-address" rows={3} className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">8. Emergency Contact Name<input required name="Emergency Contact Name" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">9. Emergency Contact Phone<input required name="Emergency Contact Phone" type="tel" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200 sm:col-span-2">10. Parent/Guardian Name {isMinor ? <span className="text-red-300">(required for participants under 18)</span> : "(if under 18)"}<input required={isMinor} name="Parent or Guardian Name" className={inputClass} /></label>
      </div></fieldset>

      <div className="space-y-8">
        <fieldset className={sectionClass}><SectionTitle number={2}>Background Information</SectionTitle><div className="space-y-5">
          <ChoiceField label="11. Have you participated in similar programs before?" name="Participated in Similar Programs" />
          <label className="text-sm font-semibold text-stone-200">12. What motivated you to join this program?<textarea required name="Motivation for Joining" rows={3} className={inputClass} /></label>
          <label className="text-sm font-semibold text-stone-200">13. How did you hear about us?<textarea required name="How They Heard About Us" rows={2} className={inputClass} /></label>
        </div></fieldset>
        <fieldset className={sectionClass}><SectionTitle number={3}>Health &amp; Safety</SectionTitle><div className="space-y-5">
          <label className="text-sm font-semibold text-stone-200">14. Do you have any medical conditions, injuries, allergies, or physical limitations we should be aware of?<textarea required name="Medical Conditions Injuries Allergies or Limitations" rows={4} placeholder="Enter details or write None" className={inputClass} /></label>
          <label className="text-sm font-semibold text-stone-200">15. Are you currently taking any medication that may affect participation?<textarea required name="Medication Affecting Participation" rows={3} placeholder="Enter details or write No" className={inputClass} /></label>
        </div></fieldset>
      </div>
    </div>

    <fieldset className={sectionClass}><SectionTitle number={4}>Expectations</SectionTitle><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">16. What are your goals for joining this program?<textarea required name="Program Goals" rows={4} className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">17. What do you hope to achieve within the next 3–6 months?<textarea required name="Three to Six Month Goals" rows={4} className={inputClass} /></label>
      <ChoiceField label="18. Are you willing to attend classes regularly and follow program requirements?" name="Attendance and Program Commitment" className="md:col-span-2" />
    </div></fieldset>

    <fieldset className={sectionClass}><SectionTitle number={5}>Terms &amp; Conditions</SectionTitle><p className="mb-5 text-sm leading-6 text-stone-400">Please review our <Link href="/liability-waiver" target="_blank" className="text-red-300 underline">Liability Waiver</Link>, <Link href="/refund-policy" target="_blank" className="text-red-300 underline">Refund Policy</Link>, <Link href="/privacy" target="_blank" className="text-red-300 underline">Privacy Policy</Link>, and <Link href="/photo-video-consent" target="_blank" className="text-red-300 underline">Photo and Video Consent</Link>. Your form, including health information, will be transmitted by {formspreeId ? "Formspree" : "FormSubmit"} to the academy email address.</p><div className="grid gap-4 md:grid-cols-2">
      {[
        { name: "Information Accuracy", text: "I confirm that all information provided is accurate.", required: true },
        { name: "Physical Activity Risk", text: "I understand that participation involves physical activity and inherent risks.", required: true },
        { name: "Rules and Safety", text: "I agree to follow all rules and safety guidelines.", required: true },
        { name: "Emergency Treatment Authorization", text: "I authorize emergency medical treatment if necessary.", required: true },
        { name: "Photo Video Permission", text: "I grant permission for photos/videos to be used for promotional purposes. (Optional)", required: false },
        { name: "Refund Policy Agreement", text: "I understand registration fees are non-refundable unless otherwise stated.", required: true },
      ].map(({ name, text, required }) => <label key={name} className="flex gap-3 rounded-xl border border-white/10 p-4 text-sm leading-6 text-stone-200"><input required={required} name={name} value="Agreed" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-red-600" /><span>{text}</span></label>)}
    </div></fieldset>

    <fieldset className={sectionClass}>
      <legend className="mb-5 border-l-4 border-red-600 bg-black px-4 py-3 text-base font-black uppercase tracking-[.08em] text-white">Liability Waiver</legend>
      <p className="text-sm leading-6 text-stone-200">I voluntarily participate in this program and assume responsibility for associated risks.</p>
      <label className="mt-4 flex min-h-12 items-center gap-3 text-sm leading-6 text-stone-200"><input required name="Liability Waiver Agreement" value="Agreed" type="checkbox" className="h-5 w-5 shrink-0 accent-red-600" /><span>I have read and agree to the <Link href="/liability-waiver" target="_blank" className="text-red-300 underline">Liability Waiver</Link>.</span></label>
    </fieldset>

    <fieldset className={sectionClass}><legend className="mb-6 w-full border-l-4 border-red-600 bg-black px-4 py-3 text-base font-black uppercase tracking-[.08em] text-white">Final Consent</legend><p className="mb-5 text-sm leading-6 text-stone-400">Enter your full name in the signature field to sign this form electronically. A parent or guardian must also complete and sign this section for participants under 18.</p><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">Participant Name<input required name="Participant Name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">Participant Signature<input required name="Participant Signature" placeholder="Type full legal name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">Parent/Guardian Name {isMinor ? "(required)" : "(if applicable)"}<input required={isMinor} name="Final Parent Guardian Name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">Parent/Guardian Signature {isMinor ? "(required)" : "(if applicable)"}<input required={isMinor} name="Parent Guardian Signature" placeholder="Type full legal name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Date<input required name="Consent Date" type="date" className={inputClass} /></label>
    </div></fieldset>

    <button type="submit" disabled={busy} className="min-h-14 w-full rounded-xl bg-red-600 px-6 text-sm font-black uppercase tracking-[.14em] text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-60">{busy ? "Sending Registration…" : "Submit Registration"}</button>
  </form>;
}
