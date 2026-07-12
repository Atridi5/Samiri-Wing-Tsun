"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Dumbbell, Sparkles, Images, MessageSquareText, Mail, UserPlus, GraduationCap } from "lucide-react";

type Stats = {
  programs: number;
  benefits: number;
  gallery: number;
  testimonials: number;
  messages: number;
  unreadMessages: number;
  registrations: number;
  newRegistrations: number;
  students: number;
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = [
    { label: "Regjistrime të Reja", value: stats?.newRegistrations, icon: UserPlus, href: "/admin/registrations" },
    { label: "Regjistrime Gjithsej", value: stats?.registrations, icon: UserPlus, href: "/admin/registrations" },
    { label: "Studentë", value: stats?.students, icon: GraduationCap, href: "/admin/students" },
    { label: "Mesazhe të Palexuara", value: stats?.unreadMessages, icon: Mail, href: "/admin/messages" },
    { label: "Programe", value: stats?.programs, icon: Dumbbell, href: "/admin/programs" },
    { label: "Përfitime", value: stats?.benefits, icon: Sparkles, href: "/admin/benefits" },
    { label: "Foto në Galeri", value: stats?.gallery, icon: Images, href: "/admin/gallery" },
    { label: "Dëshmi", value: stats?.testimonials, icon: MessageSquareText, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Përmbledhje</h1>
      <p className="mt-1 text-sm text-slate-500">Statistika të shpejta për faqen tënde.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0b1530]/5 text-[#0b1530]">
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{card.value ?? "—"}</p>
              <p className="text-sm text-slate-500">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-base font-semibold text-slate-900">Fillo shpejt</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>• Shiko klientët që janë regjistruar nga faqja te &quot;Regjistrimet&quot;.</li>
          <li>• Redakto tekstet e faqes (hero, rreth nesh, CTA) te &quot;Përmbajtja e Faqes&quot;.</li>
          <li>• Shto ose ndrysho fotot e galerisë te &quot;Galeria&quot;.</li>
          <li>• Përditëso adresën, telefonin dhe hartën te &quot;Cilësimet&quot;.</li>
          <li>• Shiko mesazhet e klientëve nga formulari i kontaktit te &quot;Mesazhet&quot;.</li>
        </ul>
      </div>
    </div>
  );
}
