import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Playfair_Display } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Wipe & Swipe Cleaning Services",
  description: "Professional cleaning services. Sparkling clean, every time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${outfit.variable} ${playfair.variable} h-full overflow-auto font-[var(--font-outfit)]`}
      >
        {children}
      </body>
    </html>
  );
}