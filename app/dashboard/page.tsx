// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import DashboardStats from "@/components/DashboardStats";
import BoxDistributionChart from "@/components/BoxDistributionChart";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    // این حالت نباید رخ دهد چون لایوت چک می‌کند
    return <div>Please sign in</div>;
  }

  // گرفتن آمار از دیتابیس
  const totalCards = await prisma.card.count({ where: { userId } });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cardsDueToday = await prisma.card.count({
    where: {
      userId,
      nextReviewAt: { lte: today },
    },
  });

  const cardsInBoxes = await prisma.card.groupBy({
    by: ["boxNumber"],
    where: { userId },
    _count: { boxNumber: true },
  });

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* هدر صفحه */}
      <div>
        <h1 className="text-3xl font-bold text-gray-400">داشبورد</h1>
        <p className="mt-3 text-gray-500">
          خوش آمدید! آمار و وضعیت یادگیری شما در زیر نمایش داده شده است.
        </p>
      </div>

      {/* کارت‌های آمار اصلی */}
      <DashboardStats
        totalCards={totalCards}
        cardsDueToday={cardsDueToday}
      />

      {/* بخش‌های پایینی در یک گرید */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* کارت توزیع جعبه‌ها */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">توزیع کارت‌ها در جعبه‌ها</h2>
          <BoxDistributionChart data={cardsInBoxes} />
        </div>

        {/* کارت فعالیت اخیر */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">فعالیت اخیر</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">مرور کلمه "Hello"</p>
                <p className="text-sm text-gray-500">جعبه 2</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                صحیح
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">مرور کلمه "Book"</p>
                <p className="text-sm text-gray-500">جعبه 1</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                غلط
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">مرور کلمه "Water"</p>
                <p className="text-sm text-gray-500">جعبه 3</p>
              </div>
              <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                صحیح
              </span>
            </div>
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">فعالیت‌های بیشتری در بخش آمار</p>
            </div>
          </div>
        </div>
      </div>

      {/* کارت پیشرفت هفتگی */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">نمودار پیشرفت هفتگی</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">نمودار در اینجا نمایش داده می‌شود...</p>
        </div>
      </div>
    </div>
  );
}