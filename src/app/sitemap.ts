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
  ];
}
