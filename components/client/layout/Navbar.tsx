"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/wipe-and-swipe-icon.png"
                alt="Wipe & Swipe Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="leading-tight">
              <div className="text-2xl font-bold">
                <span className="text-brand-primary">Wipe</span>
                <span className="text-brand-primary"> and </span>
                <span className="text-brand-accent">Swipe</span>
              </div>

              <div className="text-xs md:text-sm font-medium tracking-wide text-gray-500">
                Cleaning Services Ltd
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
            >
              Services
            </Link>

            <Link
              href="/about-us"
              className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className="text-gray-700 font-medium hover:text-brand-primary transition-colors"
            >
              Contact Us
            </Link>

            <Link
              href="/book-now"
              className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-full hover:shadow-lg hover:shadow-brand-primary/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Free Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-brand-primary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
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
                href="/"
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium hover:text-brand-primary"
              >
                Home
              </Link>

              <Link
                href="/services"
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium hover:text-brand-primary"
              >
                Services
              </Link>

              <Link
                href="/about-us"
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium hover:text-brand-primary"
              >
                About Us
              </Link>

              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="text-gray-700 font-medium hover:text-brand-primary"
              >
                Contact Us
              </Link>

              <Link
                href="/book-now"
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-semibold rounded-full text-center"
              >
                Free Quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}