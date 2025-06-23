/**
 * Secure AI Agent API Endpoint
 * Handles AI requests server-side with proper security, sanitization, and error handling
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { AIService } from '@/lib/services/AIService';
import { AIErrorHandler } from '@/lib/errors/AIErrorHandler';
import { sanitizeAIRequest } from '@/lib/utils/inputSanitizer';
import { rateLimit } from '@/lib/rate-limit';
import { getOfflineResponse } from '@/components/ai-agent/mockResponses';
import { ModuleType, PromptIntent } from '@/components/ai-agent/types';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per interval
  tokenInterval: 10, // 10 requests per interval per user
});

interface AIGenerateRequest {
  prompt: string;
  module?: ModuleType;
  intent?: PromptIntent;
  context?: string;
  history?: string[];
  mockMode?: boolean;
  model?: 'openai' | 'gemini';
  iterationCount?: number;
  previousResponse?: string;
  feedbackType?: 'refine' | 'elaborate' | 'correct';
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Rate limiting check
    const { success } = await limiter.check(res, 10, 'CACHE_TOKEN');
    if (!success) {
      const error = AIErrorHandler.create(new Error('Rate limit exceeded'), 'Rate Limiting');
      return res.status(429).json(AIErrorHandler.createAPIResponse(error));
    }

    // Method validation
    if (req.method !== 'POST') {
      const error = AIErrorHandler.create(new Error('Method not allowed'), 'HTTP Method');
      return res.status(405).json(AIErrorHandler.createAPIResponse(error));
    }

    // Environment validation
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasGemini = !!process.env.GEMINI_API_KEY;
    
    if (!hasOpenAI && !hasGemini) {
      const error = AIErrorHandler.create(new Error('No AI service configured'), 'Configuration');
      return res.status(500).json(AIErrorHandler.createAPIResponse(error));
    }

    // Input sanitization and validation
    let sanitizedRequest: AIGenerateRequest;
    try {
      sanitizedRequest = sanitizeAIRequest(req.body);
    } catch (sanitizationError) {
      const error = AIErrorHandler.create(sanitizationError, 'Input Sanitization');
      return res.status(400).json(AIErrorHandler.createAPIResponse(error));
    }

    // Validate required fields
    if (!sanitizedRequest.prompt || sanitizedRequest.prompt.trim().length === 0) {
      const error = AIErrorHandler.create(new Error('Prompt is required'), 'Validation');
      return res.status(400).json(AIErrorHandler.createAPIResponse(error));
    }

    // Handle mock mode
    if (sanitizedRequest.mockMode) {
      try {
        const mockResponse = await getOfflineResponse(
          sanitizedRequest.module,
          sanitizedRequest.intent,
          sanitizedRequest.prompt
        );

        return res.status(200).json({
          id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          content: mockResponse.response,
          timestamp: mockResponse.timestamp,
          metadata: {
            model: 'mock',
            module: sanitizedRequest.module,
            intent: sanitizedRequest.intent,
            responseTime: 500 // Simulated response time
          }
        });
      } catch (mockError) {
        const error = AIErrorHandler.create(mockError, 'Mock Response');
        return res.status(500).json(AIErrorHandler.createAPIResponse(error));
      }
    }

    // Determine which AI service to use
    let model = sanitizedRequest.model || 'openai';
    if (model === 'openai' && !hasOpenAI) {
      model = 'gemini';
    } else if (model === 'gemini' && !hasGemini) {
      model = 'openai';
    }

    // Generate AI response
    try {
      const aiResponse = await AIService.generateResponse({
        prompt: sanitizedRequest.prompt,
        module: sanitizedRequest.module,
        intent: sanitizedRequest.intent,
        context: sanitizedRequest.context,
        history: sanitizedRequest.history,
        model
      });

      return res.status(200).json(aiResponse);

    } catch (aiError) {
      const error = AIErrorHandler.create(aiError, 'AI Generation');
      const statusCode = AIErrorHandler.getStatusCode(error);
      
      // Log error details for monitoring
      AIErrorHandler.logError(error);

      return res.status(statusCode).json(AIErrorHandler.createAPIResponse(error));
    }

  } catch (unexpectedError) {
    // Handle any unexpected errors
    const error = AIErrorHandler.create(unexpectedError, 'Unexpected Error');
    AIErrorHandler.logError(error);
    
    return res.status(500).json(AIErrorHandler.createAPIResponse(error));
  }
}

// Export configuration for Next.js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // Limit request size
    },
  },
}
