"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DailyTargetScoreProps {
  targetScore: number;
  currentScore: number;
  trendMessage: string;
}

const BRAND_COLOR = "#3AB368";
const TRACK_COLOR = "#E3F3EE";
const BRAND_GRADIENT = "linear-gradient(to right, #3AB368, #2E9153)";

export default function DailyTargetScore({
  targetScore,
  currentScore,
  trendMessage,
}: DailyTargetScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const progress = Math.min((currentScore / targetScore) * 100, 100);
  const isHighProgress = progress >= 75;

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

  // Animate progress bar
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (progress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="mb-6"
    >
      <div
        className="rounded-xl p-6 shadow-sm border border-green-200/40 relative overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #E9F8EE, #FFFFFF)",
        }}
      >
        {/* Glow effect when progress >= 75% */}
        {isHighProgress && (
          <div
            className="absolute inset-0 rounded-xl opacity-20 blur-xl pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${BRAND_COLOR}, transparent)`,
            }}
          />
        )}

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Today's Target: <span className="text-gray-900 font-bold">{targetScore}</span>
              </h3>
              <h2 className="text-2xl font-bold text-gray-900">
                Current Score: <span style={{ color: "#3AB368" }}>{displayScore}</span>
              </h2>
            </div>

            {/* Progress Ring */}
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
              <svg 
                className="transform -rotate-90 w-full h-full" 
                viewBox="0 0 110 110"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Background circle */}
                <circle
                  cx="55"
                  cy="55"
                  r="45"
                  stroke={TRACK_COLOR}
                  strokeWidth="6"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="55"
                  cy="55"
                  r="45"
                  stroke={BRAND_COLOR}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{
                    filter: `drop-shadow(0 0 6px ${BRAND_COLOR}80)`,
                  }}
                />
              </svg>
              {/* Percentage in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: BRAND_COLOR }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <p className="text-sm text-gray-600 text-center italic">
            {trendMessage}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

