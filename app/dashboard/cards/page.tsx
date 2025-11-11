// src/app/dashboard/cards/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Plus, BookOpen, Trash2, Edit } from "lucide-react"; // آیکون‌های جذاب

interface Card {
  id: string;
  front: string;
  back: string;
  boxNumber: number;
  nextReviewAt: string;
}

export default function CardsPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newCardText, setNewCardText] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (session?.user) {
      fetchCards();
    }
  }, [session]);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cards");
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeedCards = async () => {
    setIsSeeding(true);
    setMessage("");
    try {
      const response = await fetch("/api/cards/seed", { method: "POST" });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        fetchCards();
      } else {
        setMessage(data.error || "خطا در افزودن کارت‌ها.");
      }
    } catch (error) {
      setMessage("خطا در ارتباط با سرور.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setMessage("");

    const parts = newCardText.split(":");
    if (parts.length !== 2) {
      setMessage("فرمت وارد شده صحیح نیست. لطفاً از فرمت 'کلمه:معنی' استفاده کنید.");
      setIsAdding(false);
      return;
    }

    const front = parts[0].trim();
    const back = parts[1].trim();

    if (!front || !back) {
      setMessage("هر دو بخش کلمه و معنی باید پر شوند.");
      setIsAdding(false);
      return;
    }

    try {
      const response = await fetch("/api/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front, back }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`کارت "${front}" با موفقیت اضافه شد.`);
        setNewCardText("");
        fetchCards();
      } else {
        setMessage(data.error || "خطا در افزودن کارت.");
      }
    } catch (error) {
      setMessage("خطا در ارتباط با سرور.");
    } finally {
      setIsAdding(false);
    }
  };

  // توابع برای ویرایش و حذف (فعلاً خالی)
  const handleEditCard = (cardId: string) => {
    alert(`ویرایش کارت با شناسه ${cardId} (در حال توسعه)`);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm("آیا از حذف این کارت مطمئن هستید؟")) {
      alert(`حذف کارت با شناسه ${cardId} (در حال توسعه)`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری کارت‌ها...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">مدیریت کارت‌ها</h1>
          <p className="mt-2 text-gray-600">کارت‌های خود را مدیریت، ویرایش و حذف کنید.</p>
        </div>

        {/* فرم افزودن کارت جدید */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-600">افزودن کارت جدید</h2>
          <form onSubmit={handleAddCard} className="flex gap-2">
            <input
              type="text"
              value={newCardText}
              onChange={(e) => setNewCardText(e.target.value)}
              placeholder="apple : سیب"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              dir="ltr"
            />
            <button
              type="submit"
              disabled={isAdding || !newCardText}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 ml-2" />
              {isAdding ? "در حال افزودن..." : "افزودن کارت"}
            </button>
          </form>
        </div>

        {/* نمایش پیام‌ها */}
        {message && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {message}
          </div>
        )}

        {/* نمایش لیست کارت‌ها یا دکمه افزودن پیش‌فرض */}
        {cards.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-xl shadow-sm">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
              <BookOpen className="h-6 w-6 text-gray-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">هنوز کارتی ندارید!</h2>
            <p className="mt-2 text-gray-600 mb-6">می‌توانید کارت‌های پیش‌فرض را اضافه کرده یا کارت جدیدی بسازید.</p>
            <button
              onClick={handleSeedCards}
              disabled={isSeeding}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSeeding ? "در حال افزودن..." : "افزودن ۱۰ کارت پیش‌فرض"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">{card.front}</h3>
                    <p className="text-gray-600">{card.back}</p>
                  </div>
                  <div className="text-left">
                    <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-800 bg-indigo-100 rounded-full">
                      جعبه {card.boxNumber}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  مرور بعدی:{" "}
                  {new Date(card.nextReviewAt).toLocaleDateString("fa-IR")}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEditCard(card.id)}
                    className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                  >
                    <Edit className="h-4 w-4 ml-1" />
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDeleteCard(card.id)}
                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                  >
                    <Trash2 className="h-4 w-4 ml-1" />
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}