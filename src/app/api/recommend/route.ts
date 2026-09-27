import { NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

const FALLBACK_RECOMMENDATIONS = [
  {
    id: "rec-kyoto",
    destination: "Kyoto, Japan",
    matchScore: 98,
    cost: "₹65,000",
    tags: ["Culture", "Zen Gardens", "Temples"],
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  },
  {
    id: "rec-bali",
    destination: "Ubud, Bali",
    matchScore: 95,
    cost: "₹42,000",
    tags: ["Nature", "Wellness", "Villas"],
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  },
  {
    id: "rec-zermatt",
    destination: "Zermatt, Switzerland",
    matchScore: 94,
    cost: "₹95,000",
    tags: ["Mountains", "Skiing", "Scenic"],
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
  },
  {
    id: "rec-amalfi",
    destination: "Positano, Italy",
    matchScore: 92,
    cost: "₹80,000",
    tags: ["Coastline", "Luxury", "Dining"],
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { history_tags = ["Travel", "Tourism"] } = body;

    const tagsKey = history_tags.sort().join(",").toLowerCase();

    const prompt = `Act as an elite AI travel recommendation engine. 
Based on these user interest tags: [${history_tags.join(", ")}], generate exactly 4 highly personalized luxury travel destination recommendations.
For each recommendation, provide:
- "id": A unique random string
- "destination": The name of the location and country
- "matchScore": A number between 88 and 99
- "cost": Estimated trip cost in INR string (e.g. "₹45,000")
- "tags": Array of 3 short interest tags matching the location
- "image": High-resolution Unsplash photo URL

Return ONLY a JSON array of 4 recommendation objects.`;

    const finalRecs = await queryGroqJson<any[]>({
      prompt,
      cacheKey: `recommend:${tagsKey}`,
      ttlSeconds: 600,
      fallback: FALLBACK_RECOMMENDATIONS,
      maxTokens: 2000,
      temperature: 0.8,
    });

    return NextResponse.json(finalRecs);
  } catch (error) {
    console.error("Recommend error:", error);
    return NextResponse.json(FALLBACK_RECOMMENDATIONS);
  }
}
