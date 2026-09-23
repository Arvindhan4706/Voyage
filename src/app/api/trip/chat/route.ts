import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { itinerary, prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI API Key" }, { status: 500 });
    }

    const systemPrompt = `You are an expert luxury travel planner AI. 
The user is providing you with their current itinerary JSON and a prompt to modify it.
You must return the EXACT SAME JSON structure, but with the days modified according to the user's prompt.
DO NOT return any conversational text. DO NOT use markdown code blocks like \`\`\`json. Return ONLY the raw JSON object.
Keep the existing destination, budget, coordinates, and weather as they are. Just modify the 'days' array.`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `CURRENT ITINERARY:\n${JSON.stringify(itinerary)}\n\nUSER PROMPT: ${prompt}` }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.5,
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API error: ${await res.text()}`);
    }

    const data = await res.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "{}";
    
    // Clean potential markdown from Gemini (just in case)
    const cleanContent = content.replace(/^```json/i, "").replace(/```$/, "").trim();

    return NextResponse.json(JSON.parse(cleanContent));
  } catch (error) {
    console.error("Trip Chat Error:", error);
    return NextResponse.json({ error: "Failed to update itinerary" }, { status: 500 });
  }
}
