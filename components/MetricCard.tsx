"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

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
        return (
          <span className="text-green-600 text-xs font-semibold">↑</span>
        );
      case "down":
        return (
          <span className="text-red-600 text-xs font-semibold">↓</span>
        );
      case "neutral":
        return (
          <span className="text-gray-500 text-xs font-semibold">→</span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl p-4 shadow-md border border-green-100/50 relative overflow-hidden transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      style={{ 
        background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.04) 0%, #F5FFF9 100%)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(77, 194, 119, 0.08) 0%, #F5FFF9 100%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(to bottom, rgba(77, 194, 119, 0.04) 0%, #F5FFF9 100%)';
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.filter = 'saturate(1.15)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.filter = 'saturate(1)';
      }}
    >
      {/* Gradient strip at top */}
      <div 
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
        style={{ background: `linear-gradient(to right, rgba(77, 194, 119, 0.15), rgba(77, 194, 119, 0.05))` }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={
            isHighValue
              ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    `0 0 0px ${color}40`,
                    `0 0 8px ${color}60`,
                    `0 0 0px ${color}40`,
                  ],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex-shrink-0"
          style={{ color }}
        >
          {icon}
        </motion.div>
        <p className="text-xs font-medium text-gray-600 flex-1">{title}</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {displayPercentage}%
          </span>
          {getTrendIndicator()}
        </div>

        {/* Progress bar - 4-6px height */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      </div>
    </motion.div>
  );
}

