"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
  initialResult?: any; // Pre-computed result to display
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
  const [gutInsightsOpen, setGutInsightsOpen] = useState(true);
  const [mentalInsightsOpen, setMentalInsightsOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing your meal...");
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Analyze image function
  const analyzeImage = async () => {
    if (!image) return;

    // Clear any existing interval
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
    
    // Notify parent that analysis has started
    if (onAnalysisStart) {
      onAnalysisStart();
    }

    // Progress simulation with messages
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
    }, 800); // Update every 800ms

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
        // Small delay to show 100% before showing results
        setTimeout(() => {
          setResult(data);
          setLoading(false);
          // Notify parent that analysis is complete
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

  // If we have initialResult, use it instead of analyzing
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

  // Auto-analyze when image is provided (only if no initialResult)
  useEffect(() => {
    if (!isOpen || !image || initialResult) return;
    analyzeImage();

    // Cleanup on unmount
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
      return; // Already saved or no result
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
        console.log("Save meal raw response:", responseText, "Status:", response.status);
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        setError("Invalid response from server");
        return;
      }
      
      if (response.ok) {
        setSaved(true);
        // Update result with saved ID
        setResult({ ...result, id: data.id || data.meal?.id });
        // Refresh dashboard immediately after saving
        onAnalysisComplete();
        console.log("Meal saved successfully with ID:", data.id || data.meal?.id);
        if (data.warning) {
          console.warn("Warning:", data.warning);
        }
      } else {
        console.error("Save meal failed:", data);
        console.error("Response status:", response.status);
        if (response.status === 409) {
          // Already saved
          setSaved(true);
          setResult({ ...result, id: data.id });
          console.log("Meal already saved with ID:", data.id);
        } else {
          const errorMessage = data.error || data.details || `Failed to save meal (${response.status})`;
          setError(errorMessage);
          console.error("Error details:", data);
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
    // Only refresh dashboard if meal was saved
    if (result?.id || saved) {
      onAnalysisComplete();
    }
    // Reset state
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
        onClick={(e) => {
          // Only close on backdrop click if not saving
          if (!saving && !loading) {
            handleClose();
          }
        }}
      >
        <div className="min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            style={{
              background: "linear-gradient(to bottom, #FFFFFF, #F9FFFB)",
            }}
          >
            {loading && (
              <div className="p-12">
                <div className="text-center mb-8">
                  {/* Animated Icon */}
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-secondary border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Main Message */}
                  <motion.p
                    key={loadingMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-gray-900 mb-3"
                  >
                    {loadingMessage}
                  </motion.p>
                  
                  {/* Sub Message */}
                  <p className="text-sm text-gray-600 mb-8">
                    Our AI is carefully examining your meal
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-semibold text-secondary">{progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-secondary to-green-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  
                  {/* Helpful Tips */}
                  <div className="mt-6 space-y-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100"
                    >
                      <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-700">
                        We're analyzing how this meal affects your gut health, mood, energy, and mental clarity.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-8 text-center">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <p className="text-lg font-semibold text-gray-900 mb-2">Analysis Failed</p>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    analyzeImage();
                  }}
                  className="bg-secondary hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {result && !loading && !error && (
              <div className="p-6" style={{ background: "linear-gradient(to bottom, #FFFFFF, #F9FFFB)" }}>
                {/* Meal Image with Gradient Background */}
                {image && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-6 rounded-xl overflow-hidden shadow-lg"
                    style={{
                      background: "linear-gradient(to bottom, #E9F8EE, #FFFFFF)",
                    }}
                  >
                    <img
                      src={image}
                      alt={result.title || "Meal"}
                      className="w-full h-64 object-cover"
                    />
                    {result.overall_score !== undefined && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className={`absolute top-6 right-6 text-white px-6 py-3 rounded-2xl text-xl font-bold flex items-center gap-3 shadow-2xl backdrop-blur-sm ${
                          result.overall_score >= 75
                            ? "bg-green-500/95"
                            : result.overall_score >= 50
                              ? "bg-yellow-500/95"
                              : "bg-red-500/95"
                        }`}
                        style={{
                          animation:
                            result.overall_score < 40 || result.overall_score > 75
                              ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                              : undefined,
                          border: "2px solid rgba(255, 255, 255, 0.3)",
                        }}
                      >
                        {result.overall_score >= 75 ? (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        <span className="text-2xl">{result.overall_score}%</span>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Meal Title */}
                {result.title && (
                  <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
                  </div>
                )}

                {/* Summary Box */}
                {result.short_verdict && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6 rounded-xl p-4 shadow-sm border border-yellow-200/50"
                    style={{
                      background: "linear-gradient(to bottom right, #FEF3C7, #FDE68A)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">💡</div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          How This Meal Affects You Today
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">{result.short_verdict}</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Nutrient Impact Grid */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Nutrient Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.mood_score !== undefined && (
                      <StatCard
                        title="Mood"
                        value={result.mood_score}
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        }
                        index={0}
                      />
                    )}
                    {result.mental_clarity_score !== undefined && (
                      <StatCard
                        title="Focus"
                        value={result.mental_clarity_score}
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        }
                        index={1}
                      />
                    )}
                    {result.energy_score !== undefined && (
                      <StatCard
                        title="Energy"
                        value={result.energy_score}
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        }
                        index={2}
                      />
                    )}
                    {result.digestion_score !== undefined && (
                      <StatCard
                        title="Digestion"
                        value={result.digestion_score}
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        }
                        index={3}
                      />
                    )}
                  </div>
                </div>

                {/* Personalized Insights Cards */}
                {result.personalized_insights?.insights && result.personalized_insights.insights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Personalized Insights</h3>
                    <div className="space-y-3">
                      {result.personalized_insights.insights.map((insight, index) => (
                        <MealInsightCard
                          key={index}
                          type={insight.type}
                          message={insight.message}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Detailed Insights (Collapsible) */}
                {result.gut_insights && (
                  <div 
                    className="rounded-xl p-4 mb-4 border border-green-300/50"
                    style={{
                      background: "linear-gradient(to bottom right, #D1FAE5, #A7F3D0)",
                    }}
                  >
                    <button
                      onClick={() => setGutInsightsOpen(!gutInsightsOpen)}
                      className="w-full flex items-center justify-between mb-2"
                    >
                      <h3 className="font-semibold text-gray-900">🦠 Detailed Gut Insights</h3>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${gutInsightsOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {gutInsightsOpen && (
                      <div className="space-y-2 text-sm text-gray-700">
                        {Object.entries(result.gut_insights).slice(0, 3).map(([k, v]) => (
                          <p key={k}>• {v}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {result.mental_insights && (
                  <div 
                    className="rounded-xl p-4 mb-6 border border-blue-300/50"
                    style={{
                      background: "linear-gradient(to bottom right, #DBEAFE, #BFDBFE)",
                    }}
                  >
                    <button
                      onClick={() => setMentalInsightsOpen(!mentalInsightsOpen)}
                      className="w-full flex items-center justify-between mb-2"
                    >
                      <h3 className="font-semibold text-gray-900">🧠 Detailed Mental Insights</h3>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${mentalInsightsOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mentalInsightsOpen && (
                      <div className="space-y-2 text-sm text-gray-700">
                        {Object.entries(result.mental_insights).slice(0, 3).map(([k, v]) => (
                          <p key={k}>• {v}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Better Choice Recommendation */}
                {result.alternatives && result.alternatives.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mb-6 rounded-xl p-4 border border-green-300/50 shadow-sm"
                    style={{
                      background: "linear-gradient(to bottom right, #D1FAE5, #A7F3D0)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">🍎</div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Try This Next Time</h3>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                          {result.alternatives[0]}
                        </p>
                        {result.overall_score !== undefined && result.overall_score < 70 && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-green-700 font-medium">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>Could improve your score by +{Math.round((70 - result.overall_score) * 0.3)} points</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  {result.id ? (
                    <button
                      onClick={handleViewDetails}
                      className="flex-1 bg-secondary hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors"
                    >
                      View Details
                    </button>
                  ) : saved ? (
                    <button
                      disabled
                      className="flex-1 bg-green-100 text-green-700 py-3 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Saved
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveMeal}
                      disabled={saving}
                      className="flex-1 bg-secondary hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Save Meal
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-xl font-semibold transition-colors"
                  >
                    {result.id || saved ? "Done" : "Close"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

