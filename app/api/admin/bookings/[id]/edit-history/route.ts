import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http/response";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { HttpError } from "@/lib/http/errors";
import { getBookingHistoryByBookingId } from "@/modules/booking-history/booking-history.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const session = await requireAdminSession({ redirectToLogin: false });

    if (session.role !== "SUPER_ADMIN") {
      throw new HttpError(403, "Forbidden");
    }

    const { id } = await context.params;
    const data = await getBookingHistoryByBookingId(id);

    return ok(data, 200);
  } catch (err) {
    return fail(err);
  }
}