"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@whop/react/components";

interface PersonalizedInsight {
  type: "Gut" | "Mind" | "Balance";
  message: string;
}

interface MealDetails {
  id: string;
  title: string;
  image_url: string;
  detected_ingredients?: string[];
  mood_score?: number;
  mental_clarity_score?: number;
  energy_score?: number;
  digestion_score?: number;
  gut_score?: number;
  mental_score?: number;
  overall_score?: number;
  short_verdict?: string;
  gut_insights?: Record<string, string>;
  mental_insights?: Record<string, string>;
  reasons?: string[];
  alternatives?: string[];
  personalized_insights?: {
    insights: PersonalizedInsight[];
  };
  created_at: string;
}

export default function MealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<MealDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gutInsightsOpen, setGutInsightsOpen] = useState(true);
  const [mentalInsightsOpen, setMentalInsightsOpen] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchMeal(params.id as string);
    }
  }, [params.id]);

  async function fetchMeal(mealId: string) {
    try {
      setLoading(true);
      const response = await fetch("/api/meals");
      
      if (response.ok) {
        const data = await response.json();
        const foundMeal = data.meals?.find((m: MealDetails) => m.id === mealId);
        
        if (foundMeal) {
          setMeal(foundMeal);
        } else {
          setError("Meal not found");
        }
      } else {
        setError("Failed to load meal");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-a1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-3 text-gray-10">Loading meal...</p>
        </div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="min-h-screen bg-gray-a1 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-6 font-bold text-gray-12 mb-4">Meal Not Found</h2>
          <p className="text-3 text-gray-10 mb-6">{error || "This meal doesn't exist"}</p>
          <Button onClick={() => router.push("/meals")} variant="classic" size="4">
            Back to Meal History
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative">
        {meal.image_url && (
          <img
            src={meal.image_url}
            alt={meal.title || "Meal"}
            className="w-full h-80 object-cover"
          />
        )}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        {meal.overall_score !== undefined && (
          <div className="absolute top-4 right-4 bg-secondary text-white px-3 py-1 rounded-lg text-3 font-bold">
            ★ {meal.overall_score}%
          </div>
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Meal Title */}
        {meal.title && (
          <div className="bg-gradient-to-r from-gray-a2 to-gray-a3 rounded-2xl p-6 border border-gray-a4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🍽️</span>
              </div>
              <div className="flex-1">
                <h2 className="text-7 font-bold text-gray-12 leading-tight">{meal.title}</h2>
                {meal.overall_score !== undefined && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-3 text-gray-10">Overall Score:</span>
                    <span className="text-4 font-bold text-secondary">{meal.overall_score}/100</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Wellness Impact Scores */}
        {(meal.mood_score !== undefined || meal.mental_clarity_score !== undefined || 
          meal.energy_score !== undefined || meal.digestion_score !== undefined) && (
          <div className="bg-gray-a1 -mx-4 px-4 py-6">
            <h3 className="text-6 font-bold text-gray-12 mb-4">Wellness Impact Scores</h3>
            <div className="grid grid-cols-2 gap-4">
              {meal.mood_score !== undefined && (
                <div className="bg-white rounded-2xl p-4 border border-gray-a4 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-2">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-a3" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke="currentColor" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (meal.mood_score || 0) / 100)}`}
                        className="text-orange-500" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl text-orange-500 mb-1">😊</span>
                      <span className="text-3 font-bold text-gray-12">{meal.mood_score}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3 font-semibold text-gray-12">Mood</p>
                    <p className="text-2 text-gray-10">
                      {meal.mood_score >= 80 ? 'Excellent' : meal.mood_score >= 60 ? 'Good' : 'Fair'}
                    </p>
                  </div>
                </div>
              )}

              {meal.mental_clarity_score !== undefined && (
                <div className="bg-white rounded-2xl p-4 border border-gray-a4 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-2">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-a3" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke="currentColor" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (meal.mental_clarity_score || 0) / 100)}`}
                        className="text-teal-500" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl text-teal-500 mb-1">🧠</span>
                      <span className="text-3 font-bold text-gray-12">{meal.mental_clarity_score}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3 font-semibold text-gray-12">Mental Clarity</p>
                    <p className="text-2 text-gray-10">
                      {meal.mental_clarity_score >= 80 ? 'Excellent' : meal.mental_clarity_score >= 60 ? 'Good' : 'Fair'}
                    </p>
                  </div>
                </div>
              )}

              {meal.energy_score !== undefined && (
                <div className="bg-white rounded-2xl p-4 border border-gray-a4 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-2">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-a3" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke="currentColor" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (meal.energy_score || 0) / 100)}`}
                        className="text-yellow-500" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl text-yellow-500 mb-1">⚡</span>
                      <span className="text-3 font-bold text-gray-12">{meal.energy_score}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3 font-semibold text-gray-12">Energy</p>
                    <p className="text-2 text-gray-10">
                      {meal.energy_score >= 80 ? 'Excellent' : meal.energy_score >= 60 ? 'Good' : 'Fair'}
                    </p>
                  </div>
                </div>
              )}

              {meal.digestion_score !== undefined && (
                <div className="bg-white rounded-2xl p-4 border border-gray-a4 flex flex-col items-center">
                  <div className="relative w-24 h-24 mb-2">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-a3" />
                      <circle
                        cx="48" cy="48" r="40"
                        stroke="currentColor" strokeWidth="8" fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - (meal.digestion_score || 0) / 100)}`}
                        className="text-secondary" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl text-secondary mb-1">❤️</span>
                      <span className="text-3 font-bold text-gray-12">{meal.digestion_score}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-3 font-semibold text-gray-12">Digestion</p>
                    <p className="text-2 text-gray-10">
                      {meal.digestion_score >= 80 ? 'Excellent' : meal.digestion_score >= 60 ? 'Good' : 'Fair'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Personalized Insights Cards */}
        {meal.personalized_insights?.insights && meal.personalized_insights.insights.length > 0 && (
          <div className="mb-6 space-y-3">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Personalized Insights</h3>
            {meal.personalized_insights.insights.map((insight, index) => {
              const getCardStyle = () => {
                switch (insight.type) {
                  case "Gut":
                    return "bg-green-50 border-green-200";
                  case "Mind":
                    return "bg-blue-50 border-blue-200";
                  case "Balance":
                    return "bg-purple-50 border-purple-200";
                  default:
                    return "bg-gray-50 border-gray-200";
                }
              };

              const getIcon = () => {
                switch (insight.type) {
                  case "Gut":
                    return "🦠";
                  case "Mind":
                    return "🧠";
                  case "Balance":
                    return "⚖️";
                  default:
                    return "💡";
                }
              };

              return (
                <div
                  key={index}
                  className={`${getCardStyle()} rounded-xl p-4 border`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{getIcon()}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{insight.type} Insight</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{insight.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gut and Mental Insights */}
        <div className="space-y-4">
          {meal.gut_insights && (
            <div className="bg-white rounded-2xl p-4 border border-gray-a4">
              <button
                onClick={() => setGutInsightsOpen(!gutInsightsOpen)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🦠</span>
                  <span className="text-4 font-bold text-gray-12">Gut Insights</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-10 transition-transform ${gutInsightsOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {gutInsightsOpen && (
                <div className="mt-4 space-y-2">
                  {Object.entries(meal.gut_insights).slice(0, 3).map(([k, v], idx) => (
                    <div key={k} className="flex items-start gap-2">
                      <span className="text-secondary text-lg mt-0.5 flex-shrink-0">✓</span>
                      <p className="text-3 text-gray-10">{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {meal.mental_insights && (
            <div className="bg-white rounded-2xl p-4 border border-gray-a4">
              <button
                onClick={() => setMentalInsightsOpen(!mentalInsightsOpen)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">🧠</span>
                  <span className="text-4 font-bold text-gray-12">Mental Insights</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-10 transition-transform ${mentalInsightsOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mentalInsightsOpen && (
                <div className="mt-4 space-y-2">
                  {Object.entries(meal.mental_insights).slice(0, 2).map(([k, v], idx) => (
                    <div key={k} className="flex items-start gap-2">
                      <span className="text-secondary text-lg mt-0.5 flex-shrink-0">✓</span>
                      <p className="text-3 text-gray-10">{v}</p>
                    </div>
                  ))}
                  {Object.entries(meal.mental_insights).slice(2, 3).map(([k, v], idx) => (
                    <div key={k} className="flex items-start gap-2">
                      <span className="text-yellow-500 text-lg mt-0.5 flex-shrink-0">⚠</span>
                      <p className="text-3 text-gray-10">{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button
            onClick={() => router.push("/dashboard")}
            variant="classic"
            size="4"
            className="w-full bg-secondary hover:bg-green-600"
          >
                Back to Dashboard
          </Button>
          <Button
            onClick={() => router.push("/meals")}
            variant="ghost"
            size="4"
            className="w-full border-secondary text-secondary hover:bg-green-50"
          >
            Back to Meal History
          </Button>
        </div>
      </div>
    </div>
  );
}

