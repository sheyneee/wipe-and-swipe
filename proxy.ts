import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth/jwt";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminHost = host.startsWith("admin.");

  if (isAdminRoute && !isAdminHost) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  let hasValidToken = false;

  if (token) {
    try {
      verifyAdminToken(token);
      hasValidToken = true;
    } catch {
      hasValidToken = false;
    }
  }

  if (pathname === "/admin/login" || pathname === "/admin/verify-email") {
    return NextResponse.next();
  }

  if (!hasValidToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";

    const res = NextResponse.redirect(url);

    if (token) {
      res.cookies.set("admin_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      });
    }

    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};