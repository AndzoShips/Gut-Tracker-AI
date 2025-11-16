"use client";

import { motion } from "framer-motion";

interface InsightCardProps {
  icon: string;
  message: string;
  impactColor: string;
  index?: number;
}

export default function InsightCard({ icon, message, impactColor, index = 0 }: InsightCardProps) {
  // Determine gradient based on impact color
  const getGradient = () => {
    if (impactColor.includes("green")) {
      return "from-green-50 to-emerald-50";
    } else if (impactColor.includes("blue")) {
      return "from-blue-50 to-cyan-50";
    } else if (impactColor.includes("yellow")) {
      return "from-yellow-50 to-amber-50";
    }
    return "from-gray-50 to-slate-50";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`bg-gradient-to-r ${getGradient()} rounded-xl p-4 border border-gray-200 shadow-sm flex items-start gap-3 transition-transform duration-150 hover:scale-[1.01] active:scale-[0.99] cursor-pointer`}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-2xl shadow-sm">
        {icon}
      </div>
      <p className="text-sm text-gray-700 flex-1 leading-relaxed">{message}</p>
    </motion.div>
  );
}

