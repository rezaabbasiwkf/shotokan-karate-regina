"use client";

import { upload } from "@vercel/blob/client";
import { useMemo, useState } from "react";
import { portalFetch } from "@/lib/client/portal-fetch";
import { safelyReadJson } from "@/lib/client/safe-json";
import { knowledgeCategories, type KnowledgeArticle, type KnowledgeResource } from "@/lib/knowledge/types";

const fieldClass = "mt-2 min-h-11 w-full rounded-md border border-white/15 bg-stone-950 px-3 py-2 text-white outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20";

export function KnowledgeContentManager({ resources, articles }: { resources: KnowledgeResource[]; articles: KnowledgeArticle[] }) {
  const [contentType, setContentType] = useState<"pdf" | "article">("pdf");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState({ title: "Untitled resource", summary: "A preview of the summary will appear here.", category: "General Refereeing" });
  const items = useMemo(() => [
    ...resources.map((raw) => ({ kind: "resource" as const, raw: raw as KnowledgeResource & KnowledgeArticle })),
    ...articles.map((raw) => ({ kind: "article" as const, raw: raw as KnowledgeResource & KnowledgeArticle })),
  ].sort((a, b) => a.raw.display_order - b.raw.display_order), [resources, articles]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      let blobPathname = "";
      let coverImage = "";
      if (contentType === "pdf") {
        const file = formData.get("pdf") as File;
        if (!file?.size) throw new Error("Choose a PDF to upload.");
        const result = await upload(`knowledge-center/${file.name}`, file, { access: "private", handleUploadUrl: "/api/admin/knowledge-upload", clientPayload: JSON.stringify({ kind: "pdf" }) });
        blobPathname = result.pathname;
      }
      const image = formData.get("image") as File;
      if (image?.size) {
        const result = await upload(`knowledge-center/${image.name}`, image, { access: "private", handleUploadUrl: "/api/admin/knowledge-upload", clientPayload: JSON.stringify({ kind: "image" }) });
        coverImage = result.pathname;
      }
      const payload = Object.fromEntries(formData.entries()) as Record<string, unknown>;
      delete payload.pdf; delete payload.image;
      payload.content_type = contentType;
      payload.blob_pathname = blobPathname;
      payload.cover_image = coverImage;
      payload.featured = formData.get("featured") === "on";
      payload.allow_download = formData.get("allow_download") === "on";
      payload.allow_print = formData.get("allow_print") === "on";
      const response = await portalFetch("/api/admin/knowledge-content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await safelyReadJson<{ message?: string }>(response);
      if (!response.ok) throw new Error(data.message || "The content could not be saved.");
      setMessage("Content saved. Refreshing the manager…");
      setTimeout(() => window.location.reload(), 700);
    } catch (error) { setMessage(error instanceof Error ? error.message : "The content could not be saved."); }
    finally { setBusy(false); }
  }

  async function update(id: string, kind: string, change: Record<string, unknown>) {
    setBusy(true); setMessage("");
    try {
      const response = await portalFetch("/api/admin/knowledge-content", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, kind, ...change }) });
      const data = await safelyReadJson<{ message?: string }>(response);
      if (!response.ok) throw new Error(data.message || "Update failed.");
      setMessage(data.message || "Content updated."); setTimeout(() => window.location.reload(), 500);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Update failed."); }
    finally { setBusy(false); }
  }

  async function saveMetadata(event: React.FormEvent<HTMLFormElement>, id: string, kind: string) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await update(id, kind, Object.fromEntries(data.entries()));
  }

  async function replacePdf(event: React.ChangeEvent<HTMLInputElement>, id: string) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setMessage("Uploading replacement PDF…");
    try {
      const result = await upload(`knowledge-center/${file.name}`, file, { access: "private", handleUploadUrl: "/api/admin/knowledge-upload", clientPayload: JSON.stringify({ kind: "pdf" }) });
      await update(id, "resource", { blob_pathname: result.pathname });
    } catch (error) { setMessage(error instanceof Error ? error.message : "The replacement could not be uploaded."); setBusy(false); }
  }

  return <div className="grid gap-8 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
    <form onSubmit={submit} onChange={(event) => { const form = event.currentTarget; const data = new FormData(form); setPreview({ title: String(data.get("title") || "Untitled resource"), summary: String(data.get("short_description") || "A preview of the summary will appear here."), category: String(data.get("document_category") || "General Refereeing") }); }} className="rounded-2xl border border-white/10 bg-black/45 p-5 sm:p-7">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Content type">
        {(["pdf", "article"] as const).map((type)=><button type="button" key={type} onClick={()=>setContentType(type)} aria-pressed={contentType===type} className={`min-h-11 rounded-full border px-4 text-sm font-bold capitalize ${contentType===type?"border-red-500 bg-red-600":"border-white/15"}`}>{type === "pdf" ? "PDF resource" : "Article"}</button>)}
      </div>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <label className="text-sm font-bold text-stone-200 md:col-span-2">Title<input name="title" required maxLength={180} className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200 md:col-span-2">Summary<textarea name="short_description" required maxLength={1000} rows={4} className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200">Category<select name="document_category" className={fieldClass}>{knowledgeCategories.map((item)=><option key={item}>{item}</option>)}</select></label>
        <label className="text-sm font-bold text-stone-200">Status<select name="status" defaultValue="draft" className={fieldClass}><option value="draft">Draft — preview only</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
        {contentType === "pdf" ? <>
          <label className="text-sm font-bold text-stone-200 md:col-span-2">PDF file<input name="pdf" type="file" accept="application/pdf,.pdf" required className={`${fieldClass} file:mr-3 file:rounded file:border-0 file:bg-red-600 file:px-3 file:py-1 file:text-white`} /></label>
          <label className="text-sm font-bold text-stone-200">Document type<input name="document_type" placeholder="Official rule document" className={fieldClass} /></label>
          <label className="text-sm font-bold text-stone-200">Issuing organization<input name="issuing_organization" className={fieldClass} /></label>
          <label className="text-sm font-bold text-stone-200">Edition or version<input name="edition_or_version" className={fieldClass} /></label>
          <label className="text-sm font-bold text-stone-200">Page count<input name="page_count" type="number" min="1" className={fieldClass} /></label>
          <label className="text-sm font-bold text-stone-200">Publication date<input name="publication_date" type="date" className={fieldClass} /></label>
          <label className="text-sm font-bold text-stone-200">Effective date<input name="effective_date" type="date" className={fieldClass} /></label>
        </> : <>
          <label className="text-sm font-bold text-stone-200">Section heading<input name="section_heading" className={fieldClass} /></label>
          <label className="text-sm font-bold text-stone-200">Content label<select name="section_label" className={fieldClass}><option>Educational Explanation</option><option>Official Rule</option><option>Practical Example</option></select></label>
          <label className="text-sm font-bold text-stone-200 md:col-span-2">Article content<textarea name="body" required rows={9} className={fieldClass} /></label>
          <label className="text-sm font-bold text-stone-200">PDF page reference<input name="page_reference" placeholder="Page 12" className={fieldClass} /></label>
        </>}
        <label className="text-sm font-bold text-stone-200">Revision date<input name="revision_date" type="date" className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200">Last reviewed<input name="last_reviewed" type="date" required defaultValue="2026-07-16" className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200">Author or source<input name="author_or_source" className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200 md:col-span-2">Source URL<input name="source_url" type="url" placeholder="https://" className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200 md:col-span-2">Keywords<input name="keywords" placeholder="Comma-separated keywords" className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200 md:col-span-2">Related resource IDs<input name="related_resources" placeholder="Comma-separated IDs" className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200">Display order<input name="display_order" type="number" defaultValue="100" className={fieldClass} /></label>
        <label className="text-sm font-bold text-stone-200">Featured image<input name="image" type="file" accept="image/jpeg,image/png,image/webp" className={`${fieldClass} file:mr-2 file:border-0 file:bg-stone-700 file:text-white`} /></label>
        <div className="flex flex-wrap gap-5 md:col-span-2"><label className="flex min-h-11 items-center gap-2 text-sm"><input name="featured" type="checkbox" /> Featured</label>{contentType === "pdf" ? <><label className="flex min-h-11 items-center gap-2 text-sm"><input name="allow_download" type="checkbox" /> Download authorized</label><label className="flex min-h-11 items-center gap-2 text-sm"><input name="allow_print" type="checkbox" /> Print authorized</label></> : null}</div>
      </div>
      <button disabled={busy} className="mt-7 min-h-12 rounded-md bg-red-600 px-6 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-50">{busy ? "Saving…" : "Upload and save content"}</button>
      {message ? <p className="mt-4 text-sm text-red-200" role="status">{message}</p> : null}
    </form>
    <div className="space-y-6">
      <section className="rounded-2xl border border-red-400/25 bg-red-950/15 p-6"><p className="text-xs font-black uppercase tracking-[0.16em] text-red-300">Preview before publishing</p><h2 className="hero-title mt-3 text-2xl font-bold text-white">{preview.title}</h2><p className="mt-2 text-xs font-black uppercase tracking-[0.13em] text-stone-500">{preview.category}</p><p className="mt-4 leading-7 text-stone-300">{preview.summary}</p></section>
      <section className="rounded-2xl border border-white/10 bg-black/45 p-5"><h2 className="text-xl font-black text-white">Managed content</h2><p className="mt-2 text-sm text-stone-500">Edit, replace, archive, publish, or reorder administrator-created entries.</p><div className="mt-5 space-y-3">{items.map((item)=>{ const record = item.raw; return <article key={record.id} className="rounded-lg border border-white/10 p-4"><p className="font-bold text-white">{record.title}</p><p className="mt-1 text-xs uppercase tracking-[0.12em] text-stone-500">{item.kind} · {record.status}</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={busy} onClick={()=>update(record.id,item.kind,{status:record.status === "published" ? "archived" : "published"})} className="min-h-10 rounded border border-white/15 px-3 text-xs font-bold text-white">{record.status === "published" ? "Archive" : "Publish"}</button><label className="flex min-h-10 items-center gap-2 rounded border border-white/15 px-3 text-xs">Order<input aria-label={`Display order for ${record.title}`} type="number" defaultValue={record.display_order} className="w-14 bg-transparent text-white" onBlur={(event)=>update(record.id,item.kind,{display_order:Number(event.target.value)})} /></label>{item.kind === "resource" ? <label className="flex min-h-10 cursor-pointer items-center rounded border border-white/15 px-3 text-xs font-bold">Replace PDF<input className="sr-only" type="file" accept="application/pdf,.pdf" onChange={(event)=>replacePdf(event,record.id)} /></label> : null}</div><details className="mt-3 border-t border-white/10 pt-3"><summary className="cursor-pointer text-sm font-bold text-red-300">Edit metadata</summary><form className="mt-3 space-y-3" onSubmit={(event)=>saveMetadata(event,record.id,item.kind)}><label className="block text-xs text-stone-400">Title<input name="title" defaultValue={record.title} className={fieldClass} /></label><label className="block text-xs text-stone-400">Summary<textarea name={item.kind === "article" ? "summary" : "short_description"} defaultValue={item.kind === "article" ? record.summary : record.short_description} rows={3} className={fieldClass} /></label><label className="block text-xs text-stone-400">Category<select name="document_category" defaultValue={item.kind === "article" ? record.category : record.document_category} className={fieldClass}>{knowledgeCategories.map((category)=><option key={category}>{category}</option>)}</select></label>{item.kind === "resource" ? <label className="block text-xs text-stone-400">Edition or version<input name="edition_or_version" defaultValue={record.edition_or_version} className={fieldClass} /></label> : <label className="block text-xs text-stone-400">Article content<textarea name="body" defaultValue={record.sections[0]?.body} rows={5} className={fieldClass} /></label>}<label className="block text-xs text-stone-400">Revision date<input name="revision_date" type="date" defaultValue={record.revision_date} className={fieldClass} /></label><label className="block text-xs text-stone-400">Last reviewed<input name="last_reviewed" type="date" defaultValue={record.last_reviewed} className={fieldClass} /></label><label className="block text-xs text-stone-400">Keywords<input name="keywords" defaultValue={record.keywords.join(", ")} className={fieldClass} /></label><label className="block text-xs text-stone-400">Related IDs<input name="related_resources" defaultValue={record.related_resources.join(", ")} className={fieldClass} /></label><button disabled={busy} className="min-h-10 rounded bg-red-600 px-4 text-xs font-bold text-white">Save metadata</button></form></details></article>})}{!items.length ? <p className="text-sm text-stone-500">No administrator-created content yet.</p> : null}</div></section>
    </div>
  </div>;
}
