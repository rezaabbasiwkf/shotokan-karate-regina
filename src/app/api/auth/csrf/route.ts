import { NextResponse } from "next/server";
import { CSRF_COOKIE, randomToken } from "@/lib/portal/security";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = randomToken(24);
  const response = NextResponse.json({ success: true, csrfToken: token });
  response.cookies.set(CSRF_COOKIE, token, { httpOnly: false, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 4 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
