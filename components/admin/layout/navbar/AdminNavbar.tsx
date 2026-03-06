import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import AdminLogoutButton from "@/components/admin/ui/AdminLogoutButton";

export default async function AdminNavbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");

  if (!token) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <Image
              src="/wipe-and-swipe-icon.png"
              alt="Wipe & Swipe Logo"
              fill
              className="object-contain"
            />
          </div>

          <div className="leading-tight">
            <div className="text-lg font-bold">
              <span className="text-brand-primary">Admin</span>
              <span className="text-brand-secondary"> Dashboard</span>
            </div>

            <div className="text-xs md:text-sm font-medium tracking-wide text-gray-500">
              Wipe & Swipe Cleaning Services
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8">
          <Link
            href="/admin"
            className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
          >
            Dashboard
          </Link>

          <Link
            href="/admin/bookings"
            className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
          >
            Bookings
          </Link>

          <Link
            href="/admin/users"
            className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
          >
            Users
          </Link>

          <Link
            href="/admin/settings"
            className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
          >
            Settings
          </Link>

        <AdminLogoutButton />
        </div>
      </div>
    </nav>
  );
}