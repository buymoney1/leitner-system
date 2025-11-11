// src/app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ارسال درخواست به API ثبت‌نام
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // بعد از ثبت‌نام موفق، کاربر را لاگین کن
        const signInResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });
        if (signInResult?.ok) {
          router.push("/dashboard");
        } else {
          setError("ثبت‌نام موفق بود اما ورود با خطا مواجه شد.");
        }
      } else {
        const data = await res.json();
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-slate-600">ایجاد حساب کاربری</h3>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block" htmlFor="signup-name">
              نام
            </label>
            <input
              type="text"
              id="signup-name"
              placeholder="نام خود را وارد کنید"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block" htmlFor="signup-email">
              ایمیل
            </label>
            <input
              type="email"
              id="signup-email"
              placeholder="ایمیل خود را وارد کنید"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block" htmlFor="signup-password">
              رمز عبور
            </label>
            <input
              type="password"
              id="signup-password"
              placeholder="رمز عبور خود را وارد کنید"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full disabled:opacity-50"
            >
              {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </div>
        </form>
        <div className="mt-6 text-slate-600 text-center">
          حساب کاربری دارید؟{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            وارد شوید
          </a>
        </div>
      </div>
    </div>
  );
}