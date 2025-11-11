// src/app/api/cards/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// تابع برای دریافت لیست کارت‌ها (قبلاً وجود داشت)
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const cards = await prisma.card.findMany({
      where: { userId: userId },
      orderBy: { nextReviewAt: 'asc' },
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}

// تابع جدید برای افزودن یک کارت
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { front, back } = await req.json();

    if (!front || !back) {
      return NextResponse.json(
        { error: "فیلدهای روی کارت و پشت کارت الزامی هستند." },
        { status: 400 }
      );
    }

    // مهم: تاریخ مرور به امروز تنظیم می‌شود تا فوراً در دسترس باشد
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayString = today.toISOString();

    const newCard = await prisma.card.create({
      data: {
        front,
        back,
        userId,
        nextReviewAt: todayString,
      },
    });

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}