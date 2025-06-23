import LogRocket from 'logrocket';
import { getEnvVar } from './environment';

interface ErrorLoggingOptions {
  moduleName?: string;
  retryCount?: number;
  extra?: Record<string, unknown>;
}

/**
 * Centralized error logging function that handles sending errors to multiple destinations
 * Currently supports LogRocket and console.error, can be extended for other services
 */
export function logError(
  error: Error,
  errorInfo?: React.ErrorInfo,
  options: ErrorLoggingOptions = {}
) {
  const { moduleName = 'global', retryCount = 0, extra = {} } = options;

  // Development logging with detailed information
  if (getEnvVar('NODE_ENV') === 'development') {
    console.group('Error logged by logError utility:');
    console.error('Error:', error);
    if (errorInfo) {
      console.error('Component Stack:', errorInfo.componentStack);
    }
    console.error('Module:', moduleName);
    console.error('Retry Count:', retryCount);
    if (Object.keys(extra).length > 0) {
      console.error('Extra Information:', extra);
    }
    console.groupEnd();
  }

  // Send to LogRocket with all available context
  LogRocket.captureException(error, {
    tags: {
      module: moduleName,
      errorName: error.name,
      errorType: error.constructor.name,
      retryCount: retryCount.toString(),
    },
    extra: {
      componentStack: errorInfo?.componentStack || 'No component stack available',
      ...extra
    },
  });

  // Here we can add more logging services as needed:
  // - Sentry.captureException(error, { extra: { moduleName, retryCount, ...extra } });
  // - Send to custom error tracking endpoint
  // - Log to analytics service
}
