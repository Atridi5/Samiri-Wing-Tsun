"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";

const FLAGS: Record<string, string> = {
  sq: "🇦🇱",
  en: "🇬🇧",
  de: "🇩🇪",
};

export default function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" }) {
  const locale = useLocale();
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function switchTo(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
    setOpen(false);
  }

  const textClass = variant === "dark" ? "text-navy-800" : "text-cream-50";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
          variant === "dark"
            ? "border-navy-800/20 text-navy-800 hover:bg-navy-800/5"
            : "border-cream-50/25 text-cream-50 hover:bg-cream-50/10"
        }`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4" />
        <span>{FLAGS[locale]}</span>
        <span className="uppercase">{locale}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-navy-900/10 bg-cream-50 py-1 shadow-xl">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchTo(loc)}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-navy-900/5 ${
                loc === locale ? "font-semibold text-navy-900" : "text-navy-800/80"
              }`}
            >
              <span className="text-base">{FLAGS[loc]}</span>
              {t(loc)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
