import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  caption: z.string().max(200).optional().nullable(),
  order: z.number().int().min(0),
});

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const updated = await prisma.galleryImage.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const image = await prisma.galleryImage.delete({ where: { id } });

  if (image.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", image.url);
    await unlink(filePath).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
