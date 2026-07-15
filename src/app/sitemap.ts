import type { MetadataRoute } from "next";

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
      url: `${siteUrl}/register`,
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
      url: `${siteUrl}/after-school-program`,
      lastModified: baseDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
