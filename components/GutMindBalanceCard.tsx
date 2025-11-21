"use client";

import { motion } from "framer-motion";

interface GutMindBalanceCardProps {
  score: number;
}

const BRAND_COLOR = "#3AB368";
const TRACK_COLOR = "#E5E7EB";

export default function GutMindBalanceCard({ score }: GutMindBalanceCardProps) {
  const circumference = 2 * Math.PI * 50; // radius = 50
  const offset = circumference - (score / 100) * circumference;

  const getLabel = () => {
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Poor";
  };

  const label = getLabel();
  const labelColor =
    label === "Good" ? BRAND_COLOR : label === "Fair" ? "#F5A623" : "#E57373";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 shadow-md border border-green-200/30"
      style={{ background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.1), rgba(77, 194, 119, 0.02))' }}
    >
      <h2 className="text-base font-bold text-gray-900 mb-4 text-center">Gut-Mind Balance Index</h2>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
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
              stroke={BRAND_COLOR}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
              filter={score >= 70 ? "url(#glow)" : undefined}
              style={score >= 70 ? { filter: `drop-shadow(0 0 4px ${BRAND_COLOR}80)` } : {}}
            />
          </svg>
          {/* Score in center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold" style={{ color: BRAND_COLOR }}>
              {score}/100
            </div>
            <div className="text-sm font-semibold mt-1" style={{ color: labelColor }}>
              {label}
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-sm text-center">
          Keep your index above 70 for 5 days to achieve Gut Harmony 🌿
        </p>
      </div>
    </motion.div>
  );
}

