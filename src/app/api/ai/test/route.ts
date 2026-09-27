import { NextResponse } from "next/server";
import { groq } from "@/lib/ai/groq";

export async function GET() {
  try {
    const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: "Hello Voyage",
        },
      ],
      model: model,
    });

    return NextResponse.json({
      success: true,
      provider: "Groq",
      model: model,
      response: chatCompletion.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error("Groq Test Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to connect to Groq" },
      { status: 500 }
    );
  }
}
