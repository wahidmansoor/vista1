import { NextApiRequest, NextApiResponse } from 'next';
import { rateLimit } from '@/lib/rate-limit';
import { OpenAIStream } from '@/lib/openai-stream';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  tokenInterval: 3, // 3 requests per interval
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Rate limit check
    const { success } = await limiter.check(res, 3, 'CACHE_TOKEN');
    if (!success) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again in 60 seconds.' 
      });
    }

    // Method validation
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // API key validation
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    // Request body validation
    const { prompt, context } = req.body;
    if (!prompt || !context) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt and context' 
      });
    }

    // Prepare system message and user prompt
    const messages = [
      {
        role: 'system',
        content: 'You are a medical AI assistant specializing in oncology. Generate concise, accurate summaries focusing on key clinical points.'
      },
      {
        role: 'user',
        content: `${prompt}\n\nContent to summarize:\n${context}`
      }
    ];

    // Call OpenAI API with streaming
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || 'gpt-4',
        messages,
        temperature: 0.3,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error('No summary generated');
    }

    return res.status(200).json({ summary });
  } catch (error: any) {
    console.error('AI Summary Generation Error:', error);
    
    const status = error.response?.status || 500;
    const message = error.message || 'Internal server error';
    
    return res.status(status).json({ 
      error: 'Failed to generate summary',
      details: process.env.NODE_ENV === 'development' ? message : undefined
    });
  }
}