import { getTranslations } from "next-intl/server";
import { getContactInfo } from "@/lib/content";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const t = await getTranslations("nav");
  const contact = await getContactInfo();

  const links = [
    { href: "/about", label: t("about") },
    { href: "/pricing", label: t("pricing") },
    { href: "/#programs", label: t("programs") },
    { href: "/rules", label: t("rules") },
    { href: "/#location", label: t("location") },
    { href: "/#contact", label: t("contact") },
  ];

  return (
    <NavbarClient
      links={links}
      ctaLabel={t("cta")}
      phone={contact?.phone ?? ""}
      instagram={contact?.instagram ?? ""}
      facebook={contact?.facebook ?? ""}
      tiktok={contact?.tiktok ?? ""}
    />
  );
}
