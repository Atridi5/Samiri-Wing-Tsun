import { setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Hero from "@/components/site/Hero";
import AboutSection from "@/components/site/AboutSection";
import ComparisonSection from "@/components/site/ComparisonSection";
import ProgramsSection from "@/components/site/ProgramsSection";
import StatsSection from "@/components/site/StatsSection";
import HowItWorksSection from "@/components/site/HowItWorksSection";
import TestimonialsSection from "@/components/site/TestimonialsSection";
import LocationSection from "@/components/site/LocationSection";
import ContactSection from "@/components/site/ContactSection";

export const revalidate = 30;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <AboutSection />
      <ComparisonSection />
      <ProgramsSection />
      <StatsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <LocationSection />
      <ContactSection />
    </>
  );
}
