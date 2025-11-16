"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Meal {
  id: string;
  title: string;
  image_url: string;
  overall_score: number;
  created_at: string;
}

type SortOption = "date-newest" | "date-oldest" | "score-high" | "score-low";

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("date-newest");
  const router = useRouter();

  useEffect(() => {
    fetchMeals();
  }, []);

  async function fetchMeals() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/meals");
      const data = await response.json();

      if (response.ok) {
        console.log("Meals fetched:", data.meals?.length || 0, "meals");
        console.log("Meals data:", data);
        setMeals(data.meals || []);
        if (data.message) {
          console.warn("API message:", data.message);
        }
      } else {
        console.error("Failed to fetch meals:", data);
        setError(data.error || data.details || "Failed to load meals");
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  const sortedMeals = [...meals].sort((a, b) => {
    switch (sortBy) {
      case "date-newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "date-oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case "score-high":
        return (b.overall_score || 0) - (a.overall_score || 0);
      case "score-low":
        return (a.overall_score || 0) - (b.overall_score || 0);
      default:
        return 0;
    }
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "date-newest":
        return "Date (Newest)";
      case "date-oldest":
        return "Date (Oldest)";
      case "score-high":
        return "Score (Highest)";
      case "score-low":
        return "Score (Lowest)";
      default:
        return "Date (Newest)";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-a1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-3 text-gray-10">Loading meals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-a1">
      {/* Header */}
      <div className="bg-white border-b border-gray-a4 px-4 py-4 flex items-center justify-center relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2"
        >
          <svg className="w-6 h-6 text-gray-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-7 font-bold text-gray-12">Your Meal History</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Sort Button */}
        <button
          onClick={() => {
            const options: SortOption[] = ["date-newest", "date-oldest", "score-high", "score-low"];
            const currentIndex = options.indexOf(sortBy);
            const nextIndex = (currentIndex + 1) % options.length;
            setSortBy(options[nextIndex]);
          }}
          className="w-full bg-white rounded-xl px-4 py-3 border border-gray-a4 flex items-center gap-3"
        >
          <svg className="w-5 h-5 text-gray-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span className="text-3 text-gray-12 flex-1 text-left">Sort by: {getSortLabel()}</span>
        </button>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-3 text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && meals.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-gray-a4 text-center">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-6 font-bold text-gray-12 mb-2">No meals yet</h2>
            <p className="text-3 text-gray-10 mb-6">
              Start analyzing meals to see them here!
            </p>
            <div className="flex gap-3 justify-center">
                  <Link href="/dashboard">
                    <button className="bg-secondary text-white px-6 py-3 rounded-lg text-4 font-semibold">
                      Go to Dashboard
                    </button>
                  </Link>
              <button
                onClick={fetchMeals}
                className="bg-gray-a2 text-gray-12 px-6 py-3 rounded-lg text-4 font-semibold border border-gray-a4"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        {/* Meal List */}
        {meals.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-3 text-gray-10">
                {meals.length} {meals.length === 1 ? 'meal' : 'meals'} found
              </p>
              <button
                onClick={fetchMeals}
                className="text-3 text-secondary hover:underline"
              >
                Refresh
              </button>
            </div>
            {sortedMeals.map((meal) => (
              <Link
                key={meal.id}
                href={`/meals/${meal.id}`}
                className="block bg-white rounded-xl p-4 border border-gray-a4 flex items-center gap-4 active:bg-gray-a2 transition-colors"
              >
                {/* Meal Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-a2">
                  {meal.image_url ? (
                    <img
                      src={meal.image_url}
                      alt={meal.title || "Meal"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      🍽️
                    </div>
                  )}
                </div>

                {/* Meal Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-4 font-bold text-gray-12 truncate mb-1">
                    {meal.title || "Untitled Meal"}
                  </h3>
                  <p className="text-2 text-gray-10">
                    {formatDate(meal.created_at)}
                  </p>
                </div>

                {/* Score and Arrow */}
                <div className="flex items-center gap-3">
                  <span className="text-4 font-bold text-gray-12">
                    {meal.overall_score || 0}/100
                  </span>
                  <svg className="w-5 h-5 text-gray-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

