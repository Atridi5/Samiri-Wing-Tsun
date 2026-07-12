import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  name: z.string().min(1).max(120),
  price: z.string().min(1).max(40),
  period: z.string().min(1).max(60),
  features: z.string().min(1).max(2000),
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
    prisma.pricingPlan.update({ where: { id }, data: { order } }),
    ...translations.map((t) =>
      prisma.pricingPlanTranslation.upsert({
        where: { planId_locale: { planId: id, locale: t.locale } },
        update: { name: t.name, price: t.price, period: t.period, features: t.features },
        create: { planId: id, locale: t.locale, name: t.name, price: t.price, period: t.period, features: t.features },
      })
    ),
  ]);

  const updated = await prisma.pricingPlan.findUnique({ where: { id }, include: { translations: true } });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.pricingPlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
