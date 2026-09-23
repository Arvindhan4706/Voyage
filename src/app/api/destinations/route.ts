import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "luxury";
  const limit = parseInt(searchParams.get("limit") || "4");

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const prompt = `Act as a travel expert. Generate a list of exactly ${limit} amazing luxury travel destinations that match this category or query: "${q}". 
For each destination, provide:
1. The city or main location name (e.g. "Paris").
2. A compelling, concise 2-sentence summary of why it's a great luxury destination.
3. A generic Unsplash image URL pattern like "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
4. An estimated current temperature in Celsius (e.g. 24).
5. A realistic weather code (use WMO codes like 0 for clear).
6. The country name.
7. A realistic user rating out of 5 (e.g., 4.8).

Return ONLY the JSON array described below.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.8,
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                summary: { type: "STRING" },
                image: { type: "STRING" },
                temp: { type: "NUMBER" },
                code: { type: "NUMBER" },
                country: { type: "STRING" },
                ratings: { type: "NUMBER" }
              },
              required: ["name", "summary", "image", "temp", "code", "country", "ratings"]
            }
          }
        }
      })
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      throw new Error(`Gemini API failed: ${err}`);
    }

    const data = await geminiRes.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const destinations = JSON.parse(content.replace(/^```json/i, "").replace(/```$/, "").trim());

    return NextResponse.json(destinations);
  } catch (error) {
    console.error("Destinations API Error:", error);
    return NextResponse.json([]);
  }
}
