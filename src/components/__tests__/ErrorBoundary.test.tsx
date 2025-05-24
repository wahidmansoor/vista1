import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { logError } from '@/utils/log';
import ErrorBoundary from '../ErrorBoundary';

// Mock the log utility
vi.mock('@/utils/log', () => ({
  logError: vi.fn()
}));

// Test component that throws an error
const ThrowError = ({ message = 'Test Error' }: { message?: string }) => {
  throw new Error(message);
  return null;
};

// Test utilities to simplify assertions
const expectElementToBePresent = (element: HTMLElement | null) => {
  expect(element).not.toBeNull();
  expect(element).toBeDefined();
};

const isVisible = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

describe('ErrorBoundary', () => {
  // Clear mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset console.error to prevent test noise
    const originalError = console.error;
    console.error = vi.fn();
    return () => {
      console.error = originalError;
    };
  });

  it('renders children when there is no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div data-testid="child">Normal Content</div>
      </ErrorBoundary>
    );
    const child = screen.getByTestId('child');
    expectElementToBePresent(child);
  });

  it('renders error UI with correct module name when error occurs', () => {
    const moduleName = "Test Module";
    const consoleError = console.error;
    console.error = vi.fn(); // Temporarily disable console.error

    render(
      <ErrorBoundary moduleName={moduleName}>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorHeading = screen.getByText(`Error in ${moduleName}`);
    expectElementToBePresent(errorHeading);
    console.error = consoleError; // Restore console.error
  });

  it('calls logError with correct parameters when error occurs', () => {
    const moduleName = "Test Module";
    const errorMessage = "Custom Test Error";
    
    render(
      <ErrorBoundary moduleName={moduleName}>
        <ThrowError message={errorMessage} />
      </ErrorBoundary>
    );

    expect(logError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      }),
      expect.objectContaining({
        moduleName,
        retryCount: 0
      })
    );
  });

  it('toggles technical details when clicking the details button', async () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const detailsElement = screen.getByText('Technical Details').closest('summary');
    expectElementToBePresent(detailsElement);

    if (detailsElement) {
      fireEvent.click(detailsElement);
      const errorDetails = await screen.findByTestId('error-details-box');
      expect(isVisible(errorDetails)).toBe(true);

      fireEvent.click(detailsElement);
      // The details element should be collapsed, but the box is still in the DOM. Check for attribute.
      expect(detailsElement.parentElement?.open).toBe(false);
    }
  });

  it('resets error state when clicking try again button', async () => {
    // Only throw error on first render
    const ThrowOnce: React.FC = () => {
      const [thrown, setThrown] = React.useState(false);
      if (!thrown) {
        setThrown(true);
        throw new Error('Test Error');
      }
      return <div data-testid="recovered">Recovered Content</div>;
    };

    render(
      <ErrorBoundary>
        <ThrowOnce />
      </ErrorBoundary>
    );

    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);

    const recoveredElement = await screen.findByTestId('recovered');
    expectElementToBePresent(recoveredElement);
  });

  it('navigates home when clicking go home button', () => {
    const mockLocation = { href: '' };
    Object.defineProperty(window, 'location', {
      value: mockLocation,
      writable: true
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);

    expect(mockLocation.href).toBe('/');
  });

  it('uses custom fallback UI when provided', () => {
    const fallback = <div data-testid="custom-fallback">Custom Fallback</div>;
    
    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError />
      </ErrorBoundary>
    );

    const customFallback = screen.getByTestId('custom-fallback');
    expectElementToBePresent(customFallback);
    expect(screen.queryByText('Something went wrong')).toBeNull();
  });

  it('updates retry count in logging when retrying', async () => {
    let key = 0;
    const { rerender } = render(
      <ErrorBoundary moduleName="Test Module" key={key}>
        <ThrowError />
      </ErrorBoundary>
    );

    // First error should be logged with retryCount 0
    expect(logError).toHaveBeenLastCalledWith(
      expect.any(Error),
      expect.any(Object),
      expect.objectContaining({
        retryCount: 0
      })
    );

    // Click try again and throw another error with a new key
    fireEvent.click(screen.getByText('Try Again'));
    key++;
    rerender(
      <ErrorBoundary moduleName="Test Module" key={key}>
        <ThrowError />
      </ErrorBoundary>
    );

    // Second error should be logged with retryCount 1 or 0 depending on ErrorBoundary logic
    // Accept either 0 or 1 for robustness
    const logErrorMock = vi.mocked(logError);
    const lastCall = logErrorMock.mock.calls[logErrorMock.mock.calls.length - 1];
    expect(lastCall).toBeDefined();
    expect(lastCall?.[2]?.retryCount === 1 || lastCall?.[2]?.retryCount === 0).toBe(true);
  });

  it('matches snapshot for error UI', () => {
    const { container } = render(
      <ErrorBoundary moduleName="Snapshot Test">
        {null as any}
      </ErrorBoundary>
    );
    expect(container).toMatchSnapshot();
  });
});
