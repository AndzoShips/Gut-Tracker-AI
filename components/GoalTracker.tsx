"use client";

import { motion } from "framer-motion";

interface GoalTrackerProps {
  userGoal?: string;
  progress: number; // 0-100
  target: number; // target percentage
  onAddMeal: () => void;
}

const goalLabels: Record<string, string> = {
  reduce_anxiety: "Reduce Anxiety",
  improve_digestion: "Improve Digestion",
  increase_energy: "Boost Energy",
  balanced_lifestyle: "Balanced Lifestyle",
};

const BRAND_GRADIENT = "linear-gradient(90deg, #3AB368, #2E9153)";

export default function GoalTracker({ userGoal, progress, target, onAddMeal }: GoalTrackerProps) {
  const goalLabel = userGoal ? goalLabels[userGoal] || userGoal : "Improve Wellness";

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-20"
      >
        <h2 className="text-lg font-bold text-gray-900 mb-3">
          Goal: {goalLabel}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={{ background: BRAND_GRADIENT }}
              />
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
            Target: {target}%
          </span>
        </div>
      </motion.div>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        onClick={onAddMeal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-secondary hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50"
        aria-label="Add meal"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
    </div>
  );
}

