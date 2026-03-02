import { CreateBookingSchema, UpdateBookingStatusSchema } from "./booking.validator";
import { createBooking, listBookings, updateBookingStatus } from "./booking.service";

export async function handleCreateBooking(req: Request) {
  const body = CreateBookingSchema.parse(await req.json());
  return createBooking(body);
}

export async function handleListBookings(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  return listBookings(status);
}

export async function handleUpdateBooking(req: Request, id: string) {
  const body = UpdateBookingStatusSchema.parse(await req.json());
  return updateBookingStatus(id, body.status);
}