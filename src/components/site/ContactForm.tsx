"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
          {t("name")}
        </label>
        <input
          name="name"
          type="text"
          required
          maxLength={120}
          className="w-full rounded-lg border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-500"
        />
      </div>
      <div className="sm:col-span-1">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
          {t("email")}
        </label>
        <input
          name="email"
          type="email"
          required
          maxLength={200}
          className="w-full rounded-lg border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-500"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
          {t("phone")}
        </label>
        <input
          name="phone"
          type="tel"
          maxLength={50}
          className="w-full rounded-lg border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-500"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
          {t("message")}
        </label>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={3000}
          className="w-full resize-none rounded-lg border border-navy-900/15 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-gold-500"
        />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-7 py-3.5 text-sm font-semibold text-cream-50 transition-transform hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          <Send className="h-4 w-4" />
          {status === "sending" ? t("sending") : t("send")}
        </button>

        {status === "success" && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> {t("success")}
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-red-600">
            <AlertCircle className="h-4 w-4" /> {t("error")}
          </p>
        )}
      </div>
    </form>
  );
}
