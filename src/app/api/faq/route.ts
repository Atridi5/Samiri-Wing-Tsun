import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const locale = (["sq", "en", "de"].includes(localeParam ?? "") ? localeParam : "sq") as "sq" | "en" | "de";

  const items = await prisma.faqItem.findMany({
    orderBy: { order: "asc" },
    include: { translations: { where: { locale } } },
  });

  const faqs = items
    .filter((item) => item.translations[0])
    .map((item) => ({
      id: item.id,
      question: item.translations[0].question,
      answer: item.translations[0].answer,
    }));

  return NextResponse.json(faqs);
}
