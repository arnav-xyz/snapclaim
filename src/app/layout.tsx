import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SnapClaim — AI-Powered Photo Delivery for Events",
    template: "%s | SnapClaim",
  },
  description:
    "SnapClaim uses AI face recognition to instantly find and deliver YOUR photos from any event — weddings, concerts, college fests, corporate events. Just scan your face.",
  keywords: [
    "event photography",
    "AI face recognition",
    "wedding photos",
    "photo delivery",
    "face scan photos",
    "SnapClaim",
  ],
  authors: [{ name: "SnapClaim" }],
  creator: "SnapClaim",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://snapclaim.app",
    title: "SnapClaim — AI-Powered Photo Delivery for Events",
    description:
      "Your moments, found instantly. AI finds your photos from any event — just scan your face.",
    siteName: "SnapClaim",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapClaim — AI-Powered Photo Delivery",
    description:
      "Your moments, found instantly. AI finds your photos from any event — just scan your face.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#FFFFFF] text-[#0A1A12] font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
