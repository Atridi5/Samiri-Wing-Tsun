import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

const schema = z.object({
  caption: z.string().max(200).optional().nullable(),
  category: z.enum(["general", "hall", "group"]).optional(),
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

  if (image.url.includes("res.cloudinary.com")) {
    const match = image.url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    const publicId = match?.[1];
    if (publicId) {
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }
  }

  return NextResponse.json({ ok: true });
}
