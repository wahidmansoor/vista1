import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const prompt = `
Please provide a concise summary of this oncology handbook section. Focus on key points and clinical relevance:

${content}

Summarize in about 3-4 bullet points, keeping it clear and clinically focused.
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert oncologist summarizing medical content for other clinicians. Be precise, clinically relevant, and evidence-based in your summaries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 250,
    });

    const summary = completion.choices[0].message.content || "Failed to generate summary";

    return res.status(200).json({ summary });
  } catch (error: any) {
    console.error('Error generating summary:', error);
    return res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
}
