export const knowledgeCategories = [
  "General Refereeing",
  "Kata Rules",
  "Kumite Rules",
  "Para Karate",
  "Referee Signals",
  "Competition Procedures",
  "Penalties and Warnings",
  "Video Review",
  "Training Materials",
  "Official Rule Documents",
  "Educational Presentations",
] as const;

export type KnowledgeCategory = (typeof knowledgeCategories)[number];
export type KnowledgeStatus = "draft" | "published" | "archived";
export type KnowledgeLabel = "Official Rule" | "Educational Explanation" | "Practical Example";

export type KnowledgeResource = {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  document_category: KnowledgeCategory;
  document_type: string;
  issuing_organization: string;
  edition_or_version: string;
  publication_date: string;
  revision_date: string;
  effective_date: string;
  language: string;
  pdf_file: string;
  blob_pathname: string;
  cover_image: string;
  author_or_source: string;
  keywords: string[];
  featured: boolean;
  display_order: number;
  status: KnowledgeStatus;
  allow_download: boolean;
  allow_print: boolean;
  source_url: string;
  last_reviewed: string;
  page_count: number;
  related_resources: string[];
  createdAt: string;
  updatedAt: string;
};

export type KnowledgeArticleSection = {
  id: string;
  heading: string;
  label: KnowledgeLabel;
  body: string;
  page_reference: string;
};

export type KnowledgeArticle = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: KnowledgeCategory;
  keywords: string[];
  revision_date: string;
  last_reviewed: string;
  author_or_source: string;
  featured_image: string;
  sections: KnowledgeArticleSection[];
  related_resources: string[];
  featured: boolean;
  display_order: number;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
};
