"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { portalFetch } from "@/lib/client/portal-fetch";
import { safelyReadJson } from "@/lib/client/safe-json";

type ApiResult = { success?: boolean; message?: string; fieldErrors?: Record<string, string>; registrationReference?: string; paymentUrl?: string; errorReference?: string };

function ageFromDob(value: string) {
  if (!value) return null;
  const birth = new Date(`${value}T12:00:00Z`), today = new Date();
  if (Number.isNaN(birth.getTime())) return null;
  let age = today.getUTCFullYear() - birth.getUTCFullYear();
  if (today.getUTCMonth() < birth.getUTCMonth() || (today.getUTCMonth() === birth.getUTCMonth() && today.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age;
}

const inputClass = "mt-2 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

export function SimplifiedRegistrationForm() {
  const submissionId = useRef(crypto.randomUUID());
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [medical, setMedical] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const age = ageFromDob(dateOfBirth), isMinor = age !== null && age < 18;
  const error = (name: string) => errors[name] ? <p id={`${name}-error`} className="mt-2 text-sm text-red-300">{errors[name]}</p> : null;
  const props = (name: string) => ({ className: `${inputClass} ${errors[name] ? "border-red-400" : ""}`, "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setErrors({}); setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries()) as Record<string, FormDataEntryValue | boolean>;
    for (const name of ["informationConfirmed", "riskAcknowledged", "rulesAccepted", "emergencyTreatmentAuthorized", "mediaPermission", "refundPolicyAccepted", "liabilityWaiverAccepted"]) payload[name] = form.has(name);
    payload.attendanceCommitment = form.get("attendanceCommitment") === "Yes";
    payload.submissionId = submissionId.current;
    try {
      const response = await portalFetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await safelyReadJson<ApiResult>(response);
      if (!response.ok || !result.success) {
        setErrors(result.fieldErrors || {});
        const first = Object.keys(result.fieldErrors || {})[0];
        if (first) document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
        throw new Error(result.message || (result.errorReference ? `Registration could not be completed. Error reference: ${result.errorReference}` : "Registration could not be completed."));
      }
      window.location.assign(result.paymentUrl || `/payment?reference=${encodeURIComponent(result.registrationReference || "")}`);
    } catch (caught) {
      setMessage(caught instanceof Error ? caught.message : "Registration could not be completed.");
      setBusy(false);
    }
  }

  return <form onSubmit={submit} noValidate className="space-y-8">
    {(message || Object.keys(errors).length > 0) && <div role="alert" tabIndex={-1} className="rounded-2xl border border-red-400/40 bg-red-950/35 p-5 text-red-100"><p className="font-bold">{message || "Please correct the highlighted fields."}</p>{Object.values(errors).length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{Object.values(errors).map((item) => <li key={item}>{item}</li>)}</ul>}</div>}
    <input className="absolute -left-[9999px]" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

    <fieldset className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-8"><legend className="px-3 text-xl font-black text-white">Personal Information</legend><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">Full Name<input name="fullName" autoComplete="name" {...props("fullName")} />{error("fullName")}</label>
      <label className="text-sm font-semibold text-stone-200">Date of Birth<input name="dateOfBirth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} {...props("dateOfBirth")} />{error("dateOfBirth")}</label>
      <label className="text-sm font-semibold text-stone-200">Gender<select name="gender" defaultValue="" {...props("gender")}><option value="" className="text-black">Select one</option><option className="text-black">Female</option><option className="text-black">Male</option><option className="text-black">Non-binary</option><option className="text-black">Prefer not to say</option></select>{error("gender")}</label>
      <label className="text-sm font-semibold text-stone-200">Phone Number<input name="phone" type="tel" autoComplete="tel" {...props("phone")} />{error("phone")}</label>
      <label className="text-sm font-semibold text-stone-200">Email Address<input name="email" type="email" autoComplete="email" {...props("email")} />{error("email")}</label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Home Address<textarea name="homeAddress" autoComplete="street-address" rows={3} {...props("homeAddress")} />{error("homeAddress")}</label>
      <label className="text-sm font-semibold text-stone-200">Emergency Contact Name<input name="emergencyContactName" {...props("emergencyContactName")} />{error("emergencyContactName")}</label>
      <label className="text-sm font-semibold text-stone-200">Emergency Contact Phone<input name="emergencyContactPhone" type="tel" {...props("emergencyContactPhone")} />{error("emergencyContactPhone")}</label>
    </div></fieldset>

    {isMinor && <fieldset className="rounded-3xl border border-red-500/20 bg-red-950/15 p-5 sm:p-8"><legend className="px-3 text-xl font-black text-white">Parent or Guardian Information</legend><p className="mb-5 text-sm leading-6 text-stone-400">Required because the participant is under 18.</p><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Parent/Guardian Full Name<input name="guardianName" {...props("guardianName")} />{error("guardianName")}</label>
      <label className="text-sm font-semibold text-stone-200">Parent/Guardian Phone<input name="guardianPhone" type="tel" {...props("guardianPhone")} />{error("guardianPhone")}</label>
      <label className="text-sm font-semibold text-stone-200">Parent/Guardian Email<input name="guardianEmail" type="email" {...props("guardianEmail")} />{error("guardianEmail")}</label>
    </div></fieldset>}

    <fieldset className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-8"><legend className="px-3 text-xl font-black text-white">Background and Safety</legend><div className="grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">Have you participated in a similar program before?<select name="previousProgram" defaultValue="" {...props("previousProgram")}><option value="" className="text-black">Select one</option><option className="text-black">Yes</option><option className="text-black">No</option></select>{error("previousProgram")}</label>
      <label className="text-sm font-semibold text-stone-200">How did you hear about us?<input name="referralSource" {...props("referralSource")} />{error("referralSource")}</label>
      <label className="text-sm font-semibold text-stone-200">Medical conditions, injuries, allergies, or physical limitations?<select name="hasMedicalCondition" value={medical} onChange={(e) => setMedical(e.target.value)} {...props("hasMedicalCondition")}><option value="" className="text-black">Select one</option><option className="text-black">Yes</option><option className="text-black">No</option></select>{error("hasMedicalCondition")}</label>
      <label className="text-sm font-semibold text-stone-200">Willing to attend regularly and follow academy requirements?<select name="attendanceCommitment" defaultValue="" {...props("attendanceCommitment")}><option value="" className="text-black">Select one</option><option className="text-black">Yes</option><option className="text-black">No</option></select>{error("attendanceCommitment")}</label>
      {medical === "Yes" && <label className="text-sm font-semibold text-stone-200 md:col-span-2">Medical Details<textarea name="medicalDetails" rows={4} {...props("medicalDetails")} />{error("medicalDetails")}</label>}
    </div></fieldset>

    <fieldset className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 sm:p-8"><legend className="px-3 text-xl font-black text-white">Consent</legend><p className="mb-5 text-sm leading-6 text-stone-400">Review the <Link className="text-red-300 underline" href="/liability-waiver" target="_blank">Liability Waiver</Link>, <Link className="text-red-300 underline" href="/refund-policy" target="_blank">Refund Policy</Link>, <Link className="text-red-300 underline" href="/privacy" target="_blank">Privacy Policy</Link>, and <Link className="text-red-300 underline" href="/photo-video-consent" target="_blank">Photo and Video Consent</Link>.</p><div className="space-y-4">
      {[["informationConfirmed", "I confirm that the information provided is accurate."], ["riskAcknowledged", "I acknowledge the risks associated with physical activity and karate training."], ["rulesAccepted", "I agree to follow academy rules and safety guidelines."], ["emergencyTreatmentAuthorized", "I authorize emergency medical treatment when reasonably necessary."], ["mediaPermission", "I grant photo and video permission."], ["refundPolicyAccepted", "I acknowledge the Refund Policy."], ["liabilityWaiverAccepted", "I accept the Liability Waiver."]].map(([name, text]) => <div key={name}><label className="flex items-start gap-3 text-sm leading-6 text-stone-200"><input name={name} type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-red-600" />{text}</label>{error(name)}</div>)}
    </div><div className="mt-6 grid gap-5 md:grid-cols-2"><label className="text-sm font-semibold text-stone-200">Typed Electronic Signature<input name="participantSignature" {...props("participantSignature")} />{error("participantSignature")}</label>{isMinor && <label className="text-sm font-semibold text-stone-200">Parent/Guardian Signature<input name="guardianSignature" {...props("guardianSignature")} />{error("guardianSignature")}</label>}</div></fieldset>

    <button type="submit" disabled={busy} className="min-h-14 w-full rounded-xl bg-red-600 px-6 text-sm font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-red-950/40 transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60">{busy ? "Submitting Registration…" : "Continue to Payment"}</button>
  </form>;
}
