"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { ICONS } from "@/components/site/icon-map";

type Locale = "sq" | "en" | "de";
type Translation = { locale: Locale; title: string; description: string };
type Program = { id: string; slug: string; icon: string; order: number; translations: Translation[] };

const LOCALES: Locale[] = ["sq", "en", "de"];
const LOCALE_LABEL: Record<Locale, string> = { sq: "🇦🇱 SQ", en: "🇬🇧 EN", de: "🇩🇪 DE" };
const ICON_NAMES = Object.keys(ICONS);

function emptyTranslations(): Translation[] {
  return LOCALES.map((locale) => ({ locale, title: "", description: "" }));
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  function load() {
    fetch("/api/admin/programs")
      .then((r) => r.json())
      .then((data) => {
        setPrograms(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë program?")) return;
    await fetch(`/api/admin/programs/${id}`, { method: "DELETE" });
    setPrograms((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Duke ngarkuar...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Programet</h1>
          <p className="mt-1 text-sm text-slate-500">Menaxho programet (Kids, Të Rinj, Të Rritur, etj.)</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-[#0b1530] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Shto Program
        </button>
      </div>

      <div className="mt-8 space-y-5">
        {creating && (
          <ProgramForm
            onCancel={() => setCreating(false)}
            onSaved={(program) => {
              setPrograms((prev) => [...prev, program]);
              setCreating(false);
            }}
          />
        )}

        {programs.map((program) => (
          <ProgramForm
            key={program.id}
            program={program}
            onSaved={(updated) => setPrograms((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
            onDelete={() => handleDelete(program.id)}
          />
        ))}
      </div>
    </div>
  );
}

function ProgramForm({
  program,
  onSaved,
  onCancel,
  onDelete,
}: {
  program?: Program;
  onSaved: (p: Program) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const [slug, setSlug] = useState(program?.slug ?? "");
  const [icon, setIcon] = useState(program?.icon ?? "shield");
  const [order, setOrder] = useState(program?.order ?? 0);
  const [translations, setTranslations] = useState<Translation[]>(
    program
      ? LOCALES.map((locale) => program.translations.find((t) => t.locale === locale) ?? { locale, title: "", description: "" })
      : emptyTranslations()
  );
  const [activeLocale, setActiveLocale] = useState<Locale>("sq");
  const [saving, setSaving] = useState(false);

  function updateTranslation(locale: Locale, field: "title" | "description", value: string) {
    setTranslations((prev) => prev.map((t) => (t.locale === locale ? { ...t, [field]: value } : t)));
  }

  async function handleSubmit() {
    setSaving(true);
    const payload = { slug, icon, order: Number(order), translations };
    const res = program
      ? await fetch(`/api/admin/programs/${program.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/programs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (res.ok) {
      const data = await res.json();
      onSaved(data);
    }
  }

  const current = translations.find((t) => t.locale === activeLocale)!;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Slug</label>
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="kids"
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Ikona</label>
          <select
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
          >
            {ICON_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Renditja</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-1 rounded-full bg-slate-100 p-1 w-fit">
        {LOCALES.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActiveLocale(loc)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeLocale === loc ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {LOCALE_LABEL[loc]}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Titulli</label>
          <input
            value={current.title}
            onChange={(e) => updateTranslation(activeLocale, "title", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Përshkrimi</label>
          <textarea
            rows={3}
            value={current.description}
            onChange={(e) => updateTranslation(activeLocale, "description", e.target.value)}
            className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !slug || !translations.every((t) => t.title && t.description)}
          className="rounded-full bg-[#0b1530] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Duke ruajtur..." : program ? "Ruaj Ndryshimet" : "Krijo Programin"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Anulo
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" /> Fshi
          </button>
        )}
      </div>
    </div>
  );
}
