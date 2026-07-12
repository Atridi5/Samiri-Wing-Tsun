import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import "../../globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Samir Wing Tsun System | Ferizaj",
  description:
    "Samir Wing Tsun System — trajnime autentike Wing Tsun në Ferizaj për fëmijë, të rinj dhe të rritur. Sifu Samir Ibishi.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${oswald.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-cream-100 font-sans antialiased">
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
