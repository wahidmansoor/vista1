interface ErrorContext {
  retryCount?: number;
  moduleName?: string;
  [key: string]: any;
}

export const logError = (error: Error, errorInfo: React.ErrorInfo, context: ErrorContext = {}) => {
  console.error('Error caught by ErrorBoundary:', {
    error: error.message,
    stack: error.stack,
    componentStack: errorInfo.componentStack,
    context
  });
  
  // In a real application, you might send this to an error reporting service
  // like Sentry, LogRocket, or Bugsnag
  if (typeof window !== 'undefined' && (window as any).LogRocket) {
    (window as any).LogRocket.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
        ...context
      }
    });
  }
};
