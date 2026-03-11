import { NextRequest } from "next/server";
import { ok, fail } from "@/lib/http/response";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { HttpError } from "@/lib/http/errors";
import {
  getAllBookingHistory,
  deleteAllBookingHistory,
} from "@/modules/booking-history/booking-history.service";

export async function GET(_request: NextRequest) {
  try {
    const session = await requireAdminSession({ redirectToLogin: false });

    if (session.role !== "SUPER_ADMIN") {
      throw new HttpError(403, "Forbidden");
    }

    const data = await getAllBookingHistory();

    return ok(data, 200);
  } catch (err) {
    return fail(err);
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    const session = await requireAdminSession({ redirectToLogin: false });

    if (session.role !== "SUPER_ADMIN") {
      throw new HttpError(403, "Forbidden");
    }

    const result = await deleteAllBookingHistory();

    return ok(
      {
        message: "All booking edit history deleted successfully.",
        ...result,
      },
      200
    );
  } catch (err) {
    return fail(err);
  }
}