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

  // Determine color based on value
  const getColor = () => {
    if (value >= 70) return "#3AB368"; // green
    if (value >= 50) return "#F5A623"; // orange
    return "#E57373"; // red
  };

  const getGradient = () => {
    if (value >= 70) {
      return "linear-gradient(to bottom right, #D1FAE5, #A7F3D0)";
    } else if (value >= 50) {
      return "linear-gradient(to bottom right, #FEF3C7, #FDE68A)";
    }
    return "linear-gradient(to bottom right, #FEE2E2, #FECACA)";
  };

  const color = getColor();
  const gradient = getGradient();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-xl p-4 border border-gray-200/50 shadow-sm"
      style={{
        background: gradient,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <p className="text-xs font-medium text-gray-700 flex-1">{title}</p>
      </div>
      <div className="text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
          className="text-2xl font-bold"
          style={{ color }}
        >
          {displayValue}%
        </motion.p>
      </div>
    </motion.div>
  );
}

