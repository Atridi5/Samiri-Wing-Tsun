import { getLocale, getTranslations } from "next-intl/server";
import { getSiteText, getContactInfo, type Locale } from "@/lib/content";
import { MapPin, Phone, User, ArrowUpRight } from "lucide-react";

export default async function LocationSection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("location");
  const [heading, contact] = await Promise.all([getSiteText("location", locale), getContactInfo()]);

  if (!contact) return null;

  const fullAddress = `${contact.address}, ${contact.city}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  return (
    <section id="location" className="bg-cream-200 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("sectionLabel")}</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900 sm:text-4xl">
            {heading.title}
          </h2>
          {heading.body && <p className="mt-4 text-base text-navy-800/65">{heading.body}</p>}
        </div>

        <div className="mt-14 grid grid-cols-1 overflow-hidden rounded-3xl shadow-xl lg:grid-cols-5">
          <div className="lg:col-span-3">
            {contact.mapEmbedUrl ? (
              <iframe
                src={contact.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 420 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Samir Wing Tsun System location"
              />
            ) : (
              <div className="flex h-full min-h-[420px] items-center justify-center bg-cream-100 text-navy-800/50">
                Map unavailable
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center gap-6 bg-navy-900 p-8 sm:p-10 lg:col-span-2">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-cream-100/50">{t("addressLabel")}</p>
                <p className="mt-1 text-sm font-medium text-cream-50">{fullAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-cream-100/50">{t("phoneLabel")}</p>
                <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="mt-1 block text-sm font-medium text-cream-50 hover:text-gold-400">
                  {contact.phone}
                </a>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-400">
                <User className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-cream-100/50">{t("instructorLabel")}</p>
                <p className="mt-1 text-sm font-medium text-cream-50">Sifu Samir Ibishi</p>
              </div>
            </div>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-navy-950 transition-transform hover:scale-105 hover:bg-gold-400"
            >
              {t("getDirections")}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
