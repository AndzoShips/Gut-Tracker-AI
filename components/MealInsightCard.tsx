"use client";

import { motion } from "framer-motion";

interface MealInsightCardProps {
  type: "Gut" | "Mind" | "Balance";
  message: string;
  index?: number;
}

export default function MealInsightCard({ type, message, index = 0 }: MealInsightCardProps) {
  const getCardStyle = () => {
    switch (type) {
      case "Gut":
        return {
          gradient: "linear-gradient(to bottom right, #D1FAE5, #A7F3D0)",
          borderColor: "border-green-300/50",
          iconBg: "bg-green-200",
          iconColor: "#3AB368",
          icon: "🦠",
        };
      case "Mind":
        return {
          gradient: "linear-gradient(to bottom right, #DBEAFE, #BFDBFE)",
          borderColor: "border-blue-300/50",
          iconBg: "bg-blue-200",
          iconColor: "#3B82F6",
          icon: "🧠",
        };
      case "Balance":
        return {
          gradient: "linear-gradient(to bottom right, #E9D5FF, #DDD6FE)",
          borderColor: "border-purple-300/50",
          iconBg: "bg-purple-200",
          iconColor: "#8B5CF6",
          icon: "⚖️",
        };
      default:
        return {
          gradient: "linear-gradient(to bottom right, #F3F4F6, #E5E7EB)",
          borderColor: "border-gray-300/50",
          iconBg: "bg-gray-200",
          iconColor: "#6B7280",
          icon: "💡",
        };
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

  const style = getCardStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`rounded-xl p-4 border ${style.borderColor} shadow-sm`}
      style={{
        background: style.gradient,
      }}
    >
      <div className="flex items-start gap-3">
        <div className={`${style.iconBg} w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0`}>
          {style.icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1 text-sm">{getTitle()}</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}

