import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history_tags = ["Travel", "Tourism"] } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const prompt = `Act as an elite AI travel recommendation engine. 
Based on these user interest tags: [${history_tags.join(", ")}], generate exactly 4 highly personalized travel destination recommendations.
For each recommendation, provide:
1. "id": A unique random string.
2. "destination": The name of the location.
3. "matchScore": A number between 85 and 99.
4. "cost": A string representing the estimated trip cost in INR (e.g. "₹45,000").
5. "tags": An array of exactly 3 short interest tags matching the location.
6. "image": A valid Unsplash URL like "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80".

Return exactly a JSON array of these objects.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.9,
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                destination: { type: "STRING" },
                matchScore: { type: "NUMBER" },
                cost: { type: "STRING" },
                tags: { type: "ARRAY", items: { type: "STRING" } },
                image: { type: "STRING" }
              },
              required: ["id", "destination", "matchScore", "cost", "tags", "image"]
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
    const finalRecs = JSON.parse(content.replace(/^```json/i, "").replace(/```$/, "").trim());

    return NextResponse.json(finalRecs);
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}
