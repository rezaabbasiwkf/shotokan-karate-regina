"use client";

import { useState } from "react";

const questions = [
  ["Are classes suitable for complete beginners?", "Yes. Students can begin with no prior martial arts experience; classes build fundamentals progressively in a welcoming environment."],
  ["What is the minimum age to join?", "Please contact the club to discuss the best starting option for your child. Our programs are designed for kids, teens, and adults."],
  ["What should students wear to their first class?", "Comfortable athletic clothing is suitable for a first class. A karate uniform can be discussed after enrollment."],
  ["How many classes are held each week?", "The current Regina class meets every Wednesday from 4:00 PM to 5:00 PM."],
  ["What are the tuition fees?", "Monthly tuition is $60, with a family rate of $50 per person per month. The first week is free."],
  ["Is previous martial arts experience required?", "No. Beginners are welcome, and experienced students receive training appropriate to their level."],
  ["How do registration and payment work?", "Submit the digital registration form, then use the PayPal payment step. The club verifies payment before completing enrollment."],
  ["Can students attend a trial class?", "Yes. Your first week is free—register or contact the club to arrange your visit."],
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return <div className="mx-auto max-w-4xl space-y-3">{questions.map(([question, answer], index) => (
    <article className="rounded-xl border border-white/10 bg-black/35" key={question}>
      <button type="button" className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-base font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-400 sm:px-6" aria-expanded={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
        {question}<span className="text-xl text-red-300" aria-hidden="true">{openIndex === index ? "−" : "+"}</span>
      </button>
      {openIndex === index ? <p className="border-t border-white/10 px-5 py-5 leading-7 text-stone-300 sm:px-6">{answer}</p> : null}
    </article>
  ))}</div>;
}
