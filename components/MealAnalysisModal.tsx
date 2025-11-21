"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Modal, Button, Progress } from "@whop/frosted-ui";
import StatCard from "./StatCard";
import MealInsightCard from "./MealInsightCard";

interface PersonalizedInsight {
  type: "Gut" | "Mind" | "Balance";
  message: string;
}

interface Analysis {
  id?: string;
  title?: string;
  detected_ingredients?: string[];
  mood_score?: number;
  mental_clarity_score?: number;
  energy_score?: number;
  digestion_score?: number;
  wellness_insights?: {
    mood_insight?: string;
    mental_clarity_insight?: string;
    energy_insight?: string;
    digestion_insight?: string;
  };
  gut_insights?: Record<string, string>;
  mental_insights?: Record<string, string>;
  gut_score?: number;
  mental_score?: number;
  overall_score?: number;
  short_verdict?: string;
  reasons?: string[];
  alternatives?: string[];
  personalized_insights?: {
    insights: PersonalizedInsight[];
  };
}

interface MealAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: string;
  initialResult?: any;
  onAnalysisComplete: () => void;
  onAnalysisStart?: () => void;
  onAnalysisError?: () => void;
}

export default function MealAnalysisModal({
  isOpen,
  onClose,
  image,
  initialResult,
  onAnalysisComplete,
  onAnalysisStart,
  onAnalysisError,
}: MealAnalysisModalProps) {
  const router = useRouter();
  const [result, setResult] = useState<Analysis | null>(initialResult?.error ? null : initialResult || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialResult?.error || null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your meal...");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Analyze image function
  const analyzeImage = async () => {
    if (!image) return;

    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
    setProgress(0);
    setLoadingMessage("Analyzing your meal...");
    
    if (onAnalysisStart) {
      onAnalysisStart();
    }

    const messages = [
      { progress: 20, text: "Identifying ingredients..." },
      { progress: 40, text: "Analyzing nutritional content..." },
      { progress: 60, text: "Assessing gut health impact..." },
      { progress: 80, text: "Evaluating mental performance..." },
      { progress: 95, text: "Finalizing insights..." },
    ];

    let messageIndex = 0;
    progressIntervalRef.current = setInterval(() => {
      if (messageIndex < messages.length) {
        setProgress(messages[messageIndex].progress);
        setLoadingMessage(messages[messageIndex].text);
        messageIndex++;
      }
    }, 800);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();
      if (response.ok) {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setProgress(100);
        setLoadingMessage("Analysis complete!");
        setTimeout(() => {
          setResult(data);
          setLoading(false);
          if (onAnalysisComplete) {
            onAnalysisComplete();
          }
        }, 500);
      } else {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setError(data.error || "Something went wrong");
        setLoading(false);
        if (onAnalysisError) {
          onAnalysisError();
        }
      }
    } catch (err) {
      console.error("Request error:", err);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setError(err instanceof Error ? err.message : "Failed to send request");
      setLoading(false);
      if (onAnalysisError) {
        onAnalysisError();
      }
    }
  };

  useEffect(() => {
    if (initialResult) {
      if (initialResult.error) {
        setError(initialResult.error);
        setLoading(false);
      } else {
        setResult(initialResult);
        setLoading(false);
      }
    }
  }, [initialResult]);

  useEffect(() => {
    if (!isOpen || !image || initialResult) return;
    analyzeImage();

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, image, initialResult]);

  const handleSaveMeal = async () => {
    if (!result || saved || result.id) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/meals/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: result.title,
          image_url: image,
          detected_ingredients: result.detected_ingredients || [],
          mood_score: result.mood_score,
          mental_clarity_score: result.mental_clarity_score,
          energy_score: result.energy_score,
          digestion_score: result.digestion_score,
          gut_score: result.gut_score,
          mental_score: result.mental_score,
          overall_score: result.overall_score,
          short_verdict: result.short_verdict,
          wellness_insights: result.wellness_insights || null,
          gut_insights: result.gut_insights,
          mental_insights: result.mental_insights,
          reasons: result.reasons || [],
          alternatives: result.alternatives || [],
          personalized_insights: result.personalized_insights || null,
        }),
      });

      let data;
      try {
        const responseText = await response.text();
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setError("Invalid response from server");
        return;
      }
      
      if (response.ok) {
        setSaved(true);
        setResult({ ...result, id: data.id || data.meal?.id });
        onAnalysisComplete();
      } else {
        if (response.status === 409) {
          setSaved(true);
          setResult({ ...result, id: data.id });
        } else {
          const errorMessage = data.error || data.details || `Failed to save meal (${response.status})`;
          setError(errorMessage);
        }
      }
    } catch (err) {
      console.error("Error saving meal:", err);
      setError("Failed to save meal. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (result?.id || saved) {
      onAnalysisComplete();
    }
    setResult(null);
    setError(null);
    setSaved(false);
    setSaving(false);
    onClose();
  };

  const handleViewDetails = () => {
    if (result?.id) {
      router.push(`/meals/${result.id}`);
      handleClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={(open) => !open && !saving && !loading && handleClose()}
      className="!max-w-2xl dark:!bg-gray-800"
      header={loading ? {
        title: "Analyzing Your Meal",
        closeButton: false,
      } : error ? {
        title: "Analysis Error",
        closeButton: true,
      } : {
        title: "",
        closeButton: false,
      }}
      body={{
        children: (
          <div className="max-h-[85vh] overflow-y-auto hide-scrollbar bg-white dark:bg-gray-800">
            {loading && (
              <div className="space-y-6 p-8">
                <div className="flex flex-col items-center mb-8">
                  {/* Animated Icon */}
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-green-500/20"></div>
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500/10">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Main Message */}
                  <motion.div
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                      {loadingMessage}
                    </h2>
                  </motion.div>
                  
                  {/* Sub Message */}
                  <p className="text-sm mb-8 text-gray-600 dark:text-gray-400">
                    Our AI is carefully examining your meal
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{progress}%</p>
                  </div>
                  <Progress value={progress} max={100} className="h-3 brand-progress" />
                  
                  {/* Helpful Tips */}
                  <div className="mt-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          We're analyzing how this meal affects your gut health, mood, energy, and mental clarity.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center p-8">
                <p className="text-4xl mb-4">⚠️</p>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Analysis Failed</h3>
                <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">{error}</p>
                <Button
                  onClick={() => {
                    setError(null);
                    analyzeImage();
                  }}
                  variant="solid"
                  size="4"
                >
                  Try Again
                </Button>
              </div>
            )}

            {result && !loading && !error && (
              <div className="space-y-6">
                {/* Header with Back and Share Buttons */}
                <div className="flex items-center justify-between px-6 pt-4">
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {result.title || "Meal Analysis"}
                  </h2>
                  <button
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                </div>

                {/* Meal Image with Score Badge in Bottom Right */}
                {image && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative px-6"
                  >
                    <img
                      src={image}
                      alt={result.title || "Meal"}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                    {result.overall_score !== undefined && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="absolute bottom-4 right-10 px-4 py-2 rounded-xl text-lg font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md bg-green-500 text-white"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>{result.overall_score}%</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Detected Ingredients */}
                {result.detected_ingredients && result.detected_ingredients.length > 0 && (
                  <div className="px-6">
                    <h3 className="text-sm font-semibold mb-3 text-gray-900 dark:text-gray-100">Detected Ingredients</h3>
                    <div className="flex flex-wrap gap-2">
                      {result.detected_ingredients.slice(0, 6).map((ingredient: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Wellness Impact Scores */}
                <div className="px-6 pb-6">
                  <h3 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">Wellness Impact Scores</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.mood_score !== undefined && (
                      <StatCard
                        title="Mood"
                        value={result.mood_score}
                        icon="😊"
                        index={0}
                      />
                    )}
                    {result.mental_clarity_score !== undefined && (
                      <StatCard
                        title="Mental Clarity"
                        value={result.mental_clarity_score}
                        icon="🧠"
                        index={1}
                      />
                    )}
                    {result.energy_score !== undefined && (
                      <StatCard
                        title="Energy"
                        value={result.energy_score}
                        icon="⚡"
                        index={2}
                      />
                    )}
                    {result.digestion_score !== undefined && (
                      <StatCard
                        title="Digestion"
                        value={result.digestion_score}
                        icon="❤️"
                        index={3}
                      />
                    )}
                  </div>
                </div>

                {/* Wellness Category Insights - Always visible */}
                {result.wellness_insights && (
                  <div className="px-6 space-y-4 pb-4">
                    {/* Mood Insight */}
                    {result.mood_score !== undefined && result.wellness_insights.mood_insight && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">😊</span>
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Mood Insight</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 pl-7">{result.wellness_insights.mood_insight}</p>
                      </div>
                    )}

                    {/* Mental Clarity Insight */}
                    {result.mental_clarity_score !== undefined && result.wellness_insights.mental_clarity_insight && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🧠</span>
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Mental Clarity Insight</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 pl-7">{result.wellness_insights.mental_clarity_insight}</p>
                      </div>
                    )}

                    {/* Energy Insight */}
                    {result.energy_score !== undefined && result.wellness_insights.energy_insight && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">⚡</span>
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Energy Insight</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 pl-7">{result.wellness_insights.energy_insight}</p>
                      </div>
                    )}

                    {/* Digestion Insight */}
                    {result.digestion_score !== undefined && result.wellness_insights.digestion_insight && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">❤️</span>
                          <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">Digestion Insight</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 pl-7">{result.wellness_insights.digestion_insight}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="px-6 pb-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex flex-col gap-3">
                    {result.id ? (
                      <Button
                        onClick={handleViewDetails}
                        variant="solid"
                        size="4"
                        className="w-full justify-center font-semibold"
                      >
                        View Details
                      </Button>
                    ) : saved ? (
                      <Button
                        disabled
                        variant="soft"
                        size="4"
                        className="w-full justify-center font-semibold"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Saved
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSaveMeal}
                        disabled={saving}
                        variant="solid"
                        size="4"
                        className="w-full justify-center font-semibold"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          "Save Meal"
                        )}
                      </Button>
                    )}
                    <Button
                      onClick={handleClose}
                      variant="soft"
                      size="4"
                      className="w-full justify-center font-semibold"
                    >
                      {result.id || saved ? "Done" : "Close"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ),
      }}
    />
  );
}


