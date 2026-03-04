import AdminNavbar from "@/components/admin/layout/navbar/AdminNavbar";
import AdminFooter from "@/components/admin/layout/footer/AdminFooter";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
  <div
      className="w-full min-h-full"
      style={{
        background: "linear-gradient(180deg, #f5f9fb 0%, #ffffff 50%, #f5f9fb 100%)",
      }}
    >
      <AdminNavbar />
      <main className="pt-20">{children}</main>
      <AdminFooter />
    </div>
  );
}