import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/**
 * API route to get current authenticated user from Whop
 */
export async function GET() {
  try {
    const { user, isAuthenticated } = await getCurrentUser();
    
    if (!isAuthenticated || !user) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 401 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      { authenticated: false, user: null, error: "Failed to get user" },
      { status: 500 }
    );
  }
}

