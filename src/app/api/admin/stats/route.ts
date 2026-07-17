import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [programs, benefits, gallery, messages, unreadMessages, registrations, newRegistrations, students, diplomas] =
    await Promise.all([
      prisma.program.count(),
      prisma.benefit.count(),
      prisma.galleryImage.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "new" } }),
      prisma.student.count({ where: { status: "active" } }),
      prisma.student.count({ where: { diplomaUrl: { not: null } } }),
    ]);
  return NextResponse.json({
    programs,
    benefits,
    gallery,
    messages,
    unreadMessages,
    registrations,
    newRegistrations,
    students,
    diplomas,
  });
}
