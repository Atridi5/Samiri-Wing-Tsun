import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const info = await prisma.contactInfo.findFirst();
  return NextResponse.json(info);
}

const schema = z.object({
  address: z.string().min(1).max(200),
  city: z.string().min(1).max(120),
  phone: z.string().min(1).max(50),
  email: z.string().email().max(200).optional().or(z.literal("")),
  instagram: z.string().max(300).optional().or(z.literal("")),
  facebook: z.string().max(300).optional().or(z.literal("")),
  tiktok: z.string().max(300).optional().or(z.literal("")),
  mapEmbedUrl: z.string().max(1000).optional().or(z.literal("")),
});

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const existing = await prisma.contactInfo.findFirst();
  const data = parsed.data;
  const updated = existing
    ? await prisma.contactInfo.update({ where: { id: existing.id }, data })
    : await prisma.contactInfo.create({ data: { id: "main", ...data } });

  return NextResponse.json(updated);
}
