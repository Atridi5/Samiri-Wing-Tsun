import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const benefits = await prisma.benefit.findMany({
    where: category ? { category } : undefined,
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: { translations: true },
  });
  return NextResponse.json(benefits);
}

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  text: z.string().min(1).max(200),
});

const schema = z.object({
  category: z.enum(["why", "passive", "active"]),
  icon: z.string().min(1).max(40),
  order: z.number().int().min(0).default(0),
  translations: z.array(translationSchema).min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const { category, icon, order, translations } = parsed.data;
  const benefit = await prisma.benefit.create({
    data: { category, icon, order, translations: { create: translations } },
    include: { translations: true },
  });
  return NextResponse.json(benefit, { status: 201 });
}
