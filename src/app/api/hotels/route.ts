import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location") || searchParams.get("place") || "Bali";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const prompt = `Act as an expert travel agent. Generate a list of 6 highly realistic luxury hotels and resorts in ${location}. 
Include realistic names, specific locations within ${location}, star ratings (e.g. "5"), prices in INR per night (between 5000 and 30000), guest ratings (e.g. 4.8), exact latitude and longitude coordinates for the hotel, and 4 realistic amenities (e.g. "Free WiFi", "Spa", "Infinity Pool", "24hr Reception"). Return exactly 6 items.`;

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
                id: { type: "STRING" },
                name: { type: "STRING" },
                location: { type: "STRING" },
                stars: { type: "STRING" },
                price: { type: "NUMBER" },
                ratings: { type: "NUMBER" },
                lat: { type: "NUMBER" },
                lon: { type: "NUMBER" },
                amenities: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                }
              },
              required: ["id", "name", "location", "stars", "price", "ratings", "lat", "lon", "amenities"]
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
    let geminiHotels = JSON.parse(content.replace(/^```json/i, "").replace(/```$/, "").trim());

    // Ensure amenities are stringified for the frontend component expectations
    geminiHotels = geminiHotels.map((h: any) => ({
      ...h,
      amenities: JSON.stringify(h.amenities)
    }));

    return NextResponse.json(geminiHotels);
  } catch (error) {
    console.error("Hotels API Error:", error);
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Use GET /api/hotels?location=Bali" });
}
