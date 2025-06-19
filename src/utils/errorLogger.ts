/**
 * Centralized Error Logging Utility
 * 
 * Provides consistent error logging capabilities across the application with
 * proper context tracking, error formatting, and environment-specific handling.
 */

type ErrorContext = {
  component?: string;
  functionName?: string;
  operation?: string;
  userId?: string;
  moduleName?: string;
  retryCount?: number;
  componentStack?: string;
  additionalInfo?: Record<string, unknown>;
  [key: string]: any; // For backward compatibility
};

type ErrorLogOptions = {
  /** Should the error be reported to external monitoring services */
  report?: boolean;
  /** Additional tags for categorizing the error */
  tags?: string[];
  /** Should stack traces be included (defaults to true in development) */
  includeStack?: boolean;
};

/**
 * ErrorWithContext extends the standard Error with additional context metadata
 * to preserve error origin and relevant debugging information.
 */
export class ErrorWithContext extends Error {
  context?: ErrorContext;
  originalError?: unknown;

  constructor(message: string, context?: ErrorContext, originalError?: unknown) {
    super(message);
    this.name = 'ErrorWithContext';
    this.context = context;
    this.originalError = originalError;
    
    // Preserve the original stack trace if available
    if (originalError instanceof Error && originalError.stack) {
      this.stack = originalError.stack;
    }
  }
}

/**
 * Safely formats an error to string, handling different error types
 */
const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.stack || `${error.name}: ${error.message}`;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

/**
 * Formats context information for logging
 */
const formatContext = (context?: ErrorContext): string => {
  if (!context) return '';
  
  const parts: string[] = [];
  if (context.component) parts.push(`Component: ${context.component}`);
  if (context.functionName) parts.push(`Function: ${context.functionName}`);
  if (context.operation) parts.push(`Operation: ${context.operation}`);
  if (context.userId) parts.push(`User: ${context.userId}`);
  if (context.moduleName) parts.push(`Module: ${context.moduleName}`);
  
  if (context.additionalInfo || Object.keys(context).some(key => !['component', 'functionName', 'operation', 'userId', 'moduleName', 'componentStack', 'retryCount'].includes(key))) {
    try {
      const additionalInfo = { ...context };
      delete additionalInfo.component;
      delete additionalInfo.functionName;
      delete additionalInfo.operation;
      delete additionalInfo.userId;
      delete additionalInfo.moduleName;
      delete additionalInfo.componentStack; // Handle separately for formatting
      delete additionalInfo.retryCount;
      
      if (Object.keys(additionalInfo).length > 0) {
        parts.push(`Additional Info: ${JSON.stringify(additionalInfo)}`);
      }
    } catch {
      parts.push('Additional Info: [Cannot stringify]');
    }
  }
  
  return parts.length ? `\nContext: ${parts.join(' | ')}` : '';
};

/**
 * Reports errors to external monitoring services if configured
 * This would connect to services like Sentry, LogRocket, etc.
 */
const reportError = (
  error: unknown,
  context?: ErrorContext
): void => {
  // Integration with error monitoring service would go here
  const isProd = import.meta.env.PROD;
  
  if (isProd) {
    // Support for LogRocket (if it exists)
    if (typeof window !== 'undefined' && (window as any).LogRocket) {
      (window as any).LogRocket.captureException(error, {
        extra: { ...context }
      });
    }
  }
};

/**
 * Legacy support for React ErrorBoundary
 */
export const logError = (
  error: Error, 
  errorInfo: { componentStack?: string } = {},
  context: ErrorContext = {}
): void => {
  // Combine context
  const combinedContext: ErrorContext = {
    ...context,
    componentStack: errorInfo.componentStack
  };
  
  // Format with context
  const contextStr = formatContext(combinedContext);
  
  // Log to console
  console.error(`🚨 Error caught by ErrorBoundary: ${error.message}${contextStr}`);
  console.error(error.stack || error);
  if (errorInfo.componentStack) {
    console.error('Component Stack:', errorInfo.componentStack);
  }
  
  // Report to monitoring service
  reportError(error, combinedContext);
};

/**
 * Logs an error with standardized formatting and optional reporting
 */
export const logErrorWithContext = (
  error: unknown,
  contextOrMessage?: ErrorContext | string,
  options: ErrorLogOptions = {}
): void => {
  const isProduction = import.meta.env.PROD;
  const isDev = !isProduction;
  const includeStack = options.includeStack ?? isDev;
  
  // Process context parameter which can be a string or object
  let errorMessage: string;
  let context: ErrorContext | undefined;
  
  if (typeof contextOrMessage === 'string') {
    errorMessage = contextOrMessage;
  } else {
    context = contextOrMessage;
    errorMessage = error instanceof Error ? error.message : String(error);
  }
  
  // Format with context
  const contextStr = formatContext(context);
  
  // Log to console with appropriate level and formatting
  console.error(`🚨 ERROR: ${errorMessage}${contextStr}`);
  if (includeStack && error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  
  // Report to monitoring service if requested
  if (options.report !== false && (isProduction || options.report === true)) {
    reportError(error, context);
  }
};

/**
 * Creates a wrapped error with context that preserves the original error
 */
export const createContextError = (
  message: string,
  context?: ErrorContext,
  originalError?: unknown
): ErrorWithContext => {
  return new ErrorWithContext(message, context, originalError);
};

/**
 * Gets a user-friendly error message suitable for displaying to users
 */
export const getUserFriendlyMessage = (error: unknown): string => {
  // Default friendly message
  let friendlyMessage = 'An unexpected error occurred. Please try again later.';
  
  if (error instanceof Error) {
    // Handle specific error types for user-friendly messages
    if (error.message.includes('network') || error.message.includes('Network')) {
      friendlyMessage = 'Network connection error. Please check your internet connection.';
    } else if (error.message.includes('timeout') || error.message.includes('timed out')) {
      friendlyMessage = 'The operation timed out. Please try again.';
    } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      friendlyMessage = 'You don\'t have permission to perform this action.';
    } else if (error.message.includes('not found')) {
      friendlyMessage = 'The requested information could not be found.';
    } else if (error instanceof ErrorWithContext) {
      // Use the error message but ensure it's user-friendly
      friendlyMessage = error.message.startsWith('Error:') 
        ? error.message.substring(7)
        : error.message;
    }
  }
  
  return friendlyMessage;
};

export default {
  logError,
  logErrorWithContext,
  createContextError,
  getUserFriendlyMessage,
  ErrorWithContext
};
