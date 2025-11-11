// src/app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // بررسی اینکه آیا کاربر از قبل وجود دارد یا نه
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "کاربری با این ایمیل از قبل وجود دارد." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // مهم: پسورد را در پاسخ برنگردانید
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "خطایی در سرور رخ داد. لطفاً دوباره تلاش کنید." },
      { status: 500 }
    );
  }
}