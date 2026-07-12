"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Phone, Mail, GraduationCap, Plus, Trash2, Pencil, X, Search } from "lucide-react";

type Student = {
  id: string;
  registrationId: string | null;
  name: string;
  phone: string;
  email: string | null;
  age: number | null;
  address: string | null;
  program: string;
  status: "active" | "paused" | "inactive";
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  healthNotes: string | null;
  notes: string | null;
  joinedAt: string;
};

const PROGRAM_LABEL: Record<string, string> = {
  kids: "Kids",
  teens: "Të Rinj",
  adults: "Të Rritur",
  trial: "Orë Provë",
};

const STATUS_OPTIONS: { value: Student["status"]; label: string }[] = [
  { value: "active", label: "Aktiv" },
  { value: "paused", label: "Pauzuar" },
  { value: "inactive", label: "Joaktiv" },
];

const STATUS_COLOR: Record<Student["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  inactive: "bg-slate-200 text-slate-600",
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  age: string;
  address: string;
  program: string;
  status: Student["status"];
  emergencyContactName: string;
  emergencyContactPhone: string;
  healthNotes: string;
  notes: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  email: "",
  age: "",
  address: "",
  program: "adults",
  status: "active",
  emergencyContactName: "",
  emergencyContactPhone: "",
  healthNotes: "",
  notes: "",
};

function toForm(s: Student): FormState {
  return {
    name: s.name,
    phone: s.phone,
    email: s.email ?? "",
    age: s.age?.toString() ?? "",
    address: s.address ?? "",
    program: s.program,
    status: s.status,
    emergencyContactName: s.emergencyContactName ?? "",
    emergencyContactPhone: s.emergencyContactPhone ?? "",
    healthNotes: s.healthNotes ?? "",
    notes: s.notes ?? "",
  };
}

export default function StudentsPage() {
  const [items, setItems] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Student["status"]>("all");
  const [modal, setModal] = useState<"create" | Student | null>(null);

  function load() {
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((data: Student[]) => {
        setItems(data);
        setLoading(false);
      });
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    return items.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return s.name.toLowerCase().includes(q) || s.phone.includes(q) || (s.email ?? "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, search, statusFilter]);

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë student?")) return;
    await fetch(`/api/admin/students/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  const counts = {
    active: items.filter((s) => s.status === "active").length,
    paused: items.filter((s) => s.status === "paused").length,
    inactive: items.filter((s) => s.status === "inactive").length,
  };

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
          <h1 className="text-2xl font-bold text-slate-900">Studentët</h1>
          <p className="mt-1 text-sm text-slate-500">
            Menaxho studentët aktivë. Regjistrimet e pranuara si &quot;Student&quot; shtohen këtu automatikisht.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModal("create")}
          className="flex items-center gap-2 rounded-full bg-[#0b1530] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Shto Student
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-2xl font-bold text-emerald-600">{counts.active}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">Aktivë</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-2xl font-bold text-amber-600">{counts.paused}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">Pauzuar</p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-2xl font-bold text-slate-500">{counts.inactive}</p>
          <p className="text-xs uppercase tracking-wide text-slate-500">Joaktivë</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko sipas emrit, telefonit, email..."
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#d4af37]"
          />
        </div>
        <div className="flex gap-1 rounded-full bg-slate-200/70 p-1">
          {(["all", "active", "paused", "inactive"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
                statusFilter === s ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {s === "all" ? "Të gjithë" : STATUS_OPTIONS.find((o) => o.value === s)?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Emri</th>
              <th className="px-5 py-3">Programi</th>
              <th className="px-5 py-3">Kontakt</th>
              <th className="px-5 py-3">Mosha</th>
              <th className="px-5 py-3">Statusi</th>
              <th className="px-5 py-3">Student që nga</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60">
                <td className="px-5 py-4 font-semibold text-slate-900">{s.name}</td>
                <td className="px-5 py-4">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    {PROGRAM_LABEL[s.program] ?? s.program}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <a href={`tel:${s.phone}`} className="hover:text-slate-900">
                      {s.phone}
                    </a>
                  </div>
                  {s.email && (
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" />
                      <a href={`mailto:${s.email}`} className="hover:text-slate-900">
                        {s.email}
                      </a>
                    </div>
                  )}
                </td>
                <td className="px-5 py-4 text-slate-600">{s.age ?? "—"}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[s.status]}`}>
                    {STATUS_OPTIONS.find((o) => o.value === s.status)?.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-500">{new Date(s.joinedAt).toLocaleDateString("sq-AL")}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModal(s)}
                      className="text-slate-400 hover:text-slate-800"
                      aria-label="Ndrysho"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="text-red-400 hover:text-red-600"
                      aria-label="Fshi"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="flex flex-col items-center gap-3 p-10 text-center text-sm text-slate-500">
            <GraduationCap className="h-8 w-8 text-slate-300" />
            {items.length === 0
              ? 'Ende nuk ka studentë. Shto një manualisht ose prano një regjistrim si "Student".'
              : "Asnjë student nuk përputhet me kërkimin/filtrin."}
          </p>
        )}
      </div>

      {modal && (
        <StudentModal
          student={modal === "create" ? null : modal}
          onClose={() => setModal(null)}
          onSaved={(saved, isNew) => {
            setItems((prev) => (isNew ? [saved, ...prev] : prev.map((s) => (s.id === saved.id ? saved : s))));
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function StudentModal({
  student,
  onClose,
  onSaved,
}: {
  student: Student | null;
  onClose: () => void;
  onSaved: (s: Student, isNew: boolean) => void;
}) {
  const [form, setForm] = useState<FormState>(student ? toForm(student) : EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      age: form.age ? Number(form.age) : null,
    };
    const res = student
      ? await fetch(`/api/admin/students/${student.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (res.ok) {
      const saved = await res.json();
      onSaved(saved, !student);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-800"
          aria-label="Mbyll"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-900">{student ? "Ndrysho Studentin" : "Shto Student"}</h2>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Emri</label>
              <input
                required
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Telefoni</label>
              <input
                required
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Mosha</label>
              <input
                type="number"
                min={0}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Programi</label>
              <select
                value={form.program}
                onChange={(e) => set("program", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              >
                {Object.entries(PROGRAM_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Statusi</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as Student["status"])}
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Adresa</label>
            <input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                Kontakt urgjence — Emri
              </label>
              <input
                value={form.emergencyContactName}
                onChange={(e) => set("emergencyContactName", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">
                Kontakt urgjence — Telefoni
              </label>
              <input
                value={form.emergencyContactPhone}
                onChange={(e) => set("emergencyContactPhone", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Shënime shëndetësore</label>
            <textarea
              rows={2}
              value={form.healthNotes}
              onChange={(e) => set("healthNotes", e.target.value)}
              className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase text-slate-500">Shënime private</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="P.sh. progres, pagesa, vërejtje..."
              className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-[#0b1530] py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Duke ruajtur..." : student ? "Ruaj Ndryshimet" : "Shto Studentin"}
          </button>
        </form>
      </div>
    </div>
  );
}
