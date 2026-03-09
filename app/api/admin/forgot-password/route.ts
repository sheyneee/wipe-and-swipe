import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http/response";
import { handleForgotPassword } from "@/modules/admin/admin.controller";

export async function POST(request: NextRequest) {
  try {
    const data = await handleForgotPassword(request);
    return ok(data, 200);
  } catch (err) {
    return fail(err);
  }
}