"use client";

import { useState } from "react";

interface FeelingScreenProps {
  selectedFeeling?: string;
  onNext: (feeling: string) => void;
  onBack: () => void;
}

const feelings = [
  {
    id: "bloated",
    emoji: "😐",
    title: "Bloated or sluggish",
    description: "Feeling heavy and slow after eating",
  },
  {
    id: "stressed",
    emoji: "😣",
    title: "Stressed or anxious",
    description: "Meals trigger worry or tension",
  },
  {
    id: "tired",
    emoji: "💤",
    title: "Tired or foggy",
    description: "Energy crashes after meals",
  },
  {
    id: "light",
    emoji: "😊",
    title: "Light and focused",
    description: "Feel energized and clear-headed",
  },
];

export default function FeelingScreen({ selectedFeeling, onNext, onBack }: FeelingScreenProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedFeeling);

  const handleSelect = (feelingId: string) => {
    setSelected(feelingId);
  };

  const handleNext = () => {
    if (selected) {
      onNext(selected);
    }
  };

  return (
    <div className="w-full animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-secondary"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          How do you usually feel after meals?
        </h1>
        <p className="text-gray-600 mt-2">
          Select the option that best reflects your current mood and physical state.
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {feelings.map((feeling) => (
          <button
            key={feeling.id}
            onClick={() => handleSelect(feeling.id)}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center text-center ${
              selected === feeling.id
                ? "border-secondary bg-green-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="text-5xl mb-3">{feeling.emoji}</div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">{feeling.title}</h3>
            <p className="text-xs text-gray-600">{feeling.description}</p>
            {selected === feeling.id && (
              <div className="mt-3 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Button */}
      <div className="space-y-3">
        <button
          onClick={handleNext}
          disabled={!selected}
          className={`w-full py-4 px-8 rounded-2xl font-semibold transition-all duration-300 ${
            selected
              ? "bg-secondary hover:bg-green-600 text-white shadow-lg transform hover:scale-105 active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
        <button
          onClick={onNext}
          className="w-full text-gray-600 hover:text-gray-900 text-sm py-2 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

