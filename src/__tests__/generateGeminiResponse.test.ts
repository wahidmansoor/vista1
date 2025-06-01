// Jest globals used: describe, it, expect, beforeEach, afterEach;
import { generateGeminiResponse } from '../lib/gemini';

jest.mock('@google/generative-ai', () => {
  // For Jest, we'll use a simpler approach instead of importActual
  const actual = {};
  return {
    ...actual,
    GoogleGenerativeAI: jest.fn((apiKey) => {
      if (!apiKey || apiKey === 'undefined') {
        throw new Error('Gemini API key not configured');
      }
      return {
        getGenerativeModel: jest.fn(() => ({
          startChat: jest.fn(() => ({
            sendMessage: jest.fn().mockImplementation((prompt: string) => {
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
    Object.defineProperty(global, 'import.meta', { value: { 
      env: { 
        VITE_GEMINI_API_KEY: 'test-key',
        NODE_ENV: 'test'
      } 
    }, writable: true });
    jest.clearAllMocks();
  });
  afterEach(() => {
    jest.resetModules();
  });

  it('throws error when API key is not configured', async () => {
    Object.defineProperty(global, 'import.meta', { value: { env: {} }, writable: true });
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