"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";

type Locale = "sq" | "en" | "de";
type Translation = { locale: Locale; name: string; price: string; period: string; features: string };
type Plan = { id: string; order: number; translations: Translation[] };

const LOCALES: Locale[] = ["sq", "en", "de"];
const LOCALE_LABEL: Record<Locale, string> = { sq: "🇦🇱 SQ", en: "🇬🇧 EN", de: "🇩🇪 DE" };

function emptyTranslations(): Translation[] {
  return LOCALES.map((locale) => ({ locale, name: "", price: "", period: "", features: "" }));
}

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/pricing")
      .then((r) => r.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      });
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë paketë?")) return;
    await fetch(`/api/admin/pricing/${id}`, { method: "DELETE" });
    setPlans((prev) => prev.filter((p) => p.id !== id));
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Çmimorja</h1>
          <p className="mt-1 text-sm text-slate-500">Paketat dhe çmimet që shfaqen te faqja "Çmimorja".</p>
        </div>
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 rounded-full bg-[#0b1530] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Shto Paketë
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {creating && (
          <PlanForm
            onCancel={() => setCreating(false)}
            onSaved={(p) => {
              setPlans((prev) => [...prev, p]);
              setCreating(false);
            }}
          />
        )}

        {plans.map((plan) => (
          <PlanForm
            key={plan.id}
            plan={plan}
            onSaved={(updated) => setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))}
            onDelete={() => handleDelete(plan.id)}
          />
        ))}

        {plans.length === 0 && !creating && (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            Ende nuk ka paketa çmimesh. Shto të parën më sipër.
          </p>
        )}
      </div>
    </div>
  );
}

function PlanForm({
  plan,
  onSaved,
  onCancel,
  onDelete,
}: {
  plan?: Plan;
  onSaved: (p: Plan) => void;
  onCancel?: () => void;
  onDelete?: () => void;
}) {
  const [order, setOrder] = useState(plan?.order ?? 0);
  const [translations, setTranslations] = useState<Translation[]>(
    plan
      ? LOCALES.map(
          (locale) =>
            plan.translations.find((t) => t.locale === locale) ?? {
              locale,
              name: "",
              price: "",
              period: "",
              features: "",
            }
        )
      : emptyTranslations()
  );
  const [activeLocale, setActiveLocale] = useState<Locale>("sq");
  const [saving, setSaving] = useState(false);

  function updateField(locale: Locale, field: keyof Omit<Translation, "locale">, value: string) {
    setTranslations((prev) => prev.map((t) => (t.locale === locale ? { ...t, [field]: value } : t)));
  }

  async function handleSubmit() {
    setSaving(true);
    const payload = { order: Number(order), translations };
    const res = plan
      ? await fetch(`/api/admin/pricing/${plan.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/pricing", {
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
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          value={current.name}
          onChange={(e) => updateField(activeLocale, "name", e.target.value)}
          placeholder="Emri i paketës (p.sh. Kids)"
          className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#d4af37]"
        />
        <input
          value={current.price}
          onChange={(e) => updateField(activeLocale, "price", e.target.value)}
          placeholder="Çmimi (p.sh. 30€)"
          className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#d4af37]"
        />
        <input
          value={current.period}
          onChange={(e) => updateField(activeLocale, "period", e.target.value)}
          placeholder="Periudha (p.sh. / muaj)"
          className="rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#d4af37]"
        />
      </div>
      <textarea
        value={current.features}
        onChange={(e) => updateField(activeLocale, "features", e.target.value)}
        placeholder={"Përfitimet, një për rresht...\n2 orë stërvitje në javë\nUniformë falas\n..."}
        rows={4}
        className="mt-3 w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-[#d4af37]"
      />

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving || !translations.every((t) => t.name && t.price && t.period)}
          className="rounded-full bg-[#0b1530] px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Duke ruajtur..." : plan ? "Ruaj" : "Krijo"}
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
