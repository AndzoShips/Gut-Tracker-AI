import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/**
 * POST /api/meals/save - Save a meal analysis to the database
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

    const body = await req.json();
    const {
      title,
      image_url,
      detected_ingredients,
      mood_score,
      mental_clarity_score,
      energy_score,
      digestion_score,
      gut_score,
      mental_score,
      overall_score,
      short_verdict,
      wellness_insights,
      gut_insights,
      mental_insights,
      reasons,
      alternatives,
      personalized_insights,
    } = body;

    // Validate required fields
    if (!title || !image_url) {
      return NextResponse.json(
        { error: "Title and image are required" },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 }
      );
    }

    // Check if meal already exists (prevent duplicates)
    // We'll check by user_id, title, and created_at within last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existingMeals } = await supabase
      .from("meals")
      .select("id")
      .eq("whop_user_id", userId)
      .eq("title", title)
      .gte("created_at", fiveMinutesAgo)
      .limit(1);

    if (existingMeals && existingMeals.length > 0) {
      return NextResponse.json(
        { 
          error: "This meal was already saved recently",
          id: existingMeals[0].id 
        },
        { status: 409 }
      );
    }

    // Prepare meal data
    const mealDataToInsert: any = {
      whop_user_id: userId,
      title,
      image_url,
      detected_ingredients: detected_ingredients || [],
      mood_score,
      mental_clarity_score,
      energy_score,
      digestion_score,
      gut_score,
      mental_score,
      overall_score,
      short_verdict,
      gut_insights,
      mental_insights,
      reasons: reasons || [],
      alternatives: alternatives || [],
    };

    // Only include wellness_insights if it exists (column might not be in DB yet)
    if (wellness_insights !== null && wellness_insights !== undefined) {
      mealDataToInsert.wellness_insights = wellness_insights;
    }

    // Only include personalized_insights if it exists (column might not be in DB yet)
    if (personalized_insights !== null && personalized_insights !== undefined) {
      mealDataToInsert.personalized_insights = personalized_insights;
    }

    // Save meal to database
    const { data: mealData, error: dbError } = await supabase
      .from("meals")
      .insert(mealDataToInsert)
      .select()
      .single();

    if (dbError) {
      console.error("Error saving meal to database:", dbError);
      console.error("Error code:", dbError.code);
      console.error("Error message:", dbError.message);
      console.error("Error details:", dbError.details);
      console.error("Error hint:", dbError.hint);
      
      // Check if it's a column doesn't exist error
      if (dbError.code === "42703" || dbError.message?.includes("column") || dbError.message?.includes("does not exist")) {
        // Try again without personalized_insights
        const { data: mealDataRetry, error: retryError } = await supabase
          .from("meals")
          .insert({
            whop_user_id: userId,
            title,
            image_url,
            detected_ingredients: detected_ingredients || [],
            mood_score,
            mental_clarity_score,
            energy_score,
            digestion_score,
            gut_score,
            mental_score,
            overall_score,
            short_verdict,
            gut_insights,
            mental_insights,
            reasons: reasons || [],
            alternatives: alternatives || [],
          })
          .select()
          .single();

        if (retryError) {
          return NextResponse.json(
            { error: "Failed to save meal", details: retryError.message, code: retryError.code },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          meal: mealDataRetry,
          id: mealDataRetry.id,
          warning: "personalized_insights column not found in database - please run migration",
        });
      }

      return NextResponse.json(
        { error: "Failed to save meal", details: dbError.message, code: dbError.code },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      meal: mealData,
      id: mealData.id,
    });
  } catch (error: any) {
    console.error("Error in POST /api/meals/save:", error);
    return NextResponse.json(
      { error: "Failed to save meal" },
      { status: 500 }
    );
  }
}

