import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface AIRequest {
  prompt: string;
  context?: string;
  history?: string[];
  module?: string;
  intent?: string;
}

interface AIResponse {
  id: string;
  content: string;
  timestamp: string;
  metadata: {
    model: string;
    module?: string;
    intent?: string;
  };
}

class GeminiError extends Error {
  constructor(
    message: string,
    public code: string = 'GEMINI_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'GeminiError';
  }
}

function validateApiKey(): string {
  const API_KEY = process.env.GEMINI_API_KEY || '';
  if (!API_KEY) {
    throw new GeminiError('Gemini API key not configured', 'API_KEY_MISSING', 400);
  }
  return API_KEY;
}

async function generateGeminiResponse(prompt: string, context?: string, history?: string[]): Promise<AIResponse> {
  const API_KEY = validateApiKey();
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  try {
    const enhancedPrompt = [
      context && `Context: ${context}`,
      history && history.length > 0 && `Previous conversation: ${history.join('\n')}`,
      `Current request: ${prompt}`
    ].filter(Boolean).join('\n\n');

    const requestBody = {
      contents: [{
        parts: [{
          text: enhancedPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new GeminiError(
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        'API_REQUEST_FAILED',
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new GeminiError('No response generated', 'NO_RESPONSE', 500);
    }

    const content = data.candidates[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new GeminiError('Invalid response format', 'INVALID_RESPONSE', 500);
    }

    return {
      id: `gemini-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      metadata: {
        model: 'gemini-pro'
      }
    };

  } catch (error) {
    if (error instanceof GeminiError) {
      throw error;
    }
    throw new GeminiError(
      `Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'REQUEST_FAILED',
      500
    );
  }
}

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const body: AIRequest = JSON.parse(event.body || '{}');
    const { prompt, context, history, module, intent } = body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request: prompt is required and must be a string' 
        }),
      };
    }

    // Generate response
    const response = await generateGeminiResponse(prompt, context, history);
    
    // Add module and intent to metadata if provided
    if (module) response.metadata.module = module;
    if (intent) response.metadata.intent = intent;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('Gemini AI function error:', error);

    if (error instanceof GeminiError) {
      return {
        statusCode: error.statusCode,
        headers,
        body: JSON.stringify({
          error: error.message,
          code: error.code,
        }),
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        code: 'INTERNAL_ERROR',
      }),
    };
  }
};
