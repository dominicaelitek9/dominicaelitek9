import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export default async function POST(req, res) {
  const { messages } = req.body;

  const result = await streamText({
    model: google('gemini-2.0-flash'),
    messages,
    system: 'You are the Dominica Elite K9 Services AI assistant. Be professional and helpful.',
  });

  return result.toDataStreamResponse();
}
