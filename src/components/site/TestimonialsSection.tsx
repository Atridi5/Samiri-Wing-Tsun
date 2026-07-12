import { getLocale, getTranslations } from "next-intl/server";
import { getTestimonials, type Locale } from "@/lib/content";
import { Star, Quote } from "lucide-react";

export default async function TestimonialsSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("testimonials");
  const testimonials = await getTestimonials(locale);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-cream-100 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("sectionLabel")}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-8 shadow-lg">
              <Quote className="h-8 w-8 text-gold-500/40" />
              <p className="mt-4 text-sm leading-relaxed text-navy-800/80">{item.text}</p>
              <div className="mt-6 flex items-center justify-between">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-navy-900">
                  {item.name}
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold-500 text-gold-500" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
