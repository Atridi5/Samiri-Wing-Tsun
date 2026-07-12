"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImg = { id: string; url: string; caption: string };

export default function GalleryGrid({ images }: { images: GalleryImg[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl"
          >
            <Image
              src={img.url}
              alt={img.caption || "Wing Tsun gallery"}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-navy-950/0 transition-colors group-hover:bg-navy-950/30" />
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 p-6"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            className="absolute right-6 top-6 text-cream-50/70 hover:text-gold-400"
            aria-label="Close"
          >
            <X className="h-8 w-8" />
          </button>

          {activeIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((idx) => (idx !== null ? idx - 1 : idx));
              }}
              className="absolute left-4 text-cream-50/70 hover:text-gold-400 sm:left-8"
              aria-label="Previous"
            >
              <ChevronLeft className="h-9 w-9" />
            </button>
          )}
          {activeIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((idx) => (idx !== null ? idx + 1 : idx));
              }}
              className="absolute right-4 text-cream-50/70 hover:text-gold-400 sm:right-8"
              aria-label="Next"
            >
              <ChevronRight className="h-9 w-9" />
            </button>
          )}

          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].caption || "Wing Tsun gallery"}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
