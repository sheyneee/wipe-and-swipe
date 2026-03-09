import AdminNavbar from "@/components/admin/layout/navbar/AdminNavbar";
import AdminFooter from "@/components/admin/layout/footer/AdminFooter";
import { getAdminSession } from "@/lib/auth/admin-session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const hasSession = !!session;

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #f5f9fb 0%, #ffffff 50%, #f5f9fb 100%)",
      }}
    >
      {hasSession ? <AdminNavbar role={session.role} /> : null}

      <main
        className={
          hasSession
            ? "flex-1 pt-20"
            : "flex-1 flex items-center justify-center"
        }
      >
        {children}
      </main>

      {hasSession ? <AdminFooter /> : null}
    </div>
  );
}