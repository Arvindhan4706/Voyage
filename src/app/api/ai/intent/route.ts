import { NextResponse } from "next/server";
import { groq } from "@/lib/ai/groq";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    
    const systemPrompt = `You are an intelligent travel search interpreter for Voyage AI. 
Extract the travel search intent from the user's natural language query.
You MUST respond with ONLY valid JSON and nothing else. No markdown formatting, no explanation.
If you cannot determine a field, omit it from the JSON.

Expected JSON schema:
{
  "origin": "string (IATA code or city name)",
  "destination": "string (IATA code or city name)",
  "departure_date": "string (YYYY-MM-DD)",
  "return_date": "string (YYYY-MM-DD)",
  "passengers": "number",
  "cabin": "string (ECONOMY, BUSINESS, FIRST)",
  "budget": "number",
  "currency": "string (e.g. INR, USD)"
}
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      model: model,
      temperature: 0, // Low temperature for consistent JSON extraction
    });

    const responseContent = chatCompletion.choices[0]?.message?.content || "{}";
    
    // Attempt to parse the JSON
    let parsedIntent;
    try {
      // Strip markdown code blocks if the model accidentally included them
      const cleanJson = responseContent.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedIntent = JSON.parse(cleanJson);
    } catch (e) {
      console.error("Failed to parse Groq response as JSON:", responseContent);
      return NextResponse.json({ error: "Failed to extract search intent", raw: responseContent }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      intent: parsedIntent,
    });
  } catch (error) {
    console.error("Intent parsing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
