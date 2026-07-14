"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

const programs = ["Kids Karate", "Teen Karate", "Adult Karate", "Beginner Program", "Advanced Training", "Practical Self-Defense"];
const initialState = { fullName: "", dateOfBirth: "", age: "", gender: "", emailAddress: "", phoneNumber: "", program: "", similarProgramsBefore: "", motivation: "", heardAbout: "", heardAboutOther: "", medicalCondition: "", medicalDetails: "", medication: "", medicationDetails: "", goals: "", nextGoals: "", attendRegularly: "", homeAddress: "", addressCity: "", addressProvince: "", postalCode: "", addressCountry: "Canada", emergencyContactName: "", emergencyContactPhone: "", parentGuardianName: "", parentGuardianSignature: "", informationAccurate: false, understandsRisks: false, followsRules: false, authorizeEmergencyTreatment: false, photoPermission: false, feesNonRefundable: false, acceptsTerms: false, acceptsWaiver: false, participantSignature: "", consentDate: "", humanCheck: false, website: "" };
type FormState = typeof initialState;
const postalPattern = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ][ -]?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i;
const phonePattern = /^\+?[0-9\s().-]{7,15}$/;
const fieldClass = (error?: string) => `w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 ${error ? "border-red-400" : "border-white/10"}`;
const fieldLabels: Record<string, string> = { fullName: "Full Name", dateOfBirth: "Date of Birth", age: "Age", gender: "Gender", emailAddress: "Email Address", phoneNumber: "Phone Number", program: "Program", similarProgramsBefore: "Previous Program", motivation: "Motivation", heardAbout: "Referral Source", heardAboutOther: "Referral Details", medicalCondition: "Medical Conditions", medicalDetails: "Medical Details", medication: "Medication", medicationDetails: "Medication Details", goals: "Program Goals", nextGoals: "3–6 Month Goals", attendRegularly: "Attendance Commitment", homeAddress: "Street Address", addressCity: "City", addressProvince: "Province", postalCode: "Postal Code", emergencyContactName: "Emergency Contact Name", emergencyContactPhone: "Emergency Contact Phone", parentGuardianName: "Parent/Guardian Name", parentGuardianSignature: "Parent/Guardian Signature", participantSignature: "Participant Signature", consentDate: "Consent Date", informationAccurate: "Information Accuracy", understandsRisks: "Physical Activity Risks", followsRules: "Safety Guidelines", authorizeEmergencyTreatment: "Emergency Treatment Consent", feesNonRefundable: "Fee Policy", acceptsTerms: "Registration Terms", acceptsWaiver: "Liability Waiver", humanCheck: "Registration Confirmation", registrationService: "Registration Service" };

export function StudentRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const update = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    const nextValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
    setForm((previous) => ({ ...previous, [name]: nextValue }));
    setErrors((previous) => ({ ...previous, [name]: "", registrationService: "" }));
    setMessage(null);
  };
  const validateStep = (target: number) => {
    const next: Record<string, string> = {};
    if (target === 1) {
      if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
      if (!form.dateOfBirth) next.dateOfBirth = "Please enter your date of birth.";
      const age = Number(form.age); if (!Number.isInteger(age) || age > 100) next.age = "Please enter a valid age."; else if (age < 16) next.age = "Participants must be at least 16 years old.";
      if (!form.gender) next.gender = "Please select an option.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress)) next.emailAddress = "Please enter a valid email address.";
      if (!phonePattern.test(form.phoneNumber)) next.phoneNumber = "Please enter a valid phone number.";
    }
    if (target === 2) {
      if (!form.program) next.program = "Please select a program.";
      if (!form.similarProgramsBefore) next.similarProgramsBefore = "Please select whether you have participated in a similar program before.";
      if (!form.motivation.trim()) next.motivation = "Please tell us what motivated you to join.";
      if (!form.heardAbout) next.heardAbout = "Please select how you heard about us.";
      if (form.heardAbout === "Other" && !form.heardAboutOther.trim()) next.heardAboutOther = "Please provide details.";
      if (!form.medicalCondition) next.medicalCondition = "Please answer this question.";
      if (form.medicalCondition === "Yes" && !form.medicalDetails.trim()) next.medicalDetails = "Please provide relevant details.";
      if (!form.medication) next.medication = "Please answer this question.";
      if (form.medication === "Yes" && !form.medicationDetails.trim()) next.medicationDetails = "Please provide relevant details.";
      if (!form.goals.trim()) next.goals = "Please tell us about your goals.";
      if (!form.nextGoals.trim()) next.nextGoals = "Please share what you hope to achieve.";
      if (!form.attendRegularly) next.attendRegularly = "Please select an option.";
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
      if (!form.informationAccurate) next.informationAccurate = "Please confirm that your information is accurate.";
      if (!form.understandsRisks) next.understandsRisks = "Please acknowledge the physical activity risks.";
      if (!form.followsRules) next.followsRules = "Please agree to follow safety guidelines.";
      if (!form.authorizeEmergencyTreatment) next.authorizeEmergencyTreatment = "Please authorize emergency treatment if necessary.";
      if (!form.feesNonRefundable) next.feesNonRefundable = "Please acknowledge the fee policy.";
      if (!form.participantSignature.trim()) next.participantSignature = "Please enter your electronic signature.";
      if (!form.consentDate) next.consentDate = "Please enter the consent date.";
      if (Number(form.age) < 18 && !form.parentGuardianSignature.trim()) next.parentGuardianSignature = "Parent or guardian signature is required.";
    }
    setErrors(next);
    if (Object.keys(next).length) requestAnimationFrame(() => { summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus(); });
    return Object.keys(next).length === 0;
  };
  const nextStep = () => { if (validateStep(step)) { setStep((current) => current + 1); setMessage(null); } };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(null); if (!validateStep(3)) return; setIsSubmitting(true);
    try {
      const response = await fetch("/api/registration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, age: Number(form.age) }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Registration could not be completed.");
      router.push(`/payment?registration=${encodeURIComponent(data.submission.id)}`);
    } catch (error) { const serverMessage = error instanceof Error ? error.message : "The registration service is temporarily unavailable. Please try again."; setErrors((previous) => ({ ...previous, registrationService: serverMessage })); setMessage(serverMessage); requestAnimationFrame(() => summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })); } finally { setIsSubmitting(false); }
  };
  const error = (name: string) => errors[name] ? <p className="mt-2 flex gap-2 text-sm text-red-300"><span aria-hidden="true">⚠</span>{errors[name]}</p> : null;
  const selectClass = (name: string) => `w-full rounded-xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-400/30 ${errors[name] ? "border-red-400" : "border-stone-300"}`;

  return <form ref={formRef} onSubmit={submit} className="rounded-3xl border border-white/10 bg-stone-950/90 p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
    <div className="border-b border-white/10 pb-6"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Student enrollment</p><h3 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">Register in three simple steps</h3><p className="mt-3 text-stone-300">Step {step} of 3 — {step === 1 ? "Student Information" : step === 2 ? "Program & Contact" : "Review & Consent"}</p></div>
    <div className="mt-6 flex gap-2" aria-label={`Step ${step} of 3`}>{[1, 2, 3].map((item) => <span key={item} className={`h-1 flex-1 rounded-full ${item <= step ? "bg-red-500" : "bg-white/10"}`} />)}</div>
    {Object.entries(errors).filter(([, errorMessage]) => errorMessage).length ? <div ref={summaryRef} className="mt-6 rounded-xl border border-red-400/60 bg-red-950/45 p-5 text-sm text-red-100" role="alert" tabIndex={-1}><p className="font-black uppercase tracking-[0.12em]">We could not continue to payment</p><p className="mt-2">Please fix the following fields:</p><ul className="mt-3 list-disc space-y-1 pl-5">{Object.entries(errors).filter(([, errorMessage]) => errorMessage).map(([field, errorMessage]) => <li key={field}><strong>{fieldLabels[field] || field}:</strong> {errorMessage}</li>)}</ul></div> : null}
    {message && !Object.keys(errors).length ? <div className="mt-6 rounded-xl border border-red-400/30 bg-red-950/30 p-4 text-sm text-red-100">{message}</div> : null}
    {step === 1 ? <div className="mt-8 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Full name<input name="fullName" value={form.fullName} onChange={update} aria-invalid={Boolean(errors.fullName)} className={`mt-2 ${fieldClass(errors.fullName)}`} autoComplete="name" />{error("fullName")}</label>
      <label className="text-sm font-semibold text-stone-200">Date of birth<input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} aria-invalid={Boolean(errors.dateOfBirth)} className={`mt-2 ${fieldClass(errors.dateOfBirth)}`} />{error("dateOfBirth")}</label>
      <label className="text-sm font-semibold text-stone-200">Age<input name="age" value={form.age} onChange={update} inputMode="numeric" aria-invalid={Boolean(errors.age)} className={`mt-2 ${fieldClass(errors.age)}`} placeholder="Age" />{error("age")}</label>
      <label className="text-sm font-semibold text-stone-200">Gender<select name="gender" value={form.gender} onChange={update} aria-invalid={Boolean(errors.gender)} className={`mt-2 ${selectClass("gender")}`}><option value="">Select one</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select>{error("gender")}</label>
      <label className="text-sm font-semibold text-stone-200"><span>Email</span><input name="emailAddress" type="email" value={form.emailAddress} onChange={update} aria-invalid={Boolean(errors.emailAddress)} className={`mt-2 ${fieldClass(errors.emailAddress)}`} placeholder="name@example.com" />{error("emailAddress")}</label>
      <label className="text-sm font-semibold text-stone-200">Phone number<input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="tel" aria-invalid={Boolean(errors.phoneNumber)} className={`mt-2 ${fieldClass(errors.phoneNumber)}`} placeholder="306-000-0000" />{error("phoneNumber")}</label>
    </div> : null}
    {step === 2 ? <div className="mt-8 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200">Program<select name="program" value={form.program} onChange={update} aria-invalid={Boolean(errors.program)} className={`mt-2 ${selectClass("program")}`}><option value="">Select one</option>{programs.map((program) => <option key={program}>{program}</option>)}</select>{error("program")}</label>
      <label className="text-sm font-semibold text-stone-200">Previous martial arts experience<select name="similarProgramsBefore" value={form.similarProgramsBefore} onChange={update} aria-invalid={Boolean(errors.similarProgramsBefore)} className={`mt-2 ${selectClass("similarProgramsBefore")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("similarProgramsBefore")}</label>
      <label className="text-sm font-semibold text-stone-200">What motivated you to join?<input name="motivation" value={form.motivation} onChange={update} aria-invalid={Boolean(errors.motivation)} className={`mt-2 ${fieldClass(errors.motivation)}`} />{error("motivation")}</label>
      <label className="text-sm font-semibold text-stone-200">How did you hear about us?<select name="heardAbout" value={form.heardAbout} onChange={update} aria-invalid={Boolean(errors.heardAbout)} className={`mt-2 ${selectClass("heardAbout")}`}><option value="">Select one</option>{["Google Search","Instagram","Facebook","WhatsApp","Friend or Family","Current Student","Community Event","Other"].map((item) => <option key={item}>{item}</option>)}</select>{error("heardAbout")}</label>
      {form.heardAbout === "Other" ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Please tell us more<input name="heardAboutOther" value={form.heardAboutOther} onChange={update} aria-invalid={Boolean(errors.heardAboutOther)} className={`mt-2 ${fieldClass(errors.heardAboutOther)}`} />{error("heardAboutOther")}</label> : null}
      <label className="text-sm font-semibold text-stone-200">Medical conditions, injuries, allergies, or limitations?<select name="medicalCondition" value={form.medicalCondition} onChange={update} aria-invalid={Boolean(errors.medicalCondition)} className={`mt-2 ${selectClass("medicalCondition")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("medicalCondition")}</label>
      <label className="text-sm font-semibold text-stone-200">Medication affecting participation?<select name="medication" value={form.medication} onChange={update} aria-invalid={Boolean(errors.medication)} className={`mt-2 ${selectClass("medication")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("medication")}</label>
      {form.medicalCondition === "Yes" ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Medical details<textarea name="medicalDetails" value={form.medicalDetails} onChange={update} aria-invalid={Boolean(errors.medicalDetails)} className={`mt-2 ${fieldClass(errors.medicalDetails)}`} rows={3} />{error("medicalDetails")}</label> : null}
      {form.medication === "Yes" ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Medication details<textarea name="medicationDetails" value={form.medicationDetails} onChange={update} aria-invalid={Boolean(errors.medicationDetails)} className={`mt-2 ${fieldClass(errors.medicationDetails)}`} rows={3} />{error("medicationDetails")}</label> : null}
      <p className="text-xs leading-6 text-stone-400 md:col-span-2">Health information is collected only to help keep participants safe and is handled securely.</p>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">What are your goals?<textarea name="goals" value={form.goals} onChange={update} aria-invalid={Boolean(errors.goals)} className={`mt-2 ${fieldClass(errors.goals)}`} rows={3} />{error("goals")}</label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">What do you hope to achieve in the next 3–6 months?<textarea name="nextGoals" value={form.nextGoals} onChange={update} aria-invalid={Boolean(errors.nextGoals)} className={`mt-2 ${fieldClass(errors.nextGoals)}`} rows={3} />{error("nextGoals")}</label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Will you attend regularly and follow program requirements?<select name="attendRegularly" value={form.attendRegularly} onChange={update} aria-invalid={Boolean(errors.attendRegularly)} className={`mt-2 ${selectClass("attendRegularly")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("attendRegularly")}</label>
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Street address<AddressAutocomplete value={form.homeAddress} hasError={Boolean(errors.homeAddress)} onChange={(homeAddress) => { setForm((previous) => ({ ...previous, homeAddress })); setErrors((previous) => ({ ...previous, homeAddress: "" })); }} onSelect={(address) => { setForm((previous) => ({ ...previous, homeAddress: address.street, addressCity: address.city, addressProvince: address.province, postalCode: address.postalCode, addressCountry: address.country })); setErrors((previous) => ({ ...previous, homeAddress: "", addressCity: "", addressProvince: "", postalCode: "" })); }} />{error("homeAddress")}</label>
      {[['addressCity','City'],['addressProvince','Province'],['postalCode','Postal code'],['addressCountry','Country']].map(([name,label]) => <label className="text-sm font-semibold text-stone-200" key={name}>{label}<input name={name} value={form[name as keyof FormState] as string} onChange={update} aria-invalid={Boolean(errors[name])} className={`mt-2 ${fieldClass(errors[name])}`} />{error(name)}</label>)}
      <label className="text-sm font-semibold text-stone-200">Emergency contact name<input name="emergencyContactName" value={form.emergencyContactName} onChange={update} aria-invalid={Boolean(errors.emergencyContactName)} className={`mt-2 ${fieldClass(errors.emergencyContactName)}`} />{error("emergencyContactName")}</label>
      <label className="text-sm font-semibold text-stone-200">Emergency contact phone<input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={update} inputMode="tel" aria-invalid={Boolean(errors.emergencyContactPhone)} className={`mt-2 ${fieldClass(errors.emergencyContactPhone)}`} />{error("emergencyContactPhone")}</label>
      {Number(form.age) < 18 ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Parent or guardian name<input name="parentGuardianName" value={form.parentGuardianName} onChange={update} aria-invalid={Boolean(errors.parentGuardianName)} className={`mt-2 ${fieldClass(errors.parentGuardianName)}`} />{error("parentGuardianName")}</label> : null}
    </div> : null}
    {step === 3 ? <div className="mt-8 space-y-5"><div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-stone-300"><p className="font-bold text-white">Review your registration</p><p className="mt-2">{form.fullName} · {form.program || "Program not selected"}</p><p>{form.emailAddress} · {form.phoneNumber}</p><p>{form.homeAddress}, {form.addressCity}, {form.addressProvince} {form.postalCode}</p></div><details className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-stone-300"><summary className="cursor-pointer font-bold text-white">Read the Liability Waiver</summary><p className="mt-3 leading-7">I voluntarily participate in this program and assume responsibility for associated risks. I understand karate involves physical activity and agree to follow safety instructions.</p></details>{[['informationAccurate','I confirm that all information provided is accurate.'],['understandsRisks','I understand participation involves physical activity and inherent risks.'],['followsRules','I agree to follow all rules and safety guidelines.'],['authorizeEmergencyTreatment','I authorize emergency medical treatment if necessary.'],['feesNonRefundable','I understand registration fees are non-refundable unless otherwise stated.'],['photoPermission','I grant permission for photos/videos to be used for promotional purposes. (Optional)'],['acceptsTerms','I accept the registration terms and fee policy.'],['acceptsWaiver','I have read and agree to the Liability Waiver.'],['humanCheck','I confirm this registration is genuine.']].map(([name,label]) => <label className={`flex gap-3 rounded-xl border p-4 text-sm text-stone-200 ${errors[name] ? "border-red-400 bg-red-950/20" : "border-white/10 bg-white/5"}`} key={name}><input type="checkbox" name={name} checked={Boolean(form[name as keyof FormState])} onChange={update} aria-invalid={Boolean(errors[name])} className="mt-1 h-4 w-4" /><span>{label}{error(name)}</span></label>)}<div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-semibold text-stone-200">Participant electronic signature<input name="participantSignature" value={form.participantSignature} onChange={update} aria-invalid={Boolean(errors.participantSignature)} className={`mt-2 ${fieldClass(errors.participantSignature)}`} placeholder="Type your full legal name" />{error("participantSignature")}</label><label className="text-sm font-semibold text-stone-200">Consent date<input name="consentDate" type="date" value={form.consentDate} onChange={update} aria-invalid={Boolean(errors.consentDate)} className={`mt-2 ${fieldClass(errors.consentDate)}`} />{error("consentDate")}</label>{Number(form.age) < 18 ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Parent/guardian electronic signature<input name="parentGuardianSignature" value={form.parentGuardianSignature} onChange={update} aria-invalid={Boolean(errors.parentGuardianSignature)} className={`mt-2 ${fieldClass(errors.parentGuardianSignature)}`} placeholder="Type full legal name" />{error("parentGuardianSignature")}</label> : null}</div><p className="text-sm text-stone-400">By typing your full legal name above, you confirm that it represents your electronic signature.</p></div> : null}
    <input type="text" name="website" value={form.website} onChange={update} className="absolute left-[-9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => { setStep((current) => Math.max(1, current - 1)); setMessage(null); }} disabled={step === 1 || isSubmitting} className="min-h-12 rounded-md border border-white/20 px-5 text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-40">Back</button>{step < 3 ? <button type="button" onClick={nextStep} className="min-h-12 rounded-md bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-red-500">Continue</button> : <button type="submit" disabled={isSubmitting} className="min-h-12 rounded-md bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-red-500 disabled:opacity-60">{isSubmitting ? "Submitting Registration…" : "Continue to Payment"}</button>}</div>
  </form>;
}
