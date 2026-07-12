import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  status: z.enum(["new", "contacted", "accepted", "declined", "enrolled"]).optional(),
  adminReply: z.string().trim().max(2000).optional(),
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const updated = await prisma.registration.update({ where: { id }, data: parsed.data });

  if (parsed.data.status === "enrolled") {
    const existing = await prisma.student.findUnique({ where: { registrationId: id } });
    if (!existing) {
      await prisma.student.create({
        data: {
          registrationId: id,
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
          age: updated.age,
          address: updated.address,
          program: updated.program,
          emergencyContactName: updated.emergencyContactName,
          emergencyContactPhone: updated.emergencyContactPhone,
          healthNotes: updated.healthNotes,
        },
      });
    }
  }

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.registration.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
