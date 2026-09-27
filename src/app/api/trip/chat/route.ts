import { NextRequest, NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

export async function POST(req: NextRequest) {
  try {
    const { itinerary, prompt } = await req.json();
    
    const systemPrompt = `You are an expert luxury travel planner AI. 
The user is providing you with their current itinerary JSON and a prompt to modify it.
You must return the EXACT SAME JSON structure, but with the days modified according to the user's prompt.
DO NOT return any conversational text. Return ONLY the raw JSON object.
Keep the existing destination, budget, coordinates, and weather as they are. Just modify the 'days' array.`;

    const userPrompt = `CURRENT ITINERARY:\n${JSON.stringify(itinerary)}\n\nUSER PROMPT: ${prompt}`;

    const updatedItinerary = await queryGroqJson<any>({
      prompt: userPrompt,
      systemPrompt,
      fallback: itinerary,
      maxTokens: 2500,
      temperature: 0.5,
    });

    return NextResponse.json(updatedItinerary);
  } catch (error) {
    console.error("Trip Chat Error:", error);
    return NextResponse.json({ error: "Failed to update itinerary" }, { status: 500 });
  }
}
