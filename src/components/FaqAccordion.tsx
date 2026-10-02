const questions = [
  ["Are classes suitable for complete beginners?", "Yes. Students can begin with no prior martial arts experience; classes build fundamentals progressively in a welcoming environment."],
  ["What is the minimum age to join?", "Please contact the club to discuss the best starting option for your child. Our programs are designed for kids, teens, and adults."],
  ["What should students wear to their first class?", "Comfortable athletic clothing is suitable for a first class. A karate uniform can be discussed after enrollment."],
  ["How many classes are held each week?", "Classes are held twice each week: Wednesdays and Sundays from 5:00 PM to 6:00 PM."],
  ["What are the tuition fees?", "Monthly tuition is $80, with a family discount rate of $70 per person per month."],
  ["Is previous martial arts experience required?", "No. Beginners are welcome, and experienced students receive training appropriate to their level."],
  ["How does registration work?", "Complete the digital registration form, or call registration and coordination at 306-519-5711 to arrange the next steps."],
  ["Can students attend a trial class?", "Yes. Your first week is free—register or contact the club to arrange your visit."],
];

export function FaqAccordion() {
  return <div className="mx-auto max-w-4xl space-y-3">{questions.map(([question, answer], index) => (
    <details open={index === 0} className="group rounded-xl border border-white/10 bg-black/35" key={question}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 text-left text-base font-bold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red-400 sm:px-6">
        {question}<span className="text-xl text-red-300 group-open:hidden" aria-hidden="true">+</span><span className="hidden text-xl text-red-300 group-open:inline" aria-hidden="true">−</span>
      </summary>
      <p className="border-t border-white/10 px-5 py-5 leading-7 text-stone-300 sm:px-6">{answer}</p>
    </details>
  ))}</div>;
}
