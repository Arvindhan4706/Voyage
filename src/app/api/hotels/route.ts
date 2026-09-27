import { NextRequest, NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

const FALLBACK_HOTELS = [
  {
    id: "hotel-aman-tokyo",
    name: "Aman Tokyo",
    location: "Otemachi, Tokyo",
    stars: "5",
    price: 45000,
    ratings: 4.9,
    amenities: ["Panoramic Skyline Views", "Private Spa & Onsen", "Michelin-Starred Dining", "Free WiFi"],
    image: "https://images.unsplash.com/photo-1542314831-c6a4d27ce6a2?w=800&q=80",
  },
  {
    id: "hotel-ritz-paris",
    name: "Hôtel Ritz Paris",
    location: "Place Vendôme, Paris",
    stars: "5",
    price: 65000,
    ratings: 4.9,
    amenities: ["Historic Luxury", "Chanel Spa", "Butler Service", "Gourmet Breakfast"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
  {
    id: "hotel-four-seasons-bali",
    name: "Four Seasons Resort Bali at Sayan",
    location: "Ubud, Bali",
    stars: "5",
    price: 38000,
    ratings: 4.8,
    amenities: ["Private River Villas", "Infinity Pool", "Yoga Pavilion", "Free WiFi"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  },
  {
    id: "hotel-belmond-amalfi",
    name: "Belmond Hotel Caruso",
    location: "Ravello, Amalfi Coast",
    stars: "5",
    price: 52000,
    ratings: 4.9,
    amenities: ["Cliffside Infinity Pool", "Private Yacht Charters", "Fine Wine Cellar", "Breakfast Included"],
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  },
  {
    id: "hotel-burj-al-arab",
    name: "Burj Al Arab Jumeirah",
    location: "Jumeirah Beach, Dubai",
    stars: "5",
    price: 85000,
    ratings: 4.9,
    amenities: ["Helipad", "Private Beach Club", "Rolls-Royce Chauffeur", "Ultra-Luxury Suites"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
  {
    id: "hotel-taj-lake-palace",
    name: "Taj Lake Palace",
    location: "Lake Pichola, Udaipur",
    stars: "5",
    price: 32000,
    ratings: 4.8,
    amenities: ["Royal Heritage Suites", "Private Boat Transfers", "Jiva Spa", "Lakeside Dining"],
    image: "https://images.unsplash.com/photo-1549294413-26f195200c16?w=800&q=80",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location") || searchParams.get("place") || "popular destinations";

  const prompt = `Act as an elite luxury travel booking concierge. The user is searching for accommodations in or around: "${location}".
Generate exactly 6 distinctive, realistic luxury hotels or boutique resorts.
For each hotel, return:
- "id": A unique string
- "name": Hotel or resort name
- "location": Specific neighborhood, city, or area
- "stars": "4" or "5"
- "price": Realistic price per night in INR as a number (e.g. 18500)
- "ratings": Rating number between 4.5 and 5.0 (e.g. 4.8)
- "amenities": Array of 3-4 luxury amenities (e.g. ["Free WiFi", "Infinity Pool", "Fine Dining"])
- "image": Valid high-resolution Unsplash photo URL of a luxury hotel

Return ONLY a JSON array of 6 hotel objects.`;

  const results = await queryGroqJson<any[]>({
    prompt,
    cacheKey: `hotels:${location.toLowerCase().trim()}`,
    ttlSeconds: 600,
    fallback: FALLBACK_HOTELS,
    maxTokens: 2000,
    temperature: 0.7,
  });

  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: "Use GET /api/hotels?location=Paris" });
}
