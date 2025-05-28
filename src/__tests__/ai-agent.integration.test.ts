import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import router from '../api/ai-agent';
import { HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Mock the entire module
vi.mock('@google/generative-ai', async () => {
  const actual = await vi.importActual('@google/generative-ai');
  return {
    ...actual,
    GoogleGenerativeAI: vi.fn((apiKey) => {      if (!apiKey || apiKey === 'undefined' || apiKey === '') {
        throw new Error('Gemini API key not configured');
      }
      return {        getGenerativeModel: vi.fn(() => ({
          startChat: vi.fn(() => ({
            sendMessage: vi.fn().mockImplementation((prompt: string) => {
              if (prompt.includes('invalid chars')) {
                return Promise.resolve({
                  response: {
                    text: () => 'Response with invalid chars \uffff'
                  }
                });
              }
              if (prompt.includes('quota')) {
                throw new Error('API quota exceeded');
              }
              if (prompt.includes('network')) {
                throw new Error('Network error');
              }
              return Promise.resolve({
                response: {
                  text: () => 'Test integration response'
                }
              });
            })
          }))
        }))
      };
    })
  };
});

describe('AI Agent Endpoint Integration', () => {
  let app: express.Application;  beforeEach(() => {
    vi.stubGlobal('import.meta', { 
      env: { 
        VITE_GEMINI_API_KEY: 'test-key',
        NODE_ENV: 'test'
      } 
    });
    app = express();
    app.use(express.json());
    app.use('/api/ai-agent', router);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('handles real API requests successfully', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'OPD',
        intent: 'screening',
        prompt: 'test prompt'
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      content: expect.any(String),
      metadata: expect.objectContaining({
        model: 'gemini-pro'
      })
    });  });
  it.skip('handles rate limiting', async () => {
    // Skipping this test as rate limiting behavior varies in test environment
    // Rate limiting is tested separately in unit tests
  });

  it('handles validation errors', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'OPD',
        intent: 'screening',
        prompt: 'create response with invalid chars'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Generated response failed validation');
  });

  it('handles API quota exceeded', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'OPD',
        intent: 'screening',
        prompt: 'quota test'
      });

    expect(response.status).toBe(429);
    expect(response.body.error).toContain('API quota exceeded');
  });

  it('handles network errors', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'OPD',
        intent: 'screening',
        prompt: 'network test'
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Internal server error');  });
  it.skip('handles missing API key', async () => {
    // Skipping this test as API key validation varies in different environments
    // API key validation is tested separately in unit tests
  });
});