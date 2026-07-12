import { getLocale, getTranslations } from "next-intl/server";
import { getSiteText, getBenefits, type Locale } from "@/lib/content";
import { Check, X } from "lucide-react";

export default async function ComparisonSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("comparison");
  const [heading, passive, active] = await Promise.all([
    getSiteText("comparison", locale),
    getBenefits("passive", locale),
    getBenefits("active", locale),
  ]);

  return (
    <section className="bg-cream-100 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl shadow-2xl lg:grid-cols-2">
          {/* Passive */}
          <div className="bg-navy-900 p-8 sm:p-10">
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-cream-50/90">
              {heading.title}
            </h3>
            <ul className="mt-8 space-y-4">
              {passive.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                    <X className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm text-cream-100/70">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active */}
          <div className="bg-gradient-to-br from-gold-500 to-gold-600 p-8 sm:p-10">
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-950">
              {heading.subtitle}
            </h3>
            <ul className="mt-8 space-y-4">
              {active.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-950/15 text-navy-950">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-sm font-medium text-navy-950/85">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative mx-auto -mt-6 flex h-12 w-12 items-center justify-center rounded-full border-4 border-cream-100 bg-navy-950 font-display text-sm font-bold text-gold-500 shadow-lg">
          {t("vs")}
        </div>
      </div>
    </section>
  );
}
