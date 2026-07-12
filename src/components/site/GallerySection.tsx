import { getLocale, getTranslations } from "next-intl/server";
import { getSiteText, getGallery, type Locale } from "@/lib/content";
import GalleryGrid from "./GalleryGrid";

export default async function GallerySection() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("gallery");
  const [heading, images] = await Promise.all([getSiteText("gallery", locale), getGallery()]);

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="bg-navy-950 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-500">{t("sectionLabel")}</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-cream-50 sm:text-4xl">
            {heading.title}
          </h2>
          {heading.body && <p className="mt-4 text-base text-cream-100/65">{heading.body}</p>}
        </div>

        <GalleryGrid images={images.map((img) => ({ id: img.id, url: img.url, caption: img.caption ?? "" }))} />
      </div>
    </section>
  );
}
