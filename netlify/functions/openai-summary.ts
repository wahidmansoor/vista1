import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface OpenAIRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
  temperature?: number;
}

interface OpenAIResponse {
  id: string;
  content: string;
  timestamp: string;
  metadata: {
    model: string;
    tokens?: number;
  };
}

class OpenAIError extends Error {
  constructor(
    message: string,
    public code: string = 'OPENAI_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'OpenAIError';
  }
}

function validateApiKey(): string {
  const API_KEY = process.env.OPENAI_API_KEY || '';
  if (!API_KEY) {
    throw new OpenAIError('OpenAI API key not configured', 'API_KEY_MISSING', 400);
  }
  return API_KEY;
}

async function generateOpenAIResponse(
  prompt: string, 
  context?: string, 
  maxTokens: number = 500,
  temperature: number = 0.7
): Promise<OpenAIResponse> {
  const API_KEY = validateApiKey();
  const API_URL = 'https://api.openai.com/v1/chat/completions';

  try {
    const enhancedPrompt = context 
      ? `Context: ${context}\n\nRequest: ${prompt}`
      : prompt;

    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant specializing in oncology and medical information. Provide accurate, helpful responses while being mindful of medical ethics and patient safety.'
        },
        {
          role: 'user',
          content: enhancedPrompt
        }
      ],
      max_tokens: maxTokens,
      temperature: temperature,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OpenAIError(
        errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
        'API_REQUEST_FAILED',
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new OpenAIError('No response generated', 'NO_RESPONSE', 500);
    }

    const content = data.choices[0]?.message?.content;
    if (!content) {
      throw new OpenAIError('Invalid response format', 'INVALID_RESPONSE', 500);
    }

    return {
      id: `openai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      metadata: {
        model: data.model || 'gpt-3.5-turbo',
        tokens: data.usage?.total_tokens
      }
    };

  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }
    throw new OpenAIError(
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
    const body: OpenAIRequest = JSON.parse(event.body || '{}');
    const { prompt, context, maxTokens, temperature } = body;

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
    const response = await generateOpenAIResponse(prompt, context, maxTokens, temperature);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };

  } catch (error) {
    console.error('OpenAI function error:', error);

    if (error instanceof OpenAIError) {
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
