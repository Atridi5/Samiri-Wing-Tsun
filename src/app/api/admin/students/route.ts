import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany({ orderBy: { joinedAt: "desc" } });
  return NextResponse.json(students);
}

const schema = z.object({
  registrationId: z.string().optional().nullable(),
  name: z.string().min(1).max(120),
  phone: z.string().min(1).max(50),
  email: z.string().email().max(200).optional().nullable().or(z.literal("")),
  age: z.number().int().min(0).max(120).optional().nullable(),
  address: z.string().max(200).optional().nullable(),
  program: z.string().min(1).max(60),
  status: z.enum(["active", "paused", "inactive"]).default("active"),
  emergencyContactName: z.string().max(120).optional().nullable(),
  emergencyContactPhone: z.string().max(50).optional().nullable(),
  healthNotes: z.string().max(1000).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const data = { ...parsed.data, email: parsed.data.email || null };
  const student = await prisma.student.create({ data });
  return NextResponse.json(student, { status: 201 });
}
