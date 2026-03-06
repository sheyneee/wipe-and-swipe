import { NextResponse } from "next/server";
import { loginAdmin } from "@/modules/admin/admin.service";

function getCookieDomain(hostname: string) {
  if (hostname.endsWith(".wipeandswipe.co.nz") || hostname === "wipeandswipe.co.nz") {
    return ".wipeandswipe.co.nz";
  }

  return undefined;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: "Email and password are required." },
      { status: 400 }
    );
  }

  try {
    const { token, admin } = await loginAdmin(body.email, body.password);

    const url = new URL(req.url);
    const domain = getCookieDomain(url.hostname);

    const res = NextResponse.json({ admin }, { status: 200 });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      domain,
    });

    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      const status = (error as { statusCode?: number }).statusCode ?? 500;

      return NextResponse.json({ message: error.message }, { status });
    }

    return NextResponse.json({ message: "Login failed." }, { status: 500 });
  }
}