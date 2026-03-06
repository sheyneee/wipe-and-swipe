import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http/response";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { handleUpdateBooking } from "@/modules/booking/booking.controller";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requireAdminSession();

    const { id } = await context.params;
    const data = await handleUpdateBooking(request, id);

    return ok(data, 200);
  } catch (err) {
    return fail(err);
  }
}