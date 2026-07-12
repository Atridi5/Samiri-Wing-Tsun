import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });
  return NextResponse.json(testimonials);
}

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  text: z.string().min(1).max(600),
});

const schema = z.object({
  name: z.string().min(1).max(120),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().min(0).default(0),
  translations: z.array(translationSchema).min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const { name, rating, order, translations } = parsed.data;
  const testimonial = await prisma.testimonial.create({
    data: { name, rating, order, translations: { create: translations } },
    include: { translations: true },
  });
  return NextResponse.json(testimonial, { status: 201 });
}
