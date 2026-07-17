export type CertificationCategory = "Instructor" | "Coaching" | "Referee" | "Federation" | "Professional Development";
export type CertificationScope = "International" | "National" | "Provincial" | "Regional" | "Club";

export type CoachCertification = {
  id: string;
  englishTitle: string;
  originalTitle: string;
  issuingOrganization: string;
  certificateType: string;
  certificationLevel?: string;
  issueDate: string;
  expiryDate?: string;
  originalCalendar: "Solar Hijri" | "Gregorian";
  gregorianDate?: string;
  certificateLanguage: "Persian" | "Persian and English";
  country: string;
  province?: string;
  city?: string;
  category: CertificationCategory;
  scope: CertificationScope;
  englishDescription: string;
  originalNotes?: string;
  certificateImage: string;
  certificateAlt: string;
  featured: boolean;
  displayOrder?: number;
  sortDate: string;
  visible: boolean;
};

export const coachCertifications: CoachCertification[] = [
  {
    id: "2022-karate-training-grade-a",
    englishTitle: "Karate Training Certification – Grade A",
    originalTitle: "حکم مربیگری",
    issuingOrganization: "I.R. Iran Karate Federation",
    certificateType: "Karate Training Certification",
    certificationLevel: "Grade A",
    issueDate: "5 Mordad 1401 SH",
    originalCalendar: "Solar Hijri",
    gregorianDate: "July 27, 2022",
    certificateLanguage: "Persian and English",
    country: "Iran",
    province: "West Azerbaijan",
    category: "Instructor",
    scope: "National",
    englishDescription: "Training certification issued by the I.R. Iran Karate Federation after completion of a six-day JKA Shotokan course and related examinations in West Azerbaijan Province.",
    certificateImage: "/images/coach-certifications/karate-grade-a-redacted.png",
    certificateAlt: "Privacy-redacted Grade A karate training certificate issued to Coach Reza Abbasi by the I.R. Iran Karate Federation in 2022.",
    featured: true,
    sortDate: "2022-07-27",
    visible: true,
  },
  {
    id: "2021-kickboxing-coaching-grade-3",
    englishTitle: "WKA Kickboxing Practical Coaching – Grade 3",
    originalTitle: "گواهینامه کلاس مربیگری عملی درجه سه کیک بوکسینگ",
    issuingOrganization: "World Kickboxing Association – Iran",
    certificateType: "Practical Coaching Course",
    certificationLevel: "Grade 3",
    issueDate: "7 Esfand 1399 SH",
    originalCalendar: "Solar Hijri",
    gregorianDate: "February 25, 2021",
    certificateLanguage: "Persian",
    country: "Iran",
    city: "Tehran",
    category: "Coaching",
    scope: "National",
    englishDescription: "Certificate of participation in a Grade 3 practical kickboxing coaching course conducted in Tehran under WKA Iran.",
    certificateImage: "/images/coach-certifications/kickboxing-coaching-grade-3.jpg",
    certificateAlt: "Coach Reza Abbasi Grade 3 practical kickboxing coaching certificate issued by WKA Iran in 2021.",
    featured: false,
    sortDate: "2021-02-25",
    visible: true,
  },
  {
    id: "2019-self-defence-coaching-grade-3",
    englishTitle: "National Self-Defence Coaching Certificate – Grade 3",
    originalTitle: "گواهینامه مربیگری دفاع شخصی",
    issuingOrganization: "Islamic Republic of Iran Judo Federation",
    certificateType: "National Coaching Certificate",
    certificationLevel: "Grade 3",
    issueDate: "26 Mordad 1398 SH",
    originalCalendar: "Solar Hijri",
    gregorianDate: "August 17, 2019",
    certificateLanguage: "Persian and English",
    country: "Iran",
    province: "West Azerbaijan",
    category: "Coaching",
    scope: "National",
    englishDescription: "National Grade 3 self-defence coaching certification issued by the Islamic Republic of Iran Judo Federation.",
    certificateImage: "/images/coach-certifications/self-defence-grade-3-redacted.png",
    certificateAlt: "Privacy-redacted Grade 3 national self-defence coaching certificate issued to Coach Reza Abbasi in 2019.",
    featured: true,
    sortDate: "2019-08-17",
    visible: true,
  },
  {
    id: "2017-kabaddi-coaching-grade-3",
    englishTitle: "Kabaddi Coaching License – Grade 3",
    originalTitle: "گواهینامه مربیگری درجه سه کبدی",
    issuingOrganization: "Kabaddi Federation of the Islamic Republic of Iran",
    certificateType: "Coaching License",
    certificationLevel: "Grade 3",
    issueDate: "11 Ordibehesht 1396 SH",
    originalCalendar: "Solar Hijri",
    gregorianDate: "May 1, 2017",
    certificateLanguage: "Persian",
    country: "Iran",
    province: "West Azerbaijan",
    city: "Miandoab",
    category: "Coaching",
    scope: "National",
    englishDescription: "Grade 3 kabaddi coaching qualification awarded after participation in a federation course and successful completion of the required examinations.",
    certificateImage: "/images/coach-certifications/kabaddi-grade-3-redacted.png",
    certificateAlt: "Privacy-redacted Grade 3 kabaddi coaching certificate issued to Coach Reza Abbasi in 2017.",
    featured: false,
    sortDate: "2017-05-01",
    visible: true,
  },
];

const scopeOrder: Record<CertificationScope, number> = { International: 0, National: 1, Provincial: 2, Regional: 3, Club: 4 };

export const visibleCoachCertifications = coachCertifications
  .filter((item) => item.visible)
  .sort((a, b) => scopeOrder[a.scope] - scopeOrder[b.scope] || (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999) || b.sortDate.localeCompare(a.sortDate));
