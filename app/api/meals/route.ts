import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/meals - Get all meals for the authenticated user
 */
export async function GET() {
  try {
    // Verify user is authenticated through Whop
    const { isAuthenticated, userId } = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Fetch meals for this user
    if (!supabase) {
      console.error("❌ Supabase client is null!");
      console.error("  NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "MISSING");
      console.error("  NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "MISSING");
      console.warn("Supabase not configured - returning empty meals array");
      return NextResponse.json(
        { meals: [], message: "Database not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the server." },
        { status: 200 }
      );
    }

    console.log("Fetching meals for user:", userId);
    const { data: meals, error } = await supabase
      .from("meals")
      .select("*")
      .eq("whop_user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching meals:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to fetch meals", details: error.message },
        { status: 500 }
      );
    }

    console.log(`✅ Found ${meals?.length || 0} meals for user ${userId}`);
    return NextResponse.json({ meals: meals || [] });
  } catch (error: any) {
    console.error("Error in GET /api/meals:", error);
    return NextResponse.json(
      { error: "Failed to fetch meals" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/meals?id=meal_id - Delete a specific meal
 */
export async function DELETE(req: Request) {
  try {
    // Verify user is authenticated through Whop
    const { isAuthenticated, userId } = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mealId = searchParams.get("id");

    if (!mealId) {
      return NextResponse.json(
        { error: "Meal ID is required" },
        { status: 400 }
      );
    }

    // Delete the meal (RLS will ensure user can only delete their own meals)
    const { error } = await supabase
      .from("meals")
      .delete()
      .eq("id", mealId)
      .eq("whop_user_id", userId);

    if (error) {
      console.error("Error deleting meal:", error);
      return NextResponse.json(
        { error: "Failed to delete meal" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in DELETE /api/meals:", error);
    return NextResponse.json(
      { error: "Failed to delete meal" },
      { status: 500 }
    );
  }
}

