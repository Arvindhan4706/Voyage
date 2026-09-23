import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source = "Chennai", destination, budget = "25000", duration = "4", style = "adventure" } = body;

    const days = parseInt(String(duration).replace(/\D/g, "")) || 4;

    const styleDestinations: Record<string, string> = {
      adventure: "Manali",
      relaxation: "Goa",
      "culture & heritage": "Jaipur",
      beach: "Goa",
      mountain: "Manali",
      spiritual: "Varanasi",
    };
    const targetDest = destination || styleDestinations[style.toLowerCase()] || "Goa";

    const prompt = `
You are an elite, luxury travel concierge AI called Voyage AI.
Design a highly personalized, premium travel itinerary based on the following parameters:
- Source: ${source}
- Destination: ${targetDest}
- Budget: ₹${budget}
- Duration: ${days} days
- Travel Style: ${style}

Since you are acting independently, you must also generate:
1. A realistic current weather estimate (e.g. "28°C").
2. A compelling 2-sentence summary/about section for ${targetDest}.
3. The exact latitude and longitude coordinates for ${targetDest}.

Create a day-by-day luxury itinerary. For each day, provide a title, and highly descriptive, premium activities for morning, afternoon, and evening. 
Do not include any placeholders.

OUTPUT STRICTLY IN THE FOLLOWING JSON FORMAT ONLY:
{
  "destination": "string",
  "source": "string",
  "estimated_budget": "string",
  "travel_style": "string",
  "current_weather": "string",
  "about": "string",
  "real_attractions_found": "number",
  "predicted_rating": "number",
  "coordinates": {
    "lat": "number",
    "lon": "number"
  },
  "tips": ["string"],
  "days": [
    {
      "day": "number",
      "title": "string",
      "morning": "string",
      "afternoon": "string",
      "evening": "string"
    }
  ]
}
`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing GEMINI_API_KEY.");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
            responseSchema: {
              type: "OBJECT",
              properties: {
                destination: { type: "STRING" },
                source: { type: "STRING" },
                estimated_budget: { type: "STRING" },
                travel_style: { type: "STRING" },
                current_weather: { type: "STRING" },
                about: { type: "STRING" },
                real_attractions_found: { type: "NUMBER" },
                predicted_rating: { type: "NUMBER" },
                coordinates: {
                  type: "OBJECT",
                  properties: {
                    lat: { type: "NUMBER" },
                    lon: { type: "NUMBER" }
                  },
                  required: ["lat", "lon"]
                },
                tips: { type: "ARRAY", items: { type: "STRING" } },
                days: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      day: { type: "NUMBER" },
                      title: { type: "STRING" },
                      morning: { type: "STRING" },
                      afternoon: { type: "STRING" },
                      evening: { type: "STRING" }
                    },
                    required: ["day", "title", "morning", "afternoon", "evening"]
                  }
                }
              },
              required: ["destination", "source", "estimated_budget", "travel_style", "current_weather", "about", "real_attractions_found", "predicted_rating", "coordinates", "tips", "days"]
            }
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!geminiRes.ok) {
        const errorText = await geminiRes.text();
        throw new Error(`Gemini API failed: ${errorText}`);
      }

      const geminiData = await geminiRes.json();
      const content = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      const itineraryData = JSON.parse(content || "{}");
      
      return NextResponse.json(itineraryData);
    } catch (e) {
      console.warn("Gemini API failed or timed out.", e);
      return NextResponse.json({ error: "Failed to generate itinerary with Gemini API." }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Trip Error - Catch All:", error);
    return NextResponse.json({ error: "Failed to generate itinerary, completely broken." }, { status: 500 });
  }
}
