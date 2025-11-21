"use client";

import { motion } from "framer-motion";

interface TodayFocusCardProps {
  icon?: string;
  title: string;
  description: string;
}

export default function TodayFocusCard({
  icon = "🌿",
  title,
  description,
}: TodayFocusCardProps) {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-4"
    >
      <div className="rounded-xl p-4 shadow-sm border bg-gradient-to-br from-green-50/50 to-emerald-50/30 border-green-200/30 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-2xl">
            {icon}
          </div>
          
          {/* Content */}
          <div className="flex flex-col flex-1">
            <p className="text-sm font-semibold mb-1 text-gray-900 dark:text-gray-100">
              {title}
            </p>
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

