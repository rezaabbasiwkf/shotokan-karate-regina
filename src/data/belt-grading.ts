export type GradingLevel = {
  slug: string;
  title: string;
  rank: string;
  tenure?: string;
  page: number;
  image: string;
  imageAlt: string;
  kihon: string[];
  kata: string[];
  kumite: string[];
  notes?: string[];
};

const pdf = "/documents/belt-grading/shotokan-karate-yxe-exam-guide-may-2026.pdf";
export const gradingDocument = { source: pdf, pageCount: 13, title: "Shotokan Karate YXE Exam Guide — May 2026" };

export const gradingLevels: GradingLevel[] = [
  {
    slug: "white-to-yellow", title: "White Belt → Yellow Belt", rank: "8th Kyu", tenure: "3 months after 9th Kyu", page: 2, image: "white-to-yellow.png", imageAlt: "White-belt student demonstrating gedan-barai",
    kihon: ["From zenkutsu-dachi with gedan-barai move forward with chudan-oizuki. — Step punch at chest level in front stance", "Move backward with gedan-barai. — Downward block", "Move forward with age-uke. — Rising block", "Move backward Uchi-soto-uke. — Inside block.", "Move forward with chudan-Soto-uke. — Outside block", "Change to kokutsu-dachi and move backward with shuto-uke. — Knife-hand block", "Move forward kokutsu-dachi with shuto-uke. — Knife-hand block", "Turn, moving forward with mae-geri from zenkutsu-dachi. — Front stance, front snap kick", "Change to kiba-dachi and move sideways with yoko-geri-keage and return using the other leg to kick. — Horse stance, side snap kick"],
    kata: ["Shitei Kata: Heian Shodan (no count)"],
    kumite: ["Gohon kumite – 5 times attack and defence Jodan, Chudan (counter attack after 5th attack)", "Start on left or right (examiner’s choice)", "For jodan and chudan, kamae in gedan barai"],
  },
  {
    slug: "yellow-to-orange", title: "Yellow Belt → Orange Belt", rank: "7th Kyu", tenure: "3 months after 8th kyu", page: 3, image: "yellow-to-orange.png", imageAlt: "Yellow-belt student demonstrating a block",
    kihon: ["From zenkutsu-dachi with gedan-barai move forward with chudan-oizuki. — Step front stance and punch at chest level in front stance", "Move backward with gedan-barai. — Downward block", "Move forward with age-uke, gyaka zuki. — Rising block, reverse punch", "Move backward Uchi-soto-uke, gyaka zuki — Inside block, reverse punch", "Move forward with chudan-Soto-uke, gyaka zuki — Outside block, reverse punch", "Change to kokutsu-dachi and move backward with shuto-uke. — Back stance, knife-hand block", "Move backward kokutsu-dachi with shuto-uke. — Back stance, knife-hand block", "Moving forward with mae-geri from zenkutsu-dachi. — Front stance, front snap kick", "Moving forward with mawashi-geri from zenkutsu-dachi. — Front stance, round house kick", "Change to kiba-dachi, move sideways with yoko-geri-keage and return using the other leg to kick. — Horse stance and side snap kick", "Change to kiba-dachi, move sideways, yoko-geri-kekomi and return using the other leg to kick. — Horse stance and side thrust kick"],
    kata: ["Shitei Kata: Heian Nidan"],
    kumite: ["Sanbon kumite – 3 times attack and defence", "Jodan, chudan and mae geri", "Hands move to the side after the chudan attack and immediately before the mae geri attack"],
  },
  {
    slug: "orange-to-green", title: "Orange Belt → Green Belt", rank: "6th Kyu", tenure: "3months after 7th kyu", page: 4, image: "orange-to-green.png", imageAlt: "Orange-belt student demonstrating mae-geri",
    kihon: ["From zenkutsu-dachi with gedan-barai move forward with chudan-oizuki. — Step front stance and punch at chest level in front stance", "Move backward with gedan-barai. — Downward Block", "Move forward with age-uke, gyaka zuki. — Rising Block, reverse punch", "Move backward Uchi-soto-uke, gyaka zuki. — Inside Block, reverse punch", "Move forward with chudan-Soto-uke, gyaka zuki. — Outside Block, reverse punch", "Change to kokutsu-dachi and move backward with shuto-uke. — Back stance and Knife-hand block", "Move forwards kokutsu-dachi with shuto-uke. — Back stance and Knife-hand block", "Turn, moving forward with mae-geri from zenkutsu-dachi. — Front Snap Kick", "Change to kiba-dachi and move sideways with yoko-geri-keage and return using the other leg to kick. — Horse stance with Side Snap Kick", "Kiba-dachi and move sideways with yoko-geri-Kekomi and return using the other leg to kick. — Horse stance with Side Thrust Kick"],
    kata: ["Shitei Kata: Heian Sandan"],
    kumite: ["Sanbon Kumite is optional (examiners choice)", "Kihon ippon kumite – single attack and defence", "Jodan x 1", "Chudan x 1", "Mae geri x 1", "Left hand side only, counter with gyaku zuki"],
  },
  {
    slug: "green-to-blue", title: "Green Belt → Blue Belt", rank: "5th Kyu", tenure: "3 months after 6th kyu", page: 5, image: "green-to-blue.png", imageAlt: "Green-belt student demonstrating yoko-geri-keage",
    kihon: ["From zenkutsu-dachi with gedan-barai move forward with chudan-oizuki.", "Move backward with gedan-barai to Gyaku zuki.", "Move forward with age-uke to Gyaku zuki.", "Move backward Uchi-soto-uke to Gyaku zuki.", "Move forward with chudan-Soto-uke to Gyaku zuki.", "Change to kokutsu-dachi and move backward with shuto-uke.", "Move forwards kokutsu-dachi with shuto-uke.", "Turn, moving forward with mae-geri from zenkutsu-dachi.", "Turn around with zenkutsu-dachi, Mawashi geri moving forwards.", "Change to kiba-dachi and move sideways with yoko-geri-keage and return using the other leg to kick. The same for yoko-geri-kekomi.", "Kiba-dachi and move sideways with yoko-geri-Kekomi and return using the other leg to kick."],
    kata: ["Shitei Kata: Heian Yondan"],
    kumite: ["Sanbon Kumite is optional (examiners choice)", "Kihon ippon kumite – single attack and defence", "Jodan x 1", "Chudan x 1", "Mae geri x 1", "Left & right hand side – examiner’s choice", "Counters must be a zuki or uchi or keri (keri means kick)", "The same counter may not be demonstrated twice in a row"],
  },
  {
    slug: "blue-to-purple", title: "Blue Belt → Purple Belt", rank: "4th Kyu", tenure: "6 months after 5th kyu", page: 6, image: "blue-to-purple.png", imageAlt: "Blue-belt student demonstrating Shotokan basics",
    kihon: ["From zenkutsu-dachi with gedan-barai move forward with chudan-oizuki.", "Move backward with gedan-barai to Gyaku zuki.", "Move forward with age-uke to Gyaku zuki.", "Move backward Uchi-soto-uke to Gyaku zuki.", "Move forward with chudan-Soto-uke to Gyaku zuki shift to Kiba dachi Empi uchi.", "Change to kokutsu-dachi and move backward with shuto-uke shift to Zenkutsu Nukite.", "Move forwards kokutsu-dachi with shuto-uke shift to zenkutsu Nukite.", "Turn, moving forward with mae-geri from zenkutsu-dachi.", "Turn around with zenkutsu-dachi, Mawashi geri moving forwards.", "Change to kiba-dachi and move sideways with yoko-geri-keage and return using the other leg to kick. The same for yoko-geri-kekomi.", "Kiba-dachi and move sideways with yoko-geri-Kekomi and return using the other leg to kick."],
    kata: ["Shitei Kata: Heian Godan"],
    kumite: ["Kihon ippon kumite – single attack and defence", "Jodan x1", "Chudan x1", "Mae geri x1", "Mawashi geri x1", "Yoko geri kekomi x1", "Left and right hand side – examiner’s choice", "Counters must be a zuki or uchi or keri", "The same counter may not be demonstrated twice in a row", "Spirit and focus with Kiai"],
  },
  {
    slug: "purple-to-first-brown", title: "Purple Belt → First Brown Belt", rank: "3rd Kyu", tenure: "6 months after 4th kyu", page: 7, image: "purple-to-first-brown.png", imageAlt: "Purple-belt student demonstrating Sanbon Zuki",
    kihon: ["From zenkutsu-dachi with gedan-barai move forward with Sanbon Zuki.", "Move backward with gedan-barai to Gyaku zuki.", "Move forward with age-uke to Gyaku zuki.", "Move backward Uchi-soto-uke/Kizami zuki to Gyaku zuki.", "Move forward with chudan-Soto-uke to Gyaku zuki shift to Kiba dachi Empi uchi.", "Change to kokutsu-dachi and move backward with shuto-uke shift to Zenkutsu Nukite.", "Move forwards kokutsu-dachi with shuto-uke shift to zenkutsu Nukite.", "Turn, moving forward with mae-geri from zenkutsu-dachi.", "Turn, Moving forwards Ren-Geri (Jodan/Chudan, Chudan/Jodan mae geri)", "Turn around with zenkutsu-dachi, Mawashi geri moving forwards.", "Change to kiba-dachi and move sideways with yoko-geri-keage and return using the other leg to kick. The same for yoko-geri-kekomi.", "Kiba-dachi and move sideways with yoko-geri-Kekomi and return using the other leg to kick.", "GYAKU ZUKI (Idomokuhyo: punching at different points by examiner’s direction)"],
    kata: ["Shitei Kata: Tekki Shodan"],
    kumite: ["Kihon Ippon Kumite – single attack and defence", "Jodan x2", "Chudan x2", "Mae geri x2", "Mawashi geri x2", "Yoko geri kekomi x2", "Left and right hand side – examiner’s choice", "Counters must be a zuki or uchi or keri", "The same counter may not be demonstrated twice in a row", "Must demonstrate two different blocks"],
  },
  {
    slug: "first-brown-to-second-brown", title: "First Brown Belt → Second Brown Belt", rank: "2th Kyu", tenure: "6 months after 3rd kyu", page: 8, image: "first-brown-to-second-brown.png", imageAlt: "First brown-belt student preparing a combination",
    kihon: ["From zenkutsu-dachi with gedan-barai move forward with Oi zuki", "Turn and move forwards zenkutsu dachi with Sanbon Zuki.", "Move backward with gedan-barai to Gyaku zuki.", "Move forward with age-uke to Gyaku zuki.", "Move backward Uchi-soto-uke/Kizami zuki to Gyaku zuki.", "Move forward with chudan-Soto-uke to Gyaku zuki shift to Kiba dachi Empi uchi to Uraken uke.", "Change to kokutsu-dachi and move backward with shuto-uke shift to Zenkutsu Nukite.", "Move forwards kokutsu-dachi with shuto-uke shift to zenkutsu Nukite.", "Turn, moving forward with mae-geri from zenkutsu-dachi.", "Turn, Moving forwards Ren-Geri (Jodan/Chudan, Chudan/Jodan mae geri)", "Turn Moving forwards Ren-Geri (Mae Geri/Mawashi geri, Mawashi geri/Mae geri)", "Turn around with zenkutsu-dachi, Mawashi geri moving forwards.", "Change to kiba-dachi and move sideways with yoko-geri-keage and return using the other leg to kick. The same for yoko-geri-kekomi.", "Kiba-dachi and move sideways with yoko-geri-Kekomi and return using the other leg to kick.", "GYAKU ZUKI (Idomokuhyo: punching at different points by examiner’s direction)"],
    kata: ["Sentei Kata: Bassai Dai", "Shitei Kata: Instructor may select any Kata from Heian Shodan to Tekki Shodan"],
    notes: ["Turning Techniques: Refer to appendix"],
    kumite: ["Jiyu ippon kumite – Free single attack and defence", "Jodan x2", "Chudan x2", "Mae geri x2", "Mawashi geri x2", "Yoko geri kekomi x2", "Ushiro geri x2", "Kizami zuki x2", "Gyku zuki x2", "Counters must be a zuki or uchi or keri. The same counter may not be demonstrated twice in a row", "Demonstrate dynamic kumite, stepping in, good timing (sen no sen), Gyaku zuki ok if close"],
  },
  {
    slug: "second-brown-to-third-brown", title: "Second Brown Belt → Third Brown Belt", rank: "1th Kyu", tenure: "6 months after 2nd Kyu", page: 9, image: "second-brown-to-third-brown.png", imageAlt: "Second brown-belt student demonstrating mawashi-geri",
    kihon: ["From Kamae position move forward with Kizami Zuki to Sanbon Zuki.", "Move backward with gedan-barai/Uraken to Gyaku zuki.", "Move forward with age-uke to Gyaku zuki.", "Move backward Uchi-soto-uke/Kizami zuki to Gyaku zuki.", "Move forward with chudan-Soto-uke to Gyaku zuki shift to Kiba dachi Empi uchi to Uraken uke.", "Change to kokutsu-dachi and move backward with shuto-uke, Kizami Mae geri, shift to Zenkutsu Nukite.", "Move forwards kokutsu-dachi with shuto-uke, Kizami Mae Geri, shift to zenkutsu Nukite.", "Moving forward with mae-geri from zenkutsu-dachi.", "Turn, Moving forwards Ren-Geri (Jodan/Chudan, Chudan/Jodan mae geri)", "Turn Moving forwards Ren-Geri (Mae Geri/Mawashi geri, Mawashi geri/Mae geri)", "Turn around with zenkutsu-dachi, Mawashi geri moving forwards.", "Change to kiba-dachi and move sideways with yoko-geri-keage change legs and pivot, Yoko Kekomi. Three times each way.", "GYAKU ZUKI (Idomokuhyo: punching at different points by examiner’s direction)"],
    kata: ["Shitei Kata: Bassai Dai, Jion, Empi or Kanku Dai", "Sentei Kata: Instructor may select any Kata from Heian Shodan to Tekki Shodan (if student does not do Bassai that is also an option for instructor to select)"],
    notes: ["Turning Techniques: Refer to appendix"],
    kumite: ["Jiyu ippon kumite – Free single attack and defence", "Jodan x2", "Chudan x2", "Mae geri x2", "Mawashi geri x2", "Yoko geri kekomi x2", "Ushiro geri x2", "Kizami zuki x2", "Gyku zuki x2", "Counters must be a zuki or uchi or keri. The same counter may not be demonstrated twice in a row", "Demonstrate dynamic kumite, stepping in, good timing (sen no sen), Gyaku zuki ok if close"],
  },
  {
    slug: "third-brown-to-shodan", title: "Third Brown Belt → First Dan Black Belt", rank: "1st Kyu to Shodan", page: 10, image: "third-brown-to-shodan.png", imageAlt: "Third brown-belt student demonstrating a punching sequence",
    notes: ["↑ moving forward", "↓ moving backwards", "↔ repeat the technique", "Karate-ka to demonstrate each technique 5 times - own count", "Turning Techniques: Refer to appendix"],
    kihon: ["From zenkutsu dachi – gedan barai", "↑ Sanbon Zuki (jodan, chudan, chudan)", "↑ Sanbon Gyaku Zuki (spinning first gyaku zuki, then jodan,chudan)", "↓ Age uke, tate uraken, gyaku zuki (age uke and vertical uraken with same arm)", "↑ Soto uke, empi in kiba dachi TO SIDE, spinning uraken, gyaku zuki in zenkutsu dachi TO FRONT", "↓ Uchi uke, kizami zuki, gyaku zuki, mawashi empi", "Change stance to kokutsu dachi", "↑ Spinning shuto uke, kizami geri, nukite (nukite in zenkutsu dachi)", "Change stance to zenkutsu dachi – gedan barai", "Karate-ka to demonstrate each technique 3 times - own count", "↑↑↔ Mae geri, mawashi geri, gyaku zuki", "↑↑↔ Mae geri, yoko geri keage, gyaku zuki", "↑ Step mawashi gari, yoko geri kekomi, Gyaku zu", "Change stance to zenkutsu dachi, facing the examiner (shomen kamae)", "↑ Mae geri, mawashi geri (same leg, to front)", "↑ Mawashi geri, kekomi geri (same leg, to front)"],
    kata: ["Shitei kata (compulsory kata): Examiner’s choice from Heian1 – 5, Tekki Sho-dan", "Sentei kata (free choice kata): Examinee chooses from Bassai-dai, Kanku-dai, Enpi, Jion"],
    kumite: ["Examiner’s choice: Jiyu ippon kumite – Free single attack and defence OR Jiyu kumite – Free sparring", "Jodan x 2", "Chudan x2", "Mae geri x2", "Mawashi geri x2", "Yoko geri kekomi x2", "Ushiro geri x2", "Kizami zuki x2", "Gyaku zuki x2", "Counters must be a zuki, uchi and keri. The same counter may not be demonstrated twice in a row"],
  },
  {
    slug: "shodan-to-nidan", title: "First Dan Black Belt → Second Dan Black Belt", rank: "Shodan to Nidan", page: 11, image: "second-dan.png", imageAlt: "Black-belt student demonstrating a chambered kick",
    notes: ["↑ moving forward", "↓ moving backwards", "→ moving to the side", "↔ repeat the technique", "Karate-ka to demonstrate each technique 5 times - own count", "Turning Techniques: Refer to appendix"],
    kihon: ["From Jiyu Ni Kamae", "↑→↑ Sanbon oi zuki gyaku zuki spinning gyaku zuki", "↑ Age uke, soto uke, gedan barai, uchi uke, mae geri gyakuzuki, all with the same hand", "↑ Sanbon geri: kizami mae geri, mae geri, mawashi geri, (the mae geri leg is placed back and then kicks mawashi geri moving forward. Mae geri and mawashi geri with same leg)", "↓↑ Age uke (stepping back), then moving forward with mawashi geri and (step through) uraken and oi zuki", "↓ Uchi uke, Kizami zuki Kokutsu), Gyaku zuki (Zenktusu) (F)", "↑ Step mawashi gari, yoko geri kekomi, Gyaku zu", "Change stance to fudo dachi gedan barai", "↑Oizuki", "↓ Sanbon zuki: (chudan, jodan, chudan)", "↑ Spinning uraken gyaku zuki, spinning back with gedan barai, step mae geri oizuki", "Change stance to zenkutsu dachi facing the examiners’ table (shomen)", "Karate-ka to demonstrate each technique 3 times - own count", "↑→↓ mae geri to the front ↑ yoko geri kekomi to the side → ushiro geri to the back ↓", "This combination is to be demonstrated on the same leg and repeated on the other leg."],
    kata: ["Sentei kata (free kata) - 2 sentei kata", "Shitei kata (compulsory kata) Examiner’s choice from: Heian 1 – 5; Tekki Shodan, Tekki Nidan, Bassai Dai, Enpi, Kanku-dai, Jion, Jitte", "The following four kata are discretionary – candidates should possess only a working knowledge thereof: Gankaku, Kanku Sho"],
    kumite: ["This is a fighting examination, candidate must demonstrate hard fighting spirit while controlling the kumite. Kumite must have intensity", "Jiyu kumite"],
  },
  {
    slug: "nidan-to-sandan", title: "Second Dan Black Belt → Third Dan Black Belt", rank: "Nidan to Sandan", page: 12, image: "third-dan.png", imageAlt: "Senior black-belt student demonstrating a controlled kick",
    notes: ["↑ moving forwards", "↓ moving backwards", "→ moving to the side", "↔ repeat the technique", "Karate-ka to demonstrate each technique 4 times - own count"],
    kihon: ["From fudo dachi – gedan barai", "↑ Sanbon zuki", "Change stance to Jiyu Ni Kame", "↑↑↔ Change step oi zuki, spinning gyaku zuki", "↓↑↔ Oi zuki, gyaku zuki forwards, pivot 45 degrees to the back with gyaku zuki, spinning (back turn) with uraken and gyaku zuki to front", "↑↓ Oi zuki, forward, shift back gedan barai (same hand) and gyaku zuki", "Change to zenkutsu dachi gedan barai – facing the examiner’s table (shomen)", "Karate-ka to demonstrate each technique 3 times - own count", "↑ mae geri, gyaku zuki. → yoko geri keage, gyaku zuki ↑ mawashi geri, gyaku zuki. ↓ ushiro geri, gyaku zuki", "↑→↓↑ mae geri to the front ↑, yoko geri to the side →, ushiro geri to the back ↓, mawashi geri to the front ↑", "This combination is to be demonstrated on the same leg and repeated on the other leg.", "The turning technique (Refer to apendix)"],
    kata: ["Sentei kata (free choice): 2 sentei kata", "The following 14 kata are shitei (compulsory) and the examiner may choose any one or more: Heian 1 – 5; Bassai Dai; Hangetsu; Tekki Shodan; Kanku-dai; Jitte; Tekki Nidan; Enpi; Tekki Sandan; Jion", "The following six kata are discretionary – candidates should possess only a working knowledge thereof: Bassai Sho; Nijushiho; Kanku Sho; Chinte; Sochin; Gankaku"],
    kumite: ["Jiyu kumite"],
  },
];

export const beltSteps = ["White", "Yellow", "Orange", "Green", "Blue", "Purple", "First Brown", "Second Brown", "Third Brown", "Shodan", "Nidan", "Sandan"];

export function gradingBySlug(slug: string) {
  return gradingLevels.find((level) => level.slug === slug);
}
