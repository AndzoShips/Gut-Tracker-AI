"use client";

import { Button, IconButton } from "@whop/frosted-ui";

interface SummaryScreenProps {
  data: {
    userGoal?: string;
    userFeeling?: string;
    commitmentLevel?: string;
  };
  onComplete: () => void;
  onBack: () => void;
}

const goalLabels: Record<string, string> = {
  reduce_anxiety: "🧘 Reduce Anxiety",
  improve_digestion: "💪 Improve Digestion",
  increase_energy: "⚡ Boost Energy",
  balanced_lifestyle: "🌿 Balanced Lifestyle",
};

const feelingLabels: Record<string, string> = {
  bloated: "😐 Bloated or sluggish",
  stressed: "😣 Stressed or anxious",
  tired: "💤 Tired or foggy",
  light: "😊 Light and focused",
};

const commitmentLabels: Record<string, string> = {
  learn: "🩵 Just curious",
  small_changes: "💚 Ready to learn",
  all_in: "💪 Committed to change",
};

export default function SummaryScreen({ data, onComplete, onBack }: SummaryScreenProps) {
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
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-2 h-2 rounded-full opacity-30 bg-gray-400 dark:bg-gray-500"></div>
          <div className="w-8 h-2 rounded-full bg-green-500 dark:bg-green-400"></div>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Your Personalized Journey Awaits!
        </h2>
        <p className="text-sm sm:text-base mt-2 text-gray-600 dark:text-gray-400">
          Based on your choices, we're ready to help you connect your gut and mind.
        </p>
      </div>

      {/* Summary Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">Your Plan Summary</h3>
        <div className="space-y-2 sm:space-y-3">
          {data.userGoal && (
            <div className="rounded-xl p-3 sm:p-4 border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl opacity-50">
                  {data.userGoal === "reduce_anxiety" && "🧘"}
                  {data.userGoal === "improve_digestion" && "💪"}
                  {data.userGoal === "increase_energy" && "⚡"}
                  {data.userGoal === "balanced_lifestyle" && "🌿"}
                </div>
                <div className="flex flex-col flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {goalLabels[data.userGoal] || data.userGoal}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {data.userFeeling && (
            <div className="rounded-xl p-3 sm:p-4 border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl opacity-50">
                  {data.userFeeling === "bloated" && "😐"}
                  {data.userFeeling === "stressed" && "😣"}
                  {data.userFeeling === "tired" && "💤"}
                  {data.userFeeling === "light" && "😊"}
                </div>
                <div className="flex flex-col flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {feelingLabels[data.userFeeling] || data.userFeeling}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {data.commitmentLevel && (
            <div className="rounded-xl p-3 sm:p-4 border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-2xl opacity-50">
                  {data.commitmentLevel === "learn" && "🩵"}
                  {data.commitmentLevel === "small_changes" && "💚"}
                  {data.commitmentLevel === "all_in" && "💪"}
                </div>
                <div className="flex flex-col flex-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {commitmentLabels[data.commitmentLevel] || data.commitmentLevel}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-xl p-3 sm:p-4 border shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl opacity-50">
                📅
              </div>
              <div className="flex flex-col flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Daily Check-in</p>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="rounded-xl p-4 sm:p-6 border shadow-sm mb-6 sm:mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
        <p className="text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300">
          We'll analyze your meals, explain how they affect your brain and gut, and guide you with smart suggestions — backed by science.
        </p>
      </div>

      {/* Button */}
      <Button
        onClick={onComplete}
        className="w-full min-h-[48px] font-semibold active:scale-[0.98] transition-transform"
      >
        Start My Journey
      </Button>
    </div>
  );
}
