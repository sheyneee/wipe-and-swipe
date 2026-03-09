import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth/admin-session";
import { listAdmins, setAdminStatus } from "@/modules/admin/admin.service";

export async function GET() {
  const session = await requireAdminSession({ redirectToLogin: false });

  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const admins = await listAdmins(session.userId);
  return NextResponse.json({ data: admins });
}

export async function PATCH(req: Request) {
  const session = await requireAdminSession({ redirectToLogin: false });

  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as {
    targetAdminId: string;
    status: "PENDING" | "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  };

  const result = await setAdminStatus({
    actorAdminId: session.userId,
    targetAdminId: body.targetAdminId,
    status: body.status,
  });

  return NextResponse.json(result);
}