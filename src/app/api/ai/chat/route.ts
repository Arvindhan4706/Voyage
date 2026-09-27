import { NextResponse } from "next/server";
import { groq } from "@/lib/ai/groq";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    
    // System prompt for the conversational assistant
    const systemPrompt = {
      role: "system",
      content: `You are Voyage AI, an expert travel companion. 
You help users plan trips, offer suggestions, and answer travel-related questions.
You are friendly, concise, and helpful.
If you need specific prices or availability, remind the user that Voyage AI uses real-time search for those and you can help them construct a search.`
    };

    const chatCompletion = await groq.chat.completions.create({
      messages: [systemPrompt, ...messages],
      model: model,
      temperature: 0.7,
    });

    return NextResponse.json({
      success: true,
      message: chatCompletion.choices[0]?.message,
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
