"use client";

import { motion } from "framer-motion";

interface TodayFocusCardProps {
  icon?: string;
  title?: string;
  description: string;
  focusType?: "gut" | "mood" | "energy" | "focus" | "inflammation";
}

export default function TodayFocusCard({
  icon = "🌿",
  title = "Today's Gut Priority: Reduce Inflammation",
  description,
  focusType = "gut",
}: TodayFocusCardProps) {
  // Determine title based on focus type if not provided
  const getTitle = () => {
    if (title) return title;
    switch (focusType) {
      case "gut":
        return "Today's Gut Priority:";
      case "mood":
        return "Today's Mood Priority:";
      case "energy":
        return "Today's Energy Priority:";
      case "focus":
        return "Today's Focus Priority:";
      case "inflammation":
        return "Today's Gut Priority: Reduce Inflammation";
      default:
        return "Today's Gut Priority:";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-4 border border-green-200/40 shadow-sm mb-4"
      style={{ background: 'linear-gradient(to bottom right, rgba(237, 253, 244, 0.8), rgba(249, 255, 251, 0.9))' }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center text-2xl">
          {icon}
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            {getTitle()}
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

