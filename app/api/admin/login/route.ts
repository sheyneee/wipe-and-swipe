import { NextResponse } from "next/server";
import { loginAdmin } from "@/modules/admin/admin.service";
import { HttpError } from "@/lib/http/errors";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  try {
    const { token, admin } = await loginAdmin(body.email, body.password);

    const res = NextResponse.json({ admin }, { status: 200 });

    // Secure cookie. HttpOnly so JS cannot read it.
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: true, // in localhost, Next still sets it, but browser may behave depending on scheme
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error: unknown) {
  if (error instanceof Error) {
    const status =
      (error as { statusCode?: number }).statusCode ?? 500;

    return NextResponse.json(
      { message: error.message },
      { status }
    );
  }

  return NextResponse.json(
    { message: "Login failed." },
    { status: 500 }
  );
}
}