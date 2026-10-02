import type { MetadataRoute } from "next";
import { gradingLevels } from "@/data/belt-grading";
import { getPublishedKnowledgeContent } from "@/lib/knowledge/store";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

// Omit dates for static pages rather than inventing a content revision date.
const publicPaths = [
  "/", "/classes", "/register", "/updates", "/self-defense",
  "/coach-achievements", "/coach-certifications", "/karate-knowledge-center",
  "/karate-refereeing", "/karate-refereeing/resources", "/belt-grading",
  "/after-school-program", "/trial-class", "/privacy", "/liability-waiver",
  "/refund-policy", "/photo-video-consent", "/terms",
];

function publishedEntry(path: string, updatedAt: string): MetadataRoute.Sitemap[number] {
  const date = new Date(updatedAt);
  return {
    url: `${SITE_URL}${path}`,
    ...(Number.isNaN(date.getTime()) ? {} : { lastModified: date }),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { resources, articles } = await getPublishedKnowledgeContent();
  const entries: MetadataRoute.Sitemap = [
    ...publicPaths.map((path) => ({ url: path === "/" ? SITE_URL : `${SITE_URL}${path}` })),
    ...gradingLevels.map((level) => ({ url: `${SITE_URL}/belt-grading/${level.slug}` })),
    ...resources.map((resource) => publishedEntry(`/karate-refereeing/resources/${resource.slug}`, resource.updatedAt)),
    ...articles.map((article) => publishedEntry(`/karate-refereeing/articles/${article.slug}`, article.updatedAt)),
  ];
  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
