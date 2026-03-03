import bcrypt from "bcryptjs";
import crypto from "crypto";

import { dbConnect } from "@/lib/db/mongodb";
import { HttpError } from "@/lib/http/errors";
import { Admin, type AdminDocument, type AdminStatus } from "./admin.model";
import { signAdminToken } from "@/lib/auth/jwt";

import { resend } from "@/lib/email/resend";
import { env } from "@/lib/config/env";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function safeAdminView(admin: AdminDocument) {
  return {
    id: String(admin._id),
    firstName: admin.firstName,
    middleName: admin.middleName,
    lastName: admin.lastName,
    role: admin.role,
    status: admin.status,
    email: admin.email,
    emailVerified: admin.emailVerified,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
}

async function requireSuperAdmin(actorAdminId: string) {
  const actor = await Admin.findById(actorAdminId).lean<AdminDocument>();
  if (!actor) throw new HttpError(404, "Actor admin not found");
  if (actor.role !== "SUPER_ADMIN") throw new HttpError(403, "Forbidden");
  return actor;
}

/**
 * Create Admin:
 * - first admin => SUPER_ADMIN + ACTIVE
 * - others => ADMIN + PENDING
 */
export async function createAdmin(input: {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
}) {
  await dbConnect();

  const email = normalizeEmail(input.email);

  const exists = await Admin.findOne({ email }).lean();
  if (exists) throw new HttpError(409, "Email already exists");

  const adminsCount = await Admin.countDocuments();
  const isFirst = adminsCount === 0;

  const passwordHash = await bcrypt.hash(input.password, 12);

  const admin = await Admin.create({
    firstName: input.firstName,
    middleName: input.middleName,
    lastName: input.lastName,
    email,
    passwordHash,
    role: isFirst ? "SUPER_ADMIN" : "ADMIN",
    status: isFirst ? "ACTIVE" : "PENDING",
    emailVerified: false,
  });

  await sendVerificationEmail(
  String(admin._id),
  admin.email,
  admin.firstName
);

  return safeAdminView(admin as AdminDocument);
}

/**
 * Login:
 * - must be emailVerified
 * - must be ACTIVE
 */
export async function loginAdmin(emailRaw: string, password: string) {
  await dbConnect();

  const email = normalizeEmail(emailRaw);

  const admin = await Admin.findOne({ email }).select("+passwordHash");
  if (!admin) throw new HttpError(401, "Invalid credentials");

  const passwordHash = (admin as unknown as { passwordHash: string }).passwordHash;

  const valid = await bcrypt.compare(password, passwordHash);
  if (!valid) throw new HttpError(401, "Invalid credentials");

  if (!admin.emailVerified) {
  const now = new Date();
  const expiresAt = admin.emailVerifyExpiresAt;

  const hasUnexpiredLink = !!expiresAt && expiresAt.getTime() > now.getTime();

  // Only resend if there is no active (unexpired) link.
  if (!hasUnexpiredLink) {
    await sendVerificationEmail(String(admin._id), admin.email, admin.firstName);
    throw new HttpError(
      403,
      "Email not verified. A new verification link was sent to your email."
    );
  }

  // Link still valid. Do not resend.
  throw new HttpError(
    403,
    "Email not verified. Please check your email for the verification link."
  );
}
  if (admin.status !== "ACTIVE") {
    if (admin.status === "PENDING") {
      throw new HttpError(403, "Your account is pending approval. Please wait for activation.");
    }
    if (admin.status === "SUSPENDED") {
      throw new HttpError(403, "Your account has been suspended. Please contact support.");
    }
    throw new HttpError(403, "Your account is not active.");
  }

  const token = signAdminToken({
    userId: String(admin._id),
    role: admin.role,
    status: admin.status,
  });

  return { token, admin: safeAdminView(admin as AdminDocument) };
}

/**
 * Admin edits their own profile (no role / status / email)
 */
export async function updateMyProfile(input: {
  adminId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}) {
  await dbConnect();

  const admin = await Admin.findById(input.adminId);
  if (!admin) throw new HttpError(404, "Admin not found");

  if (input.firstName !== undefined) admin.firstName = input.firstName;
  if (input.middleName !== undefined) admin.middleName = input.middleName;
  if (input.lastName !== undefined) admin.lastName = input.lastName;

  await admin.save();
  return safeAdminView(admin as AdminDocument);
}

/**
 * SUPER_ADMIN approves/suspends another admin
 */
export async function setAdminStatus(input: {
  actorAdminId: string;
  targetAdminId: string;
  status: Extract<AdminStatus, "ACTIVE" | "SUSPENDED">;
}) {
  await dbConnect();

  await requireSuperAdmin(input.actorAdminId);

  const target = await Admin.findById(input.targetAdminId);
  if (!target) throw new HttpError(404, "Target admin not found");

  if (target.role === "SUPER_ADMIN") throw new HttpError(400, "Cannot modify Super Admin");

  target.status = input.status;
  await target.save();

  return { success: true };
}

async function sendVerificationEmail(adminId: string, email: string, firstName: string) {
  const { token } = await generateEmailVerifyToken(adminId);

  const verifyUrl = `${env.APP_URL}/api/admin/verify-email?id=${encodeURIComponent(
    adminId
  )}&token=${encodeURIComponent(token)}`;

  await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Hello ${firstName},</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}">Verify Email</a></p>
      <p>This link expires in 1 hour.</p>
    `,
  });
}

/**
 * SUPER_ADMIN deletes another admin
 */
export async function deleteAdmin(input: { actorAdminId: string; targetAdminId: string }) {
  await dbConnect();

  await requireSuperAdmin(input.actorAdminId);

  const target = await Admin.findById(input.targetAdminId).lean<AdminDocument>();
  if (!target) throw new HttpError(404, "Target admin not found");

  if (target.role === "SUPER_ADMIN") throw new HttpError(400, "Super Admin cannot be deleted");

  await Admin.deleteOne({ _id: input.targetAdminId });
  return { success: true };
}

/**
 * Change password (self)
 */
export async function changePassword(input: {
  adminId: string;
  currentPassword: string;
  newPassword: string;
}) {
  await dbConnect();

  const admin = await Admin.findById(input.adminId).select("+passwordHash");
  if (!admin) throw new HttpError(404, "Admin not found");

  const passwordHash = (admin as unknown as { passwordHash: string }).passwordHash;

  const valid = await bcrypt.compare(input.currentPassword, passwordHash);
  if (!valid) throw new HttpError(400, "Incorrect password");

  (admin as unknown as { passwordHash: string }).passwordHash = await bcrypt.hash(input.newPassword, 12);
  await admin.save();

  return { success: true };
}

/**
 * Email verification token ready
 */
export async function generateEmailVerifyToken(adminId: string) {
  await dbConnect();

  const admin = await Admin.findById(adminId);
  if (!admin) throw new HttpError(404, "Admin not found");

  const token = crypto.randomBytes(32).toString("hex");

  admin.emailVerifyTokenHash = sha256(token);
  admin.emailVerifyExpiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await admin.save();
  return { token };
}

export async function verifyEmail(adminId: string, token: string) {
  await dbConnect();

  const tokenHash = sha256(token);

  const admin = await Admin.findOne({
    _id: adminId,
    emailVerifyTokenHash: tokenHash,
    emailVerifyExpiresAt: { $gt: new Date() },
  });

  if (!admin) throw new HttpError(400, "Invalid or expired token");

  admin.emailVerified = true;
  admin.emailVerifyTokenHash = undefined;
  admin.emailVerifyExpiresAt = undefined;

  await admin.save();
  return { success: true, accountStatus: admin.status };
}

/**
 * Forgot password (token ready, always success)
 */
export async function forgotPassword(emailRaw: string) {
  await dbConnect();

  const email = normalizeEmail(emailRaw);
  const admin = await Admin.findOne({ email });

  if (!admin) return { success: true };

  const token = crypto.randomBytes(32).toString("hex");

  admin.passwordResetTokenHash = sha256(token);
  admin.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await admin.save();

  return { success: true, token };
}

export async function resetPassword(input: { adminId: string; token: string; newPassword: string }) {
  await dbConnect();

  const tokenHash = sha256(input.token);

  const admin = await Admin.findOne({
    _id: input.adminId,
    passwordResetTokenHash: tokenHash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+passwordHash");

  if (!admin) throw new HttpError(400, "Invalid or expired token");

  (admin as unknown as { passwordHash: string }).passwordHash = await bcrypt.hash(input.newPassword, 12);

  admin.passwordResetTokenHash = undefined;
  admin.passwordResetExpiresAt = undefined;

  await admin.save();
  return { success: true };
}