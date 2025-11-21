"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

interface Meal {
  id: string;
  title: string;
  image_url?: string;
  gut_score?: number;
  mental_score?: number;
  overall_score?: number;
  created_at: string;
}

interface MealsListProps {
  meals: Meal[];
  isLoading?: boolean;
  selectedDate: Date;
  analyzingMeal?: { image: string; startTime: number } | null;
}

export default function MealsList({ meals, isLoading, selectedDate, analyzingMeal }: MealsListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Filter meals for selected date
  const selectedDateStr = selectedDate.toDateString();
  
  const todayMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.created_at).toDateString();
    return mealDate === selectedDateStr;
  });

  // Only show loading on initial load when we have no meals at all
  const isInitialLoad = meals.length === 0 && isLoading;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4 p-0 h-auto hover:opacity-80 transition-opacity"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Today's Meals {todayMeals.length > 0 && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({todayMeals.length})</span>}
        </h2>
        <svg
          className={`w-5 h-5 transition-transform text-gray-600 dark:text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Only show loading state on initial load */}
      {isInitialLoad && (
        <div className="rounded-xl p-8 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
          <div className="flex flex-col items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-current border-t-transparent mb-4"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading meals...</p>
          </div>
        </div>
      )}

      {/* Show analyzing meal entry if currently analyzing */}
      {analyzingMeal && selectedDate.toDateString() === new Date().toDateString() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <div className="rounded-xl p-4 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-4">
              {analyzingMeal.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={analyzingMeal.image}
                    alt="Analyzing meal"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Analyzing image...</p>
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-500"></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Processing...</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {/* Show empty state when no meals for selected date (but not loading) */}
            {todayMeals.length === 0 && !isInitialLoad && !analyzingMeal && (
              <div className="rounded-xl p-8 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
                <div className="flex flex-col items-center p-8">
                  <p className="text-sm text-gray-600 dark:text-gray-400">No meals recorded for this day</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {todayMeals.map((meal, index) => {
          const gutMeta = getScoreMeta(meal.gut_score);
          const mindMeta = getScoreMeta(meal.mental_score);

          return (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/meals/${meal.id}`}>
                <div className="rounded-xl p-4 shadow-sm border bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600 transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer">
                  <div className="flex items-center gap-4">
                    {meal.image_url ? (
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={meal.image_url}
                          alt={meal.title || "Meal"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl">🍽️</span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <p className="font-semibold truncate text-gray-900 dark:text-gray-100 mb-2">
                        {meal.title || "Untitled Meal"}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        {typeof meal.gut_score === "number" && (
                          <ScoreChip label="Gut" score={meal.gut_score} meta={gutMeta} />
                        )}
                        {typeof meal.mental_score === "number" && (
                          <ScoreChip label="Mind" score={meal.mental_score} meta={mindMeta} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ScoreMeta {
  label: string;
  color: string;
  background: string;
  border: string;
}

function getScoreMeta(score?: number): ScoreMeta {
  if (typeof score !== "number") {
    return {
      label: "Pending",
      color: "#9CA3AF",
      background: "bg-gray-100/70 dark:bg-gray-700/70",
      border: "border-gray-200 dark:border-gray-600",
    };
  }

  if (score >= 80) {
    return {
      label: "Excellent",
      color: "#16A34A",
      background: "bg-green-500/10 dark:bg-green-400/10",
      border: "border-green-500/30 dark:border-green-500/40",
    };
  }

  if (score >= 60) {
    return {
      label: "Fair",
      color: "#F59E0B",
      background: "bg-amber-500/10 dark:bg-amber-400/10",
      border: "border-amber-500/30 dark:border-amber-500/40",
    };
  }

  return {
    label: "Poor",
    color: "#DC2626",
    background: "bg-red-500/10 dark:bg-red-400/10",
    border: "border-red-500/30 dark:border-red-500/40",
  };
}

function ScoreChip({
  label,
  score,
  meta,
}: {
  label: string;
  score: number;
  meta: ScoreMeta;
}) {
  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${meta.background} ${meta.border}`}
      style={{ color: meta.color }}
    >
      {label}: {score}% · {meta.label}
    </div>
  );
}
