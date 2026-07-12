"use client";

import { useState } from "react";
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
} from "lucide-react";

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
    </div>
  );
}
