import type { MetadataRoute } from "next";
import { suppliedRefereeingResources } from "@/data/refereeing-resources";

const siteUrl = "https://shotokan-karate-regina.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseDate = new Date();

  return [
    {
      url: siteUrl,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/account`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/self-defense`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/coach-achievements`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/coach-certifications`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/karate-knowledge-center`,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/karate-refereeing`,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/karate-refereeing/resources`,
      lastModified: baseDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...suppliedRefereeingResources.map((resource) => ({
      url: `${siteUrl}/karate-refereeing/resources/${resource.slug}`,
      lastModified: new Date(resource.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    {
      url: `${siteUrl}/after-school-program`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/trial-class`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
