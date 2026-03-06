import { ok, fail } from "@/lib/http/response";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { handleListBookings } from "@/modules/booking/booking.controller";

export async function GET(req: Request) {
  try {
    await requireAdminSession();
    const data = await handleListBookings(req);
    return ok(data, 200);
  } catch (err) {
    return fail(err);
  }
}