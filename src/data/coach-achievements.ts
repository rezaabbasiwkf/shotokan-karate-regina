export type CareerStage = "Youth" | "Junior" | "Adult";
export type AchievementCategory = "Kata" | "Kumite" | "Not specified";
export type CompetitionLevel =
  | "Provincial"
  | "National"
  | "International"
  | "Certificates and Awards";
export type Placement = "Gold Medal" | "Silver Medal" | "Bronze Medal" | "Award";

export type CoachAchievement = {
  id: string;
  title: string;
  year: number;
  career_stage: CareerStage;
  category: AchievementCategory;
  competition_level: CompetitionLevel;
  record_type: "Certificates and Awards";
  placement: Placement;
  division?: string;
  location?: string;
  organization?: string;
  description: string;
  certificate_image: string;
  certificate_alt: string;
  medal_image?: string;
  competition_photo?: string;
  display_order: number;
  featured: boolean;
  visible: boolean;
};

// Add new certificate images under public/images/coach-achievements, then create
// a record here. Entries are ordered by display_order; set visible to false to
// hide a record without deleting it.
export const coachAchievements: CoachAchievement[] = [
  {
    id: "2015-world-men-championship-gold",
    title: "7th World Men Karate Do Championship",
    year: 2015,
    career_stage: "Adult",
    category: "Not specified",
    competition_level: "International",
    record_type: "Certificates and Awards",
    placement: "Gold Medal",
    division: "Men’s −84 kg",
    location: "Tehran, Iran",
    organization: "Shitoryu Shukokai Union / I.R. Iran Karate Federation",
    description:
      "Certificate awarded to Reza Abbasi for achieving gold in the men’s −84 kg division on September 17–18, 2015, in Tehran, Iran.",
    certificate_image:
      "/images/coach-achievements/2015-world-men-championship-gold.jpg",
    certificate_alt:
      "2015 7th World Men Karate Do Championship certificate awarded to Reza Abbasi for gold in the men’s minus 84 kilogram division",
    display_order: 10,
    featured: true,
    visible: true,
  },
];

export const visibleCoachAchievements = coachAchievements
  .filter((achievement) => achievement.visible)
  .sort((a, b) => a.display_order - b.display_order);
