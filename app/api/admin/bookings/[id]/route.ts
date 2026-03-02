import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http/response";
import { requireAdmin } from "@/lib/auth/jwt";
import { handleUpdateBooking } from "@/modules/booking/booking.controller";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    requireAdmin(request);

    const { id } = await context.params;
    const data = await handleUpdateBooking(request, id);

    return ok(data, 200);
  } catch (err) {
    return fail(err);
  }
}