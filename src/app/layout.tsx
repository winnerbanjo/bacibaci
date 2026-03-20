import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import { AppChrome } from "@/components/app-chrome";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Baci Baci",
  description: "Baci Baci: refined form. controlled presence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-[var(--color-paper)] font-sans text-[var(--color-ink)] antialiased">
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
