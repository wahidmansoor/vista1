import { vi, afterEach } from 'vitest';

// Set up test environment
process.env.VITE_GEMINI_API_KEY = 'test-key';
(process.env as any).NODE_ENV = 'test';

// Mock rate limiter for tests
vi.mock('../lib/rate-limit', () => ({
  default: {
    check: vi.fn().mockReturnValue(true),
    reset: vi.fn()
  }
}));

// Mock environment variables
vi.stubGlobal('import.meta', { 
  env: { 
    VITE_GEMINI_API_KEY: 'test-key',
    NODE_ENV: 'test'
  } 
});

// Mock console.error to avoid noise in test output
console.error = vi.fn();

// Increase timeout for all tests
vi.setConfig({ testTimeout: 10000 });

// Reset mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});