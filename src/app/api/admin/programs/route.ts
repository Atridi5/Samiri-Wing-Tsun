import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const programs = await prisma.program.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });
  return NextResponse.json(programs);
}

const translationSchema = z.object({
  locale: z.enum(["sq", "en", "de"]),
  title: z.string().min(1).max(150),
  description: z.string().min(1).max(1000),
});

const schema = z.object({
  slug: z.string().min(1).max(60),
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
  const { slug, icon, order, translations } = parsed.data;

  const program = await prisma.program.create({
    data: {
      slug,
      icon,
      order,
      translations: { create: translations },
    },
    include: { translations: true },
  });
  return NextResponse.json(program, { status: 201 });
}
