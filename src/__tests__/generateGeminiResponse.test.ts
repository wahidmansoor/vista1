import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateGeminiResponse } from '../lib/gemini';

vi.mock('@google/generative-ai', async () => {
  const actual = await vi.importActual('@google/generative-ai');
  return {
    ...actual,
    GoogleGenerativeAI: vi.fn((apiKey) => {
      if (!apiKey || apiKey === 'undefined') {
        throw new Error('Gemini API key not configured');
      }
      return {
        getGenerativeModel: vi.fn(() => ({
          startChat: vi.fn(() => ({
            sendMessage: vi.fn().mockImplementation((prompt: string) => {
              if (prompt.includes('\uffff')) {
                throw new Error('Response contains invalid JSON characters');
              }
              if (prompt.includes('quota')) {
                throw new Error('API quota exceeded');
              }
              if (prompt.includes('network')) {
                throw new Error('Network error');
              }
              return Promise.resolve({
                response: {
                  text: () => 'Test response'
                }
              });
            })
          }))
        }))
      };
    })
  };
});

describe('generateGeminiResponse', () => {
  beforeEach(() => {
    vi.stubGlobal('import.meta', { 
      env: { 
        VITE_GEMINI_API_KEY: 'test-key',
        NODE_ENV: 'test'
      } 
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('throws error when API key is not configured', async () => {
    vi.stubGlobal('import.meta', { env: {} });
    await expect(generateGeminiResponse('test prompt'))
      .rejects
      .toThrow('Gemini API key not configured');
  });

  it('returns valid response for normal prompt', async () => {
    const response = await generateGeminiResponse('test prompt');
    expect(response).toMatchObject({
      id: expect.any(String),
      content: expect.any(String),
      metadata: {
        model: 'gemini-pro'
      }
    });
  });

  it('handles network errors gracefully', async () => {
    await expect(generateGeminiResponse('network test'))
      .rejects
      .toThrow('Network error');
  });

  it('handles quota exceeded errors', async () => {
    await expect(generateGeminiResponse('quota test'))
      .rejects
      .toThrow('API quota exceeded');
  });

  it('validates JSON safety of responses', async () => {
    await expect(generateGeminiResponse('test \uffff invalid'))
      .rejects
      .toThrow('Response contains invalid JSON characters');
  });
});