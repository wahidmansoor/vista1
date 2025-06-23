import LogRocket from 'logrocket';

interface ErrorContext {
  module?: string;
  context?: string;
  extra?: Record<string, unknown>;
}

export function logErrorToService(error: unknown, { module, context, extra }: ErrorContext = {}) {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.group('OncoVista Error:');
    console.error('Error:', errorObj);
    console.error('Module:', module || 'unknown');
    console.error('Context:', context || 'unknown');
    console.error('Extra:', extra);
    console.groupEnd();
  }

  // Production logging to LogRocket
  LogRocket.captureException(errorObj, {
    tags: {
      module: module || 'unknown',
      context: context || 'unknown',
      errorType: errorObj.constructor.name,
    },
    extra: {
      ...extra,
      message: errorObj.message,
      stack: errorObj.stack,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    },
  });
}