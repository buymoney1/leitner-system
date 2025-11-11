// src/app/api/cards/due/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // مهم: گرفتن تاریخ امروز به صورت دقیق (ساعت ۰۰:۰۰:۰۰ به وقت UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayString = today.toISOString();

    const cards = await prisma.card.findMany({
      where: {
        userId: userId,
        nextReviewAt: {
          lte: todayString, // کوچکتر یا مساوی با شروع امروز
        },
      },
      orderBy: {
        nextReviewAt: 'asc',
      },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching due cards:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}