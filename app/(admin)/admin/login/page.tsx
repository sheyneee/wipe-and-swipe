import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </main>
  );
}