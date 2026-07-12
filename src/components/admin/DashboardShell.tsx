"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Dumbbell,
  Sparkles,
  Images,
  MessageSquareText,
  Mail,
  UserPlus,
  GraduationCap,
  Settings,
  HelpCircle,
  Tag,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Bell,
} from "lucide-react";

const REGISTRATIONS_POLL_MS = 15000;

function playNotificationBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    [880, 1175].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.15);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.15 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.15);
      osc.stop(now + i * 0.15 + 0.3);
    });
  } catch {
    // Audio not available; ignore.
  }
}

const NAV = [
  { href: "/admin", label: "Përmbledhje", icon: LayoutDashboard },
  { href: "/admin/content", label: "Përmbajtja e Faqes", icon: FileText },
  { href: "/admin/programs", label: "Programet", icon: Dumbbell },
  { href: "/admin/pricing", label: "Çmimorja", icon: Tag },
  { href: "/admin/benefits", label: "Përfitimet", icon: Sparkles },
  { href: "/admin/gallery", label: "Galeria", icon: Images },
  { href: "/admin/testimonials", label: "Dëshmi", icon: MessageSquareText },
  { href: "/admin/faq", label: "Pyetjet (Chatbot)", icon: HelpCircle },
  { href: "/admin/registrations", label: "Regjistrimet", icon: UserPlus },
  { href: "/admin/students", label: "Studentët", icon: GraduationCap },
  { href: "/admin/messages", label: "Mesazhet", icon: Mail },
  { href: "/admin/settings", label: "Cilësimet", icon: Settings },
];

export default function DashboardShell({
  username,
  children,
}: {
  username: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const knownIdsRef = useRef<Set<string> | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch("/api/admin/registrations");
        if (!res.ok) return;
        const data: { id: string; status: string }[] = await res.json();
        if (cancelled) return;

        const currentNew = data.filter((r) => r.status === "new");
        const currentIds = new Set(currentNew.map((r) => r.id));

        if (knownIdsRef.current) {
          const arrivedCount = [...currentIds].filter((id) => !knownIdsRef.current!.has(id)).length;
          if (arrivedCount > 0) {
            playNotificationBeep();
            setToast(
              arrivedCount === 1
                ? "Ka arritur 1 regjistrim i ri!"
                : `Kanë arritur ${arrivedCount} regjistrime të reja!`
            );
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = setTimeout(() => setToast(null), 6000);
          }
        }

        knownIdsRef.current = currentIds;
        setNewCount(currentIds.size);
      } catch {
        // Network hiccup; try again on next poll.
      }
    }

    poll();
    const interval = setInterval(poll, REGISTRATIONS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const SidebarContent = (
    <>
      <div className="flex items-center gap-3 px-5 py-6">
        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="h-10 w-10 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-white">Samir Wing Tsun</p>
          <p className="text-[11px] uppercase tracking-wide text-white/40">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? "bg-[#d4af37] text-[#060b1c]" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-[18px] w-[18px]" />
              {item.label}
              {item.href === "/admin/registrations" && newCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                  {newCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          Shiko Faqen
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/65 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Dilni
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#0b1530] lg:flex">{SidebarContent}</aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col bg-[#0b1530]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 text-white/50 hover:text-white"
              aria-label="Mbyll"
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 lg:justify-end">
          <button type="button" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Menu">
            <Menu className="h-6 w-6 text-slate-700" />
          </button>
          <p className="text-sm text-slate-500">
            Mirë se erdhe, <span className="font-semibold text-slate-800">{username}</span>
          </p>
        </header>
        <main className="flex-1 bg-slate-100 p-6 lg:p-10">{children}</main>
      </div>

      {toast && (
        <Link
          href="/admin/registrations"
          onClick={() => setToast(null)}
          className="fixed bottom-6 right-6 z-[300] flex items-center gap-3 rounded-2xl bg-[#0b1530] px-5 py-4 text-sm font-medium text-white shadow-2xl ring-1 ring-white/10 transition-transform hover:scale-[1.02]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/20 text-[#d4af37]">
            <Bell className="h-4.5 w-4.5" />
          </span>
          {toast}
        </Link>
      )}
    </div>
  );
}
