"use client";

import { motion } from "framer-motion";

interface MetricData {
  label: string;
  percentage: number;
  trend: number; // positive or negative percentage change
  icon: React.ReactNode;
}

interface MetricsGridProps {
  moodStability: MetricData;
  digestion: MetricData;
  energyLevels: MetricData;
  focusClarity: MetricData;
}

export default function MetricsGrid({
  moodStability,
  digestion,
  energyLevels,
  focusClarity,
}: MetricsGridProps) {
  const metrics: MetricData[] = [
    {
      label: "Mood Stability",
      percentage: moodStability.percentage,
      trend: moodStability.trend,
      icon: (
        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Digestion",
      percentage: digestion.percentage,
      trend: digestion.trend,
      icon: (
        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      label: "Energy Levels",
      percentage: energyLevels.percentage,
      trend: energyLevels.trend,
      icon: (
        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Focus Clarity",
      percentage: focusClarity.percentage,
      trend: focusClarity.trend,
      icon: (
        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      {metrics.map((metric, index) => {
        const isPositive = metric.trend > 0;
        const trendColor = isPositive ? "text-green-600" : "text-red-600";
        
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-3">
              {metric.icon}
              <p className="text-xs font-medium text-gray-600">{metric.label}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">{metric.percentage}%</span>
                <span className={`text-xs font-semibold ${trendColor}`}>
                  {isPositive ? "↑" : "↓"} {Math.abs(metric.trend)}%
                </span>
              </div>
              {/* Simple trend line visualization */}
              <div className="h-8 flex items-end gap-0.5">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => {
                  // Deterministic height based on metric percentage and position
                  // Creates a trend that reflects the actual score
                  const baseHeight = metric.percentage * 0.6; // Scale to 60% max
                  const variation = (i % 3) * 5; // Small variation based on position
                  const height = Math.max(20, Math.min(80, baseHeight + variation));
                  const isRecent = i >= 5;
                  const barColor = isPositive 
                    ? (isRecent ? "bg-green-500" : "bg-green-300")
                    : (isRecent ? "bg-red-500" : "bg-red-300");
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t ${barColor}`}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
