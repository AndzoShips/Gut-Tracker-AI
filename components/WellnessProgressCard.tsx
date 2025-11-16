"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface WellnessProgressCardProps {
  currentScore: number;
  targetScore: number;
  trendMessage: string;
}

export default function WellnessProgressCard({
  currentScore,
  targetScore,
  trendMessage,
}: WellnessProgressCardProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const progress = Math.min((currentScore / targetScore) * 100, 100);
  const isHighProgress = progress >= 75;
  const isHighScore = currentScore >= 70;

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

  // Determine color based on score
  const getColor = () => {
    if (currentScore >= 70) return "#3AB368"; // richer green
    if (currentScore >= 50) return "#F5A623"; // warm orange
    return "#E57373"; // softer red
  };

  const getLabel = () => {
    if (currentScore >= 70) return "Good";
    if (currentScore >= 50) return "Fair";
    return "Poor";
  };

  const color = getColor();
  const label = getLabel();
  const circumference = 2 * Math.PI * 50; // radius = 50
  const scoreOffset = circumference - (currentScore / 100) * circumference;
  const progressCircumference = 2 * Math.PI * 45; // radius = 45 for progress ring
  const progressOffset = progressCircumference - (progress / 100) * progressCircumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 shadow-md border border-green-200/30 mb-6"
      style={{ background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.1), rgba(77, 194, 119, 0.02))' }}
    >
      {/* Glow effect when progress >= 75% */}
      {isHighProgress && (
        <div
          className="absolute inset-0 rounded-2xl opacity-20 blur-xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, #4DC277, transparent)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header with Target Info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              Today's Target: <span className="text-gray-900 font-bold">{targetScore}</span>
            </h3>
            <h2 className="text-base font-bold text-gray-900 mb-2">Gut-Mind Balance Index</h2>
          </div>

          {/* Small Progress Ring (toward target) */}
          <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <svg 
              className="transform -rotate-90 w-full h-full" 
              viewBox="0 0 110 110"
              preserveAspectRatio="xMidYMid meet"
            >
              <circle
                cx="55"
                cy="55"
                r="45"
                stroke="#e5e7eb"
                strokeWidth="6"
                fill="none"
              />
              <motion.circle
                cx="55"
                cy="55"
                r="45"
                stroke={isHighProgress ? "#3AB368" : "#4DC277"}
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={progressCircumference}
                initial={{ strokeDashoffset: progressCircumference }}
                animate={{ strokeDashoffset: progressOffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                style={
                  isHighProgress
                    ? {
                        filter: `drop-shadow(0 0 6px ${isHighProgress ? "#3AB368" : "#4DC277"}80)`,
                      }
                    : {}
                }
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-xs font-bold"
                style={{ color: isHighProgress ? "#3AB368" : "#4DC277" }}
              >
                {Math.round(progress)}%
              </span>
            </div>
          </div>
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
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              {/* Gradient background circle */}
              <defs>
                <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0fdf4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#dcfce7" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <circle
                cx="70"
                cy="70"
                r="50"
                fill="url(#circleGradient)"
              />
              {/* Progress circle with glow effect */}
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <motion.circle
                cx="70"
                cy="70"
                r="50"
                stroke={color}
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: scoreOffset }}
                transition={{ duration: 1, ease: "easeOut" }}
                filter={isHighScore ? "url(#glow)" : undefined}
                style={isHighScore ? { filter: `drop-shadow(0 0 4px ${color}80)` } : {}}
              />
            </svg>
            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold" style={{ color }}>
                {displayScore}/100
              </div>
              <div className="text-sm font-semibold mt-1" style={{ color }}>
                {label}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar (toward target) */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{
              background: isHighProgress
                ? "linear-gradient(to right, #3AB368, #4DC277)"
                : "linear-gradient(to right, #4DC277, #6DD88A)",
            }}
          />
        </div>

        {/* Motivational Message */}
        <p className="text-sm text-gray-600 text-center italic mb-2">
          {trendMessage}
        </p>

        {/* Goal Message */}
        <p className="text-gray-500 text-sm text-center">
          Keep your index above 70 for 5 days to achieve Gut Harmony 🌿
        </p>
      </div>
    </motion.div>
  );
}

