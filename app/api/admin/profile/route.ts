import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/admin-session";
import {
  handleUpdateMyProfile,
  handleChangePassword,
} from "@/modules/admin/admin.controller";
import { Admin } from "@/modules/admin/admin.model";
import { dbConnect } from "@/lib/db/mongodb";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const admin = await Admin.findById(session.userId).lean();

    if (!admin) {
      return NextResponse.json({ message: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: String(admin._id),
      firstName: admin.firstName,
      middleName: admin.middleName ?? "",
      lastName: admin.lastName,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      emailVerified: admin.emailVerified,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load profile",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getAdminSession();

    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const result = await handleUpdateMyProfile(
      new Request(req.url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: session.userId,
          firstName: body.firstName,
          middleName: body.middleName,
          lastName: body.lastName,
          email: body.email,
        }),
      })
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update profile";

    return NextResponse.json({ message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getAdminSession();

    if (!session?.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const result = await handleChangePassword(
      new Request(req.url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: session.userId,
          currentPassword: body.currentPassword,
          newPassword: body.newPassword,
        }),
      })
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to change password";

    return NextResponse.json({ message }, { status: 400 });
  }
}