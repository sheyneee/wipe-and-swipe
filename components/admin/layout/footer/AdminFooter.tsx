import { getAdminSession } from "@/lib/auth/admin-session";

export default async function AdminFooter() {
  const session = await getAdminSession();

  if (!session) return null;

  return (
    <footer
      className="mt-20 py-6 border-t border-white/10"
      style={{ backgroundColor: "#283955" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm text-gray-300">
            © {new Date().getFullYear()} Wipe & Swipe Cleaning Services Ltd
          </p>

          <p className="text-xs sm:text-sm font-medium text-gray-300">
            Admin Portal
          </p>
        </div>
      </div>
    </footer>
  );
}