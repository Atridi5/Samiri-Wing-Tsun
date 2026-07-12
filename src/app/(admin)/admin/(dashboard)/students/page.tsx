"use client";

import { useEffect, useState } from "react";
import { Loader2, Phone, Mail, GraduationCap } from "lucide-react";

type Registration = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  age: number | null;
  program: string;
  status: "new" | "contacted" | "accepted" | "declined" | "enrolled";
  createdAt: string;
};

const PROGRAM_LABEL: Record<string, string> = {
  kids: "Kids",
  teens: "Të Rinj",
  adults: "Të Rritur",
  trial: "Orë Provë",
};

export default function StudentsPage() {
  const [items, setItems] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/registrations")
      .then((r) => r.json())
      .then((data: Registration[]) => {
        setItems(data.filter((r) => r.status === "enrolled"));
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
      <h1 className="text-2xl font-bold text-slate-900">Studentët</h1>
      <p className="mt-1 text-sm text-slate-500">
        Klientët e pranuar dhe të regjistruar si student aktivë. Për t&apos;i shtuar këtu, shëno statusin
        &quot;Student&quot; te faqja &quot;Regjistrimet&quot;.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-5 py-3">Emri</th>
              <th className="px-5 py-3">Programi</th>
              <th className="px-5 py-3">Kontakt</th>
              <th className="px-5 py-3">Mosha</th>
              <th className="px-5 py-3">Student që nga</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((s) => (
              <tr key={s.id}>
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
                <td className="px-5 py-4 text-slate-500">{new Date(s.createdAt).toLocaleDateString("sq-AL")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <p className="flex flex-col items-center gap-3 p-10 text-center text-sm text-slate-500">
            <GraduationCap className="h-8 w-8 text-slate-300" />
            Ende nuk ka studentë. Prano një regjistrim dhe vendose statusin &quot;Student&quot; për ta shtuar këtu.
          </p>
        )}
      </div>
    </div>
  );
}
