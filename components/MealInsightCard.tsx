"use client";

import { motion } from "framer-motion";

interface MealInsightCardProps {
  type: "Gut" | "Mind" | "Balance";
  message: string;
  index?: number;
}

export default function MealInsightCard({ type, message, index = 0 }: MealInsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case "Gut":
        return "🦠";
      case "Mind":
        return "🧠";
      case "Balance":
        return "⚖️";
      default:
        return "💡";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "Gut":
        return "Gut Insight";
      case "Mind":
        return "Mood Insight";
      case "Balance":
        return "Balance Insight";
      default:
        return "Insight";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="rounded-xl p-4 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0">
            {getIcon()}
          </div>
          <div className="flex flex-col flex-1">
            <p className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">{getTitle()}</p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{message}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

