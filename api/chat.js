import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    try {
        const { message } = req.body;
        const result = await generateText({
            model: google('gemini-2.5-flash'),
            prompt: message,
            system: 'You are the Dominica Elite K9 Services Automated Operations Center AI assistant. Always answer warmly and professionally.'
        });

        return res.status(200).json({ reply: result.text });
    } catch (error) {
        console.error("Backend Error:", error);
        return res.status(500).json({ error: "Failed to reach the serverless engine." });
    }
}
