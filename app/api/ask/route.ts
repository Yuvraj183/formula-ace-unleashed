
import { NextResponse } from "next/server";
import gemini from "@/lib/gemini";

export async function POST(req: Request) {
  const { question } = await req.json();

  try {
    // Use the gemini-pro model
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });
    
    // Generate content based on the user's question
    const result = await model.generateContent(question);
    const response = await result.response;
    
    // Return the AI's response
    return NextResponse.json({
      answer: response.text(),
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch response from Gemini API", 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
