import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Set up test environment
process.env.VITE_GEMINI_API_KEY = 'test-key';
process.env.NODE_ENV = 'test';
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co';
process.env.VITE_SUPABASE_ANON_KEY = 'test-key';

// Mock console.error to avoid noise in test output
console.error = jest.fn();

// Mock rate limiter for tests
jest.mock('@/lib/rate-limit', () => ({
  RateLimiter: class {
    check = jest.fn().mockReturnValue(true);
    reset = jest.fn();
  }
}));

// Polyfill scrollIntoView for JSDOM
if (document.defaultView) {
  document.defaultView.HTMLElement.prototype.scrollIntoView = function() {};
}

// Add TextEncoder and TextDecoder to global
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Increase timeout for all tests
jest.setTimeout(10000);
