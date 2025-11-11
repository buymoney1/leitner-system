// src/app/page.tsx

"use client"; // این کامپوننت باید کلاینت باشد

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      // هنوز در حال بارگذاری اطلاعات جلسه است، کاری نکن
      return;
    }

    if (session) {
      // کاربر وارد شده است، به داشبورد برو
      router.push("/dashboard");
    } else {
      // کاربر وارد نشده است، به صفحه ورود برو
      router.push("/signin");
    }
  }, [session, status, router]);

  // در حین بارگذاری، یک صفحه لودینگ ساده نمایش بده
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  // این بخش دیگر نمایش داده نخواهد شد، چون قبل از رندر شدن، هدایت انجام می‌شود
  return null;
}