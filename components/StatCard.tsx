"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  index?: number;
}

export default function StatCard({ title, value, icon, index = 0 }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  // Animate value from 0 to actual value
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, value);
      setDisplayValue(Math.round(current));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayValue(value);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const getLabel = () => {
    if (value >= 70) return "Good";
    if (value >= 50) return "Fair";
    return "Poor";
  };

  const getStatusColor = () => {
    if (value >= 70) return "#3AB368"; // green
    if (value >= 50) return "#F5A623"; // orange
    return "#E57373"; // red
  };

  const statusColor = getStatusColor();
  const label = getLabel();
  const trackColorLight = "rgba(148, 163, 184, 0.3)";
  const trackColorDark = "rgba(15, 23, 42, 0.5)";

  const circumference = 2 * Math.PI * 40; // radius = 40
  const offset = circumference - (displayValue / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="rounded-xl p-4 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 flex flex-col items-center">
        <div className="relative w-24 h-24 mb-3">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
              style={{
                color: trackColorLight,
              }}
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={statusColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="text-2xl mb-1"
              style={{ color: statusColor }}
            >
              {icon}
            </div>
            <span
              className="text-lg font-bold"
              style={{ color: statusColor }}
            >
              {displayValue}%
            </span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">{title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

