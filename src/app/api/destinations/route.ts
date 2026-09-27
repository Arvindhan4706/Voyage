import { NextRequest, NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

const FALLBACK_DESTINATIONS = [
  {
    id: "dest-paris",
    name: "Paris",
    country: "France",
    extract: "The City of Light captivates with timeless art, haute cuisine, and iconic monuments along the River Seine.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    temp: 21,
    ratings: 4.9,
  },
  {
    id: "dest-kyoto",
    name: "Kyoto",
    country: "Japan",
    extract: "Ancient wooden temples, serene bamboo groves, and traditional tea ceremonies evoke Japan's cultural heart.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    temp: 24,
    ratings: 4.8,
  },
  {
    id: "dest-bali",
    name: "Bali",
    country: "Indonesia",
    extract: "Tropical beaches, volcanic landscapes, and tranquil wellness retreats make Bali an island paradise.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    temp: 29,
    ratings: 4.7,
  },
  {
    id: "dest-amalfi",
    name: "Amalfi Coast",
    country: "Italy",
    extract: "Dramatic seaside cliffs, pastel fishing villages, and panoramic Mediterranean vistas offer sheer coastal luxury.",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    temp: 26,
    ratings: 4.9,
  },
  {
    id: "dest-alps",
    name: "Zermatt",
    country: "Switzerland",
    extract: "Nestled beneath the majestic Matterhorn, featuring world-class alpine skiing and pristine mountain air.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    temp: 14,
    ratings: 4.8,
  },
  {
    id: "dest-capetown",
    name: "Cape Town",
    country: "South Africa",
    extract: "Towering Table Mountain, golden Atlantic beaches, and vibrant coastal culture converge in stunning beauty.",
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
    temp: 22,
    ratings: 4.7,
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "Trending world destinations";
  const limit = parseInt(searchParams.get("limit") || "6");

  const prompt = `Act as an elite global travel curator. The user requested destination recommendations for: "${q}".
Provide exactly ${limit} distinctive, high-end travel destinations.
For each destination, return:
- "id": A unique string
- "name": The city or destination name
- "country": The country name
- "extract": A short 120-150 character summary
- "image": A valid high-resolution Unsplash photo URL
- "temp": Realistic current temperature in Celsius as a number (e.g. 24)
- "ratings": Realistic rating number between 4.5 and 5.0 (e.g. 4.8)

Return ONLY a JSON array of ${limit} destination objects.`;

  const results = await queryGroqJson<any[]>({
    prompt,
    cacheKey: `destinations:${q.toLowerCase()}:${limit}`,
    ttlSeconds: 600, // 10 min cache
    fallback: FALLBACK_DESTINATIONS.slice(0, limit),
    maxTokens: 2000,
    temperature: 0.7,
  });

  return NextResponse.json(results);
}
