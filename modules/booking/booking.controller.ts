import { CreateBookingSchema, UpdateBookingSchema } from "./booking.validator";
import {
  createBooking,
  listBookings,
  updateBooking,
  deleteBooking,
} from "./booking.service";

type AdminActor = {
  userId: string;
  role: "SUPER_ADMIN" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
};

export async function handleCreateBooking(req: Request) {
  const body = CreateBookingSchema.parse(await req.json());
  return createBooking(body);
}

export async function handleListBookings(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status") || undefined;
  return listBookings(status);
}

export async function handleUpdateBooking(
  req: Request,
  id: string,
  actor: AdminActor
) {
  const json = await req.json();
  const parsed = UpdateBookingSchema.parse(json);
  return updateBooking(id, parsed, actor);
}

export async function handleDeleteBooking(
  id: string,
  actor: AdminActor
) {
  return deleteBooking(id, actor);
}