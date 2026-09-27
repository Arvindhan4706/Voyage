import { NextRequest, NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

const FALLBACK_SEARCH = [
  {
    id: 1,
    name: "Tokyo",
    extract: "Japan's bustling capital mixes ultramodern neon with historic temples, world-class gastronomy, and vibrant nightlife.",
    fullExtract: "Tokyo, Japan's vibrant capital, blends the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods. The Imperial Palace sits amid large public gardens. The city's many museums offer exhibits that range from classical art to a reconstructed kabuki theater.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
    url: "https://en.wikipedia.org/wiki/Tokyo",
    weather: { temp: "22°C", windspeed: "12 km/h", is_day: 1 },
    lat: 35.6762,
    lon: 139.6503,
    country: "Japan",
  },
  {
    id: 2,
    name: "Kyoto",
    extract: "Famed for classical Buddhist temples, gardens, imperial palaces, and traditional wooden houses.",
    fullExtract: "Kyoto, once the capital of Japan, is famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses. It’s also known for formal traditions such as kaiseki dining, consisting of multiple courses of precise dishes, and geisha, female entertainers often found in the Gion district.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    url: "https://en.wikipedia.org/wiki/Kyoto",
    weather: { temp: "24°C", windspeed: "8 km/h", is_day: 1 },
    lat: 35.0116,
    lon: 135.7681,
    country: "Japan",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "Bali travel tourism";

  const prompt = `Act as an elite travel search engine. The user searched for: "${q}".
Find up to 4 real-world travel destinations related to this query.
For each destination, provide:
1. "id": A unique random number.
2. "name": The city or destination name.
3. "extract": A short 150-character summary.
4. "fullExtract": A comprehensive 2-3 paragraph travel guide/summary.
5. "image": A valid Unsplash URL (e.g. "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80").
6. "url": A simulated wikipedia URL (e.g. "https://en.wikipedia.org/wiki/Tokyo").
7. "weather": An object with "temp" (e.g. "28°C"), "windspeed" (e.g. "12 km/h"), and "is_day" (number 1 or 0).
8. "lat": Realistic latitude (number).
9. "lon": Realistic longitude (number).
10. "country": Country or region name.

Return EXACTLY a JSON object with a "results" array containing these items. No markdown blocks, just the JSON string.`;

  try {
    const data = await queryGroqJson<{ results: any[] }>({
      prompt,
      cacheKey: `search:${q.toLowerCase().trim()}`,
      ttlSeconds: 600,
      fallback: { results: FALLBACK_SEARCH },
      maxTokens: 2000,
      temperature: 0.7,
    });

    const results = Array.isArray(data) ? data : (data.results || []);
    return NextResponse.json({ results, query: q });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json({ results: FALLBACK_SEARCH, query: q });
  }
}
