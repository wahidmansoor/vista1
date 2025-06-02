import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import router from '../api/ai-agent';

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
          generateContent: vi.fn().mockImplementation((prompt: string) => {
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
                text: () => 'Test API response'
              }
            });
          })
        }))
      };
    })
  };
});

describe('AI Agent API', () => {
  let app: express.Application;

  beforeEach(() => {
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

  it('makes correct API call with proper params', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'OPD',
        intent: 'screening',
        prompt: 'test prompt',
        context: { key: 'value' }
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: expect.any(String),
      content: expect.any(String),
      model: 'gemini-pro'
    });
  });

  it('handles invalid JSON request', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send('invalid json');

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid JSON in request body');
  });

  it('handles missing required fields', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Missing required fields');
  });

  it('validates mock mode response', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'OPD',
        intent: 'screening',
        prompt: 'test prompt',
        mockMode: true
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'mock-response-1',
      content: 'This is a mock response',
      model: 'mock'
    });
  });

  it('handles quota exceeded errors', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'test',
        intent: 'test',
        prompt: 'quota test'
      });

    expect(response.status).toBe(429);
    expect(response.body).toHaveProperty('error', 'API quota exceeded');
  });

  it('handles validation errors', async () => {
    const response = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'test',
        intent: 'test',
        prompt: '\u0000invalid\u2028chars\uFFFF'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Generated response failed validation');
  });
});