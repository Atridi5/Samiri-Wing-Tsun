"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { X, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useTranslations("register");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  useEffect(() => {
    if (open) setStatus("idle");
  }, [open]);

  if (!open) return null;

  const PROGRAMS = [
    { value: "kids", label: t("programKids") },
    { value: "teens", label: t("programTeens") },
    { value: "adults", label: t("programAdults") },
    { value: "trial", label: t("programTrial") },
  ];

  const EXPERIENCE_LEVELS = [
    { value: "none", label: t("experienceNone") },
    { value: "beginner", label: t("experienceBeginner") },
    { value: "intermediate", label: t("experienceIntermediate") },
    { value: "advanced", label: t("experienceAdvanced") },
  ];

  const SCHEDULES = [
    { value: "morning", label: t("scheduleMorning") },
    { value: "afternoon", label: t("scheduleAfternoon") },
    { value: "evening", label: t("scheduleEvening") },
    { value: "flexible", label: t("scheduleFlexible") },
  ];

  const HEARD_FROM_OPTIONS = [
    { value: "instagram", label: t("heardInstagram") },
    { value: "facebook", label: t("heardFacebook") },
    { value: "tiktok", label: t("heardTiktok") },
    { value: "friend", label: t("heardFriend") },
    { value: "google", label: t("heardGoogle") },
    { value: "other", label: t("heardOther") },
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/register", {
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-950/70 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-navy-800/40 hover:text-navy-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            <h3 className="mt-5 font-display text-xl font-bold uppercase text-navy-900">{t("successTitle")}</h3>
            <p className="mt-2 max-w-xs text-sm text-navy-800/70">{t("successBody")}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream-50 hover:bg-navy-800"
            >
              {t("close")}
            </button>
          </div>
        ) : (
          <>
            <p className="section-eyebrow text-xs font-semibold uppercase text-gold-600">{t("eyebrow")}</p>
            <h3 className="mt-1.5 font-display text-2xl font-bold uppercase text-navy-900">{t("title")}</h3>
            <p className="mt-2 text-sm text-navy-800/60">{t("subtitle")}</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Të dhënat personale */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-bold uppercase tracking-wide text-gold-600">
                  {t("sectionPersonal")}
                </legend>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                    {t("name")}
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    maxLength={120}
                    className="w-full rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("phone")}
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      maxLength={50}
                      className="w-full rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("email")}
                    </label>
                    <input
                      name="email"
                      type="email"
                      maxLength={200}
                      className="w-full rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("age")}
                    </label>
                    <input
                      name="age"
                      type="number"
                      min={3}
                      max={100}
                      className="w-full rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("address")}
                    </label>
                    <input
                      name="address"
                      type="text"
                      maxLength={200}
                      className="w-full rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              </fieldset>

              {/* Stërvitja */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-bold uppercase tracking-wide text-gold-600">
                  {t("sectionTraining")}
                </legend>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                    {t("program")}
                  </label>
                  <select
                    name="program"
                    required
                    defaultValue=""
                    className="w-full rounded-lg border border-navy-900/15 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                  >
                    <option value="" disabled>
                      {t("programPlaceholder")}
                    </option>
                    {PROGRAMS.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("experience")}
                    </label>
                    <select
                      name="experience"
                      defaultValue=""
                      className="w-full rounded-lg border border-navy-900/15 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    >
                      <option value="" disabled>
                        {t("experiencePlaceholder")}
                      </option>
                      {EXPERIENCE_LEVELS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("preferredSchedule")}
                    </label>
                    <select
                      name="preferredSchedule"
                      defaultValue=""
                      className="w-full rounded-lg border border-navy-900/15 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    >
                      <option value="" disabled>
                        {t("schedulePlaceholder")}
                      </option>
                      {SCHEDULES.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                    {t("heardFrom")}
                  </label>
                  <select
                    name="heardFrom"
                    defaultValue=""
                    className="w-full rounded-lg border border-navy-900/15 bg-white px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                  >
                    <option value="" disabled>
                      {t("heardFromPlaceholder")}
                    </option>
                    {HEARD_FROM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>

              {/* Kontakti i urgjencës dhe shëndeti */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-bold uppercase tracking-wide text-gold-600">
                  {t("sectionEmergency")}
                </legend>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("emergencyContactName")}
                    </label>
                    <input
                      name="emergencyContactName"
                      type="text"
                      maxLength={120}
                      className="w-full rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                      {t("emergencyContactPhone")}
                    </label>
                    <input
                      name="emergencyContactPhone"
                      type="tel"
                      maxLength={50}
                      className="w-full rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                    {t("healthNotes")}
                  </label>
                  <textarea
                    name="healthNotes"
                    rows={2}
                    maxLength={1000}
                    placeholder={t("healthNotesPlaceholder")}
                    className="w-full resize-none rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                  />
                </div>
              </fieldset>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-navy-800/70">
                  {t("message")}
                </label>
                <textarea
                  name="message"
                  rows={2}
                  maxLength={2000}
                  className="w-full resize-none rounded-lg border border-navy-900/15 px-4 py-2.5 text-sm text-navy-900 outline-none focus:border-gold-500"
                />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-3.5 text-sm font-semibold text-navy-950 transition-transform hover:scale-[1.02] hover:bg-gold-400 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {status === "sending" ? t("sending") : t("submit")}
              </button>

              {status === "error" && (
                <p className="flex items-center gap-2 text-sm font-medium text-red-600">
                  <AlertCircle className="h-4 w-4" /> {t("error")}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
