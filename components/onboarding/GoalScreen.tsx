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
          className="mb-6"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          What do you want to improve the most?
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {goals.map((goal) => (
          <Button
            key={goal.id}
            onClick={() => handleSelect(goal.id)}
            variant={selected === goal.id ? "solid" : "soft"}
            className="w-full text-left p-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{goal.emoji}</span>
              <div className="flex flex-col flex-1">
                <p className="font-semibold mb-1">{goal.title}</p>
                <p className="text-sm">{goal.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
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
        variant="solid"
        size="4"
        className="w-full"
      >
        Next
      </Button>
    </div>
  );
}
