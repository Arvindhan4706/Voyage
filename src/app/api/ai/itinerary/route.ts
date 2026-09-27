import { NextResponse } from "next/server";
import { groq } from "@/lib/ai/groq";

export async function POST(req: Request) {
  try {
    const { destination, days, preferences, inventory } = await req.json();

    if (!destination || !days) {
      return NextResponse.json({ error: "Destination and days are required" }, { status: 400 });
    }

    const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    
    // We strictly inject the real data (inventory) into the prompt so the LLM doesn't hallucinate
    const systemPrompt = `You are a professional travel planner for Voyage AI.
Your job is to create a detailed, engaging itinerary for a user traveling to ${destination} for ${days} days.
The user has the following preferences: ${preferences || "None specified"}.

CRITICAL: Do NOT invent or hallucinate hotels, flights, or prices.
You MUST ONLY recommend the following real inventory provided by our system:
${inventory ? JSON.stringify(inventory, null, 2) : "No specific inventory provided. Focus on general activities."}

Structure your response clearly with Day 1, Day 2, etc. Use markdown formatting to make it readable and beautiful.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Please generate a ${days}-day itinerary for ${destination}.` },
      ],
      model: model,
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      itinerary: chatCompletion.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("Itinerary generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate itinerary" },
      { status: 500 }
    );
  }
}
