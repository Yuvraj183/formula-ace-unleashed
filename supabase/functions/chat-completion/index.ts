import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const { message, context } = await req.json();
    
    console.log('Received request with message:', message);

    // Build messages for Gemini
    const systemPrompt = `You are an expert JEE (Joint Entrance Examination) tutor specializing in Physics, Chemistry, and Mathematics. 

CRITICAL INSTRUCTIONS:
1. ALWAYS provide a COMPLETE, DETAILED answer to every question
2. Format all mathematical expressions using LaTeX notation with $ for inline math and $$ for display math
3. Break down complex problems into clear steps
4. Include relevant formulas and explain each variable
5. Show all calculations and reasoning
6. For numerical problems, provide the final answer clearly
7. Use proper LaTeX formatting: 
   - Inline: $x^2 + y^2 = r^2$
   - Display: $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$

Example response format:
**Problem:** [Restate the question]

**Solution:**
Step 1: [First step with explanation]
$$[relevant formula]$$

Step 2: [Second step]
$[inline calculation]$

**Answer:** [Final answer with units if applicable]`;

    const messages = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      ...(context || []).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      {
        role: 'user',
        parts: [{ text: message }]
      }
    ];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: messages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        }
      }),
    });

    const data = await response.json();
    
    console.log('Gemini API response:', JSON.stringify(data));
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(`Gemini API error: ${data.error.message}`);
    }
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated from the API');
    }

    const firstCandidate: any = data.candidates[0];
    const parts = firstCandidate?.content?.parts;

    let generatedText = '';
    if (Array.isArray(parts) && parts.length > 0) {
      generatedText = parts
        .map((part: any) => (typeof part.text === 'string' ? part.text : ''))
        .join('\n')
        .trim();
    }

    if (!generatedText) {
      console.error('Gemini API returned candidate without text parts:', JSON.stringify(data));
      generatedText = 'I could not generate a proper answer for this question. Please try rephrasing it or asking a slightly shorter, more specific question.';
    }

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat completion function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.toString() 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
