import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Clean up after each test
afterEach(() => {
  cleanup();
});

// Extend Jest's expect typing is not needed since @testing-library/jest-dom
// already adds these types to Jest's global expect
