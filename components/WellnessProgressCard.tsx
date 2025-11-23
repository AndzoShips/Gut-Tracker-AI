"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Progress } from "@whop/frosted-ui";

interface WellnessProgressCardProps {
  currentScore: number;
  targetScore: number;
  trendMessage: string;
}

const BRAND_COLOR = "#3AB368";
const TRACK_COLOR = "rgba(58, 179, 104, 0.2)";

export default function WellnessProgressCard({
  currentScore,
  targetScore,
  trendMessage,
}: WellnessProgressCardProps) {
  const [displayScore, setDisplayScore] = useState(0);

  // Animate score change
  useEffect(() => {
    const duration = 1000; // 1 second animation
    const steps = 60;
    const increment = currentScore / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, currentScore);
      setDisplayScore(Math.round(current));

      if (step >= steps) {
        clearInterval(timer);
        setDisplayScore(currentScore);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [currentScore]);

  const getLabel = () => {
    if (currentScore >= 70) return "Good";
    if (currentScore >= 50) return "Fair";
    return "Poor";
  };

  const label = getLabel();
  const circumference = 2 * Math.PI * 50; // radius = 50
  const scoreOffset = circumference - (currentScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
          className="mb-6 rounded-xl p-6 shadow-sm border bg-gradient-to-br from-green-50/50 to-emerald-50/30 border-green-200/30 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Gut-Mind Balance Index</h2>
        </div>

          {/* Main Circular Indicator (Wellness Score) */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-32 h-32 mb-3 flex items-center justify-center">
              <svg 
                className="transform -rotate-90 w-full h-full" 
                viewBox="0 0 140 140"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Background circle */}
                <circle
                  cx="70"
                  cy="70"
                  r="50"
                  stroke={TRACK_COLOR}
                  strokeWidth="10"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="70"
                  cy="70"
                  r="50"
                  stroke={BRAND_COLOR}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: scoreOffset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              {/* Score in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold" style={{ color: BRAND_COLOR }}>
                  {displayScore}/100
                </span>
                <span className="text-sm font-semibold mt-1">
                  {label}
                </span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
              <p className="text-sm text-center italic mb-2 text-gray-700 dark:text-gray-300">
                {trendMessage}
              </p>

              {/* Goal Message */}
              <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                Keep your index above 70 for 5 days to achieve Gut Harmony 🌿
              </p>
        </div>
    </motion.div>
  );
}

