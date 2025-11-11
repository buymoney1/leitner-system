// src/app/api/books/seed/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// تعریف کتاب‌ها و کلمات پیش‌فرض
const defaultBooks = [
  {
    title: "IELTS Vocabulary",
    description: "کلمات کلیدی برای آزمون آیلتس",
    words: [
      { front: "Accommodate", back: "جا دادن، تطبیق دادن" },
      { front: "Analyse", back: "تحلیل کردن" },
      { front: "Assess", back: "ارزیابی کردن" },
      { front: "Benefit", back: "سود، منفعت" },
      { front: "Concept", back: "مفهوم، ایده" },
      { front: "Consistent", back: "مستمر، سازگار" },
      { front: "Environment", back: "محیط زیست" },
      { front: "Factor", back: "عامل، فاکتور" },
      { front: "Identify", back: "شناسایی کردن" },
      { front: "Significant", back: "مهم، قابل توجه" },
    ],
  },
  {
    title: "Collins IELTS Words",
    description: "کلمات منتخب از کتاب کالینز برای آیلتس",
    words: [
      { front: "Achieve", back: "به دست آوردن، دستیابیافتن" },
      { front: "Appropriate", back: "مناسب، شایسته" },
      { front: "Category", back: "دسته‌بندی، رده" },
      { front: "Consequence", back: "نتیجه، پیامد" },
      { front: "Diverse", back: "متنوع، گوناگون" },
      { front: "Establish", back: "تاسیس کردن، برقرار کردن" },
      { front: "Innovate", back: "نوآوری کردن" },
      { front: "Perspective", back: "دیدگاه، منظر" },
      { front: "Relevant", back: "مرتبط، مربوط" },
      { front: "Sustain", back: "پایدار ماندن، حفظ کردن" },
    ],
  },
];

export async function POST() {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayString = today.toISOString();

    for (const bookData of defaultBooks) {
      // بررسی اینکه آیا کتاب از قبل وجود دارد یا نه
      const existingBook = await prisma.book.findFirst({
        where: { title: bookData.title },
      });

      if (!existingBook) {
        // اگر وجود نداشت، کتاب و کارت‌هایش را بساز
        const newBook = await prisma.book.create({
          data: {
            title: bookData.title,
            description: bookData.description,
            cards: {
              create: bookData.words.map(word => ({
                front: word.front,
                back: word.back,
                // این کارت‌ها متعلق به هیچ کاربری نیستند، فقط در کتابخانه موجودند
                // وقتی کاربری آن‌ها را اضافه کند، یک کپی برای او ساخته می‌شود
                // بنابراین userId و nextReviewAt اینجا مهم نیستند
              })),
            },
          },
        });
        console.log(`Created book: ${newBook.title}`);
      }
    }

    return NextResponse.json({
      message: "کتاب‌های پیش‌فرض با موفقیت ایجاد شدند.",
    });
  } catch (error) {
    console.error("Error seeding books:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد." },
      { status: 500 }
    );
  }
}