import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { routing } from "@/i18n/routing";
import { getSiteText, type Locale } from "@/lib/content";

export default async function RulesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("rules");
  const rules = await getSiteText("rules", locale as Locale);
  const items = (rules.body ?? "").split("\n").filter(Boolean);

  return (
    <section className="bg-navy-950 py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-500">{t("sectionLabel")}</p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-cream-50 sm:text-4xl">
            {rules.title || t("fallbackTitle")}
          </h1>
        </div>

        {items.length === 0 ? (
          <p className="mx-auto mt-14 max-w-md text-center text-sm text-cream-100/60">{t("empty")}</p>
        ) : (
          <ol className="mt-12 space-y-4">
            {items.map((rule, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-xl border border-cream-50/10 bg-cream-50/[0.03] p-4 transition-colors hover:border-gold-500/30"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-sm font-bold text-gold-400">
                  {i + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed text-cream-100/80">{rule}</p>
              </li>
            ))}
          </ol>
        )}

        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs uppercase tracking-widest text-gold-500/80">
          <ShieldCheck className="h-4 w-4" />
          {t("footer")}
        </p>
      </div>
    </section>
  );
}
