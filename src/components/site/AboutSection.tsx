import Image from "next/image";
import { getLocale } from "next-intl/server";
import { getSiteText, getBenefits, type Locale } from "@/lib/content";
import { DynamicIcon } from "./icon-map";

export default async function AboutSection() {
  const locale = (await getLocale()) as Locale;
  const [intro, why, whyBenefits] = await Promise.all([
    getSiteText("intro", locale),
    getSiteText("why", locale),
    getBenefits("why", locale),
  ]);

  return (
    <section id="about" className="relative">
      {/* Intro */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-24 lg:grid-cols-2">
        <div>
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">Samir Wing Tsun System</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900 sm:text-4xl">
            {intro.title}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-navy-800/75 sm:text-lg">{intro.body}</p>

          <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "KIDS", label: locale === "sq" ? "Fëmijë" : locale === "de" ? "Kinder" : "Kids" },
              { value: "13+", label: locale === "sq" ? "Të Rinj" : locale === "de" ? "Jugendliche" : "Teens" },
              { value: "18+", label: locale === "sq" ? "Të Rritur" : locale === "de" ? "Erwachsene" : "Adults" },
              { value: "1v1", label: locale === "sq" ? "Vetëmbrojtje" : locale === "de" ? "Selbstverteidigung" : "Self-Defense" },
            ].map((stat) => (
              <div key={stat.value} className="border-l-2 border-gold-500 pl-3">
                <p className="font-display text-xl font-bold text-navy-900">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-navy-800/60">{stat.label}</p>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-3xl border-2 border-gold-500/30" />
          <Image
            src="/images/hero-dark-dummy.jpg"
            alt="Wing Tsun training"
            width={800}
            height={900}
            className="aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </div>

      {/* Why Wing Tsun - dark accent band */}
      <div className="relative overflow-hidden bg-navy-950 py-24">
        <div className="bg-noise absolute inset-0" />
        <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-500">Wing Tsun</p>
          <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl font-bold uppercase leading-tight text-cream-50 sm:text-4xl">
            {why.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-cream-100/70">{why.body}</p>

          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {whyBenefits.map((b) => (
              <div
                key={b.id}
                className="group flex flex-col items-center gap-4 rounded-2xl border border-cream-50/10 bg-cream-50/[0.04] px-4 py-8 transition-all hover:-translate-y-1 hover:border-gold-500/40 hover:bg-cream-50/[0.07]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 text-gold-400 transition-transform group-hover:scale-110">
                  <DynamicIcon name={b.icon} className="h-6 w-6" />
                </div>
                <p className="text-sm font-semibold uppercase tracking-wide text-cream-100/90">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
