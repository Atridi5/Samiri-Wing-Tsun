import { prisma } from "./prisma";

export type Locale = "sq" | "en" | "de";

export async function getSiteText(section: string, locale: Locale) {
  const text = await prisma.siteText.findUnique({
    where: { section_locale: { section, locale } },
  });
  return text ?? { title: "", subtitle: "", body: "" };
}

export async function getAllSiteText(locale: Locale) {
  const rows = await prisma.siteText.findMany({ where: { locale } });
  const map: Record<string, { title: string | null; subtitle: string | null; body: string | null }> = {};
  for (const row of rows) {
    map[row.section] = { title: row.title, subtitle: row.subtitle, body: row.body };
  }
  return map;
}

export async function getPrograms(locale: Locale) {
  const programs = await prisma.program.findMany({
    orderBy: { order: "asc" },
    include: { translations: { where: { locale } } },
  });
  return programs.map((p) => ({
    id: p.id,
    slug: p.slug,
    icon: p.icon,
    title: p.translations[0]?.title ?? p.slug,
    description: p.translations[0]?.description ?? "",
  }));
}

export async function getBenefits(category: string, locale: Locale) {
  const benefits = await prisma.benefit.findMany({
    where: { category },
    orderBy: { order: "asc" },
    include: { translations: { where: { locale } } },
  });
  return benefits.map((b) => ({
    id: b.id,
    icon: b.icon,
    text: b.translations[0]?.text ?? "",
  }));
}

export async function getTestimonials(locale: Locale) {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
    include: { translations: { where: { locale } } },
  });
  return testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    rating: t.rating,
    text: t.translations[0]?.text ?? "",
  }));
}

export async function getGallery() {
  return prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
}

export async function getContactInfo() {
  const info = await prisma.contactInfo.findFirst();
  return info;
}
