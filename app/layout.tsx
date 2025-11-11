// src/app/layout.tsx
import "./globals.css";
import { Vazirmatn } from "next/font/google"; // 1. وارد کردن فونت جدید
import Providers from "./Providers";

// 2. ساخت یک نمونه از فونت با زیرمجموعه عربی (برای فارسی ضروری است)
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn", // ایجاد یک متغیر CSS برای استفاده در Tailwind
  weight: ["400", "700"], // تعیین وزن‌های مورد نیاز (نرمال و بولد)
});

export const metadata = {
  title: "Leitner Box App",
  description: "A smart spaced repetition app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.variable} font-sans`}>
        {/* 3. اعمال فونت به کل اپلیکیشن */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}