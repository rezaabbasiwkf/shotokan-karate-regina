"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AddressAutocomplete } from "@/components/AddressAutocomplete";

declare global {
  interface Window {
    grecaptcha?: {
      render: (container: Element | string, parameters: Record<string, unknown>) => number;
      reset: (widgetId?: number) => void;
    };
  }
}

const initialFormState = {
  recaptchaToken: "",
  humanCheck: false,
  website: "",
  fullName: "",
  dateOfBirth: "",
  age: "",
  gender: "",
  phoneNumber: "",
  emailAddress: "",
  homeAddress: "",
  addressCity: "",
  addressProvince: "",
  postalCode: "",
  addressCountry: "Canada",
  emergencyContactName: "",
  emergencyContactPhone: "",
  parentGuardianName: "",
  similarProgramsBefore: "",
  motivation: "",
  heardAbout: "",
  healthDetails: "",
  medicationDetails: "",
  goals: "",
  nextGoals: "",
  attendRegularly: "",
  informationAccurate: false,
  understandsRisks: false,
  followsRules: false,
  authorizeEmergencyTreatment: false,
  photoPermission: false,
  feesNonRefundable: false,
  liabilityWaiver: false,
  participantName: "",
  participantSignature: "",
  parentGuardianSignature: "",
  parentGuardianNameConsent: "",
  date: "",
};

type FormState = typeof initialFormState;

type MessageState = {
  type: "success" | "error";
  message: string;
} | null;

const normalizeAge = (value: string) => value
  .trim()
  .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
  .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));

const getAgeError = (value: string) => {
  const normalized = normalizeAge(value);
  if (!normalized || !/^\d+$/.test(normalized)) return "Please enter a valid age.";
  const age = Number(normalized);
  return age < 4 || age > 100 ? "Age must be between 4 and 100." : "";
};

export function StudentRegistrationForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<MessageState>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const [recaptchaReady, setRecaptchaReady] = useState(() => !siteKey);

  useEffect(() => {
    if (!siteKey) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [siteKey]);

  useEffect(() => {
    if (!siteKey || !recaptchaReady || !recaptchaRef.current || typeof window === "undefined") {
      return;
    }

    if (!window.grecaptcha) {
      return;
    }

    const widgetId = window.grecaptcha.render(recaptchaRef.current, {
      sitekey: siteKey,
      callback: (token: string) => {
        setFormState((prev) => ({ ...prev, recaptchaToken: token }));
        setErrors((prev) => ({ ...prev, recaptchaToken: "" }));
      },
      "expired-callback": () => {
        setFormState((prev) => ({ ...prev, recaptchaToken: "" }));
      },
    });

    return () => {
      window.grecaptcha?.reset(widgetId);
    };
  }, [recaptchaReady, siteKey]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = event.target;
    const checked = type === "checkbox" ? (event.target as HTMLInputElement).checked : undefined;
    const nextValue = name === "age" ? normalizeAge(value) : value;

    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : nextValue,
    }));

    if (name === "age") {
      const ageError = getAgeError(nextValue);
      setErrors((prev) => ({ ...prev, age: ageError }));
    } else if (name === "similarProgramsBefore") {
      setErrors((prev) => ({ ...prev, similarProgramsBefore: nextValue ? "" : "Please select whether you have participated in a similar program before." }));
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    const requiredFields = [
      ["fullName", "Full name"],
      ["dateOfBirth", "Date of birth"],
      ["age", "Age"],
      ["gender", "Gender"],
      ["phoneNumber", "Phone number"],
      ["emailAddress", "Email address"],
      ["emergencyContactName", "Emergency contact name"],
      ["emergencyContactPhone", "Emergency contact phone number"],
      ["motivation", "What motivated you to join"],
      ["heardAbout", "How you heard about us"],
      ["healthDetails", "Health and safety details"],
      ["medicationDetails", "Medication details"],
      ["goals", "Goals for joining"],
      ["nextGoals", "Three to six month goals"],
      ["attendRegularly", "Attendance commitment"],
      ["participantName", "Participant name"],
      ["participantSignature", "Participant signature"],
      ["date", "Date"],
    ] as const;

    requiredFields.forEach(([fieldName, label]) => {
      const value = formState[fieldName as keyof FormState];
      if (typeof value === "string" && !value.trim()) {
        nextErrors[fieldName] = `${label} is required.`;
      }
    });

    if (!formState.homeAddress.trim()) nextErrors.homeAddress = "Please enter your street address.";
    if (!/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ][ -]?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(formState.postalCode.trim())) nextErrors.postalCode = "Please enter a valid Canadian postal code.";
    if (!formState.similarProgramsBefore) nextErrors.similarProgramsBefore = "Please select whether you have participated in a similar program before.";

    const numericAge = Number(normalizeAge(formState.age));
    const ageError = getAgeError(formState.age);
    if (ageError) nextErrors.age = ageError;

    if (formState.age && numericAge < 18 && !formState.parentGuardianName.trim()) {
      nextErrors.parentGuardianName = "Parent or guardian name is required for applicants under 18.";
    }

    if (formState.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.emailAddress)) {
      nextErrors.emailAddress = "Please enter a valid email address.";
    }

    if (formState.phoneNumber && !/^\+?[0-9\s().-]{7,15}$/.test(formState.phoneNumber)) {
      nextErrors.phoneNumber = "Please enter a valid phone number.";
    }

    if (formState.emergencyContactPhone && !/^\+?[0-9\s().-]{7,15}$/.test(formState.emergencyContactPhone)) {
      nextErrors.emergencyContactPhone = "Please enter a valid emergency contact phone number.";
    }

    if (!formState.informationAccurate) {
      nextErrors.informationAccurate = "Please confirm the information provided is accurate.";
    }
    if (!formState.understandsRisks) {
      nextErrors.understandsRisks = "Please confirm you understand the physical risks involved.";
    }
    if (!formState.followsRules) {
      nextErrors.followsRules = "Please confirm you will follow club rules and safety guidelines.";
    }
    if (!formState.authorizeEmergencyTreatment) {
      nextErrors.authorizeEmergencyTreatment = "Please authorize emergency treatment if needed.";
    }
    if (!formState.photoPermission) {
      nextErrors.photoPermission = "Please confirm photo and video permission.";
    }
    if (!formState.feesNonRefundable) {
      nextErrors.feesNonRefundable = "Please acknowledge the registration fee policy.";
    }
    if (!formState.liabilityWaiver) {
      nextErrors.liabilityWaiver = "Please confirm that you agree to the liability waiver.";
    }

    if (formState.website) {
      nextErrors.website = "Spam detected.";
    }

    if (siteKey) {
      if (!formState.recaptchaToken) {
        nextErrors.recaptchaToken = "Please complete the anti-spam verification.";
      }
    } else if (!formState.humanCheck) {
      nextErrors.humanCheck = "Please confirm you are not submitting this automatically.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormReady = [
    formState.fullName, formState.dateOfBirth, formState.gender, formState.phoneNumber,
    formState.emailAddress, formState.homeAddress, formState.postalCode, formState.emergencyContactName,
    formState.emergencyContactPhone, formState.similarProgramsBefore, formState.motivation,
    formState.heardAbout, formState.healthDetails, formState.medicationDetails, formState.goals,
    formState.nextGoals, formState.attendRegularly, formState.participantName,
    formState.participantSignature, formState.date,
  ].every((value) => value.trim())
    && !getAgeError(formState.age)
    && (Number(normalizeAge(formState.age)) >= 18 || Boolean(formState.parentGuardianName.trim()))
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.emailAddress)
    && /^\+?[0-9\s().-]{7,15}$/.test(formState.phoneNumber)
    && /^\+?[0-9\s().-]{7,15}$/.test(formState.emergencyContactPhone)
    && /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ][ -]?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(formState.postalCode.trim())
    && formState.informationAccurate && formState.understandsRisks && formState.followsRules
    && formState.authorizeEmergencyTreatment && formState.photoPermission && formState.feesNonRefundable
    && formState.liabilityWaiver && (siteKey ? Boolean(formState.recaptchaToken) : formState.humanCheck);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      setMessage({ type: "error", message: "Please review the highlighted fields and try again." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          age: Number(normalizeAge(formState.age)),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration could not be completed.");
      }

      router.push(`/payment?registration=${encodeURIComponent(data.submission.id)}`);
    } catch (error) {
      setMessage({
        type: "error",
        message: error instanceof Error ? error.message : "Registration could not be completed.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-stone-950/90 p-6 shadow-2xl shadow-black/40 sm:p-8 lg:p-10">
      <div className="mb-8 flex flex-col gap-2 border-b border-white/10 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-red-300">
          Student registration & enrollment
        </p>
        <h3 className="text-3xl font-black uppercase text-white sm:text-4xl">
          Digital registration form
        </h3>
        <p className="max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">
          Please complete each section carefully. All required information helps us prepare the best possible experience for your training journey.
        </p>
      </div>

      {message ? (
        <div
          className={`mb-8 rounded-xl border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-red-500/30 bg-red-500/10 text-red-200"
          }`}
        >
          {message.message}
        </div>
      ) : null}

      <div className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-black uppercase text-white">Section 1 — Personal information</h4>
              <p className="mt-2 text-sm text-stone-400">Please share your basic details so we can prepare your profile.</p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Full name</span>
              <input
                name="fullName"
                value={formState.fullName}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter full name"
              />
              {errors.fullName ? <p className="text-sm text-red-300">{errors.fullName}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Date of birth</span>
              <input
                type="date"
                name="dateOfBirth"
                value={formState.dateOfBirth}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
              />
              {errors.dateOfBirth ? <p className="text-sm text-red-300">{errors.dateOfBirth}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Age</span>
              <input
                type="text"
                name="age"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formState.age}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter age"
              />
              {errors.age ? <p className="text-sm text-red-300">{errors.age}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Gender</span>
              <select
                name="gender"
                value={formState.gender}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-stone-900 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
              >
                <option className="bg-stone-950 text-white" value="">Select gender</option>
                <option className="bg-stone-950 text-white" value="Female">Female</option>
                <option className="bg-stone-950 text-white" value="Male">Male</option>
                <option className="bg-stone-950 text-white" value="Non-binary">Non-binary</option>
                <option className="bg-stone-950 text-white" value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender ? <p className="text-sm text-red-300">{errors.gender}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Phone number</span>
              <input
                name="phoneNumber"
                value={formState.phoneNumber}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter phone number"
              />
              {errors.phoneNumber ? <p className="text-sm text-red-300">{errors.phoneNumber}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Email address</span>
              <input
                type="email"
                name="emailAddress"
                value={formState.emailAddress}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="name@example.com"
              />
              {errors.emailAddress ? <p className="text-sm text-red-300">{errors.emailAddress}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200 md:col-span-2">
              <span>Street address</span>
              <AddressAutocomplete value={formState.homeAddress} hasError={Boolean(errors.homeAddress)} onChange={(homeAddress) => { setFormState((prev) => ({ ...prev, homeAddress })); setErrors((prev) => ({ ...prev, homeAddress: homeAddress.trim() ? "" : "Please enter your street address." })); }} onSelect={(address) => { setFormState((prev) => ({ ...prev, homeAddress: address.street, addressCity: address.city, addressProvince: address.province, postalCode: address.postalCode, addressCountry: address.country })); setErrors((prev) => ({ ...prev, homeAddress: "", postalCode: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ][ -]?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i.test(address.postalCode) ? "" : "Please enter a valid Canadian postal code." })); }} />
              {errors.homeAddress ? <p className="text-sm text-red-300">{errors.homeAddress}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200"><span>City</span><input name="addressCity" value={formState.addressCity} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400" placeholder="City" autoComplete="address-level2" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-200"><span>Province</span><input name="addressProvince" value={formState.addressProvince} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400" placeholder="Province" autoComplete="address-level1" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-200"><span>Postal code</span><input name="postalCode" value={formState.postalCode} onChange={handleChange} className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400 ${errors.postalCode ? "border-red-400" : "border-white/10"}`} placeholder="S4P 3Y2" autoComplete="postal-code" />{errors.postalCode ? <p className="text-sm text-red-300">{errors.postalCode}</p> : null}</label>
            <label className="space-y-2 text-sm font-semibold text-stone-200"><span>Country</span><input name="addressCountry" value={formState.addressCountry} onChange={handleChange} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400" placeholder="Country" autoComplete="country-name" /></label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Emergency contact name</span>
              <input
                name="emergencyContactName"
                value={formState.emergencyContactName}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter emergency contact"
              />
              {errors.emergencyContactName ? <p className="text-sm text-red-300">{errors.emergencyContactName}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Emergency contact phone number</span>
              <input
                name="emergencyContactPhone"
                value={formState.emergencyContactPhone}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter emergency phone"
              />
              {errors.emergencyContactPhone ? <p className="text-sm text-red-300">{errors.emergencyContactPhone}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200 md:col-span-2">
              <span>Parent / guardian name (if under 18)</span>
              <input
                name="parentGuardianName"
                value={formState.parentGuardianName}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter parent or guardian name"
              />
              {errors.parentGuardianName ? <p className="text-sm text-red-300">{errors.parentGuardianName}</p> : null}
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <h4 className="text-xl font-black uppercase text-white">Section 2 — Background information</h4>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Have you participated in similar programs before?</span>
              <select
                name="similarProgramsBefore"
                value={formState.similarProgramsBefore}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-400/30 ${errors.similarProgramsBefore ? "border-red-400" : "border-stone-300"}`}
              >
                <option className="bg-white text-stone-900" value="">Select one</option>
                <option className="bg-white text-stone-900" value="Yes">Yes</option>
                <option className="bg-white text-stone-900" value="No">No</option>
              </select>
              {errors.similarProgramsBefore ? <p className="flex items-center gap-2 text-sm text-red-300"><span aria-hidden="true">⚠</span>{errors.similarProgramsBefore}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>What motivated you to join this program?</span>
              <textarea
                name="motivation"
                rows={4}
                value={formState.motivation}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Share your motivation"
              />
              {errors.motivation ? <p className="text-sm text-red-300">{errors.motivation}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200 md:col-span-2">
              <span>How did you hear about us?</span>
              <input
                name="heardAbout"
                value={formState.heardAbout}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Instagram, referral, community event, etc."
              />
              {errors.heardAbout ? <p className="text-sm text-red-300">{errors.heardAbout}</p> : null}
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <h4 className="text-xl font-black uppercase text-white">Section 3 — Health & safety</h4>
          <div className="mt-6 grid gap-5">
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Medical conditions, injuries, allergies, or physical limitations</span>
              <textarea
                name="healthDetails"
                rows={4}
                value={formState.healthDetails}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="List any relevant health or safety information"
              />
              {errors.healthDetails ? <p className="text-sm text-red-300">{errors.healthDetails}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Are you currently taking any medication that may affect participation?</span>
              <textarea
                name="medicationDetails"
                rows={3}
                value={formState.medicationDetails}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Provide medication details if applicable"
              />
              {errors.medicationDetails ? <p className="text-sm text-red-300">{errors.medicationDetails}</p> : null}
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <h4 className="text-xl font-black uppercase text-white">Section 4 — Expectations</h4>
          <div className="mt-6 grid gap-5">
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>What are your goals for joining this program?</span>
              <textarea
                name="goals"
                rows={4}
                value={formState.goals}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Tell us about your goals"
              />
              {errors.goals ? <p className="text-sm text-red-300">{errors.goals}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>What do you hope to achieve within the next 3–6 months?</span>
              <textarea
                name="nextGoals"
                rows={4}
                value={formState.nextGoals}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Share your short-term objectives"
              />
              {errors.nextGoals ? <p className="text-sm text-red-300">{errors.nextGoals}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Are you willing to attend classes regularly and follow program requirements?</span>
              <select
                name="attendRegularly"
                value={formState.attendRegularly}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
              >
                <option value="">Select one</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              {errors.attendRegularly ? <p className="text-sm text-red-300">{errors.attendRegularly}</p> : null}
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <h4 className="text-xl font-black uppercase text-white">Section 5 — Terms & conditions</h4>
          <div className="mt-6 space-y-3 text-sm text-stone-200">
            {[
              ["informationAccurate", "The information provided is accurate."],
              ["understandsRisks", "I understand karate involves physical activity and inherent risks."],
              ["followsRules", "I agree to follow all club rules and safety guidelines."],
              ["authorizeEmergencyTreatment", "I authorize emergency medical treatment if necessary."],
              ["photoPermission", "I grant permission for photos/videos to be used for promotional purposes."],
              ["feesNonRefundable", "I understand registration fees are non-refundable unless otherwise stated."],
              ["liabilityWaiver", "I have read and agree to the liability waiver."],
            ].map(([fieldName, label]) => (
              <label key={fieldName} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <input
                  type="checkbox"
                  name={fieldName}
                  checked={Boolean(formState[fieldName as keyof FormState])}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
                />
                <span>{label}</span>
              </label>
            ))}
            {errors.informationAccurate ? <p className="text-sm text-red-300">{errors.informationAccurate}</p> : null}
            {errors.understandsRisks ? <p className="text-sm text-red-300">{errors.understandsRisks}</p> : null}
            {errors.followsRules ? <p className="text-sm text-red-300">{errors.followsRules}</p> : null}
            {errors.authorizeEmergencyTreatment ? <p className="text-sm text-red-300">{errors.authorizeEmergencyTreatment}</p> : null}
            {errors.photoPermission ? <p className="text-sm text-red-300">{errors.photoPermission}</p> : null}
            {errors.feesNonRefundable ? <p className="text-sm text-red-300">{errors.feesNonRefundable}</p> : null}
            {errors.liabilityWaiver ? <p className="text-sm text-red-300">{errors.liabilityWaiver}</p> : null}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <h4 className="text-xl font-black uppercase text-white">Final consent</h4>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Participant name</span>
              <input
                name="participantName"
                value={formState.participantName}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter participant name"
              />
              {errors.participantName ? <p className="text-sm text-red-300">{errors.participantName}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Participant signature</span>
              <input
                name="participantSignature"
                value={formState.participantSignature}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Type your signature"
              />
              {errors.participantSignature ? <p className="text-sm text-red-300">{errors.participantSignature}</p> : null}
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Parent / guardian name (if applicable)</span>
              <input
                name="parentGuardianNameConsent"
                value={formState.parentGuardianNameConsent}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Enter parent or guardian name"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200">
              <span>Parent / guardian signature</span>
              <input
                name="parentGuardianSignature"
                value={formState.parentGuardianSignature}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
                placeholder="Type signature"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-stone-200 md:col-span-2">
              <span>Date</span>
              <input
                type="date"
                name="date"
                value={formState.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-red-400"
              />
              {errors.date ? <p className="text-sm text-red-300">{errors.date}</p> : null}
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/35 p-6">
          <h4 className="text-xl font-black uppercase text-white">Anti-spam verification</h4>
          <div className="mt-4 space-y-4">
            {siteKey ? (
              <>
                <div ref={recaptchaRef} className="min-h-[78px]" />
                {errors.recaptchaToken ? <p className="text-sm text-red-300">{errors.recaptchaToken}</p> : null}
              </>
            ) : (
              <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-stone-200">
                <input
                  type="checkbox"
                  name="humanCheck"
                  checked={formState.humanCheck}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent"
                />
                <span>I confirm I am not submitting this form automatically and that the information above is genuine.</span>
              </label>
            )}
            {errors.humanCheck ? <p className="text-sm text-red-300">{errors.humanCheck}</p> : null}
            <input
              type="text"
              name="website"
              value={formState.website}
              onChange={handleChange}
              autoComplete="off"
              tabIndex={-1}
              className="absolute left-[-9999px]"
              aria-hidden="true"
            />
            {errors.website ? <p className="text-sm text-red-300">{errors.website}</p> : null}
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-400">
          Your information will be stored securely and emailed to the club contact for review.
        </p>
        <button
          type="submit"
          disabled={isSubmitting || !isFormReady}
          className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-[0.24em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Submitting..." : "Continue to payment"}
        </button>
      </div>
    </form>
  );
}
