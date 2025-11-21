"use client";

import { motion } from "framer-motion";

interface WellnessCardProps {
  score: number;
}

const BRAND_COLOR = "#3AB368";
const TRACK_COLOR = "#E5E7EB";

export default function WellnessCard({ score }: WellnessCardProps) {
  const circumference = 2 * Math.PI * 40; // radius = 40
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-4"
    >
      <h2 className="text-sm font-semibold text-gray-600 mb-4">Overall Wellness Score</h2>
      <div className="flex items-center gap-6">
        <div className="text-5xl font-bold text-gray-900">{score}</div>
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="transform -rotate-90 w-24 h-24">
            {/* Background circle */}
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke={TRACK_COLOR}
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              stroke={BRAND_COLOR}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          {/* Icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

