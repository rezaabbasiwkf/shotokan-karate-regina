import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && request.headers.get("x-forwarded-proto") === "http") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }
  const response = NextResponse.next();
  const embeddableDocument = /^\/(documents\/refereeing|api\/knowledge-documents)\//.test(request.nextUrl.pathname);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  response.headers.set("X-Frame-Options", embeddableDocument ? "SAMEORIGIN" : "DENY");
  if (/^\/(account|register|payment|registration-complete|admin|api\/admin|api\/receipts|api\/registrations)/.test(request.nextUrl.pathname)) response.headers.set("Cache-Control", "private, no-store");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("Content-Security-Policy", `default-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors ${embeddableDocument ? "'self'" : "'none'"}; object-src 'none'; img-src 'self' data: blob:; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.blob.vercel-storage.com`);
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
