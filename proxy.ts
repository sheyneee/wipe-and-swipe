import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminHost = host.startsWith("admin.");

  // Block /admin on main domain
  if (isAdminRoute && !isAdminHost) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (isAdminRoute) {
    const token = req.cookies.get("admin_token")?.value;

    // If already logged in, don't allow going back to login
    if (pathname === "/admin/login") {
      if (token) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }

    // Allow verify-email without session
    if (pathname === "/admin/verify-email") {
      return NextResponse.next();
    }

    // Protect all other admin routes
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};