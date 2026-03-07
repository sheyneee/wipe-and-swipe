import mongoose, { Schema, type InferSchemaType } from "mongoose";

const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "DECLINED",
  "CANCELLED",
  "COMPLETED",
  "ARCHIVED",
] as const;

const BookingSchema = new Schema(
  {
    // Personal Information
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      index: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 20,
    },

    // Service Details
    serviceType: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    serviceAddress: {
      type: String,
      trim: true,
      maxlength: 250,
    },

    preferredDate: {
      type: Date,
      required: true,
      index: true,
    },

    preferredTime: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    // Additional Information
    specialRequests: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    price: {
      type: Number,
      required: false,
      default: null,
      min: 0,
    },

    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "PENDING",
      required: true,
      index: true,
    },

    archivedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Useful indexes
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ preferredDate: 1, preferredTime: 1 });

// Auto-delete archived records 30 days after archivedAt
BookingSchema.index(
  { archivedAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 30,
    partialFilterExpression: {
      archivedAt: { $type: "date" },
    },
  }
);

export type BookingDocument = InferSchemaType<typeof BookingSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export { BOOKING_STATUSES };