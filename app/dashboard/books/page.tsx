// src/app/dashboard/books/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookOpen, PlusCircle, CheckCircle } from "lucide-react"; // آیکون‌های جذاب

interface Book {
  id: string;
  title: string;
  description: string | null;
  _count: { cards: number };
}

export default function BooksPage() {
  const { data: session } = useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [addingBookId, setAddingBookId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchBooks();
    }
  }, [session]);

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = async (bookId: string, bookTitle: string) => {
    setAddingBookId(bookId);
    setMessage("");

    try {
      const response = await fetch("/api/cards/add-from-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`کارت‌های کتاب "${bookTitle}" با موفقیت به مجموعه شما اضافه شدند.`);
        // می‌توانید در اینجا کارت‌های جدید را از API بگیرید و لیست را به‌روز کنید
      } else {
        setMessage(data.error || "خطا در افزودن کتاب.");
      }
    } catch (error) {
      setMessage("خطا در ارتباط با سرور.");
    } finally {
      setAddingBookId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری کتابخانه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-700">کتابخانه کلمات</h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
            از مجموعه‌های آماده کلمات استفاده کنید و یادگیری خود را سریع‌تر کنید. با یک کلیک، تمام کلمات یک کتاب به مجموعه شما اضافه می‌شود.
          </p>
        </div>

        {/* نمایش پیام‌ها */}
        {message && (
          <div className="mb-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* گرید کتاب‌ها */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center justify-center h-16 w-16 mx-auto bg-indigo-100 rounded-full mb-6">
                <BookOpen className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{book.title}</h3>
              <p className="text-gray-600 text-center mb-6">{book.description}</p>
              <div className="flex items-center justify-center mb-6">
                <span className="text-sm text-gray-500">شامل</span>
                <span className="mx-2 text-2xl font-bold text-indigo-600">{book._count.cards}</span>
                <span className="text-sm text-gray-500">کلمه</span>
              </div>
              <button
                onClick={() => handleAddBook(book.id, book.title)}
                disabled={addingBookId === book.id}
                className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingBookId === book.id ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent mr-2"></div>
                    در حال افزودن...
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 ml-1" />
                    افزودن به مجموعه من
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}