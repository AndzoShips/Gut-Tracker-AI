import { NextResponse } from "next/server";
import { getOpenAI } from "@/app/lib/openai";
import { verifyAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    // Verify user is authenticated through Whop
    const { isAuthenticated, userId } = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Authentication required. Please log in through Whop to use this feature." },
        { status: 401 }
      );
    }

    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const openai = getOpenAI();

    const prompt = `You are a nutrition assistant specialized in gut health and cognitive performance. Analyze the meal image and return ONLY a valid JSON object with this exact structure:

{
  "title": "Short descriptive meal title",
  "detected_ingredients": ["MUST identify 4-8 main visible ingredients from the image. List them as simple ingredient names like 'Salmon', 'Quinoa', 'Broccoli', 'Avocado', 'Olive Oil', 'Lemon', 'Chicken', 'Rice', etc. Be specific and accurate based on what you can see in the image."],
  "mood_score": 0-100,
  "mental_clarity_score": 0-100,
  "energy_score": 0-100,
  "digestion_score": 0-100,
  "gut_insights": {
    "digestive_ease": "Assessment of how easy/hard this meal is to digest (e.g., 'hard to digest due to heavy oils' or 'easy to digest with gentle ingredients')",
    "fiber_content": "Evaluation of fiber adequacy (e.g., 'good fiber from whole grains' or 'lacking fiber, low in plant matter')",
    "microbiome_impact": "How this meal affects gut bacteria (e.g., 'supports good bacteria with prebiotics' or 'may harm microbiome with processed ingredients')",
    "inflammatory_potential": "Risk of inflammation (e.g., 'low inflammatory risk' or 'high in sugar and processed fats that may cause inflammation')",
    "hydration_effect": "Impact on hydration (e.g., 'hydrating with fresh vegetables' or 'dehydrating due to high sodium')",
    "probiotic_prebiotic_quality": "Presence of beneficial bacteria-supporting foods (e.g., 'contains probiotic-rich yogurt' or 'no probiotic/prebiotic content detected')",
    "gut_reactivity_triggers": "Potential triggers for gut issues (e.g., 'contains lactose/gluten' or 'no common triggers identified')"
  },
  "mental_insights": {
    "brain_fuel_quality": "Type of carbohydrates and brain fuel (e.g., 'complex carbs provide steady energy' or 'simple sugars cause energy spikes')",
    "neuroinflammation_risk": "Risk of brain inflammation (e.g., 'low risk with healthy fats' or 'high in processed fats that may cause neuroinflammation')",
    "mood_stability": "Impact on mood and serotonin support (e.g., 'contains tryptophan and B vitamins for mood stability' or 'lacks mood-supportive nutrients')",
    "stimulant_load": "Caffeine or stimulant content (e.g., 'contains caffeine' or 'no stimulants detected')",
    "energy_sustainability": "Energy pattern (e.g., 'sustained energy without crashes' or 'may cause energy spikes and crashes')",
    "cognitive_nutrients": "Brain-supporting nutrients (e.g., 'rich in B vitamins, omega-3s, and antioxidants' or 'lacks cognitive-supporting nutrients')",
    "hydration_oxygen_flow": "Impact on mental clarity via hydration (e.g., 'supports hydration and oxygen flow' or 'dehydrating, may reduce mental clarity')"
  },
  "gut_score": 0-100,
  "mental_score": 0-100,
  "overall_score": 0-100,
  "short_verdict": "One sentence summary",
  "reasons": ["3-5 detailed bullet points explaining the scores"],
  "alternatives": ["1-3 healthier meal alternatives that improve both gut and mind"],
  "personalized_insights": {
    "insights": [
      { "type": "Gut", "message": "..." },
      { "type": "Mind", "message": "..." },
      { "type": "Balance", "message": "..." }
    ]
  }
}

CRITICAL RULES:
1. Output ONLY the JSON object. No markdown, no backticks, no explanation. Start with { and end with }.
2. For detected_ingredients: You MUST carefully examine the image and list 4-8 actual ingredients you can see. Do not make up ingredients. Use simple, clear ingredient names.
3. Be specific and concrete in all insights.
4. All scores must be numbers between 0-100.
5. For personalized_insights: Generate 3 short insights (≤2 sentences each) that are SPECIFIC (mention actual ingredients/nutrients), INTERESTING (cause-and-effect), PERSONAL (second-person "you"), and SHORT. Include one "Gut" insight, one "Mind" insight, and one "Balance" insight connecting the two.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analyze this meal image carefully. First, identify all visible ingredients in the meal. Then provide the complete JSON analysis with all required fields including detected_ingredients as an array of ingredient names.

For the personalized_insights field, generate 3 short insights (≤2 sentences each) that are:
- SPECIFIC: Mention actual ingredients or nutrients (e.g., "avocado", "magnesium", "fiber")
- INTERESTING: Give cause-and-effect statements explaining why it matters
- PERSONAL: Phrase in second-person ("you")
- SHORT: Each insight ≤ 2 sentences
- Include one "Gut" insight (digestion/inflammation), one "Mind" insight (focus/mood), and one "Balance" insight (connection between gut and mind)

Example insights:
1. "The probiotics in your kimchi may help rebalance your gut flora, supporting smoother digestion after meals."
2. "The healthy fats in your salmon provide omega-3s that may boost mental clarity today."
3. "Because your meal had low fiber, your blood sugar could spike later — which might make your mood dip by afternoon."`
            },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Response:", responseText);
      return NextResponse.json(
        { error: "The AI returned an invalid JSON response." },
        { status: 502 }
      );
    }

    // Validate that we have the required fields
    if (!data.title || !data.gut_insights || !data.mental_insights) {
      console.error("Missing required fields in response:", data);
      return NextResponse.json(
        { error: "The AI response is missing required fields." },
        { status: 502 }
      );
    }
    
    // Validate detected_ingredients exists
    if (!data.detected_ingredients) {
      console.warn("detected_ingredients field is missing from response");
    }
    
    // Ensure detected_ingredients is an array and has items
    if (!Array.isArray(data.detected_ingredients)) {
      console.warn("detected_ingredients is not an array, attempting to fix:", data.detected_ingredients);
      // Try to extract from string or create empty array
      if (typeof data.detected_ingredients === 'string') {
        try {
          data.detected_ingredients = JSON.parse(data.detected_ingredients);
        } catch {
          data.detected_ingredients = [];
        }
      } else {
        data.detected_ingredients = [];
      }
    }
    
    // Log detected ingredients for debugging
    console.log("Detected ingredients:", data.detected_ingredients);
    
    // If still no ingredients, try to infer from title or other fields
    if (data.detected_ingredients.length === 0 && data.title) {
      console.warn("No ingredients detected, attempting to extract from title");
      // This is a fallback - ideally the AI should provide ingredients
    }

    // Return analysis data without saving
    // User will manually save via "Save Meal" button
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error analyzing image:", error);
    
    // Provide more specific error messages
    let message = "Failed to analyze image";
    if (error?.message) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    
    // Check for specific error types
    if (message.includes("OPENAI_API_KEY")) {
      message = "OpenAI API key is missing. Please add OPENAI_API_KEY to your .env.local file.";
    } else if (message.includes("Authentication")) {
      message = "Authentication failed. Please log in through Whop.";
    }
    
    return NextResponse.json(
      { 
        error: message,
        details: process.env.NODE_ENV === "development" ? error?.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
