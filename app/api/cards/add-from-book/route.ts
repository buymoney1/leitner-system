import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { bookId } = await req.json();

    if (!bookId) {
      return NextResponse.json({ error: "شناسه کتاب الزامی است." }, { status: 400 });
    }

    // پیدا کردن کتاب به همراه تمام کارت‌هایش
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: { cards: true },
    });

    if (!book) {
      return NextResponse.json({ error: "کتاب یافت نشد." }, { status: 404 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // ایجاد کپی از تمام کارت‌های کتاب برای کاربر فعلی
    const newCards = await Promise.all(
      book.cards.map((card: typeof book.cards[number]) =>
        prisma.card.create({
          data: {
            front: card.front,
            back: card.back,
            userId,
            nextReviewAt: today,
            boxNumber: 1, // شروع از جعبه اول
          },
        })
      )
    );

    return NextResponse.json({
      message: `${newCards.length} کارت از کتاب "${book.title}" به مجموعه شما اضافه شد.`,
    });
  } catch (error) {
    console.error("Error adding cards from book:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}
