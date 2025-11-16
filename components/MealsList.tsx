"use client";

import { motion } from "framer-motion";
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
  // Filter meals for selected date
  const selectedDateStr = selectedDate.toDateString();
  
  const todayMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.created_at).toDateString();
    return mealDate === selectedDateStr;
  });

  const getBadgeColor = (score?: number) => {
    if (!score) return "bg-gray-100 text-gray-600";
    if (score >= 70) return "bg-green-100 text-green-700";
    if (score >= 50) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Only show loading on initial load when we have no meals at all
  const isInitialLoad = meals.length === 0 && isLoading;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Meals</h2>
      
      {/* Only show loading state on initial load */}
      {isInitialLoad && (
        <div 
          className="rounded-xl p-8 text-center border border-green-100/50"
          style={{ background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.02), rgba(255, 255, 255, 0.98))' }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meals...</p>
        </div>
      )}

      {/* Show analyzing meal entry if currently analyzing */}
      {analyzingMeal && selectedDate.toDateString() === new Date().toDateString() && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-4 shadow-md border border-green-100/50 mb-3"
          style={{ background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.03), rgba(255, 255, 255, 0.98))' }}
        >
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-900">Analyzing image...</p>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-gray-600">Processing...</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Show empty state when no meals for selected date (but not loading) */}
      {todayMeals.length === 0 && !isInitialLoad && !analyzingMeal && (
            <div 
              className="rounded-xl p-8 text-center border border-green-100/50"
              style={{ background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.02), rgba(255, 255, 255, 0.98))' }}
            >
              <p className="text-gray-600">No meals recorded for this day</p>
            </div>
      )}

      <div className="space-y-3">
        {todayMeals.map((meal, index) => (
          <motion.div
            key={meal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/meals/${meal.id}`}>
              <div 
                className="rounded-xl p-4 shadow-md border border-green-100/50 flex items-center gap-4 transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                style={{ background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.02), rgba(255, 255, 255, 0.99))' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(77, 194, 119, 0.05), rgba(255, 255, 255, 0.98))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(77, 194, 119, 0.02), rgba(255, 255, 255, 0.99))';
                }}
              >
                {meal.image_url ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={meal.image_url}
                      alt={meal.title || "Meal"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🍽️</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate mb-2">
                    {meal.title || "Untitled Meal"}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {meal.gut_score !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(meal.gut_score)}`}>
                        Gut: {meal.gut_score}%
                      </span>
                    )}
                    {meal.mental_score !== undefined && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor(meal.mental_score)}`}>
                        Mind: {meal.mental_score}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
