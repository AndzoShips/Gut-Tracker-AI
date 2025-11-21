"use client";

import { motion } from "framer-motion";

interface Insight {
  icon: string;
  message: string;
  impactColor: string;
}

interface DailyBriefingProps {
  insights: Insight[];
  metrics: {
    moodStability: { percentage: number; trend: number };
    digestion: { percentage: number; trend: number };
    energyLevels: { percentage: number; trend: number };
    focusClarity: { percentage: number; trend: number };
  };
}

export default function DailyBriefing({ insights, metrics }: DailyBriefingProps) {
  // Parse insights to categorize them
  const parseInsights = () => {
    const improvements: string[] = [];
    const declines: string[] = [];
    const keyInsights: string[] = [];
    const predictions: string[] = [];
    const foodInsights: string[] = [];

    // Analyze metrics for improvements and declines
    const metricChanges = [
      {
        name: "Mood Stability",
        trend: metrics.moodStability.trend,
        percentage: metrics.moodStability.percentage,
      },
      {
        name: "Digestion",
        trend: metrics.digestion.trend,
        percentage: metrics.digestion.percentage,
      },
      {
        name: "Energy Levels",
        trend: metrics.energyLevels.trend,
        percentage: metrics.energyLevels.percentage,
      },
      {
        name: "Focus Clarity",
        trend: metrics.focusClarity.trend,
        percentage: metrics.focusClarity.percentage,
      },
    ];

    // Extract improvements from metrics (only if trend is significant, > 2%)
    metricChanges
      .filter((m) => m.trend > 2)
      .slice(0, 2)
      .forEach((m) => {
        improvements.push(
          `${m.name} ↑ ${Math.abs(m.trend)}% (increase likely due to today's meal choices)`
        );
      });

    // Extract declines from metrics (only if trend is significant, < -2%)
    metricChanges
      .filter((m) => m.trend < -2)
      .slice(0, 2)
      .forEach((m) => {
        declines.push(
          `${m.name} ↓ ${Math.abs(m.trend)}% (may need dietary adjustments)`
        );
      });

    // Parse AI insights to extract key insights, predictions, and food-specific insights
    insights.forEach((insight) => {
      const message = insight.message.toLowerCase();

      // Check for predictions (keywords: "expect", "tomorrow", "will", "likely")
      if (
        message.includes("expect") ||
        message.includes("tomorrow") ||
        message.includes("will") ||
        message.includes("likely") ||
        message.includes("may")
      ) {
        predictions.push(insight.message);
      }
      // Check for food-specific insights (mentions specific foods/ingredients)
      else if (
        message.includes("fiber") ||
        message.includes("protein") ||
        message.includes("kimchi") ||
        message.includes("beef") ||
        message.includes("chicken") ||
        message.includes("salmon") ||
        message.includes("rice") ||
        message.includes("vegetable") ||
        message.includes("meal") ||
        message.includes("food")
      ) {
        foodInsights.push(insight.message);
      }
      // Everything else is a key insight
      else {
        keyInsights.push(insight.message);
      }
    });

    return {
      improvements,
      declines,
      keyInsights,
      predictions,
      foodInsights,
    };
  };

  const { improvements, declines, keyInsights, predictions, foodInsights } =
    parseInsights();

  // Don't render if no data
  if (
    improvements.length === 0 &&
    declines.length === 0 &&
    keyInsights.length === 0 &&
    predictions.length === 0 &&
    foodInsights.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="mb-8"
    >
      <div className="rounded-xl p-5 shadow-sm border bg-gradient-to-br from-purple-50/30 to-pink-50/20 dark:from-gray-800 dark:to-gray-700 border-gray-200 dark:border-gray-600">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg">
            ✨
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            Your Daily Wellness Briefing
          </h3>
        </div>

        <div className="space-y-4">
          {/* What Improved Today */}
          {improvements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="rounded-xl p-3 shadow-sm border bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    What Improved Today
                  </p>
                  <div className="space-y-1.5">
                    {improvements.map((improvement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-sm font-bold text-green-600 dark:text-green-400">↑</span>
                        <p className="text-sm flex-1 text-gray-700 dark:text-gray-300">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* What Declined */}
          {declines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="rounded-xl p-3 shadow-sm border bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    What Declined
                  </p>
                  <div className="space-y-1.5">
                    {declines.map((decline, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-sm font-bold text-red-600 dark:text-red-400">↓</span>
                        <p className="text-sm flex-1 text-gray-700 dark:text-gray-300">{decline}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Today's Key Insight */}
          {keyInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="rounded-xl p-3 shadow-sm border bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    Today's Key Insight
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    {keyInsights[0]}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tomorrow's Prediction */}
          {predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <div className="rounded-xl p-3 shadow-sm border bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    Tomorrow's Prediction
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {predictions[0]}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Food-Specific Insight */}
          {foodInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="rounded-xl p-3 shadow-sm border bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-300">
                    Food-Specific Insight
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {foodInsights[0]}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

