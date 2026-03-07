"use client";

import { useRouter } from "next/navigation";
import { BRAND } from "@/lib/config/brand";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-2 font-semibold hover:opacity-80"
      style={{ color: BRAND.primary }}
    >
      <span aria-hidden>←</span>
      Back
    </button>
  );
}