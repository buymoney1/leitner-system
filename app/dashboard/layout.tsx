// src/app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useRouteChange } from "@/hooks/useRouteChange"; // هوک جدید را وارد کنید

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  // از هوک سفارشی برای بستن کردن منو استفاده کنید
  useRouteChange((url) => {
    setIsMenuOpen(false);
  });

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (status === "loading") {
    return <div>در حال بارگذاری...</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <Navbar isMenuOpen={isMenuOpen} onMenuToggle={handleMenuToggle} />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </section>
  );
}