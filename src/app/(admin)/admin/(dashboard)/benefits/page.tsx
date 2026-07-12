"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { ICONS } from "@/components/site/icon-map";

type Locale = "sq" | "en" | "de";
type Translation = { locale: Locale; text: string };
type Benefit = { id: string; category: string; icon: string; order: number; translations: Translation[] };

const LOCALES: Locale[] = ["sq", "en", "de"];
const LOCALE_LABEL: Record<Locale, string> = { sq: "🇦🇱 SQ", en: "🇬🇧 EN", de: "🇩🇪 DE" };
const ICON_NAMES = Object.keys(ICONS);

const CATEGORIES = [
  { key: "why", label: "Pse Wing Tsun" },
  { key: "passive", label: "Njerëzit Pasiv" },
  { key: "active", label: "Njerëzit Aktiv" },
];

function emptyTranslations(): Translation[] {
  return LOCALES.map((locale) => ({ locale, text: "" }));
}

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("why");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/benefits")
      .then((r) => r.json())
      .then((data) => {
        setBenefits(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish?")) return;
    await fetch(`/api/admin/benefits/${id}`, { method: "DELETE" });
    setBenefits((prev) => prev.filter((b) => b.id !== id));
  }

  const filtered = benefits.filter((b) => b.category === category);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Duke ngarkuar...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Përfitimet</h1>
          <p className="mt-1 text-sm text-slate-500">Listat e ikonave/pikave për seksionet "Pse Wing Tsun" dhe krahasimin Pasiv vs Aktiv.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-[#0b1530] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Shto Pikë
        </button>
      </div>

      <div className="mt-6 flex gap-1 rounded-full bg-slate-200/70 p-1 w-fit">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => {
              setCategory(cat.key);
              setCreating(false);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === cat.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {creating && (
          <BenefitForm
            category={category}
            onCancel={() => setCreating(false)}
            onSaved={(b) => {
              setBenefits((prev) => [...prev, b]);
              setCreating(false);
            }}
          />
        )}

        {filtered.map((benefit) => (
          <BenefitForm
            key={benefit.id}
            category={category}
            benefit={benefit}
            onSaved={(updated) => setBenefits((prev) => prev.map((b) => (b.id === updated.id ? updated : b)))}
            onDelete={() => handleDelete(benefit.id)}
          />
        ))}

        {filtered.length === 0 && !creating && (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            Nuk ka ende pika për këtë kategori.
          </p>
        )}
      </div>
    </div>
  );
}

function BenefitForm({
  category,
  benefit,
  onSaved,
  onCancel,
  onDelete,
}: {
  category: string;
  benefit?: Benefit;
  onSaved: (b: Benefit) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const [icon, setIcon] = useState(benefit?.icon ?? "check");
  const [order, setOrder] = useState(benefit?.order ?? 0);
  const [translations, setTranslations] = useState<Translation[]>(
    benefit
      ? LOCALES.map((locale) => benefit.translations.find((t) => t.locale === locale) ?? { locale, text: "" })
      : emptyTranslations()
  );
  const [activeLocale, setActiveLocale] = useState<Locale>("sq");
  const [saving, setSaving] = useState(false);

  function updateText(locale: Locale, value: string) {
    setTranslations((prev) => prev.map((t) => (t.locale === locale ? { ...t, text: value } : t)));
  }

  async function handleSubmit() {
    setSaving(true);
    const payload = { category, icon, order: Number(order), translations };
    const res = benefit
      ? await fetch(`/api/admin/benefits/${benefit.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/benefits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (res.ok) onSaved(await res.json());
  }

  const current = translations.find((t) => t.locale === activeLocale)!;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#d4af37]"
        >
          {ICON_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#d4af37]"
          title="Renditja"
        />
        <div className="flex gap-1 rounded-full bg-slate-100 p-1">
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
        <input
          value={current.text}
          onChange={(e) => updateText(activeLocale, e.target.value)}
          placeholder="Teksti..."
          className="min-w-[200px] flex-1 rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#d4af37]"
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !translations.every((t) => t.text)}
          className="rounded-full bg-[#0b1530] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Duke ruajtur..." : benefit ? "Ruaj" : "Krijo"}
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
