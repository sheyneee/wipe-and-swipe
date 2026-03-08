import mongoose, { Schema, type InferSchemaType } from "mongoose";

export const BookingHistoryActionEnum = [
  "CREATE",
  "UPDATE",
  "STATUS_CHANGE",
  "ARCHIVE",
  "DELETE",
] as const;

export type BookingHistoryAction = (typeof BookingHistoryActionEnum)[number];

const BookingHistoryChangeSchema = new Schema(
  {
    field: { type: String, required: true, trim: true },
    oldValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const BookingHistorySchema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: BookingHistoryActionEnum,
      required: true,
      index: true,
    },

    performedBy: {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
      },
      firstName: { type: String, trim: true },
      middleName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      email: { type: String, trim: true, lowercase: true },
      role: { type: String, trim: true },
    },

    changes: {
      type: [BookingHistoryChangeSchema],
      default: [],
    },

    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

BookingHistorySchema.index({ bookingId: 1, createdAt: -1 });
BookingHistorySchema.index({ action: 1, createdAt: -1 });
BookingHistorySchema.index({ "performedBy.userId": 1, createdAt: -1 });

export type BookingHistoryDocument = InferSchemaType<typeof BookingHistorySchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const BookingHistory =
  mongoose.models.BookingHistory ||
  mongoose.model("BookingHistory", BookingHistorySchema);