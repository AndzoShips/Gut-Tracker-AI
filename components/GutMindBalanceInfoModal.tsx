"use client";

import { Modal, Button } from "@whop/frosted-ui";
import { motion } from "framer-motion";

interface GutMindBalanceInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime?: boolean;
}

export default function GutMindBalanceInfoModal({
  isOpen,
  onClose,
  isFirstTime = false,
}: GutMindBalanceInfoModalProps) {
  const handleGotIt = () => {
    if (isFirstTime) {
      localStorage.setItem("gut_mind_balance_info_seen", "true");
    }
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={(open) => !open && onClose()}
      className="!max-w-2xl dark:!bg-gray-800"
      header={{
        title: isFirstTime ? "Welcome! Understanding Your Gut-Mind Balance Index" : "Gut-Mind Balance Index Explained",
        closeButton: !isFirstTime,
      }}
      body={{
        children: (
          <div className="max-h-[85vh] overflow-y-auto hide-scrollbar bg-white dark:bg-gray-800">
            <div className="space-y-6 p-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                What is the Gut-Mind Balance Index?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A single score (0-100) that measures how well your meals support both your gut health and mental clarity.
              </p>
            </motion.div>

            {/* How It Works */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">
                  1
                </span>
                How It's Calculated
              </h4>
              <div className="ml-10 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Gut Score (0-100)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Measures digestive ease, fiber content, microbiome support, inflammation risk, and gut-friendly nutrients.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Mental Score (0-100)</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Measures brain fuel quality, mood stability, energy sustainability, cognitive nutrients, and mental clarity support.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Balance Index</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Combines both scores to show how well your meal balances gut and mental health together.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Ranges */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">
                  2
                </span>
                Understanding Your Score
              </h4>
              <div className="ml-10 space-y-3">
                <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">70-100</span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      Good
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your meal supports both gut health and mental clarity. Keep it up! 🌿
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">50-69</span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
                      Fair
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your meal is okay, but could be better balanced for optimal gut and mental health.
                  </p>
                </div>
                <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">0-49</span>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      Poor
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Your meal may harm gut or mental health. Consider healthier alternatives.
                  </p>
                </div>
              </div>
            </div>

            {/* The Balance Concept */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500/10 dark:bg-green-400/10 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">
                  3
                </span>
                Why Balance Matters
              </h4>
              <div className="ml-10 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  A meal can be great for your gut but bad for your brain (or vice versa). The Balance Index rewards meals that support <strong>both</strong>.
                </p>
                <div className="space-y-2 mt-3">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      High fiber (good for gut) + simple sugars (bad for mental) = Lower balance index
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Complex carbs + healthy fats (good for both) = Higher balance index
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Your Goal</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Keep your index above <strong>70</strong> for <strong>5 consecutive days</strong> to achieve "Gut Harmony" — meaning your meals consistently support both gut and mental health.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <Button
                onClick={handleGotIt}
                className="w-full flex items-center justify-center gap-2 font-semibold"
              >
                {isFirstTime ? "Got it, let's get started!" : "Got it"}
              </Button>
            </div>
            </div>
          </div>
        ),
      }}
    />
  );
}

