"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { Progress } from "@whop/frosted-ui";

interface MetricCardProps {
  title: string;
  percentage: number;
  trend: "up" | "down" | "neutral";
  icon: ReactNode;
  color: string;
}

export default function MetricCard({
  title,
  percentage,
  trend,
  icon,
  color,
}: MetricCardProps) {
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const isHighValue = percentage >= 80;

  // Animate percentage change
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60;
    const increment = percentage / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, percentage);
      setDisplayPercentage(Math.round(current));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayPercentage(percentage);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [percentage]);

  // Get trend indicator
  const getTrendIndicator = () => {
    switch (trend) {
      case "up":
        return <span className="text-xs font-semibold">↑</span>;
      case "down":
        return <span className="text-xs font-semibold">↓</span>;
      case "neutral":
        return <span className="text-xs font-semibold">→</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
    >
      <div className="rounded-xl p-4 shadow-sm border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <motion.div
              animate={
                isHighValue
                  ? {
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex-shrink-0"
            >
              {icon}
            </motion.div>
            <p className="text-xs font-medium flex-1 text-gray-700 dark:text-gray-300">{title}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {displayPercentage}%
            </span>
            {getTrendIndicator()}
          </div>

          {/* Progress bar */}
          <Progress value={percentage} max={100} className="h-1.5 brand-progress" />
        </div>
      </div>
    </motion.div>
  );
}

