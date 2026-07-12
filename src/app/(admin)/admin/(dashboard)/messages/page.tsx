"use client";

import { useEffect, useState } from "react";
import { Trash2, Loader2, Mail, MailOpen, Phone } from "lucide-react";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/messages")
      .then((r) => r.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      });
  }, []);

  async function toggleRead(msg: ContactMessage) {
    const updated = { ...msg, read: !msg.read };
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
    await fetch(`/api/admin/messages/${msg.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: updated.read }),
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("A je i sigurt që dëshiron ta fshish këtë mesazh?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
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
      <h1 className="text-2xl font-bold text-slate-900">Mesazhet</h1>
      <p className="mt-1 text-sm text-slate-500">Mesazhet e dërguara nga formulari i kontaktit në faqe.</p>

      <div className="mt-8 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`rounded-2xl bg-white p-5 shadow-sm ring-1 transition-colors ${
              msg.read ? "ring-slate-200" : "ring-[#d4af37]/50"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {!msg.read && <span className="h-2 w-2 rounded-full bg-[#d4af37]" />}
                  <p className="font-semibold text-slate-900">{msg.name}</p>
                </div>
                <p className="mt-0.5 text-sm text-slate-500">{msg.email}</p>
                {msg.phone && (
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-500">
                    <Phone className="h-3.5 w-3.5" /> {msg.phone}
                  </p>
                )}
              </div>
              <p className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleString("sq-AL")}</p>
            </div>

            <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{msg.message}</p>

            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => toggleRead(msg)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                {msg.read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                {msg.read ? "Shëno të palexuar" : "Shëno të lexuar"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(msg.id)}
                className="ml-auto flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" /> Fshi
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="rounded-2xl bg-white p-6 text-sm text-slate-500 ring-1 ring-slate-200">
            Ende nuk ka mesazhe.
          </p>
        )}
      </div>
    </div>
  );
}
