import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getOpenAI } from "@/app/lib/openai";

/**
 * POST /api/insights - Generate personalized insights based on user's meal history
 */
export async function POST(req: Request) {
  try {
    // Verify user is authenticated through Whop
    const { isAuthenticated, userId } = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Fetch all meals for this user
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    const { data: meals, error: mealsError } = await supabase
      .from("meals")
      .select("*")
      .eq("whop_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50); // Get last 50 meals for context

    if (mealsError) {
      console.error("Error fetching meals:", mealsError);
      return NextResponse.json(
        { error: "Failed to fetch meals" },
        { status: 500 }
      );
    }

    if (!meals || meals.length === 0) {
      return NextResponse.json({
        insights: [
          {
            icon: "💡",
            message: "Keep tracking your meals to see personalized insights!",
            impactColor: "bg-blue-50",
          },
        ],
      });
    }

    // Prepare meal data for AI analysis
    const mealSummary = meals.map((meal) => ({
      title: meal.title,
      date: meal.created_at,
      gut_score: meal.gut_score || 0,
      mental_score: meal.mental_score || 0,
      overall_score: meal.overall_score || 0,
      mood_score: meal.mood_score || 0,
      mental_clarity_score: meal.mental_clarity_score || 0,
      energy_score: meal.energy_score || 0,
      digestion_score: meal.digestion_score || 0,
      detected_ingredients: meal.detected_ingredients || [],
    }));

    // Calculate recent trends (last 7 days vs previous 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentMeals = mealSummary.filter(
      (m) => new Date(m.date) >= sevenDaysAgo
    );
    const previousMeals = mealSummary.filter(
      (m) => new Date(m.date) >= fourteenDaysAgo && new Date(m.date) < sevenDaysAgo
    );

    const recentAvgGut =
      recentMeals.length > 0
        ? recentMeals.reduce((sum, m) => sum + m.gut_score, 0) /
          recentMeals.length
        : 0;
    const previousAvgGut =
      previousMeals.length > 0
        ? previousMeals.reduce((sum, m) => sum + m.gut_score, 0) /
          previousMeals.length
        : 0;

    const recentAvgMental =
      recentMeals.length > 0
        ? recentMeals.reduce((sum, m) => sum + m.mental_score, 0) /
          recentMeals.length
        : 0;
    const previousAvgMental =
      previousMeals.length > 0
        ? previousMeals.reduce((sum, m) => sum + m.mental_score, 0) /
          previousMeals.length
        : 0;

    // Use OpenAI to generate personalized insights
    const openai = getOpenAI();

    const prompt = `You are a Gut-Mind Health Assistant that analyzes a user's meal history to provide specific, personalized, and actionable insights.

Given a user's meal history data, analyze their patterns and generate 2-3 short, specific insights that:
- Are SPECIFIC: Mention actual ingredients, nutrients, or patterns you observe
- Are INTERESTING: Give cause-and-effect statements explaining why it matters
- Are PERSONAL: Phrase in second-person ("you")
- Are SHORT: Each insight ≤ 2 sentences
- Are ACTIONABLE: Help the user understand what to do next
- Are ACCURATE: Based on actual data from their meals

Meal History Data:
${JSON.stringify(mealSummary.slice(0, 20), null, 2)}

Recent Trends (Last 7 days vs Previous 7 days):
- Gut Score: ${recentAvgGut.toFixed(1)} (recent) vs ${previousAvgGut.toFixed(1)} (previous) - ${recentAvgGut > previousAvgGut ? "improving" : recentAvgGut < previousAvgGut ? "declining" : "stable"}
- Mental Score: ${recentAvgMental.toFixed(1)} (recent) vs ${previousAvgMental.toFixed(1)} (previous) - ${recentAvgMental > previousAvgMental ? "improving" : recentAvgMental < previousAvgMental ? "declining" : "stable"}
- Total Meals Tracked: ${meals.length}
- Recent Meals (last 7 days): ${recentMeals.length}

Common ingredients across meals:
${Array.from(new Set(mealSummary.flatMap((m) => m.detected_ingredients || []))).slice(0, 15).join(", ")}

Return the response as JSON with this exact structure:
{
  "insights": [
    {
      "icon": "🌿",
      "message": "Specific insight about their meal patterns, mentioning actual ingredients or nutrients when relevant",
      "impactColor": "bg-green-50"
    },
    {
      "icon": "💡",
      "message": "Another specific insight based on their data",
      "impactColor": "bg-blue-50"
    }
  ]
}

Rules:
- Use icons that match the insight (🌿 for fiber/gut, 🧠 for mental, ⚡ for energy, 💪 for strength, etc.)
- Use impactColor: "bg-green-50" for positive insights, "bg-blue-50" for neutral/informative, "bg-yellow-50" for warnings
- Be specific about percentages, ingredients, or patterns when you have the data
- Focus on actionable insights that help the user improve their gut-mind health
- If you notice patterns (e.g., high fiber meals correlate with better scores), mention it specifically`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `Analyze this user's meal history and generate 2-3 personalized insights. Focus on specific patterns, ingredients, or trends you observe in their data.`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Response:", responseText);
      // Fallback to default insights
      return NextResponse.json({
        insights: [
          {
            icon: "💡",
            message: "Keep tracking your meals to see personalized insights!",
            impactColor: "bg-blue-50",
          },
        ],
      });
    }

    // Validate and return insights
    if (!data.insights || !Array.isArray(data.insights)) {
      return NextResponse.json({
        insights: [
          {
            icon: "💡",
            message: "Keep tracking your meals to see personalized insights!",
            impactColor: "bg-blue-50",
          },
        ],
      });
    }

    // Ensure each insight has required fields
    const validatedInsights = data.insights
      .slice(0, 3)
      .map((insight: any) => ({
        icon: insight.icon || "💡",
        message: insight.message || "Track more meals for insights",
        impactColor: insight.impactColor || "bg-blue-50",
      }));

    return NextResponse.json({ insights: validatedInsights });
  } catch (error: any) {
    console.error("Error generating insights:", error);

    // Return default insights on error
    return NextResponse.json({
      insights: [
        {
          icon: "💡",
          message: "Keep tracking your meals to see personalized insights!",
          impactColor: "bg-blue-50",
        },
      ],
    });
  }
}

