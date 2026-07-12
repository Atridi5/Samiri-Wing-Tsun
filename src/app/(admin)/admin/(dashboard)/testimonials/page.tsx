"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, Star } from "lucide-react";

type Locale = "sq" | "en" | "de";
type Translation = { locale: Locale; text: string };
type Testimonial = { id: string; name: string; rating: number; order: number; translations: Translation[] };

const LOCALES: Locale[] = ["sq", "en", "de"];
const LOCALE_LABEL: Record<Locale, string> = { sq: "🇦🇱 SQ", en: "🇬🇧 EN", de: "🇩🇪 DE" };

function emptyTranslations(): Translation[] {
  return LOCALES.map((locale) => ({ locale, text: "" }));
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/testimonials")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë dëshmi?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((t) => t.id !== id));
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
          <h1 className="text-2xl font-bold text-slate-900">Dëshmi</h1>
          <p className="mt-1 text-sm text-slate-500">
            Shtohen vetëm kur ka dëshmi reale nga anëtarët — shfaqen automatikisht në faqe kur ka të paktën një.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-[#0b1530] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Shto Dëshmi
        </button>
      </div>

      <div className="mt-8 space-y-5">
        {creating && (
          <TestimonialForm
            onCancel={() => setCreating(false)}
            onSaved={(t) => {
              setItems((prev) => [...prev, t]);
              setCreating(false);
            }}
          />
        )}

        {items.map((item) => (
          <TestimonialForm
            key={item.id}
            testimonial={item}
            onSaved={(updated) => setItems((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))}
            onDelete={() => handleDelete(item.id)}
          />
        ))}

        {items.length === 0 && !creating && (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">Ende nuk ka dëshmi.</p>
        )}
      </div>
    </div>
  );
}

function TestimonialForm({
  testimonial,
  onSaved,
  onCancel,
  onDelete,
}: {
  testimonial?: Testimonial;
  onSaved: (t: Testimonial) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const [name, setName] = useState(testimonial?.name ?? "");
  const [rating, setRating] = useState(testimonial?.rating ?? 5);
  const [order, setOrder] = useState(testimonial?.order ?? 0);
  const [translations, setTranslations] = useState<Translation[]>(
    testimonial
      ? LOCALES.map((locale) => testimonial.translations.find((t) => t.locale === locale) ?? { locale, text: "" })
      : emptyTranslations()
  );
  const [activeLocale, setActiveLocale] = useState<Locale>("sq");
  const [saving, setSaving] = useState(false);

  function updateText(locale: Locale, value: string) {
    setTranslations((prev) => prev.map((t) => (t.locale === locale ? { ...t, text: value } : t)));
  }

  async function handleSubmit() {
    setSaving(true);
    const payload = { name, rating, order: Number(order), translations };
    const res = testimonial
      ? await fetch(`/api/admin/testimonials/${testimonial.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (res.ok) onSaved(await res.json());
  }

  const current = translations.find((t) => t.locale === activeLocale)!;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Emri</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Vlerësimi</label>
          <div className="flex items-center gap-1 pt-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)}>
                <Star className={`h-6 w-6 ${n <= rating ? "fill-[#d4af37] text-[#d4af37]" : "text-slate-300"}`} />
              </button>
            ))}
          </div>
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

      <div className="mt-4">
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Teksti i dëshmisë</label>
        <textarea
          rows={3}
          value={current.text}
          onChange={(e) => updateText(activeLocale, e.target.value)}
          className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !name || !translations.every((t) => t.text)}
          className="rounded-full bg-[#0b1530] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Duke ruajtur..." : testimonial ? "Ruaj Ndryshimet" : "Krijo"}
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
