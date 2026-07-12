import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(50),
  email: z.string().trim().email().max(200).optional().or(z.literal("")),
  age: z.coerce.number().int().min(3).max(100).optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  program: z.string().trim().min(1).max(60),
  experience: z.string().trim().max(60).optional().or(z.literal("")),
  heardFrom: z.string().trim().max(60).optional().or(z.literal("")),
  preferredSchedule: z.string().trim().max(60).optional().or(z.literal("")),
  emergencyContactName: z.string().trim().max(120).optional().or(z.literal("")),
  emergencyContactPhone: z.string().trim().max(50).optional().or(z.literal("")),
  healthNotes: z.string().trim().max(1000).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const {
    name,
    phone,
    email,
    age,
    address,
    program,
    experience,
    heardFrom,
    preferredSchedule,
    emergencyContactName,
    emergencyContactPhone,
    healthNotes,
    message,
  } = parsed.data;

  await prisma.registration.create({
    data: {
      name,
      phone,
      email: email || null,
      age: age === "" || age === undefined ? null : age,
      address: address || null,
      program,
      experience: experience || null,
      heardFrom: heardFrom || null,
      preferredSchedule: preferredSchedule || null,
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      healthNotes: healthNotes || null,
      message: message || null,
    },
  });

  return NextResponse.json({ ok: true });
}
