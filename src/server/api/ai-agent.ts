import express, { Request, Response, NextFunction, Router } from 'express';
import { generateGeminiResponse } from '../../lib/gemini';
import { getOfflineResponse } from '../../components/ai-agent/mockResponses';
import { v4 as uuidv4 } from 'uuid';
import { ModuleType, PromptIntent, AIRequestBody, AIError } from '@/types/ai-agent';
import { RateLimiter } from '../../lib/rate-limit';
import { z } from 'zod';

const router: Router = express.Router();

// Create a rate limiter instance
const rateLimiter = new RateLimiter(
  process.env.NODE_ENV === 'test' ? 3 : 10, 
  60000
); // 3 requests per minute in test, 10 in production

// Custom error handler
class APIError implements AIError {
  name: string;
  message: string;
  code: string;
  statusCode: number;
  details?: any;
  
  constructor(message: string, code: string, statusCode: number = 500, details?: any) {
    this.name = 'APIError';
    this.message = message;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

// JSON parsing error handler must be first
router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ 
      error: 'Invalid JSON in request body',
      code: 'INVALID_JSON',
      details: err.message
    });
  }
  next(err);
});

router.use(express.json());

// Validate request body
router.use((req: Request, res: Response, next: NextFunction) => {
  const { module, intent, prompt } = req.body as Partial<AIRequestBody>;
  
  if (!module || !intent || !prompt) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      code: 'MISSING_FIELDS',
      details: `Required: module, intent, prompt. Received: ${Object.keys(req.body).join(', ')}`
    });
  }
  
  next();
});

// Response validation
function validateResponse(text: string): { valid: boolean; sanitized?: string } {
  try {
    // Sanitize and check for unsafe characters
    const sanitized = text.replace(/[\u0000-\u001F\u2028\u2029\uffff]/g, '');
    
    // Verify JSON compatibility
    JSON.stringify({ test: sanitized });
    
    return {
      valid: text === sanitized,
      sanitized: sanitized
    };
  } catch {
    return { valid: false };
  }
}

/**
 * Zod schema for LLM prompt validation.
 * - String, max 500 chars
 * - Only alphanumeric, whitespace, and . , ? ! -
 */
export const promptSchema = z.string().max(500).regex(/^[\w\s.,?!-]+$/);

// Main route handler
router.post('/', async (req: Request, res: Response) => {
  try {
    const { prompt, mockMode, module, intent, context, history, iterationCount, previousResponse, feedbackType } = req.body as AIRequestBody;
    
    // Zod prompt validation
    try {
      await promptSchema.parseAsync(prompt);
    } catch (validationError: any) {
      return res.status(400).json({
        error: 'Prompt validation failed',
        code: 'INVALID_PROMPT',
        details: validationError.errors || validationError.message
      });
    }

    // Handle mock mode first
    if (mockMode) {
      const mockResponse = getOfflineResponse(module, intent);
      return res.status(200).json({
        id: 'mock-response-1',
        content: mockResponse,
        timestamp: new Date().toISOString(),
        metadata: {
          module,
          intent,
          model: 'mock',
          iterationCount: iterationCount || 0,
          feedbackType
        }
      });
    }

    // Check API key for non-mock requests
    const API_KEY = import.meta?.env?.VITE_GEMINI_API_KEY ?? process?.env?.VITE_GEMINI_API_KEY ?? '';
    if (!API_KEY) {
      throw new APIError('Gemini API key not configured', 'API_KEY_MISSING', 400);
    }
    
    // Rate limiting check
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    if (!rateLimiter.check(clientIP)) {
      throw new APIError('API quota exceeded', 'RATE_LIMIT_EXCEEDED', 429);
    }

    // Generate response
    const response = await generateGeminiResponse(prompt, context, history);
    
    // Validate response
    const validation = validateResponse(response.content);
    if (!validation.valid || !validation.sanitized) {
      throw new APIError('Generated response failed validation', 'INVALID_RESPONSE', 400);
    }

    return res.status(200).json({
      ...response,
      content: validation.sanitized,
      timestamp: new Date().toISOString(),
      metadata: {
        ...response.metadata,
        module,
        intent,
        iterationCount: iterationCount || 0,
        feedbackType
      }
    });

  } catch (error) {
    console.error('AI Agent error:', error);
    
    if (error instanceof APIError) {
      return res.status(error.statusCode).json({ 
        error: error.message,
        code: error.code,
        details: error.details
      });
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorResponse = {
      error: errorMessage,
      code: 'INTERNAL_ERROR',
      details: error instanceof Error ? error.stack : undefined
    };
    
    // Map certain errors to specific status codes
    if (errorMessage === 'Response contains invalid JSON characters') {
      return res.status(400).json({
        error: 'Generated response failed validation',
        code: 'INVALID_RESPONSE'
      });
    }
    
    if (errorMessage === 'API quota exceeded') {
      return res.status(429).json({
        error: 'API quota exceeded',
        code: 'RATE_LIMIT_EXCEEDED'
      });
    }

    if (errorMessage.toLowerCase().includes('network') || 
        errorMessage.toLowerCase().includes('connection')) {
      return res.status(500).json({
        error: 'Internal server error',
        code: 'SERVICE_UNAVAILABLE'
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

export default router;
