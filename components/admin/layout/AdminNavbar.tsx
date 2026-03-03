"use client";

import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/admin" className="font-bold text-xl text-gray-900">
          Admin Panel
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link href="/admin" className="text-gray-700 hover:text-gray-900">
            Dashboard
          </Link>
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            View Site
          </Link>
        </div>
      </div>
    </nav>
  );
}