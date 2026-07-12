"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Locale = "sq" | "en" | "de";
type TextValue = { title: string; subtitle: string; body: string };
type TextMap = Record<string, Record<Locale, TextValue>>;

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "sq", label: "Shqip", flag: "🇦🇱" },
  { code: "en", label: "Anglisht", flag: "🇬🇧" },
  { code: "de", label: "Gjermanisht", flag: "🇩🇪" },
];

const SECTIONS: { key: string; label: string; fields: (keyof TextValue)[] }[] = [
  { key: "hero", label: "Hero (Ballina)", fields: ["title", "subtitle", "body"] },
  { key: "intro", label: "Rreth Nesh — Intro (Ballina)", fields: ["title", "body"] },
  { key: "about_page", label: "Rreth Nesh — Faqja e Veçantë", fields: ["title", "body"] },
  { key: "about_video", label: "Rreth Nesh — Video (URL embed, p.sh. YouTube)", fields: ["body"] },
  { key: "why", label: "Pse Wing Tsun", fields: ["title", "body"] },
  { key: "comparison", label: "Krahasimi: Pasiv vs Aktiv", fields: ["title", "subtitle"] },
  { key: "programs", label: "Programet — Titull", fields: ["title", "body"] },
  { key: "kids_section", label: "Seksioni për Fëmijë", fields: ["title", "body"] },
  { key: "gallery", label: "Galeria — Titull", fields: ["title", "body"] },
  { key: "location", label: "Lokacioni — Titull", fields: ["title", "body"] },
  { key: "cta", label: "Kontakt — CTA", fields: ["title", "subtitle", "body"] },
  { key: "footer", label: "Footer", fields: ["body"] },
];

const FIELD_LABELS: Record<keyof TextValue, string> = {
  title: "Titulli",
  subtitle: "Nëntitulli",
  body: "Përmbajtja",
};

const EMPTY: TextValue = { title: "", subtitle: "", body: "" };

export default function ContentPage() {
  const [data, setData] = useState<TextMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then((rows: { section: string; locale: Locale; title: string | null; subtitle: string | null; body: string | null }[]) => {
        const map: TextMap = {};
        for (const section of SECTIONS) {
          map[section.key] = { sq: { ...EMPTY }, en: { ...EMPTY }, de: { ...EMPTY } };
        }
        for (const row of rows) {
          if (!map[row.section]) map[row.section] = { sq: { ...EMPTY }, en: { ...EMPTY }, de: { ...EMPTY } };
          map[row.section][row.locale] = {
            title: row.title ?? "",
            subtitle: row.subtitle ?? "",
            body: row.body ?? "",
          };
        }
        setData(map);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Duke ngarkuar...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Përmbajtja e Faqes</h1>
      <p className="mt-1 text-sm text-slate-500">Redakto tekstet e faqes kryesore në tri gjuhët.</p>

      <div className="mt-8 space-y-6">
        {SECTIONS.map((section) => (
          <SectionEditor
            key={section.key}
            sectionKey={section.key}
            label={section.label}
            fields={section.fields}
            values={data[section.key]}
            onSaved={(locale, value) =>
              setData((prev) => ({
                ...prev,
                [section.key]: { ...prev[section.key], [locale]: value },
              }))
            }
          />
        ))}
      </div>
    </div>
  );
}

function SectionEditor({
  sectionKey,
  label,
  fields,
  values,
  onSaved,
}: {
  sectionKey: string;
  label: string;
  fields: (keyof TextValue)[];
  values: Record<Locale, TextValue>;
  onSaved: (locale: Locale, value: TextValue) => void;
}) {
  const [activeLocale, setActiveLocale] = useState<Locale>("sq");
  const [draft, setDraft] = useState<TextValue>(values[activeLocale]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDraft(values[activeLocale]);
    setSaved(false);
  }, [activeLocale, values]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: sectionKey, locale: activeLocale, ...draft }),
    });
    setSaving(false);
    if (res.ok) {
      onSaved(activeLocale, draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-slate-900">{label}</h2>
        <div className="flex gap-1 rounded-full bg-slate-100 p-1">
          {LOCALES.map((loc) => (
            <button
              key={loc.code}
              type="button"
              onClick={() => setActiveLocale(loc.code)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                activeLocale === loc.code ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {loc.flag} {loc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
              {FIELD_LABELS[field]}
            </label>
            {field === "body" ? (
              <textarea
                rows={3}
                value={draft[field]}
                onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))}
                className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d4af37]"
              />
            ) : (
              <input
                type="text"
                value={draft[field]}
                onChange={(e) => setDraft((d) => ({ ...d, [field]: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-[#d4af37]"
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[#0b1530] px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Duke ruajtur..." : "Ruaj"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
            <Check className="h-4 w-4" /> U ruajt
          </span>
        )}
      </div>
    </div>
  );
}
