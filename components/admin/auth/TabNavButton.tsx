"use client";

import React from "react";
import { BRAND } from "@/lib/config/brand";

export default function TabNavButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-1 py-4 text-center font-semibold border-b-2 transition-all hover:bg-gray-50"
      style={{
        borderBottomColor: active ? BRAND.primary : "transparent",
        color: active ? BRAND.primary : "rgb(75 85 99)",
      }}
    >
      {label}
    </button>
  );
}