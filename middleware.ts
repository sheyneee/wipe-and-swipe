import { NextResponse, NextRequest } from "next/server";

// OPTIONAL. Basic Auth gate for /admin routes.
// Set these in Vercel env for production.
// ADMIN_GATE_USER=someuser
// ADMIN_GATE_PASS=somepass
const GATE_USER = process.env.ADMIN_GATE_USER || "admin";
const GATE_PASS = process.env.ADMIN_GATE_PASS || "user123";

function requireBasicAuth(req: NextRequest) {
  if (!GATE_USER || !GATE_PASS) return null;

  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
    });
  }

  const decoded = Buffer.from(auth.slice(6), "base64").toString("utf8");
  const [user, pass] = decoded.split(":");

  if (user !== GATE_USER || pass !== GATE_PASS) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply only to /admin routes (except login page and verification page if you have it)
  if (pathname.startsWith("/admin")) {
    // Optional Basic Auth gate
    const gate = requireBasicAuth(req);
    if (gate) return gate;

    // Allow /admin/login without session
    if (pathname === "/admin/login") return NextResponse.next();

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