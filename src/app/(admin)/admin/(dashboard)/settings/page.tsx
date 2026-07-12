"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, MapPinned } from "lucide-react";

type ContactInfo = {
  address: string;
  city: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  mapEmbedUrl: string;
};

const EMPTY: ContactInfo = {
  address: "",
  city: "",
  phone: "",
  email: "",
  instagram: "",
  facebook: "",
  tiktok: "",
  mapEmbedUrl: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState<ContactInfo>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            address: data.address ?? "",
            city: data.city ?? "",
            phone: data.phone ?? "",
            email: data.email ?? "",
            instagram: data.instagram ?? "",
            facebook: data.facebook ?? "",
            tiktok: data.tiktok ?? "",
            mapEmbedUrl: data.mapEmbedUrl ?? "",
          });
        }
        setLoading(false);
      });
  }, []);

  function set<K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function regenerateMap() {
    const query = encodeURIComponent(`${form.address}, ${form.city}`);
    set("mapEmbedUrl", `https://www.google.com/maps?q=${query}&output=embed`);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" /> Duke ngarkuar...
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Cilësimet</h1>
      <p className="mt-1 text-sm text-slate-500">Informatat e kontaktit, rrjetet sociale dhe harta e Google Maps.</p>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-semibold text-slate-900">Kontakt</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Adresa" value={form.address} onChange={(v) => set("address", v)} />
          <Field label="Qyteti" value={form.city} onChange={(v) => set("city", v)} />
          <Field label="Telefoni" value={form.phone} onChange={(v) => set("phone", v)} />
          <Field label="Email" value={form.email} onChange={(v) => set("email", v)} type="email" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-semibold text-slate-900">Rrjetet Sociale</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/..." />
          <Field label="Facebook" value={form.facebook} onChange={(v) => set("facebook", v)} placeholder="https://facebook.com/..." />
          <Field label="TikTok" value={form.tiktok} onChange={(v) => set("tiktok", v)} placeholder="https://tiktok.com/@..." />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Harta (Google Maps)</h2>
          <button
            type="button"
            onClick={regenerateMap}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <MapPinned className="h-3.5 w-3.5" /> Rigjenero nga adresa
          </button>
        </div>
        <div className="mt-4">
          <Field
            label="Map Embed URL"
            value={form.mapEmbedUrl}
            onChange={(v) => set("mapEmbedUrl", v)}
            placeholder="https://www.google.com/maps?q=...&output=embed"
          />
        </div>
        {form.mapEmbedUrl && (
          <iframe src={form.mapEmbedUrl} className="mt-4 h-64 w-full rounded-xl border border-slate-200" loading="lazy" title="Preview" />
        )}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[#0b1530] px-6 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Duke ruajtur..." : "Ruaj Cilësimet"}
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

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
      />
    </div>
  );
}
