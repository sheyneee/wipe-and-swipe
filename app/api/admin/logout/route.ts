import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function getAdminBaseUrl(req: NextRequest) {
  const url = new URL(req.url);
  const isLocal = url.hostname === "localhost" || url.hostname === "admin.localhost";

  if (isLocal) {
    return "http://admin.localhost:3000";
  }

  return `${url.protocol}//admin.wipeandswipe.co.nz`;
}

export async function GET(req: NextRequest) {
  const adminBaseUrl = getAdminBaseUrl(req);
  const response = NextResponse.redirect(new URL("/admin/login", adminBaseUrl));

  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: ".wipeandswipe.co.nz",
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}