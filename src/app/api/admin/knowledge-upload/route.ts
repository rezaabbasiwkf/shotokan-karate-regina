import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { accountFromRequest } from "@/lib/portal/auth";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ error: "Cross-site uploads are not permitted." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const admin = await accountFromRequest(request, { verified: true, admin: true });
        if (!admin) throw new Error("Administrator access is required.");
        const payload = JSON.parse(clientPayload || "{}") as { kind?: string };
        const image = payload.kind === "image";
        return {
          allowedContentTypes: image
            ? ["image/jpeg", "image/png", "image/webp"]
            : ["application/pdf"],
          maximumSizeInBytes: image ? 8 * 1024 * 1024 : 30 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ adminId: admin.id, kind: image ? "image" : "pdf" }),
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return Response.json(response);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "The upload could not be authorized." },
      { status: 400 },
    );
  }
}
