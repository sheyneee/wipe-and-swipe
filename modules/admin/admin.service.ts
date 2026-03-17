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

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    archivedAt: admin.archivedAt ?? null,
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

  export async function cleanupArchivedAdmins() {
    await dbConnect();

    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    await Admin.deleteMany({
      status: "ARCHIVED",
      archivedAt: { $lte: cutoff },
    });

    return { success: true };
  }

  export async function listAdmins(actorAdminId: string) {
    await dbConnect();

    await requireSuperAdmin(actorAdminId);
    await cleanupArchivedAdmins();

    const admins = await Admin.find({})
      .sort({ createdAt: -1 })
      .lean<AdminDocument[]>();

    return admins.map((admin) => safeAdminView(admin));
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
  if (admin.status === "ARCHIVED") {
    throw new HttpError(403, "Your account has been archived.");
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
 * Admin edits their own profile (no role / status)
 */
export async function updateMyProfile(input: {
  adminId: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
}) {
  await dbConnect();

  const admin = await Admin.findById(input.adminId);
  if (!admin) throw new HttpError(404, "Admin not found");

  let emailChanged = false;

  if (input.firstName !== undefined) admin.firstName = input.firstName;
  if (input.middleName !== undefined) admin.middleName = input.middleName;
  if (input.lastName !== undefined) admin.lastName = input.lastName;

  if (input.email !== undefined) {
    const normalizedEmail = normalizeEmail(input.email);

    if (normalizedEmail !== admin.email) {
      const existingAdmin = await Admin.findOne({
        email: normalizedEmail,
        _id: { $ne: admin._id },
      }).lean();

      if (existingAdmin) {
        throw new HttpError(409, "Email already exists");
      }

      admin.email = normalizedEmail;
      admin.emailVerified = false;
      emailChanged = true;
    }
  }

  await admin.save();

  if (emailChanged) {
    await sendVerificationEmail(String(admin._id), admin.email, admin.firstName);
  }

  return {
    ...safeAdminView(admin as AdminDocument),
    emailChanged,
    message: emailChanged
      ? "Profile updated. Please verify your new email address."
      : "Profile updated successfully.",
  };
}

/**
 * SUPER_ADMIN approves/suspends another admin
 */
export async function setAdminStatus(input: {
  actorAdminId: string;
  targetAdminId: string;
  status: Extract<AdminStatus, "PENDING" | "ACTIVE" | "SUSPENDED" | "ARCHIVED">;
}) {
  await dbConnect();

  await requireSuperAdmin(input.actorAdminId);

  const target = await Admin.findById(input.targetAdminId);
  if (!target) throw new HttpError(404, "Target admin not found");

  if (String(target._id) === input.actorAdminId) {
    throw new HttpError(400, "You cannot modify your own account status");
  }

  if (target.role === "SUPER_ADMIN") {
    throw new HttpError(400, "Cannot modify Super Admin");
  }

  target.status = input.status;

  if (input.status === "ARCHIVED") {
    target.archivedAt = new Date();
  } else {
    target.archivedAt = null;
  }

  await target.save();

  return {
    success: true,
    admin: safeAdminView(target as AdminDocument),
  };
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
export async function deleteAdmin(input: {
  actorAdminId: string;
  targetAdminId: string;
}) {
  await dbConnect();

  await requireSuperAdmin(input.actorAdminId);

  const target = await Admin.findById(input.targetAdminId);
  if (!target) throw new HttpError(404, "Target admin not found");

  if (String(target._id) === input.actorAdminId) {
    throw new HttpError(400, "You cannot delete your own account");
  }

  if (target.role === "SUPER_ADMIN") {
    throw new HttpError(400, "Super Admin cannot be deleted");
  }

  if (target.status !== "ARCHIVED") {
    throw new HttpError(
      400,
      "Admin must be archived first before permanent deletion."
    );
  }

  await Admin.deleteOne({ _id: target._id });

  return { success: true, message: "Admin permanently deleted." };
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

  // Always return success to avoid email enumeration
  if (!admin) return { success: true };

  const code = generateSixDigitCode();

  admin.passwordResetTokenHash = sha256(code);
  admin.passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  await admin.save();

  await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: email,
    subject: "Your password reset code",
    html: `
      <p>Hello ${admin.firstName},</p>
      <p>You requested to reset your password.</p>
      <p>Your 6-digit reset code is:</p>
      <h2 style="letter-spacing: 6px;">${code}</h2>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, you may ignore this email.</p>
    `,
  });

  return { success: true };
}

export async function verifyResetCode(emailRaw: string, code: string) {
  await dbConnect();

  const email = normalizeEmail(emailRaw);
  const codeHash = sha256(code);

  const admin = await Admin.findOne({
    email,
    passwordResetTokenHash: codeHash,
    passwordResetExpiresAt: { $gt: new Date() },
  });

  if (!admin) throw new HttpError(400, "Invalid or expired code");

  return { success: true };
}

export async function resetPassword(input: {
  email: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}) {
  await dbConnect();

  const email = normalizeEmail(input.email);
  const codeHash = sha256(input.code);

  const admin = await Admin.findOne({
    email,
    passwordResetTokenHash: codeHash,
    passwordResetExpiresAt: { $gt: new Date() },
  }).select("+passwordHash");

  if (!admin) throw new HttpError(400, "Invalid or expired code");

  (admin as unknown as { passwordHash: string }).passwordHash = await bcrypt.hash(
    input.newPassword,
    12
  );

  admin.passwordResetTokenHash = undefined;
  admin.passwordResetExpiresAt = undefined;

  await admin.save();

  return { success: true };
}