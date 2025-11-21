"use client";

import { motion } from "framer-motion";

interface StreakTrackerProps {
  days: number;
}

export default function StreakTracker({ days }: StreakTrackerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      <div className="rounded-xl p-4 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
        <p className="text-sm text-center text-gray-700 dark:text-gray-300">
          <span className="font-semibold">{days} days</span> toward gut harmony{" "}
          <span>🌱</span> Keep it up!
        </p>
      </div>
    </motion.div>
  );
}

