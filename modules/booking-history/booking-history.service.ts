import mongoose from "mongoose";
import { dbConnect } from "@/lib/db/mongodb";
import { HttpError } from "@/lib/http/errors";
import { BookingHistory, type BookingHistoryAction } from "./booking-history.model";
import { Admin } from "@/modules/admin/admin.model";

type AdminActor = {
  userId: string;
  role: "SUPER_ADMIN" | "ADMIN";
  status: "PENDING" | "ACTIVE" | "SUSPENDED";
};

type BookingHistoryChange = {
  field: string;
  oldValue: unknown;
  newValue: unknown;
};

export async function createBookingHistory(args: {
  bookingId: string;
  action: BookingHistoryAction;
  actor: AdminActor;
  changes?: BookingHistoryChange[];
  note?: string;
}) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(args.bookingId)) {
    throw new HttpError(400, "Invalid booking id");
  }

  if (!mongoose.Types.ObjectId.isValid(args.actor.userId)) {
    throw new HttpError(401, "Invalid admin session");
  }

  const admin = await Admin.findById(args.actor.userId)
    .select("firstName middleName lastName email role")
    .lean();

  if (!admin) {
    throw new HttpError(404, "Admin not found");
  }

  const history = await BookingHistory.create({
    bookingId: args.bookingId,
    action: args.action,
    performedBy: {
      userId: admin._id,
      firstName: admin.firstName,
      middleName: admin.middleName,
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
    },
    changes: args.changes ?? [],
    note: args.note,
  });

  return history;
}

export async function getAllBookingHistory() {
  await dbConnect();

  return BookingHistory.find({})
    .populate("bookingId", "fullName serviceType preferredDate preferredTime status price")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getBookingHistoryByBookingId(bookingId: string) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    throw new HttpError(400, "Invalid booking id");
  }

  return BookingHistory.find({ bookingId })
    .populate("bookingId", "fullName serviceType preferredDate preferredTime status price")
    .sort({ createdAt: -1 })
    .lean();
}

export async function deleteBookingHistoryById(historyId: string) {
  await dbConnect();

  if (!mongoose.Types.ObjectId.isValid(historyId)) {
    throw new HttpError(400, "Invalid history id");
  }

  const deleted = await BookingHistory.findByIdAndDelete(historyId).lean();

  if (!deleted) {
    throw new HttpError(404, "History record not found");
  }

  return deleted;
}

export async function deleteAllBookingHistory() {
  await dbConnect();

  const result = await BookingHistory.deleteMany({});

  return {
    deletedCount: result.deletedCount ?? 0,
  };
}