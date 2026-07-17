import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  diplomaUrl: z.string().url().nullable(),
});

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const updated = await prisma.student.update({
    where: { id },
    data: {
      diplomaUrl: parsed.data.diplomaUrl,
      diplomaIssuedAt: parsed.data.diplomaUrl ? new Date() : null,
    },
  });
  return NextResponse.json(updated);
}
