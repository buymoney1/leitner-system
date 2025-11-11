// next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// 1. تعریف نوع جدید برای User
declare module "next-auth" {
  interface Session {
    user?: {
      id: string; // این مهم‌ترین خط است
    } & DefaultSession["user"]; // این کار باعث می‌شود فیلدهای پیش‌فرض هم حفظ شوند
  }

  interface User {
    id: string; // این هم برای مدل User مهم است
  }
}

// 2. تعریف نوع جدید برای توکن JWT (اختیاری اما توصیه شده)
declare module "next-auth/jwt" {
  interface JWT {
    id: string; // اضافه کردن id به توکن
  }
}