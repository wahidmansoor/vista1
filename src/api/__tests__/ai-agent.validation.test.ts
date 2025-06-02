import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/app';

describe('POST /api/ai-agent - Prompt Validation', () => {
  it('accepts a valid prompt', async () => {
    const res = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'test',
        intent: 'test',
        prompt: 'This is a valid prompt 123?! -'
      });
    // Accepts or fails for other reasons, but not prompt validation
    expect(res.status).not.toBe(400);
    expect(res.body.code).not.toBe('INVALID_PROMPT');
  });

  it('rejects a prompt that is too long', async () => {
    const res = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'test',
        intent: 'test',
        prompt: 'A'.repeat(501)
      });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_PROMPT');
    expect(res.body.error).toMatch(/Prompt validation failed/);
  });

  it('rejects a prompt with invalid characters', async () => {
    const res = await request(app)
      .post('/api/ai-agent')
      .send({
        module: 'test',
        intent: 'test',
        prompt: 'Invalid @ character!'
      });
    expect(res.status).toBe(400);
    expect(res.body.code).toBe('INVALID_PROMPT');
    expect(res.body.error).toMatch(/Prompt validation failed/);
  });
}); 