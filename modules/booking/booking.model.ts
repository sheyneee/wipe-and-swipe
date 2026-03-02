import mongoose, { Schema, type InferSchemaType } from "mongoose";

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

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DECLINED", "CANCELLED", "COMPLETED"],
      default: "PENDING",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Useful compound indexes
BookingSchema.index({ status: 1, createdAt: -1 });
BookingSchema.index({ preferredDate: 1, preferredTime: 1 });

export type BookingDocument = InferSchemaType<typeof BookingSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const Booking =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);