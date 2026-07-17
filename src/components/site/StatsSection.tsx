import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function StatsSection() {
  const t = await getTranslations("stats");
  const activeStudents = await prisma.student.count({ where: { status: "active" } });

  const stats = [
    { value: `${activeStudents}+`, label: t("students") },
    { value: "10+", label: t("years") },
    { value: "3", label: t("groups") },
    { value: "3x", label: t("weekly") },
  ];

  return (
    <section className="bg-navy-950 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <p className="font-display text-4xl font-bold text-gold-400 sm:text-5xl">{s.value}</p>
            <p className="mt-2 text-xs uppercase tracking-widest text-cream-100/60">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
