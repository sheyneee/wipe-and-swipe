import { z } from "zod";

export const CreateAdminSchema = z.object({
  firstName: z.string().min(1).max(80),
  middleName: z.string().max(80).optional(),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(254),
  password: z.string().min(8).max(72),
});

export const LoginAdminSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(72),
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
  actorAdminId: z.string().min(1), // super admin
  targetAdminId: z.string().min(1),
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export const DeleteAdminSchema = z.object({
  actorAdminId: z.string().min(1), // super admin
  targetAdminId: z.string().min(1),
});

export const VerifyEmailSchema = z.object({
  adminId: z.string().min(1),
  token: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email().max(254),
});

export const ResetPasswordSchema = z.object({
  adminId: z.string().min(1),
  token: z.string().min(1),
  newPassword: z.string().min(8).max(72),
});