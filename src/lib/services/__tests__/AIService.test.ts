/**
 * 🧪 AIService Integration Tests
 * 
 * Tests the refactored AI Service layer with:
 * - Service layer functionality
 * - Input validation and sanitization
 * - Error handling
 * - Caching mechanisms
 * - Rate limiting
 */

import { AIService, AIServiceRequest } from '../AIService';
import { ModuleType, PromptIntent } from '@/components/ai-agent/types';

// Mock fetch for testing
global.fetch = jest.fn();

describe('AIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear cache between tests
    (AIService as any).responseCache.clear();
  });

  describe('Input Validation', () => {
    it('should reject requests with missing required fields', async () => {
      const invalidRequest: Partial<AIServiceRequest> = {
        module: 'OPD',
        intent: 'screening'
        // Missing prompt
      };

      const response = await AIService.generateResponse(invalidRequest as AIServiceRequest);
      
      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('INVALID_INPUT');
      expect(response.error?.message).toContain('required fields');
    });

    it('should reject requests with invalid module', async () => {
      const invalidRequest: AIServiceRequest = {
        prompt: 'Test prompt',
        module: 'INVALID_MODULE' as ModuleType,
        intent: 'screening'
      };

      const response = await AIService.generateResponse(invalidRequest);
      
      expect(response.success).toBe(false);
      expect(response.error?.code).toBe('INVALID_INPUT');
      expect(response.error?.message).toContain('Invalid module');
    });
  });

  describe('Successful AI Response', () => {
    beforeEach(() => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'test-id-123',
          content: 'Test AI response content',
          timestamp: new Date().toISOString(),
          metadata: {
            model: 'gemini-pro'
          }
        })
      } as Response);
    });

    it('should generate a successful response', async () => {
      const request: AIServiceRequest = {
        prompt: 'What are the symptoms of hypertension?',
        module: 'OPD',
        intent: 'screening'
      };

      const response = await AIService.generateResponse(request);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data?.content).toBe('Test AI response content');
      expect(response.data?.id).toBe('test-id-123');
      expect(response.metadata?.provider).toBe('gemini');
      expect(response.metadata?.sanitized).toBe(true);
    });

    it('should call Netlify function with correct parameters', async () => {
      const request: AIServiceRequest = {
        prompt: 'Test medical question',
        module: 'CDU',
        intent: 'triage',
        context: 'Patient history',
        history: ['Previous interaction']
      };

      await AIService.generateResponse(request);

      expect(fetch).toHaveBeenCalledWith('/.netlify/functions/gemini-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Test medical question',
          context: 'Patient history',
          history: ['Previous interaction'],
          module: 'CDU',
          intent: 'triage'
        }),
        signal: expect.any(AbortSignal)
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
        new Error('Network error')
      );

      const request: AIServiceRequest = {
        prompt: 'Test prompt',
        module: 'OPD',
        intent: 'screening'
      };

      const response = await AIService.generateResponse(request);

      expect(response.success).toBe(false);
      expect(response.error?.code).toBeDefined();
      expect(response.error?.retryable).toBeDefined();
    });

    it('should handle HTTP errors', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests'
      } as Response);

      const request: AIServiceRequest = {
        prompt: 'Test prompt',
        module: 'OPD',
        intent: 'screening'
      };

      const response = await AIService.generateResponse(request);

      expect(response.success).toBe(false);
      expect(response.error?.message).toContain('HTTP 429');
    });
  });

  describe('Caching', () => {
    beforeEach(() => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'test-id-123',
          content: 'Cached response',
          timestamp: new Date().toISOString(),
          metadata: {
            model: 'gemini-pro'
          }
        })
      } as Response);
    });

    it('should cache responses and return cached data on subsequent calls', async () => {
      const request: AIServiceRequest = {
        prompt: 'Repeatable test prompt',
        module: 'OPD',
        intent: 'screening'
      };

      // First call - should hit the API
      const firstResponse = await AIService.generateResponse(request);
      expect(firstResponse.success).toBe(true);
      expect(firstResponse.metadata?.cached).toBe(false);

      // Second call - should return cached data
      const secondResponse = await AIService.generateResponse(request);
      expect(secondResponse.success).toBe(true);
      expect(secondResponse.metadata?.cached).toBe(true);
      expect(secondResponse.data?.content).toBe('Cached response');

      // Verify fetch was only called once
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should bypass cache when caching is disabled', async () => {
      const request: AIServiceRequest = {
        prompt: 'Test prompt',
        module: 'OPD',
        intent: 'screening'
      };

      // Make two calls with caching disabled
      await AIService.generateResponse(request, { enableCaching: false });
      await AIService.generateResponse(request, { enableCaching: false });

      // Verify fetch was called twice
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Configuration', () => {
    it('should allow configuration updates', () => {
      const newConfig = {
        maxRetries: 5,
        timeoutMs: 60000
      };

      AIService.updateConfig(newConfig);
      const currentConfig = AIService.getConfig();

      expect(currentConfig.maxRetries).toBe(5);
      expect(currentConfig.timeoutMs).toBe(60000);
    });

    it('should maintain default values for unspecified config', () => {
      AIService.updateConfig({ maxRetries: 5 });
      const currentConfig = AIService.getConfig();

      expect(currentConfig.maxRetries).toBe(5);
      expect(currentConfig.enableCaching).toBe(true); // Should keep default
    });
  });

  describe('Health Check', () => {
    it('should return healthy status when service is working', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'health-check',
          content: 'OK',
          timestamp: new Date().toISOString(),
          metadata: { model: 'gemini-pro' }
        })
      } as Response);

      const health = await AIService.healthCheck();

      expect(health.healthy).toBe(true);
      expect(health.provider).toBe('gemini');
      expect(health.latency).toBeGreaterThan(0);
    });

    it('should return unhealthy status when service fails', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockRejectedValue(
        new Error('Service unavailable')
      );

      const health = await AIService.healthCheck();

      expect(health.healthy).toBe(false);
      expect(health.provider).toBe('gemini');
      expect(health.latency).toBeUndefined();
    });
  });

  describe('Backward Compatibility Functions', () => {
    beforeEach(() => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'compat-test',
          content: 'Compatibility test response',
          timestamp: new Date().toISOString(),
          metadata: { model: 'gemini-pro' }
        })
      } as Response);
    });

    it('should support callAIAgent function', async () => {
      const { callAIAgent } = await import('../AIService');
      
      const request: AIServiceRequest = {
        prompt: 'Test prompt',
        module: 'OPD',
        intent: 'screening'
      };

      const response = await callAIAgent(request);

      expect(response.id).toBe('compat-test');
      expect(response.content).toBe('Compatibility test response');
    });

    it('should support callAIAgentWithRetry function', async () => {
      const { callAIAgentWithRetry } = await import('../AIService');
      
      const request: AIServiceRequest = {
        prompt: 'Test prompt',
        module: 'OPD',
        intent: 'screening'
      };

      const response = await callAIAgentWithRetry(request, 3);

      expect(response.id).toBe('compat-test');
      expect(response.content).toBe('Compatibility test response');
    });
  });
});
