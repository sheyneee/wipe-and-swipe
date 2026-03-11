import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http/response";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { HttpError } from "@/lib/http/errors";
import { deleteBookingHistoryById } from "@/modules/booking-history/booking-history.service";

type RouteContext = {
  params: Promise<{ historyId: string }>;
};

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const session = await requireAdminSession({ redirectToLogin: false });

    if (session.role !== "SUPER_ADMIN") {
      throw new HttpError(403, "Forbidden");
    }

    const { historyId } = await context.params;
    const deleted = await deleteBookingHistoryById(historyId);

    return ok(
      {
        message: "Booking edit history deleted successfully.",
        data: deleted,
      },
      200
    );
  } catch (err) {
    return fail(err);
  }
}