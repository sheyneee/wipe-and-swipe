import { z } from "zod";

export const CreateBookingSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phoneNumber: z.string().min(7).max(20),

  serviceType: z.string().min(2).max(80),
  serviceAddress: z.string().max(250).optional(),

  preferredDate: z.string().min(1), // ISO date string from frontend
  preferredTime: z.string().min(1).max(20),
  specialRequests: z.string().max(500).optional(),
});

export const UpdateBookingSchema = z
  .object({
    status: z.enum(["PENDING", "CONFIRMED", "DECLINED", "CANCELLED", "COMPLETED"]).optional(),
    price: z.union([z.coerce.number().min(0), z.null()]).optional(),
  })
  .refine((v) => v.status !== undefined || v.price !== undefined, {
    message: "At least one field must be provided.",
  });