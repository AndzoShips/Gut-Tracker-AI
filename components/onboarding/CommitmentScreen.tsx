"use client";

import { useState } from "react";
import { Button, IconButton } from "@whop/frosted-ui";

interface CommitmentScreenProps {
  selectedCommitment?: string;
  onNext: (commitment: string) => void;
  onBack: () => void;
}

const commitments = [
  {
    id: "learn",
    emoji: "🩵",
    title: "I just want to learn more.",
    description: "Curious about the gut-brain connection",
  },
  {
    id: "small_changes",
    emoji: "💚",
    title: "I'm ready to make small changes.",
    description: "Ready to learn and take action",
  },
  {
    id: "all_in",
    emoji: "💪",
    title: "I'm going all in on my gut health.",
    description: "Committed to transformation",
  },
];

export default function CommitmentScreen({ selectedCommitment, onNext, onBack }: CommitmentScreenProps) {
  const [selected, setSelected] = useState<string | undefined>(selectedCommitment);

  const handleSelect = (commitmentId: string) => {
    setSelected(commitmentId);
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
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-8 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
        </div>

        <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          How committed are you?
        </h2>
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">
          Your dedication helps us provide the most accurate and supportive guidance.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {commitments.map((commitment) => (
          <Button
            key={commitment.id}
            onClick={() => handleSelect(commitment.id)}
            variant={selected === commitment.id ? "solid" : "soft"}
            className="w-full text-left p-4"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{commitment.emoji}</span>
              <div className="flex flex-col flex-1">
                <p className="font-semibold mb-1">{commitment.title}</p>
                <p className="text-sm">{commitment.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === commitment.id
                    ? "border-current bg-current"
                    : "border-current opacity-30"
                }`}
              >
                {selected === commitment.id && (
                  <div className="w-2 h-2 rounded-full bg-current"></div>
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
