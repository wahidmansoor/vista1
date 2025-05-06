import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { v4 as uuidv4 } from 'uuid';
import { AIError } from '@/types/ai-agent';

const MODEL_NAME = 'gemini-pro';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

class GeminiError extends Error implements AIError {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number = 500) {
    super(message);
    this.name = 'GeminiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function validateApiKey(): string {
  const API_KEY = import.meta?.env?.VITE_GEMINI_API_KEY ?? process?.env?.VITE_GEMINI_API_KEY ?? '';
  if (!API_KEY) {
    throw new GeminiError('Gemini API key not configured', 'API_KEY_MISSING', 400);
  }
  return API_KEY;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    // Don't retry certain errors
    if (error instanceof GeminiError && 
        ['API_KEY_MISSING', 'INVALID_RESPONSE', 'RATE_LIMIT_EXCEEDED'].includes(error.code)) {
      throw error;
    }
    
    await delay(RETRY_DELAY * (MAX_RETRIES - retries + 1));
    return retryWithBackoff(fn, retries - 1);
  }
}

function validateJsonSafety(text: string): { valid: boolean; sanitized?: string } {
  try {
    // Test if the string can be safely stringified and parsed
    const parsed = JSON.parse(JSON.stringify(text));
    return { valid: true, sanitized: parsed };
  } catch (error) {
    return { valid: false };
  }
}

export async function generateGeminiResponse(prompt: string, context?: string, history?: string[]) {
  // Validate API key first
  const apiKey = validateApiKey();

  return retryWithBackoff(async () => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
        safetySettings
      });

      // Construct the chat
      const messages = [];
      if (context) {
        messages.push({ role: 'user' as const, parts: [{ text: `Context: ${context}` }] });
      }
      if (history?.length) {
        for (const msg of history) {
          messages.push({ role: 'user' as const, parts: [{ text: msg }] });
        }
      }
      messages.push({ role: 'user' as const, parts: [{ text: prompt }] });

      const chat = model.startChat({
        history: messages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      // Validate response
      const validation = validateJsonSafety(text);
      if (!validation.valid || !validation.sanitized) {
        throw new Error('Response contains invalid JSON characters');
      }

      return {
        id: uuidv4(),
        content: validation.sanitized,
        timestamp: new Date().toISOString(),
        metadata: {
          model: MODEL_NAME
        }
      };

    } catch (error) {
      if (error instanceof GeminiError) {
        throw error;
      }

      if (error instanceof Error) {
        // Pass through the original error message for expected error types
        if (
          error.message.includes('API quota exceeded') ||
          error.message.includes('Network error') ||
          error.message.includes('Response contains invalid JSON characters')
        ) {
          throw new Error(error.message);
        }

        // Check for network related errors
        if (
          error.message.toLowerCase().includes('network') ||
          error.message.toLowerCase().includes('fetch') ||
          error.message.toLowerCase().includes('connection')
        ) {
          throw new Error('Network error');
        }

        throw new GeminiError(
          `Failed to generate response: ${error.message}`,
          'GENERATION_FAILED',
          500
        );
      }

      throw new GeminiError('Unknown error occurred', 'UNKNOWN_ERROR', 500);
    }
  });
}