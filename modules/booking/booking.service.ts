import { dbConnect } from "@/lib/db/mongodb";
import { Booking } from "@/modules/booking/booking.model";
import { HttpError } from "@/lib/http/errors";

type CreateBookingInput = {
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  serviceAddress?: string;
  preferredDate: string; // ISO string
  preferredTime: string;
  specialRequests?: string;
};

export async function createBooking(input: CreateBookingInput) {
  await dbConnect();

  const booking = await Booking.create({
    ...input,
    email: input.email.toLowerCase(),
    preferredDate: new Date(input.preferredDate),
    status: "PENDING",
  });

  return { id: String(booking._id) };
}

export async function listBookings(status?: string) {
  await dbConnect();

  const query: Record<string, unknown> = {};
  if (status) query.status = status;

  return Booking.find(query).sort({ createdAt: -1 }).lean();
}

export async function updateBookingStatus(id: string, status: string) {
  await dbConnect();

  const updated = await Booking.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (!updated) throw new HttpError(404, "Booking not found");

  return updated;
}