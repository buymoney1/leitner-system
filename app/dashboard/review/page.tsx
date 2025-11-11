// src/app/dashboard/review/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";

interface Card {
  id: string;
  front: string;
  back: string;
  boxNumber: number;
}

export default function ReviewPage() {
  const { data: session } = useSession();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      fetchDueCards();
    }
  }, [session]);

  const fetchDueCards = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cards/due");
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

  const handleReview = async (isCorrect: boolean) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const currentCard = cards[currentCardIndex];

    try {
      const response = await fetch("/api/cards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId: currentCard.id, isCorrect }),
      });

      if (response.ok) {
        handleNext();
      } else {
        const data = await response.json();
        alert(data.error || "خطا در ثبت پاسخ.");
      }
    } catch (error) {
      alert("خطا در ارتباط با سرور.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCorrect = () => {
    handleReview(true);
  };

  const handleIncorrect = () => {
    handleReview(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      alert("مرور امروز تمام شد! عالی بود.");
      router.push("/dashboard");
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-2 text-gray-600">در حال بارگذاری کارت‌ها...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">موفق باشی!</h1>
          <p className="mt-2 text-gray-600">هیچ کارتی برای مرور امروز نداری.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
          >
            بازگشت به داشبورد
          </button>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-600">مرور کارت‌ها</h1>
          <p className="mt-3 text-gray-600">
            کارت {currentCardIndex + 1} از {cards.length}
          </p>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="relative mb-2">
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* ... بخش هدر و نوار پیشرفت بدون تغییر */}

        <div className="relative mb-5">
          <div
            className="relative w-full h-64 cursor-pointer"
            onClick={handleFlip}
          >
            <div
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                isFlipped ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {/* Front of card */}
              <div className="absolute inset-0 w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center p-6">
                <p className="text-xl font-semibold text-center text-gray-900">
                  {currentCard.front}
                </p>
              </div>
            </div>

            <div
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                isFlipped ? 'opacity-100 rotate-y-180' : 'opacity-0 -rotate-y-180'
              }`}
            >
              {/* Back of card */}
              <div className="absolute inset-0 w-full h-full bg-indigo-600 text-white rounded-xl shadow-lg flex items-center justify-center p-6">
                <div>
                  <p className="text-xl font-semibold text-center">
                    {currentCard.back}
                  </p>
                  <div className="mt-6 text-center">
                    <span className="inline-block px-3 py-1 text-sm font-semibold bg-indigo-700 rounded-full">
                      جعبه {currentCard.boxNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
    
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleIncorrect}
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5 ml-2" />
            غلط
          </button>
          <button
            onClick={handleCorrect}
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-5 w-5 ml-2" />
            صحیح
          </button>
        </div>
      </div>
    </div>
    
        </div>

    
      </div>
    </div>
  );
}