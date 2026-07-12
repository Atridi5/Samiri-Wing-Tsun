import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import ChatAssistant from "@/components/site/ChatAssistant";
import { getContactInfo } from "@/lib/content";
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

const DESCRIPTIONS: Record<string, string> = {
  sq: "Samir Wing Tsun System — trajnime autentike Wing Tsun në Ferizaj për fëmijë, të rinj dhe të rritur. Sifu Samir Ibishi.",
  en: "Samir Wing Tsun System — authentic Wing Tsun training in Ferizaj for kids, teens and adults. Led by Sifu Samir Ibishi.",
  de: "Samir Wing Tsun System — authentisches Wing-Tsun-Training in Ferizaj für Kinder, Jugendliche und Erwachsene. Geleitet von Sifu Samir Ibishi.",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const description = DESCRIPTIONS[locale] ?? DESCRIPTIONS.sq;
  const title = "Samir Wing Tsun System | Ferizaj";

  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { sq: "/sq", en: "/en", de: "/de" },
    },
    openGraph: {
      title,
      description,
      locale,
      type: "website",
      siteName: "Samir Wing Tsun System",
      images: [{ url: "/images/hero-training.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-training.jpg"],
    },
  };
}

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
  const [contact, messages] = await Promise.all([getContactInfo(), getMessages()]);

  return (
    <html lang={locale} className={`${oswald.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col bg-cream-100 font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat phone={contact?.phone ?? ""} />
          <ChatAssistant />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
