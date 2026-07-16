import { get } from "@vercel/blob";
import { getPublishedKnowledgeContent } from "@/lib/knowledge/store";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { resources } = await getPublishedKnowledgeContent();
  const { id } = await params;
  const resource = resources.find((item) => item.id === id);
  if (!resource?.blob_pathname) return new Response("Document not found.", { status: 404 });
  const download = new URL(request.url).searchParams.get("download") === "1";
  if (download && !resource.allow_download) return new Response("Download is not authorized.", { status: 403 });
  const result = await get(resource.blob_pathname, { access: "private" });
  if (!result || result.statusCode !== 200) return new Response("Document not found.", { status: 404 });
  return new Response(result.stream, { headers: {
    "Content-Type": "application/pdf",
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${resource.slug}.pdf"`,
    "Cache-Control": "private, no-cache",
    "X-Content-Type-Options": "nosniff",
  } });
}
