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
      <div 
        className="rounded-2xl p-5 shadow-md border border-green-200/40 relative overflow-hidden"
        style={{ background: 'linear-gradient(to bottom right, #E3FCEB, #F9FFFB)' }}
      >
        {/* Green radial glow behind title icon */}
        <div 
          className="absolute top-3 left-3 w-8 h-8 rounded-full opacity-30 blur-md"
          style={{ background: 'radial-gradient(circle, #4DC277, transparent)' }}
        />
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-5 relative z-10">
          <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-lg shadow-sm">
            ✨
          </div>
          <h3 className="text-base font-bold text-gray-900">
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
              className="bg-white/70 rounded-xl p-3 border-l-3 border-green-400/60"
              style={{ borderLeftWidth: '3px' }}
            >
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                What Improved Today
              </h4>
              <div className="space-y-1.5">
                {improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <span className="text-green-600 font-bold mt-0.5">↑</span>
                    <span className="flex-1">{improvement}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* What Declined */}
          {declines.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="bg-white/70 rounded-xl p-3 border-l-3 border-orange-400/60"
              style={{ borderLeftWidth: '3px' }}
            >
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                What Declined
              </h4>
              <div className="space-y-1.5">
                {declines.map((decline, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-800"
                  >
                    <span className="text-orange-600 font-bold mt-0.5">↓</span>
                    <span className="flex-1">{decline}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Today's Key Insight */}
          {keyInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white/80 rounded-xl p-3 border-l-3 border-green-500/60"
              style={{ borderLeftWidth: '3px' }}
            >
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Today's Key Insight
              </h4>
              <p className="text-sm text-gray-800 font-medium leading-relaxed">
                {keyInsights[0]}
              </p>
            </motion.div>
          )}

          {/* Tomorrow's Prediction */}
          {predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white/70 rounded-xl p-3 border-l-3 border-blue-400/60"
              style={{ borderLeftWidth: '3px' }}
            >
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Tomorrow's Prediction
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed">
                {predictions[0]}
              </p>
            </motion.div>
          )}

          {/* Food-Specific Insight */}
          {foodInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-white/70 rounded-xl p-3 border-l-3 border-purple-400/60"
              style={{ borderLeftWidth: '3px' }}
            >
              <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Food-Specific Insight
              </h4>
              <p className="text-sm text-gray-800 leading-relaxed">
                {foodInsights[0]}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

