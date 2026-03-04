import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

export default async function AdminNavbar() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token");

  if (!token) return null;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 shadow-sm"
      style={{ backgroundColor: "#283955" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/admin" className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <Image
              src="/wipe-and-swipe-icon.png"
              alt="Wipe & Swipe"
              fill
              className="object-contain"
            />
          </div>

          <div className="leading-tight">
            <div className="text-white font-bold text-lg">
              Admin Dashboard
            </div>
            <div className="text-xs text-gray-300">
              Wipe & Swipe Cleaning Services
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-8 text-white font-medium">
          <Link href="/admin" className="hover:text-[#296276]">
            Dashboard
          </Link>

          <Link href="/admin/bookings" className="hover:text-[#296276]">
            Bookings
          </Link>

          <Link href="/admin/users" className="hover:text-[#296276]">
            Users
          </Link>

          <Link href="/admin/settings" className="hover:text-[#296276]">
            Settings
          </Link>

          <Link
            href="/api/admin/logout"
            className="px-4 py-2 rounded-md"
            style={{ backgroundColor: "#296276" }}
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
}