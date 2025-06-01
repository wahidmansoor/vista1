import '@testing-library/jest-dom';

// Set up test environment
process.env.VITE_GEMINI_API_KEY = 'test-key';
process.env.NODE_ENV = 'test';

// Mock rate limiter for tests
jest.mock('../lib/rate-limit', () => ({
  RateLimiter: class {
    check = jest.fn().mockReturnValue(true);
    reset = jest.fn();
  }
}));

// Mock global environment variables (equivalent to vi.stubGlobal)
// In Jest, we can set properties directly on the global object
Object.defineProperty(global, 'import', {
  value: {
    meta: { 
      env: { 
        VITE_GEMINI_API_KEY: 'test-key',
        NODE_ENV: 'test'
      } 
    }
  },
  writable: true
});

// Mock console.error to avoid noise in test output
console.error = jest.fn();

// Polyfill scrollIntoView for JSDOM
if (document.defaultView) {
  document.defaultView.HTMLElement.prototype.scrollIntoView = function() {};
}

// After each test, clear all mocks
afterEach(() => {
  jest.clearAllMocks();
});
