import {
  ApproveAdminSchema,
  ChangePasswordSchema,
  CreateAdminSchema,
  DeleteAdminSchema,
  ForgotPasswordSchema,
  LoginAdminSchema,
  ResetPasswordSchema,
  UpdateMyProfileSchema,
  VerifyEmailSchema,
} from "./admin.validator";

import * as service from "./admin.service";

export async function handleCreateAdmin(req: Request) {
  const body = CreateAdminSchema.parse(await req.json());
  return service.createAdmin(body);
}

export async function handleLoginAdmin(req: Request) {
  const body = LoginAdminSchema.parse(await req.json());
  return service.loginAdmin(body.email, body.password);
}

export async function handleUpdateMyProfile(req: Request) {
  const body = UpdateMyProfileSchema.parse(await req.json());
  return service.updateMyProfile(body);
}

export async function handleApproveOrSuspendAdmin(req: Request) {
  const body = ApproveAdminSchema.parse(await req.json());
  return service.setAdminStatus(body);
}

export async function handleDeleteAdmin(req: Request) {
  const body = DeleteAdminSchema.parse(await req.json());
  return service.deleteAdmin(body);
}

export async function handleListAdmins(req: Request) {
  const { actorAdminId } = (await req.json()) as { actorAdminId: string };
  return service.listAdmins(actorAdminId);
}

export async function handleChangePassword(req: Request) {
  const body = ChangePasswordSchema.parse(await req.json());
  return service.changePassword(body);
}

export async function handleGenerateEmailVerifyToken(req: Request) {
  const { adminId } = (await req.json()) as { adminId: string };
  return service.generateEmailVerifyToken(adminId);
}

export async function handleVerifyEmail(req: Request) {
  const body = VerifyEmailSchema.parse(await req.json());
  return service.verifyEmail(body.adminId, body.token);
}

export async function handleForgotPassword(req: Request) {
  const body = ForgotPasswordSchema.parse(await req.json());
  return service.forgotPassword(body.email);
}

export async function handleResetPassword(req: Request) {
  const body = ResetPasswordSchema.parse(await req.json());
  return service.resetPassword(body);
}