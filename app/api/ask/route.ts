import { NextResponse } from "next/server";
import gemini from "@/lib/gemini";

export async function POST(req: Request) {
  const { question } = await req.json();

  try {
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(question);
    const response = await result.response;
    
    return NextResponse.json({
      answer: response.text(),
    });

    return NextResponse.json({
      answer: response.text(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
