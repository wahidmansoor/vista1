import { Request, Response } from 'express';
import { OpenAIStream } from '../../../lib/openai-stream';
import { OpenAIStreamPayload } from '../../../types/ai';

const rateLimitWindowMs = 60 * 1000; // 1 minute
const requestsPerWindow = 3;
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Simple in-memory rate limiter
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now >= record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + rateLimitWindowMs });
    return true;
  }

  if (record.count >= requestsPerWindow) {
    return false;
  }

  record.count++;
  return true;
}

export default async function handler(req: Request, res: Response) {
  // Track connection status
  let isConnectionClosed = false;
  // Handle client disconnection
  req.on('close', () => {
    isConnectionClosed = true;
  });

  try {
    // Apply rate limiting
    const clientIp = req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again in 60 seconds.'
      });
    }

    // Method validation
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Request body validation
    const { prompt, context } = req.body;
    if (!prompt || !context) {
      return res.status(400).json({ 
        error: 'Missing required fields: prompt and context' 
      });
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: 'You are a medical AI assistant specializing in oncology. Generate concise, accurate summaries focusing on key clinical points.'
      },
      {
        role: 'user',
        content: `${prompt}\n\nContent to summarize:\n${context}`
      }
    ] satisfies Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;

    // Create payload
    const payload: OpenAIStreamPayload = {
      model: process.env.AI_MODEL || 'gpt-4',
      messages,
      temperature: 0.3,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
    };

    // Get streaming response from OpenAI
    const stream = await OpenAIStream(payload);

    // Set up streaming response headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    try {
      // Stream the response back to client
      for await (const chunk of stream) {
        if (isConnectionClosed) {
          // Client disconnected, clean up and stop processing
          stream.controller?.abort();
          break;
        }

        try {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        } catch (streamError) {
          console.error('Error processing stream chunk:', streamError);
          continue;
        }
      }

      // Only send completion message if client is still connected
      if (!isConnectionClosed) {
        res.write('data: [DONE]\n\n');
        res.end();
      }
    } catch (streamError) {
      console.error('Stream processing error:', streamError);
      if (!isConnectionClosed) {
        res.write(`data: ${JSON.stringify({ error: 'Stream processing error' })}\n\n`);
        res.end();
      }
    }

  } catch (error: any) {
    console.error('AI Summary Generation Error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate summary',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
