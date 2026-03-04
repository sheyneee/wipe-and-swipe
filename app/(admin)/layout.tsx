import AdminNavbar from "@/components/admin/layout/navbar/AdminNavbar";
import AdminFooter from "@/components/admin/layout/footer/AdminFooter";
import { cookies } from "next/headers";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("admin_token")?.value;
  const hasToken = !!token;

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(180deg, #f5f9fb 0%, #ffffff 50%, #f5f9fb 100%)",
      }}
    >
      {hasToken ? <AdminNavbar /> : null}

      <main
        className={
          hasToken
            ? "flex-1 pt-20"
            : "flex-1 flex items-center justify-center"
        }
      >
        {children}
      </main>

      {hasToken ? <AdminFooter /> : null}
    </div>
  );
}