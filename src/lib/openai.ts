import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // Ensure we don't hang on slow requests
  timeout: 15 * 1000, // 15 seconds
  maxRetries: 2
});