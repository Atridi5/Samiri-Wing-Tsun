"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, User, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setError("Emri i përdoruesit ose fjalëkalimi është i pasaktë.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Diçka shkoi keq. Provoni përsëri.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#060b1c] via-[#10193a] to-[#172248] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/images/logo.png" alt="Samir Wing Tsun System" width={72} height={72} className="h-[72px] w-[72px] rounded-full" />
          <h1 className="mt-5 text-lg font-semibold uppercase tracking-wide text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-white/50">Kyçu për të menaxhuar faqen</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white/[0.04] p-7 shadow-2xl ring-1 ring-white/10 backdrop-blur">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/60">
              Emri i përdoruesit
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                name="username"
                type="text"
                required
                autoFocus
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-white/60">
              Fjalëkalimi
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none transition-colors focus:border-[#d4af37]"
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-full bg-[#d4af37] py-3 text-sm font-semibold text-[#060b1c] transition-transform hover:scale-[1.02] disabled:opacity-60"
          >
            {loading ? "Duke u kyçur..." : "Kyçu"}
          </button>
        </form>

        <a href="/" className="mt-6 block text-center text-xs text-white/40 hover:text-white/70">
          &larr; Kthehu në faqe
        </a>
      </div>
    </div>
  );
}
