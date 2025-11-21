"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@whop/react/components";
import Link from "next/link";

type Analysis = {
  id?: string; // Database ID if saved
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
} | null;

export default function AnalyzePage() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<Analysis>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gutInsightsOpen, setGutInsightsOpen] = useState(true);
  const [mentalInsightsOpen, setMentalInsightsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if onboarding is completed, redirect if not
  useEffect(() => {
    const completed = localStorage.getItem("onboarding_completed");
    if (completed !== "true") {
      router.push("/onboarding");
    }
  }, [router]);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImage(base64);
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: base64 }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log("API Response:", data);
          console.log("Detected ingredients:", data.detected_ingredients);
          setResult(data);
        } else {
          setError(data.error || "Something went wrong");
        }
      } catch (err) {
        console.error("Request error:", err);
        setError(err instanceof Error ? err.message : "Failed to send request. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleScanButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getScoreMeta = (score?: number) => {
    const value = score ?? 0;
    if (value >= 70) return { label: "Good", color: "#3AB368" };
    if (value >= 50) return { label: "Fair", color: "#F5A623" };
    return { label: "Poor", color: "#E57373" };
  };

  const circleTrackColor = "rgba(148, 163, 184, 0.35)";

  // If we have results, show them. Otherwise show the home screen.
  if (result || loading || error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
        {loading && (
          <div className="text-center">
            <p className="text-green-600 text-lg mb-4">Analyzing your meal...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        )}
        {error && (
          <div className="text-center max-w-md">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setResult(null);
                setImage(null);
              }}
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
            >
              Try Again
            </button>
          </div>
        )}
        {result && (
          <div className="w-full max-w-2xl mx-auto bg-white min-h-screen">
            {/* Meal Image with Overlay Buttons and Score Badge */}
            {image && (
              <div className="relative">
                <img
                  src={image}
                  alt={result.title || "Meal"}
                  className="w-full h-80 object-cover"
                />
                {/* Back Button */}
                <button
                  onClick={() => {
                    setResult(null);
                    setImage(null);
                    setError(null);
                  }}
                  className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <svg className="w-6 h-6 text-gray-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {/* Share Button */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                {/* Score Badge */}
                {result.overall_score !== undefined && (
                  <div className="absolute top-4 right-20 bg-secondary text-white px-3 py-1 rounded-lg text-3 font-bold">
                    ★ {result.overall_score}%
                  </div>
                )}
              </div>
            )}

            <div className="p-4 space-y-6">
              {/* Meal Title - Enhanced */}
              {result.title && (
                <div className="bg-gradient-to-r from-gray-a2 to-gray-a3 rounded-2xl p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <div className="flex-1">
                      <h2 className="text-7 font-bold text-gray-12 leading-tight">{result.title}</h2>
                      {result.overall_score !== undefined && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-3 text-gray-10">Overall Score:</span>
                          <span className="text-4 font-bold text-secondary">{result.overall_score}/100</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Wellness Impact Scores */}
              <div className="bg-gray-a1 -mx-4 px-4 py-6">
                <h3 className="text-6 font-bold text-gray-12 mb-4">Wellness Impact Scores</h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Mood Score */}
                  {result.mood_score !== undefined && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-600 flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-a3"
                            style={{ color: circleTrackColor }}
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={getScoreMeta(result.mood_score).color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - (result.mood_score || 0) / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl mb-1" style={{ color: getScoreMeta(result.mood_score).color }}>😊</span>
                          <span className="text-3 font-bold text-gray-12">{result.mood_score}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-3 font-semibold text-gray-12">Mood</p>
                        <p className="text-2 text-gray-10">
                          {getScoreMeta(result.mood_score).label}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Mental Clarity Score */}
                  {result.mental_clarity_score !== undefined && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-600 flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-a3"
                            style={{ color: circleTrackColor }}
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={getScoreMeta(result.mental_clarity_score).color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - (result.mental_clarity_score || 0) / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl mb-1" style={{ color: getScoreMeta(result.mental_clarity_score).color }}>🧠</span>
                          <span className="text-3 font-bold text-gray-12">{result.mental_clarity_score}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-3 font-semibold text-gray-12">Mental Clarity</p>
                        <p className="text-2 text-gray-10">
                          {getScoreMeta(result.mental_clarity_score).label}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Energy Score */}
                  {result.energy_score !== undefined && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-600 flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-a3"
                            style={{ color: circleTrackColor }}
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={getScoreMeta(result.energy_score).color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - (result.energy_score || 0) / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl mb-1" style={{ color: getScoreMeta(result.energy_score).color }}>⚡</span>
                          <span className="text-3 font-bold text-gray-12">{result.energy_score}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-3 font-semibold text-gray-12">Energy</p>
                        <p className="text-2 text-gray-10">
                          {getScoreMeta(result.energy_score).label}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Digestion Score */}
                  {result.digestion_score !== undefined && (
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-600 flex flex-col items-center">
                      <div className="relative w-24 h-24 mb-2">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-a3"
                            style={{ color: circleTrackColor }}
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke={getScoreMeta(result.digestion_score).color}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - (result.digestion_score || 0) / 100)}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl mb-1" style={{ color: getScoreMeta(result.digestion_score).color }}>❤️</span>
                          <span className="text-3 font-bold text-gray-12">{result.digestion_score}%</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-3 font-semibold text-gray-12">Digestion</p>
                        <p className="text-2 text-gray-10">
                          {getScoreMeta(result.digestion_score).label}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gut and Mental Insights */}
              <div className="space-y-4">
                {/* Gut Insights */}
                {result.gut_insights && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-600 mb-3">
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
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {gutInsightsOpen && (
                      <div className="mt-4 space-y-2">
                        {Object.entries(result.gut_insights).slice(0, 3).map(([k, v], idx) => (
                          <div key={k} className="flex items-start gap-2">
                            <span className="text-secondary text-lg mt-0.5 flex-shrink-0">✓</span>
                            <p className="text-3 text-gray-10">{v}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Mental Insights */}
                {result.mental_insights && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-200 dark:border-gray-600">
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
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mentalInsightsOpen && (
                      <div className="mt-4 space-y-2">
                        {Object.entries(result.mental_insights).slice(0, 2).map(([k, v], idx) => (
                          <div key={k} className="flex items-start gap-2">
                            <span className="text-secondary text-lg mt-0.5 flex-shrink-0">✓</span>
                            <p className="text-3 text-gray-10">{v}</p>
                          </div>
                        ))}
                        {Object.entries(result.mental_insights).slice(2, 3).map(([k, v], idx) => (
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

              {/* Healthier Alternatives */}
              {result.alternatives && result.alternatives.length > 0 && (
                <div className="bg-secondary rounded-2xl p-4">
                  <h4 className="text-4 font-bold text-white mb-3">Healthier Alternatives</h4>
                  <div className="space-y-2">
                    {result.alternatives.map((alt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                        </svg>
                        <p className="text-3 text-white">{alt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pb-6">
                <Button
                  className="w-full bg-secondary hover:bg-green-600"
                  onClick={() => {
                    if (result.id) {
                      router.push(`/meals/${result.id}`);
                    } else {
                      // Meal is already saved automatically, just show confirmation
                      alert("Meal saved! You can view it in your meal history.");
                    }
                  }}
                >
                  {result.id ? "View Saved Meal" : "Save This Meal"}
                </Button>
                <Button
                  onClick={() => {
                    setResult(null);
                    setImage(null);
                    setError(null);
                  }}
                  className="w-full border-secondary text-secondary hover:bg-green-50"
                >
                  Scan Another Meal
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Home screen matching the screenshot - using Whop design system
  return (
    <div className="min-h-screen bg-gray-a1 flex flex-col items-center justify-center relative overflow-hidden p-8">
      {/* Decorative corner placeholders */}
      <div className="absolute top-4 left-4 w-12 h-12 bg-gray-a3 rounded-lg opacity-50"></div>
      <div className="absolute top-4 right-4 w-12 h-12 bg-gray-a3 rounded-full opacity-50"></div>
      <div className="absolute bottom-4 left-4 w-12 h-12 bg-gray-a3 rounded-lg opacity-50 flex items-center justify-center">
        <span className="text-gray-12 font-bold">N</span>
      </div>
      <div className="absolute bottom-4 right-4 w-12 h-12 bg-gray-a3 rounded-lg opacity-50"></div>

      {/* Top logo/icon */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <svg className="w-6 h-6 text-gray-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center justify-center text-center z-10 max-w-md w-full">
        {/* Greeting */}
        <h2 className="text-9 font-bold text-gray-12 mb-8 mt-20">
          Hi David <span className="inline-block">👋</span>
        </h2>

        {/* Headline */}
        <h1 className="text-9 font-bold text-gray-12 mb-6 leading-tight">
          Your Gut & Mind,<br />In Sync
        </h1>

        {/* Description */}
        <p className="text-3 text-gray-10 mb-8 leading-relaxed">
          Scan your meal to see how it affects<br />your digestion, focus, and mood.
        </p>

        {/* Scan Button - using Whop Button component */}
        <div className="w-full max-w-sm mb-4">
          <Button
            onClick={handleScanButtonClick}
            className="w-full flex items-center justify-center gap-2"
          >
            Scan Your Meal
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Secondary link */}
        <Link href="/meals" className="text-3 text-gray-10 underline mb-12">
          View My Past Meals →
        </Link>

        {/* Footer */}
        <p className="text-2 text-gray-10">
          Learn what your food is saying to your body.
        </p>
      </div>
    </div>
  );
}
