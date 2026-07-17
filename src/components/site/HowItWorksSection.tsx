import { getTranslations, getLocale } from "next-intl/server";
import { UserPlus, Gift, Sparkles } from "lucide-react";
import RegisterButton from "./RegisterButton";
import { getSiteText, type Locale } from "@/lib/content";

export default async function HowItWorksSection() {
  const t = await getTranslations("howItWorks");
  const locale = (await getLocale()) as Locale;
  const [step1, step2, step3] = await Promise.all([
    getSiteText("how_it_works_step1", locale),
    getSiteText("how_it_works_step2", locale),
    getSiteText("how_it_works_step3", locale),
  ]);

  const steps = [
    { icon: UserPlus, title: step1.title || t("step1Title"), body: step1.body || t("step1Body") },
    { icon: Gift, title: step2.title || t("step2Title"), body: step2.body || t("step2Body") },
    { icon: Sparkles, title: step3.title || t("step3Title"), body: step3.body || t("step3Body") },
  ];

  return (
    <section className="bg-cream-100 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("sectionLabel")}</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900 sm:text-4xl">
            {t("title")}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="relative rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-navy-900/5">
              <span className="font-display text-6xl font-bold text-navy-900/5">0{i + 1}</span>
              <div className="mx-auto -mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold uppercase tracking-wide text-navy-900">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-800/65">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <RegisterButton className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-8 py-3.5 text-sm font-semibold text-cream-50 shadow-md transition-transform hover:scale-105 hover:bg-navy-800">
            {t("step1Title")}
          </RegisterButton>
        </div>
      </div>
    </section>
  );
}
