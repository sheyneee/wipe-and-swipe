import { ok, fail } from "@/lib/http/response";
import { requireAdmin } from "@/lib/auth/jwt";
import { handleListBookings } from "@/modules/booking/booking.controller";

export async function GET(req: Request) {
  try {
    requireAdmin(req);
    const data = await handleListBookings(req);
    return ok(data, 200);
  } catch (err) {
    return fail(err);
  }
}