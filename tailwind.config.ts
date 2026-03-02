import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#296276",
          secondary: "#283955",
          accent: "#266075",
          light: "#f5f9fb",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;