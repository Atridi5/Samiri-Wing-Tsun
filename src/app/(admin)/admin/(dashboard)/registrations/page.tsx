"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, Phone, Mail, Check, X, Send } from "lucide-react";

type Registration = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  age: number | null;
  address: string | null;
  program: string;
  experience: string | null;
  heardFrom: string | null;
  preferredSchedule: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  healthNotes: string | null;
  message: string | null;
  status: "new" | "contacted" | "accepted" | "declined" | "enrolled";
  adminReply: string | null;
  createdAt: string;
};

const PROGRAM_LABEL: Record<string, string> = {
  kids: "Kids",
  teens: "Të Rinj",
  adults: "Të Rritur",
  trial: "Orë Provë",
};

const EXPERIENCE_LABEL: Record<string, string> = {
  none: "Pa përvojë",
  beginner: "Fillestar",
  intermediate: "Mesatar",
  advanced: "I Përparuar",
};

const SCHEDULE_LABEL: Record<string, string> = {
  morning: "Paradite",
  afternoon: "Pasdite",
  evening: "Mbrëmje",
  flexible: "Fleksibël",
};

const HEARD_FROM_LABEL: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  friend: "Mik/Familje",
  google: "Google",
  other: "Tjetër",
};

const STATUS_OPTIONS: { value: Registration["status"]; label: string }[] = [
  { value: "new", label: "I Ri" },
  { value: "contacted", label: "I Kontaktuar" },
  { value: "accepted", label: "I Pranuar" },
  { value: "declined", label: "I Anuluar" },
  { value: "enrolled", label: "Student" },
];

const STATUS_COLOR: Record<Registration["status"], string> = {
  new: "bg-[#d4af37]/15 text-[#8a6d1c]",
  contacted: "bg-blue-100 text-blue-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  enrolled: "bg-navy-900/10 text-navy-900",
};

export default function RegistrationsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingReplyId, setSavingReplyId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/registrations")
      .then((r) => r.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      });
  }, []);

  async function updateStatus(id: string, status: Registration["status"]) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function updateReplyDraft(id: string, adminReply: string) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, adminReply } : r)));
  }

  async function saveReply(id: string, adminReply: string, email: string | null) {
    setSavingReplyId(id);
    await fetch(`/api/admin/registrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminReply }),
    });
    setSavingReplyId(null);
    if (email && adminReply.trim()) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(
        "Përgjigje - Samir Wing Tsun System"
      )}&body=${encodeURIComponent(adminReply)}`;
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë regjistrim?")) return;
    await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((r) => r.id !== id));
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
      <h1 className="text-2xl font-bold text-slate-900">Regjistrimet</h1>
      <p className="mt-1 text-sm text-slate-500">
        Klientët që janë regjistruar nga faqja kryesore përmes butonit &quot;Regjistrohu&quot;.
      </p>

      <div className="mt-8 space-y-3">
        {items.map((reg) => (
          <div key={reg.id} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{reg.name}</p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {PROGRAM_LABEL[reg.program] ?? reg.program}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  <a href={`tel:${reg.phone}`} className="hover:text-slate-800">
                    {reg.phone}
                  </a>
                </p>
                {reg.email && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${reg.email}`} className="hover:text-slate-800">
                      {reg.email}
                    </a>
                  </p>
                )}
                {(reg.age || reg.address) && (
                  <p className="mt-0.5 text-sm text-slate-500">
                    {reg.age && <span>{reg.age} vjeç</span>}
                    {reg.age && reg.address && <span> · </span>}
                    {reg.address && <span>{reg.address}</span>}
                  </p>
                )}
              </div>
              <p className="text-xs text-slate-400">{new Date(reg.createdAt).toLocaleString("sq-AL")}</p>
            </div>

            {(reg.experience || reg.preferredSchedule || reg.heardFrom) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {reg.experience && (
                  <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">
                    Përvojë: {EXPERIENCE_LABEL[reg.experience] ?? reg.experience}
                  </span>
                )}
                {reg.preferredSchedule && (
                  <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">
                    Orari: {SCHEDULE_LABEL[reg.preferredSchedule] ?? reg.preferredSchedule}
                  </span>
                )}
                {reg.heardFrom && (
                  <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200">
                    Burimi: {HEARD_FROM_LABEL[reg.heardFrom] ?? reg.heardFrom}
                  </span>
                )}
              </div>
            )}

            {(reg.emergencyContactName || reg.emergencyContactPhone) && (
              <p className="mt-3 text-sm text-slate-600">
                <span className="font-semibold">Kontakt urgjence:</span> {reg.emergencyContactName}
                {reg.emergencyContactName && reg.emergencyContactPhone && " · "}
                {reg.emergencyContactPhone}
              </p>
            )}

            {reg.healthNotes && (
              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-amber-50 p-2.5 text-sm text-amber-800 ring-1 ring-amber-200">
                <span className="font-semibold">Shëndeti:</span> {reg.healthNotes}
              </p>
            )}

            {reg.message && <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{reg.message}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateStatus(reg.id, "accepted")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  reg.status === "accepted"
                    ? "bg-emerald-500 text-white"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                <Check className="h-3.5 w-3.5" /> Prano
              </button>
              <button
                type="button"
                onClick={() => updateStatus(reg.id, "declined")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  reg.status === "declined" ? "bg-red-500 text-white" : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
              >
                <X className="h-3.5 w-3.5" /> Anulo
              </button>

              <select
                value={reg.status}
                onChange={(e) => updateStatus(reg.id, e.target.value as Registration["status"])}
                className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${STATUS_COLOR[reg.status]}`}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleDelete(reg.id)}
                className="ml-auto flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" /> Fshi
              </button>
            </div>

            <div className="mt-3 flex items-start gap-2 border-t border-slate-100 pt-3">
              <textarea
                value={reg.adminReply ?? ""}
                onChange={(e) => updateReplyDraft(reg.id, e.target.value)}
                rows={1}
                placeholder="Shkruaj një përgjigje për klientin..."
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-navy-900/40"
              />
              <button
                type="button"
                disabled={savingReplyId === reg.id}
                onClick={() => saveReply(reg.id, reg.adminReply ?? "", reg.email)}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-2 text-xs font-semibold text-cream-50 hover:bg-navy-800 disabled:opacity-60"
                title={reg.email ? "Ruaj dhe hap email për t'iu përgjigjur" : "Ruaj përgjigjen"}
              >
                <Send className="h-3.5 w-3.5" />
                {savingReplyId === reg.id ? "..." : "Përgjigju"}
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            Ende nuk ka regjistrime.
          </p>
        )}
      </div>
    </div>
  );
}
