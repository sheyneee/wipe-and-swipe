import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL("/admin/login", req.url);

  const response = NextResponse.redirect(url);

  response.cookies.set({
    name: "admin_token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });

  return response;
}