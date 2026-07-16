import { accountFromRequest } from "@/lib/portal/auth";
import { assertCsrf, cleanText } from "@/lib/portal/security";
import { audit, mutatePortalDatabase, newId } from "@/lib/portal/store";
import { apiError } from "@/lib/portal/validation";
import { knowledgeCategories, type KnowledgeCategory, type KnowledgeLabel, type KnowledgeStatus } from "@/lib/knowledge/types";

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}

function strings(value: unknown, maxItems = 30) {
  const source = Array.isArray(value) ? value : String(value || "").split(",");
  return source.map((item) => cleanText(item, 120)).filter(Boolean).slice(0, maxItems);
}

function category(value: unknown): KnowledgeCategory {
  const cleaned = cleanText(value, 80) as KnowledgeCategory;
  return knowledgeCategories.includes(cleaned) ? cleaned : "General Refereeing";
}

function status(value: unknown): KnowledgeStatus {
  const cleaned = cleanText(value, 20);
  return cleaned === "published" || cleaned === "archived" ? cleaned : "draft";
}

export async function POST(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure admin session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  const admin = await accountFromRequest(request, { verified: true, admin: true });
  if (!admin) return apiError("Administrator access is required.", 403, "ADMIN_REQUIRED");
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const contentType = cleanText(payload.content_type, 20);
  const title = cleanText(payload.title, 180);
  const summary = cleanText(payload.short_description || payload.summary, 1000);
  if (!title || !summary) return apiError("A title and summary are required.");
  const now = new Date().toISOString();

  try {
    const saved = await mutatePortalDatabase((database) => {
      if (contentType === "article") {
        const label = cleanText(payload.section_label, 40) as KnowledgeLabel;
        const article = {
          id: newId("article"), slug: slugify(cleanText(payload.slug, 120) || title), title, summary,
          category: category(payload.document_category), keywords: strings(payload.keywords),
          revision_date: cleanText(payload.revision_date, 10), last_reviewed: cleanText(payload.last_reviewed, 10),
          author_or_source: cleanText(payload.author_or_source, 160) || "SHOTOKAN Karate Regina",
          featured_image: cleanText(payload.cover_image, 600),
          sections: [{ id: newId("section"), heading: cleanText(payload.section_heading, 180) || title, label: (["Official Rule", "Educational Explanation", "Practical Example"].includes(label) ? label : "Educational Explanation") as KnowledgeLabel, body: cleanText(payload.body, 12000), page_reference: cleanText(payload.page_reference, 100) }],
          related_resources: strings(payload.related_resources), featured: Boolean(payload.featured),
          display_order: Number(payload.display_order) || 100, status: status(payload.status), createdAt: now, updatedAt: now,
        };
        database.knowledge_articles.push(article);
        audit(database, request, admin.id, "knowledge.article.created", "knowledge_article", article.id, article.title);
        return article;
      }

      const blobPathname = cleanText(payload.blob_pathname, 600);
      if (!blobPathname.startsWith("knowledge-center/")) throw new Error("PDF_REQUIRED");
      const item = {
        id: newId("resource"), slug: slugify(cleanText(payload.slug, 120) || title), title,
        short_description: summary, document_category: category(payload.document_category),
        document_type: cleanText(payload.document_type, 100) || "Educational document",
        issuing_organization: cleanText(payload.issuing_organization, 180),
        edition_or_version: cleanText(payload.edition_or_version, 120),
        publication_date: cleanText(payload.publication_date, 10), revision_date: cleanText(payload.revision_date, 10),
        effective_date: cleanText(payload.effective_date, 10), language: cleanText(payload.language, 40) || "English",
        pdf_file: "", blob_pathname: blobPathname, cover_image: cleanText(payload.cover_image, 600),
        author_or_source: cleanText(payload.author_or_source, 180), keywords: strings(payload.keywords),
        featured: Boolean(payload.featured), display_order: Number(payload.display_order) || 100,
        status: status(payload.status), allow_download: Boolean(payload.allow_download), allow_print: Boolean(payload.allow_print),
        source_url: cleanText(payload.source_url, 500), last_reviewed: cleanText(payload.last_reviewed, 10),
        page_count: Math.max(1, Number(payload.page_count) || 1), related_resources: strings(payload.related_resources),
        createdAt: now, updatedAt: now,
      };
      database.knowledge_resources.push(item);
      audit(database, request, admin.id, "knowledge.resource.created", "knowledge_resource", item.id, item.title);
      return item;
    });
    return Response.json({ success: true, message: "Knowledge content saved.", item: saved });
  } catch (error) {
    if (error instanceof Error && error.message === "PDF_REQUIRED") return apiError("Upload a PDF before saving this resource.");
    console.error("KNOWLEDGE_CREATE_ERROR", error);
    return apiError("The knowledge content could not be saved.", 500, "SERVER_ERROR");
  }
}

export async function PATCH(request: Request) {
  try { assertCsrf(request); } catch { return apiError("Your secure admin session expired. Refresh and try again.", 403, "CSRF_FAILED"); }
  const admin = await accountFromRequest(request, { verified: true, admin: true });
  if (!admin) return apiError("Administrator access is required.", 403, "ADMIN_REQUIRED");
  const payload = await request.json().catch(() => ({})) as Record<string, unknown>;
  const id = cleanText(payload.id, 100), kind = cleanText(payload.kind, 20);
  if (!id) return apiError("The content identifier is missing.");
  try {
    await mutatePortalDatabase((database) => {
      if (kind === "article") {
        const item = database.knowledge_articles.find((entry) => entry.id === id);
        if (!item) throw new Error("NOT_FOUND");
        if (payload.title) item.title = cleanText(payload.title, 180);
        if (payload.summary) item.summary = cleanText(payload.summary, 1000);
        if (payload.document_category) item.category = category(payload.document_category);
        if (payload.keywords !== undefined) item.keywords = strings(payload.keywords);
        if (payload.revision_date !== undefined) item.revision_date = cleanText(payload.revision_date, 10);
        if (payload.last_reviewed !== undefined) item.last_reviewed = cleanText(payload.last_reviewed, 10);
        if (payload.author_or_source !== undefined) item.author_or_source = cleanText(payload.author_or_source, 180);
        if (payload.body !== undefined && item.sections[0]) item.sections[0].body = cleanText(payload.body, 12000);
        if (payload.status) item.status = status(payload.status);
        if (payload.display_order !== undefined) item.display_order = Number(payload.display_order) || 100;
        if (payload.featured !== undefined) item.featured = Boolean(payload.featured);
        if (payload.related_resources !== undefined) item.related_resources = strings(payload.related_resources);
        item.updatedAt = new Date().toISOString();
        audit(database, request, admin.id, "knowledge.content.updated", "knowledge_article", item.id, item.title);
        return;
      }
      const item = database.knowledge_resources.find((entry) => entry.id === id);
      if (!item) throw new Error("NOT_FOUND");
      if (payload.title) item.title = cleanText(payload.title, 180);
      if (payload.short_description) item.short_description = cleanText(payload.short_description, 1000);
      if (payload.document_category) item.document_category = category(payload.document_category);
      if (payload.edition_or_version !== undefined) item.edition_or_version = cleanText(payload.edition_or_version, 120);
      if (payload.revision_date !== undefined) item.revision_date = cleanText(payload.revision_date, 10);
      if (payload.last_reviewed !== undefined) item.last_reviewed = cleanText(payload.last_reviewed, 10);
      if (payload.author_or_source !== undefined) item.author_or_source = cleanText(payload.author_or_source, 180);
      if (payload.keywords !== undefined) item.keywords = strings(payload.keywords);
      if (payload.status) item.status = status(payload.status);
      if (payload.display_order !== undefined) item.display_order = Number(payload.display_order) || 100;
      if (payload.featured !== undefined) item.featured = Boolean(payload.featured);
      if (payload.related_resources !== undefined) item.related_resources = strings(payload.related_resources);
      if (payload.blob_pathname) item.blob_pathname = cleanText(payload.blob_pathname, 600);
      if (payload.cover_image) item.cover_image = cleanText(payload.cover_image, 600);
      item.updatedAt = new Date().toISOString();
      audit(database, request, admin.id, "knowledge.content.updated", "knowledge_resource", item.id, item.title);
    });
    return Response.json({ success: true, message: "Content updated." });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") return apiError("Content not found.", 404, "NOT_FOUND");
    return apiError("The content could not be updated.", 500, "SERVER_ERROR");
  }
}
