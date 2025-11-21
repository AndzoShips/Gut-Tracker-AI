"use client";

import { useState } from "react";
import { Button, IconButton } from "@whop/frosted-ui";

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
        <IconButton
          onClick={onBack}
          className="mb-6"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </IconButton>
        
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6">
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-8 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
        </div>

        <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          How do you usually feel after meals?
        </h2>
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
          Select the option that best reflects your current mood and physical state.
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {feelings.map((feeling) => (
          <Button
            key={feeling.id}
            onClick={() => handleSelect(feeling.id)}
            className="p-6 flex flex-col items-center text-center"
          >
            <span className="text-5xl mb-3">{feeling.emoji}</span>
            <p className="font-semibold text-sm mb-1">{feeling.title}</p>
            <p className="text-xs">{feeling.description}</p>
            {selected === feeling.id && (
              <div className="mt-3 w-5 h-5 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </Button>
        ))}
      </div>

      {/* Button */}
      <div className="space-y-3">
        <Button
          onClick={handleNext}
          disabled={!selected}
          className="w-full"
        >
          Next
        </Button>
        <Button
          onClick={() => onNext("")}
          className="w-full"
        >
          Skip
        </Button>
      </div>
    </div>
  );
}
