"use client";

import { useState } from "react";

interface GoalScreenProps {
  selectedGoal?: string;
  onNext: (goal: string) => void;
  onBack: () => void;
}

const goals = [
  {
    id: "reduce_anxiety",
    emoji: "🧘",
    title: "Reduce anxiety or brain fog",
    description: "Calm your mind and clear mental fog",
  },
  {
    id: "improve_digestion",
    emoji: "💪",
    title: "Improve digestion and gut health",
    description: "Support a healthy digestive system",
  },
  {
    id: "increase_energy",
    emoji: "⚡",
    title: "Increase energy and focus",
    description: "Boost your daily performance",
  },
  {
    id: "balanced_lifestyle",
    emoji: "🌿",
    title: "Maintain a balanced lifestyle",
    description: "Find harmony in your daily routine",
  },
];

export default function GoalScreen({ selectedGoal, onNext, onBack }: GoalScreenProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedGoal);

  const handleSelect = (goalId: string) => {
    setSelected(goalId);
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
          <div className="w-8 h-2 rounded-full bg-secondary"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          What do you want to improve the most?
        </h1>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => handleSelect(goal.id)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
              selected === goal.id
                ? "border-secondary bg-green-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{goal.emoji}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{goal.title}</h3>
                <p className="text-sm text-gray-600">{goal.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === goal.id
                    ? "border-secondary bg-secondary"
                    : "border-gray-300"
                }`}
              >
                {selected === goal.id && (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Button */}
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
    </div>
  );
}

