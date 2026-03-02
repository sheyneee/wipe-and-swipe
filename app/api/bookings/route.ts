import { ok, fail } from "@/lib/http/response";
import { handleCreateBooking } from "@/modules/booking/booking.controller";

export async function POST(req: Request) {
  try {
    const data = await handleCreateBooking(req);
    return ok(data, 201);
  } catch (err) {
    return fail(err);
  }
}