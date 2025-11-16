import { headers } from "next/headers";
import { whopsdk } from "./whop-sdk";

// Development mode: Set to true to bypass Whop authentication for local testing
const DEV_MODE_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === "true";

/**
 * Verify user authentication from Whop
 * Use this in server components and API routes
 * @returns {Promise<{userId: string, isAuthenticated: boolean}>}
 */
export async function verifyAuth() {
  // Development mode: bypass authentication for testing
  if (DEV_MODE_BYPASS_AUTH && process.env.NODE_ENV === "development") {
    console.warn("⚠️  DEV MODE: Authentication bypassed for testing");
    return { userId: "dev-user-123", isAuthenticated: true };
  }

  try {
    const { userId } = await whopsdk.verifyUserToken(await headers());
    return { userId, isAuthenticated: true };
  } catch (error) {
    console.error("Auth verification failed:", error);
    return { userId: null, isAuthenticated: false };
  }
}

/**
 * Get current user data
 * @returns {Promise<{user: any | null, isAuthenticated: boolean}>}
 */
export async function getCurrentUser() {
  try {
    const { userId, isAuthenticated } = await verifyAuth();
    if (!isAuthenticated || !userId) {
      return { user: null, isAuthenticated: false };
    }
    const user = await whopsdk.users.retrieve(userId);
    return { user, isAuthenticated: true };
  } catch (error) {
    console.error("Failed to get user:", error);
    return { user: null, isAuthenticated: false };
  }
}

