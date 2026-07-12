import { getLocale, getTranslations } from "next-intl/server";
import { getSiteText, type Locale } from "@/lib/content";
import ContactForm from "./ContactForm";

export default async function ContactSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("contact");
  const cta = await getSiteText("cta", locale);

  return (
    <section id="contact" className="bg-cream-100 py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("sectionLabel")}</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900 sm:text-4xl">
            {cta.title}
          </h2>
          <p className="mt-3 text-lg font-medium text-gold-600">{cta.subtitle}</p>
          <p className="mt-5 text-base leading-relaxed text-navy-800/70">{cta.body}</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-xl lg:col-span-3 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
