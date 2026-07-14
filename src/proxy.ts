import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function unauthorized() {
  return new NextResponse("Administrator authentication is required.", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Shotokan Karate Administration"' } });
}

export function proxy(request: NextRequest) {
  const password = process.env.ADMIN_DASHBOARD_PASSWORD;
  if (!password) return new NextResponse("Administrator access has not been configured.", { status: 503 });
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return unauthorized();
  try {
    const credentials = atob(authorization.slice(6));
    const [, suppliedPassword] = credentials.split(":", 2);
    return suppliedPassword === password ? NextResponse.next() : unauthorized();
  } catch { return unauthorized(); }
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
