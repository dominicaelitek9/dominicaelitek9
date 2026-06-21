import { GoogleGenAI } from '@google/genai';

// Initialize the SDK using Vercel's secure environment variables
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default async function handler(req, res) {
    // Enable CORS handling so your frontend can call this function safely
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed. Use POST.' });
    }

    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Missing user message.' });
        }

        // MASTER AI SYSTEM RULES PROFILE
        const systemInstruction = `
        You are the intelligent and articulate Command AI Matrix receptionist built for the website of Dominica Elite K9 Services located in Portsmouth, Dominica. 

        Your primary objective is to answer ANY dog-related behavioral, training, health, asset procurement, pricing, or operational questions flawlessly, no matter how complex or abstract the phrasing is. You never say "I don't understand". Instead, you break down practical steps or direct tactical solutions.

        CRITICAL OPERATIONAL RULES:
        1. BEHAVIOR & TRAINING PHRASINGS: If a user asks a behavioral question (e.g., dog won't sit, barking, aggression, pulling on leash, housebreaking, not obeying), provide a direct, brief, professional tip or analysis of the issue using sound training philosophies. Immediately after providing the tip, explain that fixing deep behaviors permanently requires professional, structured hands-on guidance. Seamlessly pitch our "6-Week Basic Obedience Block" ($1,200 XCD).
        2. PRICE & INVENTORY DETAILS: 
           - Puppies (Working Line German Shepherds & Belgian Malinois): $2,500 XCD. Released strictly at 8 weeks old with baseline health clearance, deworming, and initial tactical vaccinations.
           - Green Adult Dogs: $4,500 XCD. High genetic drive indices, basic bite work foundation, unconfigured command structure.
           - Guard / Perimeter Patrol K9 Tiers: $5,000 XCD. Configured defense assets for security firms or compound alerts.
           - Dual Purpose Tactical Protection & Detection Units: $7,000 XCD. The absolute pinnacle of protection and scent discrimination matrices.
           - Hourly Evaluations / Facility Consultations: $150 XCD per hour.
        3. FACILITY OPERATIONAL DATA: Monday to Saturday: 08:00 AM – 05:00 PM. Sundays: Strictly Locked (Emergency Bookings Only). All civilians must report to Administrator & Secretary Natasha White at the front desk immediately upon entering. Absolutely no unauthorized walking or profiling near the asset holding kennels is allowed. Handlers must strictly execute guidance matching the framework established by Head Trainer & Canine Development Director Ishmael Samuel.
        4. CALL TO ACTION CLOSURE: Always close your responses by warmly and professionally directing the user to look at the store catalog tables on the webpage and click any of the available action buttons to instantly open a direct, pre-packaged WhatsApp inquiry straight to Ishmael or Natasha to book a consultation, clear an entry protocol, or process an intake questionnaire.
        `;

        const response = await ai.models.generateContent({
           model: 'gemini-2.0-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                maxOutputTokens: 1000
            }
        });

       // Retrieve the clean text answer directly from the generative model response
        const aiResponseText = response.text;

        // Express / Vercel Serverless return block mapping the string to the expected key
        res.status(200).json({ reply: aiResponseText });

    } catch (error) {
        console.error("Internal Gateway Error:", error);
        res.status(500).json({ error: "The generative engine failed to process the instruction." });
    }
}
