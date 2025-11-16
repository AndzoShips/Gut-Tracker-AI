"use client";

import { useState } from "react";

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

  const getCommitmentLabel = (id: string) => {
    switch (id) {
      case "learn":
        return "Just curious";
      case "small_changes":
        return "Ready to learn";
      case "all_in":
        return "Committed to change";
      default:
        return "";
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
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-secondary"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          How committed are you?
        </h1>
        <p className="text-gray-600 mt-2">
          Your dedication helps us provide the most accurate and supportive guidance.
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {commitments.map((commitment) => (
          <button
            key={commitment.id}
            onClick={() => handleSelect(commitment.id)}
            className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
              selected === commitment.id
                ? "border-secondary bg-green-50 shadow-md"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{commitment.emoji}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{commitment.title}</h3>
                <p className="text-sm text-gray-600">{commitment.description}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === commitment.id
                    ? "border-secondary bg-secondary"
                    : "border-gray-300"
                }`}
              >
                {selected === commitment.id && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
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

