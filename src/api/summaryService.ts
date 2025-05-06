import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, use server-side API calls instead
});

// In production, you should implement rate limiting and additional security measures
const MAX_REQUESTS_PER_MIN = 10;
let requestCount = 0;
let lastRequestTime = Date.now();

export async function generateSummary(content: string): Promise<string> {
  if (!content) {
    throw new Error('Content is required');
  }

  // Basic rate limiting
  const now = Date.now();
  if (now - lastRequestTime > 60000) { // Reset counter every minute
    requestCount = 0;
    lastRequestTime = now;
  }

  if (requestCount >= MAX_REQUESTS_PER_MIN) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  requestCount++;

  const prompt = `
Please provide a concise summary of this oncology handbook section. Focus on key points and clinical relevance:

${content}

Summarize in about 3-4 bullet points, keeping it clear and clinically focused.
  `.trim();

  try {
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

    return completion.choices[0].message.content || "Failed to generate summary";
  } catch (error: any) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}
