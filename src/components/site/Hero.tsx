import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { getSiteText, type Locale } from "@/lib/content";
import { ArrowRight, PlayCircle, MapPin } from "lucide-react";
import RegisterButton from "./RegisterButton";

export default async function Hero() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("hero");
  const hero = await getSiteText("hero", locale);

  return (
    <section id="home" className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-navy-950">
      <Image
        src="/images/hero-training.jpg"
        alt="Samir Wing Tsun System"
        fill
        priority
        className="object-cover object-center opacity-45"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/70 to-navy-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-gold-400">
            <MapPin className="h-3.5 w-3.5" />
            {t("badge")}
          </div>
          <h1 className="font-display text-4xl font-bold uppercase leading-[1.05] tracking-tight text-cream-50 sm:text-6xl">
            {hero.title || "Samir Wing Tsun System"}
          </h1>
          <p className="mt-6 text-xl font-medium leading-snug text-gold-gradient sm:text-2xl">
            {hero.subtitle}
          </p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-100/75 sm:text-lg">
            {hero.body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <RegisterButton className="group inline-flex items-center gap-2 rounded-full bg-gold-500 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-lg shadow-gold-500/20 transition-all hover:scale-105 hover:bg-gold-400">
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </RegisterButton>
            <a
              href="#about"
              className="inline-flex items-center gap-2 rounded-full border border-cream-50/25 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-gold-400 hover:text-gold-400"
            >
              <PlayCircle className="h-4 w-4" />
              {t("ctaSecondary")}
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream-100 to-transparent" />
    </section>
  );
}
