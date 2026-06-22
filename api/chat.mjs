import { GoogleGenAI } from '@google/genai';

// Initialize with an empty configuration object as strictly required by the SDK in Node environments
const ai = new GoogleGenAI({});

export default async function handler(req, res) {
    // Inject core Cross-Origin Resource Sharing security headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message payload is completely blank.' });
        }

        const systemInstruction = `You are the Dominica Elite K9 Services Automated Operations Center AI assistant. Always answer warmly and professionally, directing the user to look at the store catalog tables on the webpage and click any available links to proceed.`;

        // Execute text generation using the precise active flash standard model identifier
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        });

        // Pull the text response directly from the SDK string variable 
        const aiResponseText = response.text;
        return res.status(200).json({ reply: aiResponseText });

    } catch (error) {
        console.error("Internal Serverless Engine Error:", error);
        return res.status(500).json({ 
            error: "The generative model failed to handle the instruction set.",
            details: error.message 
        });
    }
}
