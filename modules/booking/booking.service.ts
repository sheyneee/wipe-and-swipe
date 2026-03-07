import { dbConnect } from "@/lib/db/mongodb";
import { Booking } from "@/modules/booking/booking.model";
import { HttpError } from "@/lib/http/errors";
import { Resend } from "resend";
import mongoose from "mongoose";

type CreateBookingInput = {
  fullName: string;
  email: string;
  phoneNumber: string;
  serviceType: string;
  serviceAddress?: string;
  preferredDate: string;
  preferredTime: string;
  specialRequests?: string;
};

type UpdateBookingInput = {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  serviceType?: string;
  serviceAddress?: string;
  preferredDate?: string;
  preferredTime?: string;
  specialRequests?: string;
  status?: "PENDING" | "CONFIRMED" | "DECLINED" | "CANCELLED" | "COMPLETED" | "ARCHIVED";
  price?: number | null;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createBooking(input: CreateBookingInput) {
  await dbConnect();

  const booking = await Booking.create({
    ...input,
    email: input.email.toLowerCase(),
    preferredDate: new Date(input.preferredDate),
    status: "PENDING",
    archivedAt: null,
  });

  try {
    await resend.emails.send({
      from: `Wipe & Swipe <${process.env.CONTACT_FROM_EMAIL}>`,
      to: [process.env.CONTACT_TO_EMAIL!],
      subject: "New Cleaning Quote Request",
      html: `
        <h2>New Quote Request</h2>
        <p><strong>Name:</strong> ${input.fullName}</p>
        <p><strong>Email:</strong> ${input.email}</p>
        <p><strong>Phone:</strong> ${input.phoneNumber}</p>
        <p><strong>Service Type:</strong> ${input.serviceType}</p>
        <p><strong>Service Address:</strong> ${input.serviceAddress || "Not provided"}</p>
        <p><strong>Date:</strong> ${new Date(input.preferredDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${input.preferredTime}</p>
        <p><strong>Special Requests:</strong></p>
        <p>${input.specialRequests || "None"}</p>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }

  return { id: String(booking._id) };
}

export async function listBookings(status?: string) {
  await dbConnect();

  const query: Record<string, unknown> = {};
  if (status) query.status = status;

  return Booking.find(query).sort({ createdAt: -1 }).lean();
}

export async function updateBooking(id: string, patch: UpdateBookingInput) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid booking id");
  }

  const updatePayload: Record<string, unknown> = {};

  if (patch.fullName !== undefined) updatePayload.fullName = patch.fullName;
  if (patch.email !== undefined) updatePayload.email = patch.email.toLowerCase();
  if (patch.phoneNumber !== undefined) updatePayload.phoneNumber = patch.phoneNumber;
  if (patch.serviceType !== undefined) updatePayload.serviceType = patch.serviceType;
  if (patch.serviceAddress !== undefined) updatePayload.serviceAddress = patch.serviceAddress;
  if (patch.preferredDate !== undefined) updatePayload.preferredDate = new Date(patch.preferredDate);
  if (patch.preferredTime !== undefined) updatePayload.preferredTime = patch.preferredTime;
  if (patch.specialRequests !== undefined) updatePayload.specialRequests = patch.specialRequests;
  if (patch.price !== undefined) updatePayload.price = patch.price;

  if (patch.status !== undefined) {
    updatePayload.status = patch.status;
    updatePayload.archivedAt = patch.status === "ARCHIVED" ? new Date() : null;
  }

  const updated = await Booking.findByIdAndUpdate(
    id,
    { $set: updatePayload },
    { new: true, runValidators: true }
  ).lean();

  if (!updated) throw new HttpError(404, "Booking not found");

  return updated;
}

export async function deleteBooking(id: string) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpError(400, "Invalid booking id");
  }

  const deleted = await Booking.findByIdAndDelete(id).lean();

  if (!deleted) {
    throw new HttpError(404, "Booking not found");
  }

  return {
    success: true,
    message: "Booking deleted successfully",
    id,
  };
}