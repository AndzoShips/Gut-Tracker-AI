"use client";

import { useState } from "react";
import { Button, IconButton } from "@whop/frosted-ui";

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
        <IconButton
          onClick={onBack}
          className="mb-6 w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </IconButton>
        
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-6">
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-8 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          What do you want to improve the most?
        </h2>
        <p className="text-sm sm:text-base mt-2 text-gray-600 dark:text-gray-400">
          Select the option that best matches your primary goal.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
        {goals.map((goal) => (
          <Button
            key={goal.id}
            onClick={() => handleSelect(goal.id)}
            className="w-full text-left p-4 sm:p-5 min-h-[72px] sm:min-h-[80px] active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl flex-shrink-0">{goal.emoji}</span>
              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-base">{goal.title}</p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{goal.description}</p>
              </div>
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  selected === goal.id
                    ? "border-current bg-current"
                    : "border-current opacity-30"
                }`}
              >
                {selected === goal.id && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          </Button>
        ))}
      </div>

      {/* Button */}
      <Button
        onClick={handleNext}
        disabled={!selected}
        className="w-full min-h-[48px] font-semibold active:scale-[0.98] transition-transform"
      >
        Next
      </Button>
    </div>
  );
}
