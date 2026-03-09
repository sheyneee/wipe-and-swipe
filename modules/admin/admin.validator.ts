import { z } from "zod";

export const CreateAdminSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must contain at least 2 characters." })
    .max(80, { message: "First name must not exceed 80 characters." }),

  middleName: z
    .string()
    .trim()
    .max(80, { message: "Middle name must not exceed 80 characters." })
    .optional(),

  lastName: z
    .string()
    .min(2, { message: "Last name must contain at least 2 characters." })
    .max(80, { message: "Last name must not exceed 80 characters." }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(254, { message: "Email must not exceed 254 characters." }),

  password: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters." })
    .max(72, { message: "Password must not exceed 72 characters." }),
});

export const LoginAdminSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).max(254),
  password: z.string().min(8, { message: "Password must contain at least 8 characters." }).max(72),
});

export const UpdateMyProfileSchema = z.object({
  adminId: z.string().min(1),
  firstName: z.string().min(1).max(80).optional(),
  middleName: z.string().max(80).optional(),
  lastName: z.string().min(1).max(80).optional(),
});

export const ChangePasswordSchema = z.object({
  adminId: z.string().min(1),
  currentPassword: z.string().min(8).max(72),
  newPassword: z.string().min(8).max(72),
});

export const ApproveAdminSchema = z.object({
  actorAdminId: z.string().min(1),
  targetAdminId: z.string().min(1),
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "ARCHIVED"]),
});

export const DeleteAdminSchema = z.object({
  actorAdminId: z.string().min(1),
  targetAdminId: z.string().min(1),
});

export const VerifyEmailSchema = z.object({
  adminId: z.string().min(1),
  token: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).max(254),
});

export const VerifyResetCodeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).max(254),
  code: z
    .string()
    .regex(/^\d{6}$/, { message: "Code must be exactly 6 digits." }),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).max(254),
  code: z
    .string()
    .regex(/^\d{6}$/, { message: "Code must be exactly 6 digits." }),
  newPassword: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters." })
    .max(72, { message: "Password must not exceed 72 characters." }),
  confirmPassword: z
    .string()
    .min(8, { message: "Password must contain at least 8 characters." })
    .max(72, { message: "Password must not exceed 72 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});