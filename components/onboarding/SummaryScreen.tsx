"use client";

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
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-8 h-2 rounded-full bg-secondary"></div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Your Personalized Journey Awaits!
        </h1>
        <p className="text-gray-600 mt-2">
          Based on your choices, we're ready to help you connect your gut and mind.
        </p>
      </div>

      {/* Summary Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Plan Summary</h2>
        <div className="space-y-3">
          {data.userGoal && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-2xl">
                {data.userGoal === "reduce_anxiety" && "🧘"}
                {data.userGoal === "improve_digestion" && "💪"}
                {data.userGoal === "increase_energy" && "⚡"}
                {data.userGoal === "balanced_lifestyle" && "🌿"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {goalLabels[data.userGoal] || data.userGoal}
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {data.userFeeling && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-2xl">
                {data.userFeeling === "bloated" && "😐"}
                {data.userFeeling === "stressed" && "😣"}
                {data.userFeeling === "tired" && "💤"}
                {data.userFeeling === "light" && "😊"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {feelingLabels[data.userFeeling] || data.userFeeling}
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          {data.commitmentLevel && (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-2xl">
                {data.commitmentLevel === "learn" && "🩵"}
                {data.commitmentLevel === "small_changes" && "💚"}
                {data.commitmentLevel === "all_in" && "💪"}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {commitmentLabels[data.commitmentLevel] || data.commitmentLevel}
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-xl">
              📅
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">Daily Check-in</p>
            </div>
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8 p-6 bg-gray-50 rounded-2xl">
        <p className="text-gray-700 leading-relaxed">
          We'll analyze your meals, explain how they affect your brain and gut, and guide you with smart suggestions — backed by science.
        </p>
      </div>

      {/* Button */}
      <button
        onClick={onComplete}
        className="w-full py-4 px-8 rounded-2xl font-semibold bg-secondary hover:bg-green-600 text-white shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        Start My Journey
      </button>
    </div>
  );
}

