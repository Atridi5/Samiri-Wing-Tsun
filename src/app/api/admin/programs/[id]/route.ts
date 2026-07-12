import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(1000),
});

const schema = z.object({
  slug: z.string().min(1).max(60),
  icon: z.string().min(1).max(40),
  order: z.number().int().min(0),
  translations: z.array(translationSchema).min(1),
});

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const { slug, icon, order, translations } = parsed.data;

  await prisma.$transaction([
    prisma.program.update({ where: { id }, data: { slug, icon, order } }),
    ...translations.map((t) =>
      prisma.programTranslation.upsert({
        where: { programId_locale: { programId: id, locale: t.locale } },
        update: { title: t.title, description: t.description },
        create: { programId: id, locale: t.locale, title: t.title, description: t.description },
      })
    ),
  ]);

  const updated = await prisma.program.findUnique({ where: { id }, include: { translations: true } });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.program.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
