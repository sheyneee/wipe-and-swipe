import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const AdminRoleEnum = ["SUPER_ADMIN", "ADMIN"] as const;
export type AdminRole = (typeof AdminRoleEnum)[number];

export const AdminStatusEnum = [
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
  "ARCHIVED",
] as const;
export type AdminStatus = (typeof AdminStatusEnum)[number];

const AdminSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    middleName: { type: String, trim: true, maxlength: 80 },
    lastName: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },

    role: { type: String, enum: AdminRoleEnum, required: true, index: true },
    status: { type: String, enum: AdminStatusEnum, required: true, index: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    passwordHash: { type: String, required: true, select: false },

    emailVerified: { type: Boolean, required: true, default: false, index: true },

    emailVerifyTokenHash: { type: String, select: false },
    emailVerifyExpiresAt: { type: Date },

    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpiresAt: { type: Date },

    archivedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ role: 1, status: 1 });
AdminSchema.index({ status: 1, archivedAt: 1 });

export type AdminDocument = InferSchemaType<typeof AdminSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  emailVerifyTokenHash?: string;
  emailVerifyExpiresAt?: Date;
  passwordResetTokenHash?: string;
  passwordResetExpiresAt?: Date;
  archivedAt?: Date | null;
};

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", AdminSchema);