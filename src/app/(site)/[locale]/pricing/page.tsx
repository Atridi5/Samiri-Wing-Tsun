import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { routing } from "@/i18n/routing";
import { getPricingPlans, type Locale } from "@/lib/content";
import RegisterButton from "@/components/site/RegisterButton";

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("pricing");
  const plans = await getPricingPlans(locale as Locale);

  return (
    <section className="bg-cream-100 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("sectionLabel")}</p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-navy-800/70">{t("subtitle")}</p>
        </div>

        {plans.length === 0 ? (
          <p className="mx-auto mt-14 max-w-md text-center text-sm text-navy-800/60">{t("empty")}</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex flex-col rounded-2xl bg-navy-900 p-8 shadow-xl transition-transform hover:-translate-y-1.5"
              >
                <h3 className="font-display text-xl font-bold uppercase tracking-wide text-cream-50">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-gold-400">{plan.price}</span>
                  <span className="text-sm text-cream-100/60">{plan.period}</span>
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-cream-100/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <RegisterButton className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition-transform hover:scale-105 hover:bg-gold-400">
                  {t("cta")}
                </RegisterButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
