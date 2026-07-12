import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getSiteText, getPrograms, type Locale } from "@/lib/content";
import { DynamicIcon } from "./icon-map";
import { Heart, Brain, Smile, Users2 } from "lucide-react";

export default async function ProgramsSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("programs");
  const [heading, programs, kids] = await Promise.all([
    getSiteText("programs", locale),
    getPrograms(locale),
    getSiteText("kids_section", locale),
  ]);

  const kidsHighlights = [
    { icon: Heart, text: locale === "sq" ? "Shëndeti fizik" : locale === "de" ? "Körperliche Gesundheit" : "Physical health" },
    { icon: Brain, text: locale === "sq" ? "Fokus mendor" : locale === "de" ? "Mentaler Fokus" : "Mental focus" },
    { icon: Smile, text: locale === "sq" ? "Vetëbesim" : locale === "de" ? "Selbstvertrauen" : "Self-confidence" },
    { icon: Users2, text: locale === "sq" ? "Miqësi të reja" : locale === "de" ? "Neue Freundschaften" : "New friendships" },
  ];

  return (
    <section id="programs" className="bg-cream-100 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("sectionLabel")}</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900 sm:text-4xl">
            {heading.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-navy-800/70">{heading.body}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {programs.map((program, i) => (
            <div
              key={program.id}
              className="group relative overflow-hidden rounded-2xl bg-navy-900 p-8 shadow-xl transition-transform hover:-translate-y-1.5"
            >
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-gold-500/10 transition-transform group-hover:scale-125" />
              <span className="font-display text-5xl font-bold text-cream-50/10">0{i + 1}</span>
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gold-500 text-navy-950">
                <DynamicIcon name={program.icon} className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-xl font-bold uppercase tracking-wide text-cream-50">
                {program.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cream-100/65">{program.description}</p>
            </div>
          ))}
        </div>

        {/* Kids highlight */}
        <div className="mt-20 grid grid-cols-1 items-center gap-12 overflow-hidden rounded-3xl bg-navy-950 shadow-xl lg:grid-cols-2">
          <div className="relative h-72 lg:h-full">
            <Image src="/images/kids-training.jpg" alt="Kids Wing Tsun training" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
          <div className="px-8 py-12 lg:pr-14">
            <h3 className="font-display text-2xl font-bold uppercase leading-tight text-cream-50 sm:text-3xl">
              {kids.title}
            </h3>
            <p className="mt-5 text-sm leading-relaxed text-cream-100/70 sm:text-base">{kids.body}</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {kidsHighlights.map((h) => (
                <div key={h.text} className="flex items-center gap-3 rounded-xl bg-cream-50/5 px-4 py-3">
                  <h.icon className="h-5 w-5 shrink-0 text-gold-500" />
                  <span className="text-sm font-medium text-cream-100/85">{h.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
