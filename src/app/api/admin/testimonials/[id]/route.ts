import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  text: z.string().min(1).max(600),
});

const schema = z.object({
  name: z.string().min(1).max(120),
  rating: z.number().int().min(1).max(5),
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
  const { name, rating, order, translations } = parsed.data;

  await prisma.$transaction([
    prisma.testimonial.update({ where: { id }, data: { name, rating, order } }),
    ...translations.map((t) =>
      prisma.testimonialTranslation.upsert({
        where: { testimonialId_locale: { testimonialId: id, locale: t.locale } },
        update: { text: t.text },
        create: { testimonialId: id, locale: t.locale, text: t.text },
      })
    ),
  ]);

  const updated = await prisma.testimonial.findUnique({ where: { id }, include: { translations: true } });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
