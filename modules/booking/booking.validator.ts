import { z } from "zod";

export const BookingStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
  "COMPLETED",
  "ARCHIVED",
]);

export const CreateBookingSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phoneNumber: z.string().min(7).max(20),

  serviceType: z.string().min(2).max(80),
  serviceAddress: z.string().max(250).optional(),

  preferredDate: z.string().min(1),
  preferredTime: z.string().min(1).max(20),
  specialRequests: z.string().max(500).optional(),
});

export const UpdateBookingSchema = z
  .object({
    fullName: z.string().min(2).max(120).optional(),
    email: z.string().email().max(254).optional(),
    phoneNumber: z.string().min(7).max(20).optional(),

    serviceType: z.string().min(2).max(80).optional(),
    serviceAddress: z.string().max(250).optional(),

    preferredDate: z.string().min(1).optional(),
    preferredTime: z.string().min(1).max(20).optional(),
    specialRequests: z.string().max(500).optional(),

    price: z.union([z.coerce.number().min(0), z.null()]).optional(),
    status: BookingStatusSchema.optional(),
  })
  .refine(
    (v) =>
      v.fullName !== undefined ||
      v.email !== undefined ||
      v.phoneNumber !== undefined ||
      v.serviceType !== undefined ||
      v.serviceAddress !== undefined ||
      v.preferredDate !== undefined ||
      v.preferredTime !== undefined ||
      v.specialRequests !== undefined ||
      v.price !== undefined ||
      v.status !== undefined,
    {
      message: "At least one field must be provided.",
    }
  );