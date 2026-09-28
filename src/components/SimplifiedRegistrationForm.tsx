"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const endpoint = "https://formsubmit.co/ajax/shotokan.karate.regina@gmail.com";
const inputClass = "mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-stone-600 focus:border-red-400 focus:ring-2 focus:ring-red-500/20";
const sectionClass = "rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 sm:p-8";

function ageFromDob(value: string) {
  if (!value) return "";
  const birth = new Date(`${value}T12:00:00`);
  if (Number.isNaN(birth.getTime()) || birth > new Date()) return "";
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return String(age);
}

function SectionTitle({ number, children }: { number: number; children: React.ReactNode }) {
  return <legend className="mb-6 w-full border-l-4 border-red-600 bg-black px-4 py-3 text-base font-black uppercase tracking-[.08em] text-white">Section {number}: {children}</legend>;
}

export function SimplifiedRegistrationForm() {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const age = useMemo(() => ageFromDob(dateOfBirth), [dateOfBirth]);
  const isMinor = age !== "" && Number(age) < 18;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    setBusy(true);
    setStatus(null);
    try {
      const response = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      const result = await response.json().catch(() => ({})) as { success?: string | boolean; message?: string };
      if (!response.ok || result.success === false || result.success === "false") throw new Error(result.message || "Your registration could not be sent. Please try again or call 306-570-3125.");
      form.reset();
      setDateOfBirth("");
      setStatus({ kind: "success", text: "Thank you. Your registration has been sent to SHOTOKAN Karate Regina. We will contact you about the next step." });
      window.scrollTo({ top: form.offsetTop - 110, behavior: "smooth" });
    } catch (error) {
      setStatus({ kind: "error", text: error instanceof Error ? error.message : "Your registration could not be sent. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="space-y-8">
    <input type="hidden" name="_subject" value="New Student Registration — SHOTOKAN Karate Regina" />
    <input type="hidden" name="_template" value="table" />
    <input type="text" name="_honey" className="absolute -left-[9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {status ? <div role="status" className={`rounded-2xl border p-5 ${status.kind === "success" ? "border-green-500/40 bg-green-950/30 text-green-100" : "border-red-500/40 bg-red-950/30 text-red-100"}`}><p className="font-bold">{status.text}</p></div> : null}

    <div className="grid items-start gap-8 lg:grid-cols-2">
      <fieldset className={sectionClass}><SectionTitle number={1}>Personal Information</SectionTitle><div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-stone-200 sm:col-span-2">1. Full Name<input required name="Full Name" autoComplete="name" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">2. Date of Birth<input required name="Date of Birth" type="date" value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">3. Age<input name="Age" value={age} readOnly aria-live="polite" className={`${inputClass} cursor-not-allowed opacity-80`} /></label>
        <label className="text-sm font-semibold text-stone-200 sm:col-span-2">4. Gender<select required name="Gender" defaultValue="" className={inputClass}><option value="" disabled className="text-black">Select one</option><option className="text-black">Male</option><option className="text-black">Female</option><option className="text-black">Prefer not to say</option></select></label>
        <label className="text-sm font-semibold text-stone-200">5. Phone Number<input required name="Phone Number" type="tel" autoComplete="tel" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">6. Email Address<input required name="email" type="email" autoComplete="email" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200 sm:col-span-2">7. Home Address<textarea required name="Home Address" autoComplete="street-address" rows={3} className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">8. Emergency Contact Name<input required name="Emergency Contact Name" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200">9. Emergency Contact Phone<input required name="Emergency Contact Phone" type="tel" className={inputClass} /></label>
        <label className="text-sm font-semibold text-stone-200 sm:col-span-2">10. Parent/Guardian Name {isMinor ? <span className="text-red-300">(required for participants under 18)</span> : "(if under 18)"}<input required={isMinor} name="Parent or Guardian Name" className={inputClass} /></label>
      </div></fieldset>

      <div className="space-y-8">
        <fieldset className={sectionClass}><SectionTitle number={2}>Background Information</SectionTitle><div className="space-y-5">
          <label className="text-sm font-semibold text-stone-200">11. Have you participated in similar programs before?<select required name="Participated in Similar Programs" defaultValue="" className={inputClass}><option value="" disabled className="text-black">Select one</option><option className="text-black">Yes</option><option className="text-black">No</option></select></label>
          <label className="text-sm font-semibold text-stone-200">12. What motivated you to join this program?<textarea required name="Motivation for Joining" rows={3} className={inputClass} /></label>
          <label className="text-sm font-semibold text-stone-200">13. How did you hear about us?<textarea required name="How They Heard About Us" rows={2} className={inputClass} /></label>
        </div></fieldset>
        <fieldset className={sectionClass}><SectionTitle number={3}>Health &amp; Safety</SectionTitle><div className="space-y-5">
          <label className="text-sm font-semibold text-stone-200">14. Medical conditions, injuries, allergies, or physical limitations we should know about?<textarea required name="Medical Conditions Injuries Allergies or Limitations" rows={4} placeholder="Enter details or write None" className={inputClass} /></label>
          <label className="text-sm font-semibold text-stone-200">15. Are you currently taking medication that may affect participation?<textarea required name="Medication Affecting Participation" rows={3} placeholder="Enter details or write No" className={inputClass} /></label>
        </div></fieldset>
      </div>
    </div>

    <fieldset className={sectionClass}><SectionTitle number={4}>Expectations</SectionTitle><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">16. What are your goals for joining this program?<textarea required name="Program Goals" rows={4} className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">17. What do you hope to achieve within the next 3–6 months?<textarea required name="Three to Six Month Goals" rows={4} className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">18. Are you willing to attend classes regularly and follow program requirements?<select required name="Attendance and Program Commitment" defaultValue="" className={inputClass}><option value="" disabled className="text-black">Select one</option><option className="text-black">Yes</option><option className="text-black">No</option></select></label>
    </div></fieldset>

    <fieldset className={sectionClass}><SectionTitle number={5}>Terms &amp; Conditions</SectionTitle><p className="mb-5 text-sm leading-6 text-stone-400">Please review our <Link href="/liability-waiver" target="_blank" className="text-red-300 underline">Liability Waiver</Link>, <Link href="/refund-policy" target="_blank" className="text-red-300 underline">Refund Policy</Link>, <Link href="/privacy" target="_blank" className="text-red-300 underline">Privacy Policy</Link>, and <Link href="/photo-video-consent" target="_blank" className="text-red-300 underline">Photo and Video Consent</Link>. Your form, including health information, will be transmitted by FormSubmit to the academy email address.</p><div className="grid gap-4 md:grid-cols-2">
      {[
        { name: "Information Accuracy", text: "I confirm that all information provided is accurate.", required: true },
        { name: "Physical Activity Risk", text: "I understand that participation involves physical activity and inherent risks.", required: true },
        { name: "Rules and Safety", text: "I agree to follow all rules and safety guidelines.", required: true },
        { name: "Emergency Treatment Authorization", text: "I authorize emergency medical treatment if necessary.", required: true },
        { name: "Photo Video Permission", text: "I grant permission for photos/videos to be used for promotional purposes. (Optional)", required: false },
        { name: "Refund Policy Agreement", text: "I understand registration fees are non-refundable unless otherwise stated.", required: true },
        { name: "Liability Waiver Agreement", text: "I voluntarily participate and assume responsibility for associated risks. I have read and agree to the Liability Waiver.", required: true },
      ].map(({ name, text, required }) => <label key={name} className="flex gap-3 rounded-xl border border-white/10 p-4 text-sm leading-6 text-stone-200"><input required={required} name={name} value="Agreed" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-red-600" /><span>{text}</span></label>)}
    </div></fieldset>

    <fieldset className={sectionClass}><legend className="mb-6 w-full border-l-4 border-red-600 bg-black px-4 py-3 text-base font-black uppercase tracking-[.08em] text-white">Final Consent</legend><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">Participant Name<input required name="Participant Name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">Participant Signature<input required name="Participant Signature" placeholder="Type full legal name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">Parent/Guardian Name {isMinor ? "(required)" : "(if applicable)"}<input required={isMinor} name="Final Parent Guardian Name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200">Parent/Guardian Signature {isMinor ? "(required)" : "(if applicable)"}<input required={isMinor} name="Parent Guardian Signature" placeholder="Type full legal name" className={inputClass} /></label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Date<input required name="Consent Date" type="date" className={inputClass} /></label>
    </div></fieldset>

    <button type="submit" disabled={busy} className="min-h-14 w-full rounded-xl bg-red-600 px-6 text-sm font-black uppercase tracking-[.14em] text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500 disabled:cursor-wait disabled:opacity-60">{busy ? "Sending Registration…" : "Submit Registration"}</button>
  </form>;
}
