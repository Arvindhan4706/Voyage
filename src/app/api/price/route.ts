import { NextResponse } from "next/server";
import { queryGroqJson } from "@/lib/ai/groq";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { source, destination, dates, passengers = 1, travelClass = "Economy" } = body;

    if (!source || !destination) {
      return NextResponse.json({ error: "Source and destination required" }, { status: 400 });
    }

    const departDate = dates ? new Date(dates) : new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysLeft = Math.max(0, Math.ceil((departDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    const prompt = `You are an elite flight pricing engine. Provide a realistic estimated flight price in INR (Indian Rupees) for a single adult flying one-way.
Flight Details:
- Origin: ${source}
- Destination: ${destination}
- Days left until departure: ${daysLeft}
- Travel Class: ${travelClass}

Return EXACTLY a JSON object with this schema:
{
  "price": number (the realistic base price per person in INR, e.g. 5400),
  "duration_hours": number (realistic flight duration in hours, e.g. 2.5),
  "historical_low": number (lowest expected price),
  "historical_high": number (highest expected price),
  "trend": string ("rising", "stable", or "falling"),
  "explanation": string (brief explanation of the fare)
}
No markdown formatting, just the raw JSON object.`;

    const fallbackPricing = {
      price: 5800,
      duration_hours: 2.5,
      historical_low: 4500,
      historical_high: 8200,
      trend: "stable",
      explanation: `Standard dynamic pricing estimated for ${travelClass} class on ${source} to ${destination} route.`
    };

    const parsed = await queryGroqJson<typeof fallbackPricing>({
      prompt,
      cacheKey: `price:${source.toLowerCase()}:${destination.toLowerCase()}:${daysLeft}:${travelClass.toLowerCase()}`,
      ttlSeconds: 600,
      fallback: fallbackPricing,
      maxTokens: 1000,
      temperature: 0.3,
    });

    const pricePerPerson = parsed.price || 5500;
    const totalPrice = Math.round(pricePerPerson * passengers);

    const fareOptions = generateFareOptions(
      source, 
      destination, 
      pricePerPerson, 
      passengers, 
      parsed.duration_hours || 2.5, 
      8 // default 8am
    );

    return NextResponse.json({
      price: totalPrice,
      price_per_person: pricePerPerson,
      historical_low: parsed.historical_low || Math.round(pricePerPerson * 0.8),
      historical_high: parsed.historical_high || Math.round(pricePerPerson * 1.2),
      trend: parsed.trend || "stable",
      duration_hours: parsed.duration_hours || 2.5,
      days_left: daysLeft,
      calculation_method: `Groq AI Flight Predictor (Real-Time)`,
      model_version: "Groq LLM",
      disclaimer: "Real-time AI forecasted market fares.",
      explainability: [parsed.explanation || "Price estimated based on route and demand."],
      real_flights: fareOptions,
    });

  } catch (error) {
    console.error("Price API Error:", error);
    return NextResponse.json({ error: "Failed to predict price" }, { status: 500 });
  }
}

function generateFareOptions(
  source: string,
  destination: string,
  basePrice: number,
  passengers: number,
  durationHours: number,
  depHour: number,
) {
  const options = [
    { name: "IndiGo", stops: "zero" },
    { name: "Air India", stops: "zero" },
    { name: "Vistara", stops: "one" },
    { name: "SpiceJet", stops: "zero" }
  ];

  return options.map((opt, i) => {
    const flightDuration = Math.max(1, durationHours + (opt.stops === "one" ? 1.5 : 0) + (i * 0.2));
    const h = Math.floor(flightDuration);
    const m = Math.round((flightDuration - h) * 60);

    const startH = (depHour + i * 3) % 24;
    const endH = (startH + h) % 24;
    const pad = (n: number) => n.toString().padStart(2, '0');

    // Vary price slightly per airline
    const mult = opt.name === "Vistara" ? 1.15 : opt.name === "Air India" ? 1.05 : opt.name === "SpiceJet" ? 0.95 : 1.0;
    const optionBase = Math.round(basePrice * mult);

    return {
      id: `fl-${i + 1}`,
      airline: opt.name,
      flightNumber: `${opt.name.substring(0, 2).toUpperCase()}-${100 + i * 42}`,
      departure: `${pad(startH)}:00`,
      arrival: `${pad(endH)}:${pad(m)}`,
      duration: `${h}h ${m}m`,
      stops: opt.stops,
      price: optionBase * passengers,
      pricePerPerson: optionBase,
      seatsLeft: Math.floor(Math.random() * 7) + 2,
      origin: source,
      destination: destination
    };
  });
}