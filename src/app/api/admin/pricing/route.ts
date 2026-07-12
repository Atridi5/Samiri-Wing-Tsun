import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const plans = await prisma.pricingPlan.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });
  return NextResponse.json(plans);
}

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  name: z.string().min(1).max(120),
  price: z.string().min(1).max(40),
  period: z.string().min(1).max(60),
  features: z.string().min(1).max(2000),
});

const schema = z.object({
  order: z.number().int().min(0).default(0),
  translations: z.array(translationSchema).min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const { order, translations } = parsed.data;
  const plan = await prisma.pricingPlan.create({
    data: { order, translations: { create: translations } },
    include: { translations: true },
  });
  return NextResponse.json(plan, { status: 201 });
}
