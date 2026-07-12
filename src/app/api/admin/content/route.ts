import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const rows = await prisma.siteText.findMany();
  return NextResponse.json(rows);
}

const schema = z.object({
  section: z.string().min(1),
  locale: z.enum(["sq", "en", "de"]),
  title: z.string().max(300).optional().nullable(),
  subtitle: z.string().max(400).optional().nullable(),
  body: z.string().max(4000).optional().nullable(),
});

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const { section, locale, title, subtitle, body: bodyText } = parsed.data;
  const result = await prisma.siteText.upsert({
    where: { section_locale: { section, locale } },
    update: { title, subtitle, body: bodyText },
    create: { section, locale, title, subtitle, body: bodyText },
  });
  return NextResponse.json(result);
}
