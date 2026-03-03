import { NextResponse } from "next/server";
import { verifyEmail } from "@/modules/admin/admin.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const token = url.searchParams.get("token");

  if (!id || !token) {
    return NextResponse.redirect(new URL("/verify-email?status=missing", url.origin));
  }

  try {
    const result = await verifyEmail(id, token);
    const account = encodeURIComponent(String(result.accountStatus));

    return NextResponse.redirect(
      new URL(`/verify-email?status=success&account=${account}`, url.origin)
    );
  } catch {
    return NextResponse.redirect(new URL("/verify-email?status=expired", url.origin));
  }
}