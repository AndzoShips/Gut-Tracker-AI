import { createClient } from "@supabase/supabase-js";

// Support both NEXT_PUBLIC_ prefixed and non-prefixed versions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

// Debug logging (only in development)
if (process.env.NODE_ENV === "development") {
  console.log("🔍 Supabase Configuration Check:");
  console.log("  NEXT_PUBLIC_SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing");
  console.log("  SUPABASE_URL (fallback):", process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing");
  console.log("  NEXT_PUBLIC_SUPABASE_ANON_KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");
  console.log("  SUPABASE_ANON_KEY (fallback):", process.env.SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing");
  console.log("  Final supabaseUrl:", supabaseUrl ? "✅ Available" : "❌ NULL");
  console.log("  Final supabaseAnonKey:", supabaseAnonKey ? "✅ Available" : "❌ NULL");
  if (supabaseUrl) {
    console.log("  URL value:", supabaseUrl.substring(0, 40) + "...");
  }
}

// Create Supabase client if credentials are available
// If not, we'll handle it gracefully in the API routes
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper function to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return supabase !== null;
}

