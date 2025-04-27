import { NextResponse } from "next/server";
import openai from "@/lib/openai";

export async function POST(req: Request) {
  const { question } = await req.json();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: question }],
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
