// Import the official OpenAI SDK
import OpenAI from "openai";

// Lazily create the client so importing this module never crashes
let cachedClient: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Throw here so callers can catch and convert to a 500 JSON safely
    throw new Error(
      "OPENAI_API_KEY environment variable is not set. Add it to your .env.local and restart the dev server."
    );
  }
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey });
  }
  return cachedClient;
}
