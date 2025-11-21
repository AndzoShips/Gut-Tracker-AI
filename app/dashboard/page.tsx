"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@whop/frosted-ui";
import HomeHeader from "@/components/HomeHeader";
import TodayFocusCard from "@/components/TodayFocusCard";
import WellnessProgressCard from "@/components/WellnessProgressCard";
import MetricCard from "@/components/MetricCard";
import DailyBriefing from "@/components/DailyBriefing";
import MealsList from "@/components/MealsList";
import StreakTracker from "@/components/StreakTracker";
import MealScanModal from "@/components/MealScanModal";
import MealAnalysisModal from "@/components/MealAnalysisModal";
import DarkModeToggle from "@/components/DarkModeToggle";
import GutMindBalanceInfoModal from "@/components/GutMindBalanceInfoModal";

interface Meal {
  id: string;
  title: string;
  image_url?: string;
  mood_score?: number;
  mental_clarity_score?: number;
  energy_score?: number;
  digestion_score?: number;
  gut_score?: number;
  mental_score?: number;
  overall_score?: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzingMeal, setAnalyzingMeal] = useState<{ image: string; startTime: number } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showGutMindInfoModal, setShowGutMindInfoModal] = useState(false);
  const [isFirstTimeGutMindInfo, setIsFirstTimeGutMindInfo] = useState(false);

  // Check onboarding
  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (completed !== "true") {
      router.push("/onboarding");
      return;
    }

    // Load onboarding data
    const saved = localStorage.getItem("onboarding_data");
    if (saved) {
      try {
        setOnboardingData(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading onboarding data:", e);
      }
    }

    // Check if user has seen the Gut-Mind Balance Index explanation
    const hasSeenInfo = localStorage.getItem("gut_mind_balance_info_seen");
    if (!hasSeenInfo) {
      // Show the info modal after a short delay to let the page load
      setTimeout(() => {
        setShowGutMindInfoModal(true);
        setIsFirstTimeGutMindInfo(true);
      }, 1000);
    }
  }, [router]);

  async function fetchMeals() {
    try {
      // Only show loading spinner on initial load, not on refreshes
      const isInitialLoad = meals.length === 0;
      if (isInitialLoad) {
        setLoading(true);
      }
      
      const response = await fetch("/api/meals");
      const data = await response.json();

      if (response.ok) {
        setMeals(data.meals || []);
        console.log("Meals fetched:", data.meals?.length || 0, "meals");
      } else {
        console.error("Failed to fetch meals:", data);
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
    } finally {
      setLoading(false);
    }
  }

  // Fetch meals on mount and when date changes
  useEffect(() => {
    fetchMeals();
  }, []);

  // Refresh meals when returning to dashboard
  useEffect(() => {
    const handleFocus = () => {
      fetchMeals();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  // Calculate wellness metrics from today's meals
  const calculateMetrics = () => {
    const today = selectedDate.toDateString();
    const todayMeals = meals.filter((meal) => {
      return new Date(meal.created_at).toDateString() === today;
    });

    // Get yesterday's meals for trend calculation
    const yesterday = new Date(selectedDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    const yesterdayMeals = meals.filter((meal) => {
      return new Date(meal.created_at).toDateString() === yesterdayStr;
    });

    if (todayMeals.length === 0) {
      return {
        overallScore: 0,
        moodStability: { percentage: 0, trend: 0 },
        digestion: { percentage: 0, trend: 0 },
        energyLevels: { percentage: 0, trend: 0 },
        focusClarity: { percentage: 0, trend: 0 },
      };
    }

    // Calculate today's averages
    const avgOverall = Math.round(
      todayMeals.reduce((sum, m) => sum + (m.overall_score || 0), 0) / todayMeals.length
    );
    const avgMood = Math.round(
      todayMeals.reduce((sum, m) => sum + (m.mood_score || 0), 0) / todayMeals.length
    );
    const avgDigestion = Math.round(
      todayMeals.reduce((sum, m) => sum + (m.digestion_score || 0), 0) / todayMeals.length
    );
    const avgEnergy = Math.round(
      todayMeals.reduce((sum, m) => sum + (m.energy_score || 0), 0) / todayMeals.length
    );
    const avgFocus = Math.round(
      todayMeals.reduce((sum, m) => sum + (m.mental_clarity_score || 0), 0) / todayMeals.length
    );

    // Calculate yesterday's averages for trends
    const calcTrend = (todayAvg: number, yesterdayAvg: number) => {
      if (yesterdayMeals.length === 0) return 0;
      return Math.round(todayAvg - yesterdayAvg);
    };

    const yesterdayMood = yesterdayMeals.length > 0
      ? Math.round(yesterdayMeals.reduce((sum, m) => sum + (m.mood_score || 0), 0) / yesterdayMeals.length)
      : avgMood;
    const yesterdayDigestion = yesterdayMeals.length > 0
      ? Math.round(yesterdayMeals.reduce((sum, m) => sum + (m.digestion_score || 0), 0) / yesterdayMeals.length)
      : avgDigestion;
    const yesterdayEnergy = yesterdayMeals.length > 0
      ? Math.round(yesterdayMeals.reduce((sum, m) => sum + (m.energy_score || 0), 0) / yesterdayMeals.length)
      : avgEnergy;
    const yesterdayFocus = yesterdayMeals.length > 0
      ? Math.round(yesterdayMeals.reduce((sum, m) => sum + (m.mental_clarity_score || 0), 0) / yesterdayMeals.length)
      : avgFocus;

    return {
      overallScore: avgOverall,
      moodStability: {
        percentage: avgMood,
        trend: calcTrend(avgMood, yesterdayMood),
      },
      digestion: {
        percentage: avgDigestion,
        trend: calcTrend(avgDigestion, yesterdayDigestion),
      },
      energyLevels: {
        percentage: avgEnergy,
        trend: calcTrend(avgEnergy, yesterdayEnergy),
      },
      focusClarity: {
        percentage: avgFocus,
        trend: calcTrend(avgFocus, yesterdayFocus),
      },
    };
  };

  // Calculate streak (days with score >= 70)
  const calculateStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkDateStr = checkDate.toDateString();
      
      const dayMeals = meals.filter((meal) => {
        return new Date(meal.created_at).toDateString() === checkDateStr;
      });

      if (dayMeals.length === 0) break;

      const avgScore = dayMeals.reduce((sum, m) => sum + (m.overall_score || 0), 0) / dayMeals.length;
      if (avgScore >= 70) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Fetch AI-generated insights based on meal history
  const fetchInsights = async () => {
    if (meals.length === 0) {
      setInsights([
        {
          icon: "💡",
          message: "Keep tracking your meals to see personalized insights!",
        },
      ]);
      return;
    }

    try {
      setLoadingInsights(true);
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok && data.insights) {
        setInsights(data.insights);
      } else {
        // Fallback to default
        setInsights([
          {
            icon: "💡",
            message: "Keep tracking your meals to see personalized insights!",
            impactColor: "bg-blue-50",
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching insights:", err);
      // Fallback to default
      setInsights([
        {
          icon: "💡",
          message: "Keep tracking your meals to see personalized insights!",
        },
      ]);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Recalculate metrics whenever meals or selectedDate changes
  const metrics = calculateMetrics();
  const streak = calculateStreak();
  
  // Calculate progress for daily target
  const progress = metrics.overallScore > 0 ? (metrics.overallScore / 78) * 100 : 0;

  // Fetch insights when meals change
  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meals.length]); // Re-fetch when meal count changes

  // Log metrics changes for debugging
  useEffect(() => {
    console.log("Metrics recalculated:", {
      overallScore: metrics.overallScore,
      mealsCount: meals.length,
      todayMeals: meals.filter((m) => {
        const mealDate = new Date(m.created_at).toDateString();
        return mealDate === selectedDate.toDateString();
      }).length,
    });
  }, [metrics.overallScore, meals.length, selectedDate]);

  const handleImageSelected = async (image: string) => {
    console.log("handleImageSelected called, image length:", image?.length);
    
    if (!image) {
      console.error("No image provided to handleImageSelected");
      alert("Failed to load image. Please try again.");
      return;
    }

    setSelectedImage(image);
    setShowScanModal(false);
    // Show analyzing state in dashboard
    setAnalyzingMeal({ image, startTime: Date.now() });
    // Don't show modal during analysis - only show when results are ready
    setShowAnalysisModal(false);
    setAnalysisResult(null);

    // Start analysis in background
    try {
      console.log("Sending image to /api/analyze...");
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
      
      if (response.ok) {
        setAnalysisResult(data);
        setAnalyzingMeal(null); // Clear analyzing state
        setShowAnalysisModal(true); // Show modal with results
        // Refresh meals to show the new one and update metrics
        fetchMeals();
        setTimeout(() => {
          fetchMeals();
          // Refresh insights after meal is saved
          fetchInsights();
        }, 500);
      } else {
        console.error("API error:", data);
        setAnalyzingMeal(null); // Clear analyzing state
        setShowAnalysisModal(true); // Show modal with error
        setAnalysisResult({ error: data.error || "Something went wrong" });
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalyzingMeal(null); // Clear analyzing state
      setShowAnalysisModal(true); // Show modal with error
      setAnalysisResult({ error: err instanceof Error ? err.message : "Failed to send request" });
    }
  };

  const handleAnalysisComplete = () => {
    // Analysis is already complete, just refresh meals and insights
    fetchMeals();
    setTimeout(() => {
      fetchMeals();
      fetchInsights(); // Refresh insights after meal is saved
    }, 500);
  };

  return (
    <>
      <div className="min-h-screen pb-24 bg-gradient-to-br from-green-50/20 via-white to-purple-50/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate.toDateString()}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="max-w-6xl mx-auto px-4 py-6"
          >
          <HomeHeader selectedDate={selectedDate} onDateChange={setSelectedDate} />

          {/* Two Column Layout: Left (Target & Metrics) and Right (Meals) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <WellnessProgressCard
                currentScore={metrics.overallScore || 0}
                targetScore={78}
                trendMessage={
                  progress >= 75
                    ? "Excellent progress! You're exceeding your target! 🌟"
                    : progress >= 50
                      ? "You're on track — one smart meal away!"
                      : "Keep going! Every meal counts toward your goal."
                }
              />


              {/* Metrics Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  Your Daily Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3">
            <MetricCard
              title="Mood Stability"
              percentage={metrics.moodStability.percentage}
              trend={
                metrics.moodStability.trend > 0
                  ? "up"
                  : metrics.moodStability.trend < 0
                    ? "down"
                    : "neutral"
              }
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
              color={metrics.moodStability.percentage >= 70 ? "#3AB368" : metrics.moodStability.percentage >= 50 ? "#F5A623" : "#E57373"}
            />
            <MetricCard
              title="Digestion"
              percentage={metrics.digestion.percentage}
              trend={
                metrics.digestion.trend > 0
                  ? "up"
                  : metrics.digestion.trend < 0
                    ? "down"
                    : "neutral"
              }
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              }
              color={metrics.digestion.percentage >= 70 ? "#3AB368" : metrics.digestion.percentage >= 50 ? "#F5A623" : "#E57373"}
            />
            <MetricCard
              title="Energy Levels"
              percentage={metrics.energyLevels.percentage}
              trend={
                metrics.energyLevels.trend > 0
                  ? "up"
                  : metrics.energyLevels.trend < 0
                    ? "down"
                    : "neutral"
              }
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
              color={metrics.energyLevels.percentage >= 70 ? "#3AB368" : metrics.energyLevels.percentage >= 50 ? "#F5A623" : "#E57373"}
            />
            <MetricCard
              title="Focus Clarity"
              percentage={metrics.focusClarity.percentage}
              trend={
                metrics.focusClarity.trend > 0
                  ? "up"
                  : metrics.focusClarity.trend < 0
                    ? "down"
                    : "neutral"
              }
              icon={
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              }
              color={metrics.focusClarity.percentage >= 70 ? "#3AB368" : metrics.focusClarity.percentage >= 50 ? "#F5A623" : "#E57373"}
            />
                </div>
              </motion.div>
            </div>

            {/* Right Column - Today's Meals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:sticky lg:top-6 lg:self-start"
            >
              <MealsList meals={meals} isLoading={loading} selectedDate={selectedDate} analyzingMeal={analyzingMeal} />
            </motion.div>
          </div>

          {/* Daily Wellness Briefing */}
          <DailyBriefing insights={insights} metrics={metrics} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <StreakTracker days={streak} />
          </motion.div>

          {/* Floating Add Button */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={() => setShowScanModal(true)}
              variant="solid"
              size="4"
              className="w-14 h-14 rounded-full"
              aria-label="Add meal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </Button>
          </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scan Modal */}
      <MealScanModal
        isOpen={showScanModal}
        onClose={() => setShowScanModal(false)}
        onImageSelected={handleImageSelected}
      />

      {/* Analysis Modal - Only show when results are ready or error occurs */}
      {selectedImage && analysisResult && (
        <MealAnalysisModal
          isOpen={showAnalysisModal && !analyzingMeal}
          onClose={() => {
            setShowAnalysisModal(false);
            setSelectedImage(null);
            setAnalyzingMeal(null);
            setAnalysisResult(null);
          }}
          image={selectedImage}
          initialResult={analysisResult}
          onAnalysisComplete={handleAnalysisComplete}
        />
      )}

      {/* Gut-Mind Balance Index Info Modal */}
      <GutMindBalanceInfoModal
        isOpen={showGutMindInfoModal}
        onClose={() => {
          setShowGutMindInfoModal(false);
          setIsFirstTimeGutMindInfo(false);
        }}
        isFirstTime={isFirstTimeGutMindInfo}
      />

      {/* Dark Mode Toggle - for testing */}
      <DarkModeToggle />
    </>
  );
}
