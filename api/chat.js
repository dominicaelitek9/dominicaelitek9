import { GoogleGenAI } from '@google/genai';

// Initialize the SDK cleanly - it handles looking up process.env.GEMINI_API_KEY automatically!
const ai = new GoogleGenAI();

export default async function handler(req, res) {
    // Enable CORS handling for safety
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const { message } = req.body;

        const systemInstruction = `You are the Dominica Elite K9 Services Automated Operations Center AI assistant. 
Always answer warmly and professionally, directing the user to look at the store catalog tables on the webpage and click any available links to proceed.`;

        // Execute generation payload with standard configuration nesting rules
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
        console.error("Internal Gateway Error:", error);
        return res.status(500).json({ error: "The generative engine failed to process the instruction." });
    }
}
    } catch (error) {
        console.error("Internal Gateway Error:", error);
        res.status(500).json({ error: "The generative engine failed to process the instruction." });
    }
};
