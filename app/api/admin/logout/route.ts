import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getCookieDomain(hostname: string) {
  if (hostname.endsWith(".wipeandswipe.co.nz") || hostname === "wipeandswipe.co.nz") {
    return ".wipeandswipe.co.nz";
  }

  return undefined;
}

export async function GET(req: NextRequest) {
  const url = new URL("/admin/login", req.url);
  const domain = getCookieDomain(new URL(req.url).hostname);

  const response = NextResponse.redirect(url);

  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    domain,
  });

  return response;
}