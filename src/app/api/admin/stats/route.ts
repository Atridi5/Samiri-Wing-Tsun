import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [programs, benefits, gallery, testimonials, messages, unreadMessages, registrations, newRegistrations, students] =
    await Promise.all([
      prisma.program.count(),
      prisma.benefit.count(),
      prisma.galleryImage.count(),
      prisma.testimonial.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "new" } }),
      prisma.student.count({ where: { status: "active" } }),
    ]);
  return NextResponse.json({
    programs,
    benefits,
    gallery,
    testimonials,
    messages,
    unreadMessages,
    registrations,
    newRegistrations,
    students,
  });
}
