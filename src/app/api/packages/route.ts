import { NextRequest, NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

const FALLBACK_PACKAGES = [
  {
    id: "pkg-bali-luxury",
    title: "Enchanted Bali & Ubud Sanctuary",
    location: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    price: 48000,
    originalPrice: 65000,
    rating: 4.9,
    reviews: 184,
    tags: ["Couples", "Luxury Spa", "Nature"],
    includes: ["Private Pool Villa", "Return Airport Transfers", "Daily Gourmet Breakfast"],
    days: "6 Days / 5 Nights",
  },
  {
    id: "pkg-swiss-alps",
    title: "Matterhorn & Swiss Alpine Grandeur",
    location: "Zermatt & Lucerne, Switzerland",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
    price: 92000,
    originalPrice: 125000,
    rating: 4.9,
    reviews: 142,
    tags: ["Scenic Train", "Mountain", "Luxury"],
    includes: ["Glacier Express First Class", "Chalet Stay", "Mountain Excursions"],
    days: "7 Days / 6 Nights",
  },
  {
    id: "pkg-amalfi-escape",
    title: "Mediterranean Dream: Amalfi & Capri",
    location: "Amalfi Coast, Italy",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    price: 78000,
    originalPrice: 105000,
    rating: 4.8,
    reviews: 210,
    tags: ["Coastal", "Romance", "Gastronomy"],
    includes: ["Cliffside 5-Star Hotel", "Private Capri Boat Tour", "Wine Tasting"],
    days: "5 Days / 4 Nights",
  },
  {
    id: "pkg-kyoto-blossom",
    title: "Imperial Kyoto & Zen Heritage",
    location: "Kyoto & Nara, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    price: 64000,
    originalPrice: 85000,
    rating: 4.9,
    reviews: 167,
    tags: ["Culture", "Boutique Ryokan", "Gastronomy"],
    includes: ["Traditional Luxury Ryokan", "Kaiseki Dinners", "Private Temple Guide"],
    days: "6 Days / 5 Nights",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination") || "Popular global destinations";
  const month = searchParams.get("month") || "Anytime";

  const prompt = `Act as an elite luxury travel agency. The user is searching for curated holiday packages for: "${destination}" during "${month}".
Generate exactly 4 comprehensive, realistic holiday package deals.
For each package, provide:
- "id": A unique string
- "title": A captivating, luxurious package title
- "location": Specific destination or country
- "image": Valid high-resolution Unsplash photo URL
- "price": Discounted package price per person in INR as a number (e.g. 52000)
- "originalPrice": Original price before discount in INR as a number (higher than price, e.g. 70000)
- "rating": Rating number between 4.6 and 5.0 (e.g. 4.9)
- "reviews": Number of reviews as a number (e.g. 158)
- "tags": Array of 2-3 short descriptive tags (e.g. ["Couples", "Luxury", "Beach"])
- "includes": Array of 3 distinct premium inclusions (e.g. ["5-Star Resort", "Private Transfers", "Daily Breakfast"])
- "days": Duration string (e.g. "5 Days / 4 Nights")

Return ONLY a JSON array of 4 package objects.`;

  const results = await queryGroqJson<any[]>({
    prompt,
    cacheKey: `packages:${destination.toLowerCase().trim()}:${month.toLowerCase().trim()}`,
    ttlSeconds: 600,
    fallback: FALLBACK_PACKAGES,
    maxTokens: 2000,
    temperature: 0.7,
  });

  return NextResponse.json(results);
}
