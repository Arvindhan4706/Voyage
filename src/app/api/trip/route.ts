import { NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

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

    const prompt = `You are an elite, luxury travel concierge AI called Voyage AI.
Design a highly personalized, premium travel itinerary based on:
- Source: ${source}
- Destination: ${targetDest}
- Budget: ₹${budget}
- Duration: ${days} days
- Travel Style: ${style}

Generate:
1. Current realistic weather estimate (e.g. "28°C").
2. A compelling 2-sentence summary/about section for ${targetDest}.
3. Exact latitude and longitude coordinates.
4. Day-by-day itinerary with title and activities for morning, afternoon, and evening.

OUTPUT STRICTLY IN THIS JSON FORMAT ONLY:
{
  "destination": "${targetDest}",
  "source": "${source}",
  "estimated_budget": "₹${budget}",
  "travel_style": "${style}",
  "current_weather": "28°C",
  "about": "A breathtaking destination known for its pristine beauty and cultural heritage.",
  "real_attractions_found": 8,
  "predicted_rating": 4.9,
  "coordinates": {
    "lat": 15.2993,
    "lon": 74.1240
  },
  "tips": [
    "Book heritage tours early in the morning to beat the crowds.",
    "Try local organic cafes in the historical quarter."
  ],
  "days": [
    {
      "day": 1,
      "title": "Arrival & Sunset Welcome",
      "morning": "Arrive and check in to your boutique resort with welcome herbal teas.",
      "afternoon": "Stroll through the scenic heritage quarter and visit local artisan boutiques.",
      "evening": "Enjoy an exclusive oceanfront dinner with candlelit views and local cuisine."
    }
  ]
}`;

    const fallbackItinerary = {
      destination: targetDest,
      source: source,
      estimated_budget: `₹${budget}`,
      travel_style: style,
      current_weather: "26°C",
      about: `${targetDest} is an extraordinary destination blending vibrant local traditions, breathtaking landscapes, and luxury hospitality.`,
      real_attractions_found: 12,
      predicted_rating: 4.9,
      coordinates: { lat: 15.2993, lon: 74.124 },
      tips: [
        "Private airport transfers are recommended for seamless arrival.",
        "Dress comfortably in breathable fabrics for daytime excursions.",
        "Reserve specialty dining experiences at least 24 hours in advance."
      ],
      days: Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        title: `Day ${i + 1}: Discovering ${targetDest}`,
        morning: `Private guided morning exploration of top landmarks in ${targetDest}.`,
        afternoon: `Artisanal lunch followed by leisure time at luxury boutique facilities.`,
        evening: `Sunset viewing followed by fine dining featuring signature local specialties.`
      }))
    };

    const itineraryData = await queryGroqJson<typeof fallbackItinerary>({
      prompt,
      cacheKey: `trip:${source.toLowerCase()}:${targetDest.toLowerCase()}:${days}:${style.toLowerCase()}`,
      ttlSeconds: 600,
      fallback: fallbackItinerary,
      maxTokens: 2500,
      temperature: 0.7,
    });

    return NextResponse.json(itineraryData);
  } catch (error) {
    console.error("Trip Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate itinerary" }, { status: 500 });
  }
}
