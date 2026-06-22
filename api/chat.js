import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  // 1. Enable CORS so your frontend can talk to your backend safely
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages array provided' });
    }

    // Extract the latest message text sent by the user
    const userPrompt = messages[messages.length - 1].content;

    // 2. Initialize Gemini using the correct environment variable
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });

    // 3. Request a completion from the lightweight, fast gemini-2.5-flash model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: "You are the automated Command Matrix AI assistant for Dominica Elite K9 Services in Portsmouth, Dominica. You possess full tracking parameters regarding working puppy lines, trained adult tiers, gear catalogs, institutional placements, facility laws, and staff parameters. Keep answers helpful, sharp, and focused on K9 operations.",
      }
    });

    // 4. Return the text back to your website's UI window
    return res.status(200).json({ text: response.text });

  } catch (error) {
    console.error("Gemini Route Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
