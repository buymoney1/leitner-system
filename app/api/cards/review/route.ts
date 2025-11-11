// src/app/api/cards/review/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// فواصل زمانی برای هر جعبه (به روز)
const boxIntervals = {
  1: 1,   // جعبه 1: هر روز
  2: 3,   // جعبه 2: هر 3 روز
  3: 7,   // جعبه 3: هر 7 روز
  4: 14,  // جعبه 4: هر 14 روز
  5: 30,  // جعبه 5: هر 30 روز
};

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { cardId, isCorrect } = await req.json();
    console.log("Received data:", { cardId, isCorrect }); // <-- این خط را اضافه کنید

    if (!cardId || typeof isCorrect !== "boolean") {
      return NextResponse.json(
        { error: "ورودی‌های نامعتبر." },
        { status: 400 }
      );
    }

    // پیدا کردن کارت و مطمئن شدن از اینکه متعلق به کاربر فعلی است
    const card = await prisma.card.findFirst({
      where: {
        id: cardId,
        userId: userId,
      },
    });

    if (!card) {
      return NextResponse.json({ error: "کارت یافت نشد." }, { status: 404 });
    }

    let newBoxNumber;
    let nextReviewDate;

        if (isCorrect) {
      // پاسخ صحیح: رفتن به جعبه بعدی (حداکثر جعبه 5)
      // اطمینان از اینکه boxNumber یک عدد است
      const currentBox = typeof card.boxNumber === 'number' ? card.boxNumber : parseInt(card.boxNumber, 10);
      newBoxNumber = Math.min(currentBox + 1, 5);
    } else {
      // پاسخ غلط: بازگشت به جعبه 1
      newBoxNumber = 1;
    }

    // محاسبه تاریخ مرور بعدی
    const intervalDays = boxIntervals[newBoxNumber as keyof typeof boxIntervals];
    nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
    const nextReviewAt = nextReviewDate.toISOString();

    // به‌روزرسانی کارت در دیتابیس
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        boxNumber: newBoxNumber,
        nextReviewAt: nextReviewAt,
        lastReviewedAt: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      message: isCorrect ? "پاسخ صحیح ثبت شد." : "پاسخ غلط ثبت شد.",
      card: updatedCard,
    });
  } catch (error) {
    console.error("Error reviewing card:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}