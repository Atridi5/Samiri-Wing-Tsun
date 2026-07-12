import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(images);
}

const schema = z.object({
  url: z.string().min(1).max(500),
  caption: z.string().max(200).optional().nullable(),
  category: z.enum(["general", "hall", "group"]).default("general"),
  order: z.number().int().min(0).default(0),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const image = await prisma.galleryImage.create({ data: parsed.data });
  return NextResponse.json(image, { status: 201 });
}
