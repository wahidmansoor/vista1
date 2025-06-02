import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

declare module 'vitest' {
  interface JestAssertion<T = any> {
    toBeInTheDocument(): void;
    toBeVisible(): void;
    toHaveTextContent(text: string): void;
    toHaveValue(value: string | number | string[]): void;
    toHaveClass(...classNames: string[]): void;
    toHaveAttribute(attr: string, value?: string): void;
  }
}
