import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
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
    // Allow these without session
    if (pathname === "/admin/login") return NextResponse.next();
    if (pathname === "/admin/verify-email") return NextResponse.next(); // keep if you have this route

    // Require session cookie
    const token = req.cookies.get("admin_token")?.value;
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