"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

const initialState = {
  fullName: "", dateOfBirth: "", gender: "", phoneNumber: "", emailAddress: "", homeAddress: "",
  emergencyContactName: "", emergencyContactPhone: "", parentGuardianName: "", parentGuardianPhone: "", parentGuardianEmail: "",
  similarProgramsBefore: "", heardAbout: "", heardAboutOther: "", medicalCondition: "", medicalDetails: "", attendRegularly: "",
  informationAccurate: false, understandsRisks: false, followsRules: false, authorizeEmergencyTreatment: false,
  photoPermission: false, feesNonRefundable: false, acceptsWaiver: false, participantSignature: "", parentGuardianSignature: "", website: "",
};

type FormState = typeof initialState;
type Errors = Record<string, string>;

const labels: Record<string, string> = {
  fullName: "Full Name", dateOfBirth: "Date of Birth", gender: "Gender", phoneNumber: "Phone Number", emailAddress: "Email Address", homeAddress: "Home Address",
  emergencyContactName: "Emergency Contact Name", emergencyContactPhone: "Emergency Contact Phone", parentGuardianName: "Parent/Guardian Name", parentGuardianPhone: "Parent/Guardian Phone", parentGuardianEmail: "Parent/Guardian Email",
  similarProgramsBefore: "Previous Program", heardAbout: "How You Heard About Us", heardAboutOther: "Referral Details", medicalCondition: "Medical Conditions", medicalDetails: "Medical Details", attendRegularly: "Attendance Commitment",
  informationAccurate: "Information Accuracy", understandsRisks: "Risk Acknowledgment", followsRules: "Safety Guidelines", authorizeEmergencyTreatment: "Emergency Authorization", feesNonRefundable: "Refund Policy", acceptsWaiver: "Liability Waiver", participantSignature: "Electronic Signature", parentGuardianSignature: "Parent/Guardian Signature", registrationService: "Registration Service",
};

const phonePattern = /^[+\d][\d\s().-]{6,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ageFromDateOfBirth(dateOfBirth: string) {
  const date = new Date(`${dateOfBirth}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const hasHadBirthday = today.getMonth() > date.getMonth() || (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());
  if (!hasHadBirthday) age -= 1;
  return age;
}

export function StudentRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const under18 = (ageFromDateOfBirth(form.dateOfBirth) ?? 18) < 18;

  const error = (name: string) => errors[name] ? <p className="mt-2 text-xs font-semibold text-red-300" id={`${name}-error`}>{errors[name]}</p> : null;
  const inputClass = (name: string) => `w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-500 focus:border-red-400 ${errors[name] ? "border-red-400" : "border-white/10"}`;
  const selectClass = (name: string) => `${inputClass(name)} appearance-auto bg-white text-stone-900`;

  const focusErrors = () => requestAnimationFrame(() => {
    summaryRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
  });

  const validate = (currentStep: number) => {
    const next: Errors = {};
    const age = ageFromDateOfBirth(form.dateOfBirth);
    if (currentStep === 1) {
      if (!form.fullName.trim()) next.fullName = "Please enter your full name.";
      if (!form.dateOfBirth) next.dateOfBirth = "Please enter your date of birth.";
      else if (age === null || age < 5) next.dateOfBirth = "Participants must be at least 5 years old.";
      if (!form.gender) next.gender = "Please select a gender option.";
      if (!phonePattern.test(form.phoneNumber.trim())) next.phoneNumber = "Please enter a valid phone number.";
      if (!emailPattern.test(form.emailAddress.trim())) next.emailAddress = "Please enter a valid email address.";
    }
    if (currentStep === 2) {
      if (!form.homeAddress.trim()) next.homeAddress = "Please enter your home address.";
      if (!form.emergencyContactName.trim()) next.emergencyContactName = "Please enter an emergency contact name.";
      if (!phonePattern.test(form.emergencyContactPhone.trim())) next.emergencyContactPhone = "Please enter a valid emergency contact phone number.";
      if (under18 && !form.parentGuardianName.trim()) next.parentGuardianName = "Please enter a parent or guardian name.";
      if (under18 && !phonePattern.test(form.parentGuardianPhone.trim())) next.parentGuardianPhone = "Please enter a valid parent or guardian phone number.";
      if (under18 && !emailPattern.test(form.parentGuardianEmail.trim())) next.parentGuardianEmail = "Please enter a valid parent or guardian email address.";
      if (!form.similarProgramsBefore) next.similarProgramsBefore = "Please select whether you have participated in a similar program before.";
      if (!form.heardAbout) next.heardAbout = "Please select how you heard about us.";
      if (form.heardAbout === "Other" && !form.heardAboutOther.trim()) next.heardAboutOther = "Please provide details.";
      if (!form.medicalCondition) next.medicalCondition = "Please answer this question.";
      if (form.medicalCondition === "Yes" && !form.medicalDetails.trim()) next.medicalDetails = "Please provide relevant details.";
      if (!form.attendRegularly) next.attendRegularly = "Please select an option.";
    }
    if (currentStep === 3) {
      if (!form.informationAccurate) next.informationAccurate = "Please confirm that your information is accurate.";
      if (!form.understandsRisks) next.understandsRisks = "Please acknowledge the physical activity risks.";
      if (!form.followsRules) next.followsRules = "Please agree to follow safety guidelines.";
      if (!form.authorizeEmergencyTreatment) next.authorizeEmergencyTreatment = "Please authorize emergency treatment if necessary.";
      if (!form.feesNonRefundable) next.feesNonRefundable = "Please acknowledge the refund policy.";
      if (!form.acceptsWaiver) next.acceptsWaiver = "You must accept the liability waiver before continuing.";
      if (!form.participantSignature.trim()) next.participantSignature = "Please enter your electronic signature.";
      if (under18 && !form.parentGuardianSignature.trim()) next.parentGuardianSignature = "Parent or guardian signature is required.";
    }
    setErrors(next);
    if (Object.keys(next).length) focusErrors();
    return Object.keys(next).length === 0;
  };

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type } = event.target;
    const value = type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value;
    setForm((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => ({ ...previous, [name]: "", registrationService: "" }));
  };
  const nextStep = () => { if (validate(step)) setStep((current) => current + 1); };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate(3)) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/registrations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setErrors(result.fieldErrors || { registrationService: result.message || result.error || "The registration service is temporarily unavailable." });
        focusErrors();
        return;
      }
      router.push(result.paymentUrl || `/payment?reference=${encodeURIComponent(result.registrationReference)}`);
    } catch {
      setErrors({ registrationService: "The registration service is temporarily unavailable. Please try again." });
      focusErrors();
    } finally { setIsSubmitting(false); }
  };

  const checkboxes: Array<[keyof FormState, string, boolean]> = [
    ["informationAccurate", "I confirm that all information provided is accurate.", true], ["understandsRisks", "I understand participation involves physical activity and inherent risks.", true],
    ["followsRules", "I agree to follow all academy rules and safety guidelines.", true], ["authorizeEmergencyTreatment", "I authorize emergency medical treatment if necessary.", true],
    ["photoPermission", "I grant permission for photos/videos to be used for promotional purposes. (Optional)", false], ["feesNonRefundable", "I acknowledge that registration fees are non-refundable unless otherwise stated.", true],
    ["acceptsWaiver", "I have read and agree to the Liability Waiver.", true],
  ];

  return <form ref={formRef} onSubmit={submit} className="rounded-3xl border border-white/10 bg-stone-950/90 p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
    <div className="border-b border-white/10 pb-6"><p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">Student enrollment</p><h3 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">Register in three simple steps</h3><p className="mt-3 text-stone-300">Step {step} of 3 — {step === 1 ? "Personal Information" : step === 2 ? "Background & Safety" : "Consent"}</p></div>
    {Object.values(errors).some(Boolean) ? <div ref={summaryRef} className="mt-6 rounded-xl border border-red-400/60 bg-red-950/45 p-5 text-sm text-red-100" role="alert" tabIndex={-1}><p className="font-black uppercase tracking-[0.12em]">We could not continue to payment</p><p className="mt-2">Please fix the following fields:</p><ul className="mt-3 list-disc space-y-1 pl-5">{Object.entries(errors).filter(([, value]) => value).map(([field, value]) => <li key={field}><strong>{labels[field] || field}:</strong> {value}</li>)}</ul></div> : null}
    {step === 1 ? <div className="mt-8 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Full name<input name="fullName" value={form.fullName} onChange={update} aria-invalid={Boolean(errors.fullName)} aria-describedby="fullName-error" className={`mt-2 ${inputClass("fullName")}`} autoComplete="name" />{error("fullName")}</label>
      <label className="text-sm font-semibold text-stone-200">Date of birth<input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={update} aria-invalid={Boolean(errors.dateOfBirth)} className={`mt-2 ${inputClass("dateOfBirth")}`} />{error("dateOfBirth")}</label>
      <label className="text-sm font-semibold text-stone-200">Gender<select name="gender" value={form.gender} onChange={update} aria-invalid={Boolean(errors.gender)} className={`mt-2 ${selectClass("gender")}`}><option value="">Select one</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option></select>{error("gender")}</label>
      <label className="text-sm font-semibold text-stone-200">Phone number<input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="tel" autoComplete="tel" aria-invalid={Boolean(errors.phoneNumber)} className={`mt-2 ${inputClass("phoneNumber")}`} placeholder="306-000-0000" />{error("phoneNumber")}</label>
      <label className="text-sm font-semibold text-stone-200">Email address<input name="emailAddress" type="email" value={form.emailAddress} onChange={update} autoComplete="email" aria-invalid={Boolean(errors.emailAddress)} className={`mt-2 ${inputClass("emailAddress")}`} placeholder="name@example.com" />{error("emailAddress")}</label>
    </div> : null}
    {step === 2 ? <div className="mt-8 grid gap-5 md:grid-cols-2">
      <label className="text-sm font-semibold text-stone-200 md:col-span-2">Home address<AddressAutocomplete value={form.homeAddress} hasError={Boolean(errors.homeAddress)} onChange={(homeAddress) => { setForm((previous) => ({ ...previous, homeAddress })); setErrors((previous) => ({ ...previous, homeAddress: "", registrationService: "" })); }} onSelect={(address) => { setForm((previous) => ({ ...previous, homeAddress: address.formattedAddress })); setErrors((previous) => ({ ...previous, homeAddress: "" })); }} />{error("homeAddress")}</label>
      <label className="text-sm font-semibold text-stone-200">Emergency contact name<input name="emergencyContactName" value={form.emergencyContactName} onChange={update} aria-invalid={Boolean(errors.emergencyContactName)} className={`mt-2 ${inputClass("emergencyContactName")}`} />{error("emergencyContactName")}</label>
      <label className="text-sm font-semibold text-stone-200">Emergency contact phone<input name="emergencyContactPhone" value={form.emergencyContactPhone} onChange={update} inputMode="tel" aria-invalid={Boolean(errors.emergencyContactPhone)} className={`mt-2 ${inputClass("emergencyContactPhone")}`} />{error("emergencyContactPhone")}</label>
      {under18 ? <><label className="text-sm font-semibold text-stone-200">Parent/guardian full name<input name="parentGuardianName" value={form.parentGuardianName} onChange={update} aria-invalid={Boolean(errors.parentGuardianName)} className={`mt-2 ${inputClass("parentGuardianName")}`} />{error("parentGuardianName")}</label><label className="text-sm font-semibold text-stone-200">Parent/guardian phone number<input name="parentGuardianPhone" value={form.parentGuardianPhone} onChange={update} inputMode="tel" aria-invalid={Boolean(errors.parentGuardianPhone)} className={`mt-2 ${inputClass("parentGuardianPhone")}`} />{error("parentGuardianPhone")}</label><label className="text-sm font-semibold text-stone-200 md:col-span-2">Parent/guardian email address<input name="parentGuardianEmail" type="email" value={form.parentGuardianEmail} onChange={update} aria-invalid={Boolean(errors.parentGuardianEmail)} className={`mt-2 ${inputClass("parentGuardianEmail")}`} />{error("parentGuardianEmail")}</label></> : null}
      <label className="text-sm font-semibold text-stone-200">Have you participated in a similar program before?<select name="similarProgramsBefore" value={form.similarProgramsBefore} onChange={update} aria-invalid={Boolean(errors.similarProgramsBefore)} className={`mt-2 ${selectClass("similarProgramsBefore")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("similarProgramsBefore")}</label>
      <label className="text-sm font-semibold text-stone-200">How did you hear about us?<select name="heardAbout" value={form.heardAbout} onChange={update} aria-invalid={Boolean(errors.heardAbout)} className={`mt-2 ${selectClass("heardAbout")}`}><option value="">Select one</option>{["Google Search", "Instagram", "Facebook", "WhatsApp", "Friend or Family", "Current Student", "Community Event", "Other"].map((item) => <option key={item}>{item}</option>)}</select>{error("heardAbout")}</label>
      {form.heardAbout === "Other" ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Please tell us more<input name="heardAboutOther" value={form.heardAboutOther} onChange={update} aria-invalid={Boolean(errors.heardAboutOther)} className={`mt-2 ${inputClass("heardAboutOther")}`} />{error("heardAboutOther")}</label> : null}
      <label className="text-sm font-semibold text-stone-200">Medical conditions, injuries, allergies, or limitations?<select name="medicalCondition" value={form.medicalCondition} onChange={update} aria-invalid={Boolean(errors.medicalCondition)} className={`mt-2 ${selectClass("medicalCondition")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("medicalCondition")}</label>
      <label className="text-sm font-semibold text-stone-200">Will you attend regularly and follow academy requirements?<select name="attendRegularly" value={form.attendRegularly} onChange={update} aria-invalid={Boolean(errors.attendRegularly)} className={`mt-2 ${selectClass("attendRegularly")}`}><option value="">Select one</option><option>Yes</option><option>No</option></select>{error("attendRegularly")}</label>
      {form.medicalCondition === "Yes" ? <label className="text-sm font-semibold text-stone-200 md:col-span-2">Medical details<textarea name="medicalDetails" value={form.medicalDetails} onChange={update} aria-invalid={Boolean(errors.medicalDetails)} className={`mt-2 ${inputClass("medicalDetails")}`} rows={3} />{error("medicalDetails")}</label> : null}
    </div> : null}
    {step === 3 ? <div className="mt-8 space-y-5"><div className="rounded-2xl border border-white/10 bg-black/35 p-5 text-sm text-stone-300"><p className="font-bold text-white">Review your registration</p><p className="mt-2">{form.fullName}</p><p>{form.emailAddress} · {form.phoneNumber}</p><p>{form.homeAddress}</p></div><details className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-stone-300"><summary className="cursor-pointer font-bold text-white">Read the Liability Waiver</summary><p className="mt-3 leading-7">I voluntarily participate in this program and assume responsibility for associated risks. I understand karate involves physical activity and agree to follow safety instructions.</p></details>{checkboxes.map(([name, label, required]) => <label className={`flex gap-3 rounded-xl border p-4 text-sm text-stone-200 ${errors[name] ? "border-red-400 bg-red-950/20" : "border-white/10 bg-white/5"}`} key={name}><input type="checkbox" name={name} checked={Boolean(form[name])} onChange={update} aria-invalid={Boolean(errors[name])} className="mt-1 h-4 w-4" /><span>{label}{required ? <span className="ml-1 text-red-300">*</span> : null}{error(name)}</span></label>)}<div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-semibold text-stone-200">Participant electronic signature<input name="participantSignature" value={form.participantSignature} onChange={update} aria-invalid={Boolean(errors.participantSignature)} className={`mt-2 ${inputClass("participantSignature")}`} placeholder="Type your full legal name" />{error("participantSignature")}</label>{under18 ? <label className="text-sm font-semibold text-stone-200">Parent/guardian electronic signature<input name="parentGuardianSignature" value={form.parentGuardianSignature} onChange={update} aria-invalid={Boolean(errors.parentGuardianSignature)} className={`mt-2 ${inputClass("parentGuardianSignature")}`} placeholder="Type full legal name" />{error("parentGuardianSignature")}</label> : null}</div></div> : null}
    <input type="text" name="website" value={form.website} onChange={update} className="absolute left-[-9999px]" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><button type="button" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1 || isSubmitting} className="min-h-12 rounded-md border border-white/20 px-5 text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-40">Back</button>{step < 3 ? <button type="button" onClick={nextStep} className="min-h-12 rounded-md bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-red-500">Continue</button> : <button type="submit" disabled={isSubmitting} className="min-h-12 rounded-md bg-red-600 px-6 text-xs font-black uppercase tracking-[0.14em] text-white hover:bg-red-500 disabled:opacity-60">{isSubmitting ? "Submitting Registration…" : "Continue to Payment"}</button>}</div>
  </form>;
}
