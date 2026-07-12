import { getTranslations } from "next-intl/server";
import { getContactInfo, getSiteText } from "@/lib/content";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Phone, Mail, MapPin } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "./SocialIcons";
import type { Locale } from "@/lib/content";
import { getLocale } from "next-intl/server";

export default async function Footer() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations();
  const contact = await getContactInfo();
  const footerText = await getSiteText("footer", locale);

  const links = [
    { href: "/about", label: t("nav.about") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/#programs", label: t("nav.programs") },
    { href: "/rules", label: t("nav.rules") },
    { href: "/#location", label: t("nav.location") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  return (
    <footer className="bg-navy-950 text-cream-100/80">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <Image src="/images/logo.png" alt="Samir Wing Tsun System" width={52} height={52} className="h-12 w-12 rounded-full" />
            <span className="font-display text-sm font-semibold uppercase tracking-wider text-cream-50">
              Samir Wing Tsun <span className="text-gold-500">System</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-cream-100/60">
            Arti i thjeshtë. Efektiv. Për jetë.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {contact?.instagram && (
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-50/15 transition-colors hover:border-gold-500 hover:text-gold-400"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
            {contact?.facebook && (
              <a
                href={contact.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream-50/15 transition-colors hover:border-gold-500 hover:text-gold-400"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cream-50">
            {t("footer.quickLinks")}
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                {link.href.startsWith("/#") ? (
                  <a href={link.href} className="transition-colors hover:text-gold-400">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="transition-colors hover:text-gold-400">
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cream-50">
            {t("footer.contactInfo")}
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {contact && (
              <>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  <span>
                    {contact.address}, {contact.city}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-gold-500" />
                  <a href={`tel:${contact.phone.replace(/\s+/g, "")}`} className="hover:text-gold-400">
                    {contact.phone}
                  </a>
                </li>
                {contact.email && (
                  <li className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 shrink-0 text-gold-500" />
                    <a href={`mailto:${contact.email}`} className="hover:text-gold-400">
                      {contact.email}
                    </a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-cream-50">
            SIFU
          </h3>
          <p className="mt-4 text-sm text-cream-100/70">Samir Ibishi</p>
          <p className="mt-1 text-xs text-cream-100/50">Ferizaj, Kosovë</p>
        </div>
      </div>

      <div className="border-t border-cream-50/10 py-5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs text-cream-100/50 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Samir Wing Tsun System. {footerText.body || t("footer.rights")}
          </p>
          <a href="/admin/login" className="hover:text-gold-400">
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
