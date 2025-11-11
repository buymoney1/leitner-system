// src/app/api/cards/seed/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// لیست کلمات و معانی پیش‌فرض
const defaultCards = [
  { front: "Hello", back: "سلام" },
  { front: "Book", back: "کتاب" },
  { front: "Water", back: "آب" },
  { front: "Computer", back: "کامپیوتر" },
  { front: "Friend", back: "دوست" },
  { front: "Family", back: "خانواده" },
  { front: "Learn", back: "یاد گرفتن" },
  { front: "Question", back: "سوال" },
  { front: "Answer", back: "پاسخ" },
  { front: "Success", back: "موفقیت" },
];

export async function POST() {
  const session = await getServerSession(authOptions);
  console.log("Server-side session:", session); // <-- این خط را اضافه کنید
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;


  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // تنظیم زمان به ابتدای امروز
    const todayString = today.toISOString();

    // ایجاد کارت‌ها در دیتابیس
    const createdCards = await Promise.all(
      defaultCards.map(card =>
        prisma.card.create({
          data: {
            front: card.front,
            back: card.back,
            userId: userId,
            nextReviewAt: todayString, // مهم: تاریخ مرور به امروز تنظیم می‌شود
          },
        })
      )
    );

    return NextResponse.json({
      message: "10 کارت پیش‌فرض با موفقیت اضافه شدند.",
      count: createdCards.length,
    });
  } catch (error) {
    console.error("Error seeding cards:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}