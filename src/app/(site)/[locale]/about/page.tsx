import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getSiteText, getGallery, type Locale } from "@/lib/content";
import GalleryGrid from "@/components/site/GalleryGrid";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const [story, video, hallImages, groupImages] = await Promise.all([
    getSiteText("about_page", locale as Locale),
    getSiteText("about_video", locale as Locale),
    getGallery("hall"),
    getGallery("group"),
  ]);

  return (
    <>
      <section className="relative isolate flex min-h-[50vh] items-center overflow-hidden bg-navy-950">
        <Image
          src="/images/hero-dark-dummy.jpg"
          alt="Samir Wing Tsun System"
          fill
          priority
          className="object-cover object-center opacity-40"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/70 to-navy-950" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="section-eyebrow text-xs font-semibold uppercase text-gold-400">{t("sectionLabel")}</p>
          <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-cream-50 sm:text-5xl">
            {story.title || t("fallbackTitle")}
          </h1>
        </div>
      </section>

      <section className="bg-cream-100 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="whitespace-pre-wrap text-base leading-relaxed text-navy-800/80 sm:text-lg">
            {story.body || t("fallbackBody")}
          </p>
        </div>
      </section>

      {video.body && (
        <section className="bg-navy-950 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <p className="section-eyebrow text-center text-xs font-semibold uppercase text-gold-500">
              {t("videoLabel")}
            </p>
            <div className="mt-6 aspect-video overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                src={video.body}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Wing Tsun video"
              />
            </div>
          </div>
        </section>
      )}

      {hallImages.length > 0 && (
        <section className="bg-cream-100 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("hallLabel")}</p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900">
                {t("hallTitle")}
              </h2>
            </div>
            <GalleryGrid
              images={hallImages.map((img) => ({ id: img.id, url: img.url, caption: img.caption ?? "" }))}
            />
          </div>
        </section>
      )}

      {groupImages.length > 0 && (
        <section className="bg-cream-200 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("groupLabel")}</p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-navy-900">
                {t("groupTitle")}
              </h2>
            </div>
            <GalleryGrid
              images={groupImages.map((img) => ({ id: img.id, url: img.url, caption: img.caption ?? "" }))}
            />
          </div>
        </section>
      )}
    </>
  );
}
