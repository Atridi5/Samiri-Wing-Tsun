import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin — Samir Wing Tsun System",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-slate-100 font-sans antialiased">{children}</body>
    </html>
  );
}
