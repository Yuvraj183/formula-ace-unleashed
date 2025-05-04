
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with the API key from environment variables
const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default gemini;
