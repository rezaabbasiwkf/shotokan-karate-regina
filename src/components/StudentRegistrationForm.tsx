"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

const programs = ["Kids Karate", "Teen Karate", "Adult Karate", "Beginner Program", "Advanced Training", "Practical Self-Defense"];
const initialState = { firstName: "", lastName: "", age: "", gender: "", emailAddress: "", phoneNumber: "", program: "", similarProgramsBefore: "", homeAddress: "", addressCity: "", addressProvince: "", postalCode: "", addressCountry: "Canada", emergencyContactName: "", emergencyContactPhone: "", parentGuardianName: "", acceptsTerms: false, acceptsWaiver: false, humanCheck: false, website: "" };
type FormState = typeof initialState;
const postalPattern = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ][ -]?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i;
const phonePattern = /^\+?[0-9\s().-]{7,15}$/;
const fieldClass = (error?: string) => `w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 ${error ? "border-red-400" : "border-white/10"}`;

export function StudentRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const nextValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
    setForm((previous) => ({ ...previous, [name]: nextValue }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };
  const validateStep = (target: number) => {
    const next: Record<string, string> = {};
    if (target === 1) {
      if (!form.firstName.trim()) next.firstName = "Please enter your first name.";
      if (!form.lastName.trim()) next.lastName = "Please enter your last name.";
      const age = Number(form.age); if (!Number.isInteger(age) || age < 4 || age > 100) next.age = "Please enter an age between 4 and 100.";
      if (!form.gender) next.gender = "Please select an option.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) next.emailAddress = "Please enter a valid email address.";
      if (!phonePattern.test(form.phoneNumber)) next.phoneNumber = "Please enter a valid phone number.";
    }
    if (target === 2) {
      if (!form.program) next.program = "Please select a program.";
      if (!form.similarProgramsBefore) next.similarProgramsBefore = "Please select whether you have participated in a similar program before.";
      if (!form.homeAddress.trim()) next.homeAddress = "Please enter your street address.";
      if (!form.addressCity.trim()) next.addressCity = "Please enter your city.";
      if (!form.addressProvince.trim()) next.addressProvince = "Please enter your province.";
      if (!postalPattern.test(form.postalCode.trim())) next.postalCode = "Please enter a valid Canadian postal code.";
      if (!form.emergencyContactName.trim()) next.emergencyContactName = "Please enter an emergency contact name.";
      if (!phonePattern.test(form.emergencyContactPhone)) next.emergencyContactPhone = "Please enter a valid emergency contact phone number.";
      if (Number(form.age) < 18 && !form.parentGuardianName.trim()) next.parentGuardianName = "Please enter a parent or guardian name.";
    }
    if (target === 3) {
      if (!form.acceptsTerms) next.acceptsTerms = "Please accept the registration terms.";
      if (!form.acceptsWaiver) next.acceptsWaiver = "Please accept the waiver before continuing.";
      if (!form.humanCheck) next.humanCheck = "Please confirm this registration is genuine.";
    }
    setErrors(next);
    if (Object.keys(next).length) requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
    return Object.keys(next).length === 0;
  };
  const nextStep = () => { if (validateStep(step)) { setStep((current) => current + 1); setMessage(null); } };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(null); if (!validateStep(3)) return; setIsSubmitting(true);
    try {
      const response = await fetch("/api/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, age: Number(form.age) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Registration could not be completed.");
      router.push(`/payment?registration=${encodeURIComponent(data.submission.id)}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "We could not complete your registration. Please try again."); } finally { setIsSubmitting(false); }
  };
  const error = (name: string) => errors[name] ? <p className="mt-2 flex gap-2 text-sm text-red-300"><span aria-hidden="true">⚠</span>{errors[name]}</p> : null;
  const selectClass = (name: string) => `w-full rounded-xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-400/30 ${errors[name] ? "border-red-400" : "border-stone-300"}`;

  return <form ref={formRef} onSubmit={submit} className="rounded-3xl border border-white/10 bg-stone-950/90 p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
    <div className="border-b border-white/10 pb-6"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Student enrollment</p><h3 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">Register in three simple steps</h3><p className="mt-3 text-stone-300">Step {step} of 3 — {step === 1 ? "Student Information" : step === 2 ? "Program & Contact" : "Review & Consent"}</p></div>
    <div className="mt-6 flex gap-2" aria-label={`Step ${step} of 3`}>{[1, 2, 3].map((item) => <span key={item} className={`h-1 flex-1 rounded-full ${item <= step ? "bg-red-500" : "bg-white/10"}`} />)}</div>
    {message ? <div className="mt-6 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{message}</div> : null}
    {step === 1 ? <div className="mt-8 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">First name<input name="firstName" value={form.firstName} onChange={update} aria-invalid={Boolean(errors.firstName)} className={`mt-2 ${fieldClass(errors.firstName)}`} />{error("firstName")}</label>
      <label className="text-sm font-semibold text-stone-200">Last name<input name="lastName" value={form.lastName} onChange={update} aria-invalid={Boolean(errors.lastName)} className={`mt-2 ${fieldClass(errors.lastName)}`} />{error("lastName")}</label>
      <label className="text-sm font-semibold text-stone-200">Age<input name="age" value={form.age} onChange={update} inputMode="numeric" aria-invalid={Boolean(errors.age)} className={`mt-2 ${fieldClass(errors.age)}`} placeholder="Age" />{error("age")}</label>
      <label className="text-sm font-semibold text-stone-200">Gender<select name="gender" value={form.gender} onChange={update} aria-invalid={Boolean(errors.gender)} className={`mt-2 ${selectClass("gender")}`}><option value="">Select one</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select>{error("gender")}</label>
      <label className="text-sm font-semibold text-stone-200"><span>Email</span><input name="emailAddress" type="email" value={form.emailAddress} onChange={update} aria-invalid={Boolean(errors.emailAddress)} className={`mt-2 ${fieldClass(errors.emailAddress)}`} placeholder="name@example.com" />{error("emailAddress")}</label>
      <label className="text-sm font-semibold text-stone-200">Phone number<input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="tel" aria-invalid={Boolean(errors.phoneNumber)} className={`mt-2 ${fieldClass(errors.phoneNumber)}`} placeholder="306-000-0000" />{error("phoneNumber")}</label>
    </div> : null}
    {step === 2 ? <div className="mt-8 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">Program<select name="program" value={form.program} onChange={update} aria-invalid={Boolean(errors.program)} className={`mt-2 ${selectClass("program")}`}><option value="">Select one</option>{programs.map((program) => <option key={program}>{program}</option>)}</select>{error("program")}</label>
      <label className="text-sm font-semibold text-stone-200">Previous martial arts experience<select name="similarProgramsBefore" value={form.similarProgramsBefore} onChange={update} aria-invalid={Boolean(errors.similarProgramsBefore)} className={`mt-2 ${selectClass("similarProgramsBefore")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("similarProgramsBefore")}</label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Street address<AddressAutocomplete value={form.homeAddress} hasError={Boolean(errors.homeAddress)} onChange={(homeAddress) => { setForm((previous) => ({ ...previous, homeAddress })); setErrors((previous) => ({ ...previous, homeAddress: "" })); }} onSelect={(address) => { setForm((previous) => ({ ...previous, homeAddress: address.street, addressCity: address.city, addressProvince: address.province, postalCode: address.postalCode, addressCountry: address.country })); setErrors((previous) => ({ ...previous, homeAddress: "", addressCity: "", addressProvince: "", postalCode: "" })); }} />{error("homeAddress")}</label>
      {[['addressCity','City'],['addressProvince','Province'],['postalCode','Postal code'],['addressCountry','Country']].map(([name,label]) => <label className="text-sm font-semibold text-stone-200" key={name}>{label}<input name={name} value={form[name as keyof FormState] as string} onChange={update} aria-invalid={Boolean(errors[name])} className={`mt-2 ${fieldClass(errors[name])}`} />{error(name)}</label>)}
      <label className="text-sm font-semibold text-stone-200">Emergency contact name<input name="emergencyContactName" value={form.emergencyContactName} onChange={update} aria-invalid={Boolean(errors.emergencyContactName)} className={`mt-2 ${fieldClass(errors.emergencyContactName)}`} />{error("emergencyContactName")}</label>
      <label className="text-sm font-semibold text-stone-200">Emergency contact phone<input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={update} inputMode="tel" aria-invalid={Boolean(errors.emergencyContactPhone)} className={`mt-2 ${fieldClass(errors.emergencyContactPhone)}`} />{error("emergencyContactPhone")}</label>
      {Number(form.age) < 18 ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Parent or guardian name<input name="parentGuardianName" value={form.parentGuardianName} onChange={update} aria-invalid={Boolean(errors.parentGuardianName)} className={`mt-2 ${fieldClass(errors.parentGuardianName)}`} />{error("parentGuardianName")}</label> : null}
    </div> : null}
    {step === 3 ? <div className="mt-8 space-y-5"><div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-stone-300"><p className="font-bold text-white">Review your registration</p><p className="mt-2">{form.firstName} {form.lastName} · {form.program || "Program not selected"}</p><p>{form.emailAddress} · {form.phoneNumber}</p><p>{form.homeAddress}, {form.addressCity}, {form.addressProvince} {form.postalCode}</p></div>{[['acceptsTerms','I accept the registration terms and fee policy.'],['acceptsWaiver','I accept the activity waiver and safety guidelines.'],['humanCheck','I confirm the information is accurate and this registration is genuine.']].map(([name,label]) => <label className={`flex gap-3 rounded-xl border p-4 text-sm text-stone-200 ${errors[name] ? "border-red-400 bg-red-950/20" : "border-white/10 bg-white/5"}`} key={name}><input type="checkbox" name={name} checked={Boolean(form[name as keyof FormState])} onChange={update} aria-invalid={Boolean(errors[name])} className="mt-1 h-4 w-4" /><span>{label}{error(name)}</span></label>)}</div> : null}
    <input type="text" name="website" value={form.website} onChange={update} className="absolute left-[-9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => { setStep((current) => Math.max(1, current - 1)); setMessage(null); }} disabled={step === 1 || isSubmitting} className="min-h-12 rounded-md border border-white/20 px-5 text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-40">Back</button>{step < 3 ? <button type="button" onClick={nextStep} className="min-h-12 rounded-md bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-red-500">Continue</button> : <button type="submit" disabled={isSubmitting} className="min-h-12 rounded-md bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-red-500 disabled:opacity-60">{isSubmitting ? "Submitting Registration…" : "Continue to Payment"}</button>}</div>
  </form>;
}
