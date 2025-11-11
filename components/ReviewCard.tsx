// src/components/ReviewCard.tsx
"use client";

import { useState } from "react";

// تعریف تایپ کارت مورد نیاز
export interface CardType {
  id: string;
  front: string;
  back: string;
  boxNumber?: number;
}

interface ReviewCardProps {
  card: CardType;
  onResult: (cardId: string, isCorrect: boolean) => void;
}

export default function ReviewCard({ card, onResult }: ReviewCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCorrect = () => {
    onResult(card.id, true);
  };

  const handleIncorrect = () => {
    onResult(card.id, false);
  };

  return (
    <div
      className="relative w-full h-64 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <div
        className={`absolute inset-0 w-full h-full transition-transform duration-500 ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 w-full h-full bg-white rounded-lg shadow-lg flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden" }}
        >
          <p className="text-xl font-semibold text-center">{card.front}</p>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 w-full h-full bg-blue-500 text-white rounded-lg shadow-lg flex items-center justify-center p-6"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex flex-col items-center">
            <p className="text-xl font-semibold text-center">{card.back}</p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleIncorrect();
                }}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Incorrect
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCorrect();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Correct
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
