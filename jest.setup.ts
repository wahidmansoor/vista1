import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Set up test environment variables
process.env = {
  ...process.env,
  VITE_GEMINI_API_KEY: 'test-key',
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-key',
  NODE_ENV: 'test',
  MODE: 'test',
  DEV: 'true',
  PROD: 'false'
};

// Mock objects that aren't available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock console.error to avoid noise in test output but keep errors visible in CI
const originalError = console.error;
console.error = (...args) => {
  if (process.env.CI) {
    originalError(...args);
  }
  // In local tests, avoid console noise
};

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
