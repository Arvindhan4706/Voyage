import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "Bali travel tourism";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const prompt = `Act as an elite travel search engine. The user searched for: "${q}".
Find up to 4 real-world travel destinations related to this query.
For each destination, provide:
1. "id": A unique random number.
2. "name": The city or destination name.
3. "extract": A short 150-character summary.
4. "fullExtract": A comprehensive 3-paragraph travel guide/summary.
5. "image": A valid Unsplash URL like "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80".
6. "url": A simulated wikipedia URL (e.g. "https://en.wikipedia.org/wiki/Bali").
7. "weather": An object with "temp" (e.g. "28°C"), "windspeed" (e.g. "12 km/h"), and "is_day" (boolean 0 or 1).
8. "lat": Exact latitude.
9. "lon": Exact longitude.
10. "country": Country or region name.

Return EXACTLY a JSON object with a "results" array containing these items.`;

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          responseSchema: {
            type: "OBJECT",
            properties: {
              results: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    id: { type: "NUMBER" },
                    name: { type: "STRING" },
                    extract: { type: "STRING" },
                    fullExtract: { type: "STRING" },
                    image: { type: "STRING" },
                    url: { type: "STRING" },
                    weather: {
                      type: "OBJECT",
                      properties: {
                        temp: { type: "STRING" },
                        windspeed: { type: "STRING" },
                        is_day: { type: "NUMBER" }
                      },
                      required: ["temp", "windspeed", "is_day"]
                    },
                    lat: { type: "NUMBER" },
                    lon: { type: "NUMBER" },
                    country: { type: "STRING" }
                  },
                  required: ["id", "name", "extract", "fullExtract", "image", "url", "weather", "lat", "lon", "country"]
                }
              }
            },
            required: ["results"]
          }
        }
      })
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      throw new Error(`Gemini API failed: ${err}`);
    }

    const data = await geminiRes.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{"results": []}';
    const parsed = JSON.parse(content.replace(/^```json/i, "").replace(/```$/, "").trim());

    return NextResponse.json({ results: parsed.results || [], query: q });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ results: [], query: q, error: "Search failed" }, { status: 500 });
  }
}
