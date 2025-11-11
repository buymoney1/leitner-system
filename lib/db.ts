// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // این خط برای جلوگیری از multiple client در development
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // در توسعه، از global برای جلوگیری از multiple instances استفاده می‌کنیم
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };
