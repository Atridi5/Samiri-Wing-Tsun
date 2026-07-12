import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(2000),
});

const schema = z.object({
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
  const { order, translations } = parsed.data;

  await prisma.$transaction([
    prisma.faqItem.update({ where: { id }, data: { order } }),
    ...translations.map((t) =>
      prisma.faqTranslation.upsert({
        where: { faqId_locale: { faqId: id, locale: t.locale } },
        update: { question: t.question, answer: t.answer },
        create: { faqId: id, locale: t.locale, question: t.question, answer: t.answer },
      })
    ),
  ]);

  const updated = await prisma.faqItem.findUnique({ where: { id }, include: { translations: true } });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.faqItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
