"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import AdminLogoutButton from "@/components/admin/ui/AdminLogoutButton";


type Props = {
  role: "SUPER_ADMIN" | "ADMIN";
};

export default function AdminNavbarBody({ role }: Props) {
  const [open, setOpen] = useState(false);
  

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="w-full px-6 lg:px-12 xl:px-20 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link
            href="/admin"
            className="flex items-center gap-3 min-w-0"
            onClick={() => setOpen(false)}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 shrink-0">
              <Image
                src="/wipe-and-swipe-icon.png"
                alt="Wipe & Swipe Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="leading-tight min-w-0">
              <div className="text-base sm:text-lg font-bold truncate">
                <span className="text-brand-primary">Admin</span>
                <span className="text-brand-primary"> Dashboard</span>
              </div>

              <div className="text-[10px] sm:text-xs md:text-sm font-medium tracking-wide text-gray-500 truncate">
                Wipe & Swipe Cleaning Services
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 xl:gap-10">
            <Link
              href="/admin"
              className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
            >
              Dashboard
            </Link>

            {role === "SUPER_ADMIN" && (
              <Link
                href="/admin/bookings"
                className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
              >
                Edit History
              </Link>
            )}

            {role === "SUPER_ADMIN" && (
              <Link
                href="/admin/users"
                className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
              >
                Users
              </Link>
            )}

            <Link
              href="/admin/settings"
              className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
            >
              Settings
            </Link>

            <AdminLogoutButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 text-brand-primary shrink-0"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle admin menu"
            aria-expanded={open}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pt-4 pb-2 border-t mt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
              >
                Dashboard
              </Link>

              {role === "SUPER_ADMIN" && (
                <Link
                  href="/admin/bookings"
                  onClick={() => setOpen(false)}
                  className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
                >
                  Edit History
                </Link>
              )}

              {role === "SUPER_ADMIN" && (
                <Link
                  href="/admin/users"
                  onClick={() => setOpen(false)}
                  className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
                >
                  Users
                </Link>
              )}

              <Link
                href="/admin/settings"
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
              >
                Settings
              </Link>

              <div className="pt-2">
                <AdminLogoutButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}