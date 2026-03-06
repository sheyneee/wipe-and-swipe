import type { Metadata } from "next";
import "./globals.css";
import { Outfit, Playfair_Display } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://wipeandswipe.co.nz"),

  title: {
    default: "Wipe & Swipe Cleaning Services Ltd",
    template: "%s | Wipe & Swipe Cleaning Services Ltd",
  },

  description:
    "Professional residential and commercial cleaning services. Request a free quote today.",

  openGraph: {
    title: "Wipe & Swipe Cleaning Services Ltd",
    description:
      "Professional residential and commercial cleaning services.",
    url: "https://wipeandswipe.co.nz",
    siteName: "Wipe & Swipe Cleaning Services Ltd",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wipe & Swipe Cleaning Services",
      },
    ],
    locale: "en_NZ",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Wipe & Swipe Cleaning Services Ltd",
    description:
      "Professional residential and commercial cleaning services.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${outfit.variable} ${playfair.variable} h-full overflow-auto font-[var(--font-outfit)]`}
      >
        {children}
      </body>
    </html>
  );
}