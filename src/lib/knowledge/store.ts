import { suppliedRefereeingResources } from "@/data/refereeing-resources";
import { readPortalDatabase } from "@/lib/portal/store";
import type { KnowledgeArticle, KnowledgeResource } from "./types";

export async function getKnowledgeContent(): Promise<{
  resources: KnowledgeResource[];
  articles: KnowledgeArticle[];
}> {
  try {
    const database = await readPortalDatabase();
    return {
      resources: [...suppliedRefereeingResources, ...database.knowledge_resources].sort(
        (a, b) => a.display_order - b.display_order,
      ),
      articles: [...database.knowledge_articles].sort((a, b) => a.display_order - b.display_order),
    };
  } catch {
    return { resources: suppliedRefereeingResources, articles: [] };
  }
}

export async function getPublishedKnowledgeContent() {
  const content = await getKnowledgeContent();
  return {
    resources: content.resources.filter((item) => item.status === "published"),
    articles: content.articles.filter((item) => item.status === "published"),
  };
}

export async function findKnowledgeResource(slug: string) {
  const { resources } = await getPublishedKnowledgeContent();
  return resources.find((item) => item.slug === slug) || null;
}
