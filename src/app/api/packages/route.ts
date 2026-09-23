import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination") || "worldwide";
  const month = searchParams.get("month") || "Anytime";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

    const prompt = `Generate exactly 4 highly realistic luxury holiday packages for someone looking to travel to ${destination} during ${month}. 
The prices must be highly realistic for a premium luxury vacation, strictly in Indian Rupees (INR) (e.g., between 80000 and 500000 per person).
CRITICAL: The "image" MUST be a fully qualified, working Unsplash photo URL like "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80". DO NOT use relative URLs like /images/bali_resort.png.`;

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
                id: { type: "NUMBER" },
                title: { type: "STRING" },
                location: { type: "STRING" },
                image: { type: "STRING" },
                days: { type: "STRING" },
                originalPrice: { type: "NUMBER" },
                price: { type: "NUMBER" },
                rating: { type: "NUMBER" },
                reviews: { type: "NUMBER" },
                tags: { type: "ARRAY", items: { type: "STRING" } },
                includes: { type: "ARRAY", items: { type: "STRING" } }
              },
              required: ["id", "title", "location", "image", "days", "originalPrice", "price", "rating", "reviews", "tags", "includes"]
            }
          }
        }
      })
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      console.error("Gemini Details:", errorText);
      throw new Error(`Gemini API failed: ${geminiRes.status} ${errorText}`);
    }

    const data = await geminiRes.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const packages = JSON.parse(content.replace(/^```json/i, "").replace(/```$/, "").trim());

    return NextResponse.json(packages);
  } catch (error) {
    console.error("Packages API Error:", error);
    return NextResponse.json([]);
  }
}
