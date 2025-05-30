import OpenAI from 'openai';
import type { ChatCompletionChunk } from 'openai/resources';
import type { Stream } from 'openai/streaming';
import { OpenAIStreamPayload } from '../types/ai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function OpenAIStream(payload: OpenAIStreamPayload): Promise<Stream<ChatCompletionChunk>> {
  const abortController = new AbortController();

  try {
    const stream = await openai.chat.completions.create({
      model: payload.model,
      messages: payload.messages,
      temperature: payload.temperature ?? 0.3,
      max_tokens: payload.max_tokens ?? 500,
      top_p: payload.top_p ?? 1,
      frequency_penalty: payload.frequency_penalty ?? 0,
      presence_penalty: payload.presence_penalty ?? 0,
      stream: true,
    }, { signal: abortController.signal });

    if (!stream) {
      throw new Error('Failed to get stream from OpenAI');
    }

    // Attach abort controller to stream for cleanup
    (stream as any).controller = abortController;
    return stream;
  } catch (error) {
    console.error('OpenAI Stream Error:', error);
    // Clean up abort controller in case of error
    abortController.abort();
    throw error;
  }
}

export type { OpenAIStreamPayload };
