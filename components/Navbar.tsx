// src/components/Navbar.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Link from "next/link";

// کامپوننت props را تعریف کنید
interface NavbarProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

export default function Navbar({ isMenuOpen, onMenuToggle }: NavbarProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/signin");
  };

  return (
    <nav className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* لوگو */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex-shrink-0">
              <span className="text-xl font-bold text-white">جعبه لایتنر</span>
            </Link>
          </div>

          {/* لینک‌های اصلی (دسکتاپ) */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <Link href="/dashboard" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              داشبورد
            </Link>
            <Link href="/dashboard/view" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              مرور
            </Link>
            <Link href="/dashboard/cards" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              کارت‌ها
            </Link>
            <Link href="/dashboard/books" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              کتابخانه
            </Link>
            <Link href="/dashboard/statistics" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
              آمار
            </Link>
          </div>

          {/* بخش کاربر و دکمه منو (دسکتاپ) */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            {session?.user?.name && (
              <span className="text-gray-300 text-sm">خوش آمدی، {session.user.name}</span>
            )}
            <button
              onClick={handleLogout}
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              خروج
            </button>
          </div>

          {/* دکمه منو (موبایل) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={onMenuToggle} // <-- از prop استفاده کنید
              className="text-gray-400 hover:text-white focus:outline-none p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/dashboard"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                داشبورد
              </Link>
              <Link
                href="/dashboard/review"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                مرور
              </Link>
              <Link
                href="/dashboard/cards"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                کارت‌ها
              </Link>
              <Link
                href="/dashboard/books"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                کتابخانه
              </Link>
              <Link
                href="/dashboard/statistics"
                className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                آمار
              </Link>
              {session?.user?.name && (
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-gray-300 text-base">خوش آمدی، {session.user.name}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 w-full text-center bg-gray-800  hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium"
                  >
                    خروج
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}