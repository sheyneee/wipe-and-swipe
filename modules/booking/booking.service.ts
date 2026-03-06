import { dbConnect } from "@/lib/db/mongodb";
import { Booking } from "@/modules/booking/booking.model";
import { HttpError } from "@/lib/http/errors";
import { Resend } from "resend";

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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createBooking(input: CreateBookingInput) {
  await dbConnect();

  const booking = await Booking.create({
    ...input,
    email: input.email.toLowerCase(),
    preferredDate: new Date(input.preferredDate),
    status: "PENDING",
  });

  // SEND EMAIL NOTIFICATION
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

export async function updateBooking(
  id: string,
  patch: { status?: string; price?: number | null }
) {
  await dbConnect();

  const updated = await Booking.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true }
  ).lean();

  if (!updated) throw new HttpError(404, "Booking not found");

  return updated;
}