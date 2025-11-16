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
      className="rounded-2xl p-4 shadow-md border border-green-200/30 mb-20"
      style={{ background: 'linear-gradient(to bottom, rgba(77, 194, 119, 0.05), rgba(255, 255, 255, 0.95))' }}
    >
      <p className="text-sm text-center text-gray-700">
        <span className="font-semibold" style={{ color: '#3AB368' }}>{days} days</span> toward gut harmony{" "}
        <span style={{ color: '#3AB368' }}>🌱</span> Keep it up!
      </p>
    </motion.div>
  );
}

