/**
 * Unified Error Handling for AI Agent System
 * Provides standardized error creation, classification, and user-friendly messages
 */

export interface AIErrorDetails {
  message: string;
  type: string;
  code?: string;
  statusCode?: number;
  retryable?: boolean;
  userMessage?: string;
  metadata?: Record<string, any>;
}

export class AIErrorHandler {
  private static readonly ERROR_TYPES = {
    API_KEY_MISSING: 'API_KEY_MISSING',
    RATE_LIMIT: 'RATE_LIMIT_EXCEEDED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT: 'TIMEOUT_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    MALICIOUS_INPUT: 'MALICIOUS_INPUT',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
  };

  private static readonly USER_FRIENDLY_MESSAGES = {
    [this.ERROR_TYPES.API_KEY_MISSING]: 'AI service is temporarily unavailable. Please try again later.',
    [this.ERROR_TYPES.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
    [this.ERROR_TYPES.NETWORK_ERROR]: 'Network connection issue. Please check your connection and retry.',
    [this.ERROR_TYPES.TIMEOUT]: 'Request timed out. Please try again with a shorter message.',
    [this.ERROR_TYPES.VALIDATION_ERROR]: 'Invalid input provided. Please check your message and try again.',
    [this.ERROR_TYPES.MALICIOUS_INPUT]: 'Input contains potentially harmful content. Please rephrase your message.',
    [this.ERROR_TYPES.SERVICE_UNAVAILABLE]: 'AI service is temporarily unavailable. Please try again later.',
    [this.ERROR_TYPES.QUOTA_EXCEEDED]: 'Service quota exceeded. Please try again later.',
    [this.ERROR_TYPES.AUTHENTICATION_ERROR]: 'Authentication failed. Please refresh the page and try again.',
    [this.ERROR_TYPES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.'
  };

  private static readonly RETRYABLE_ERRORS = new Set([
    this.ERROR_TYPES.NETWORK_ERROR,
    this.ERROR_TYPES.TIMEOUT,
    this.ERROR_TYPES.SERVICE_UNAVAILABLE,
    this.ERROR_TYPES.RATE_LIMIT
  ]);

  /**
   * Creates a standardized error object from any error type
   */
  static create(error: unknown, context?: string): AIErrorDetails {
    if (error instanceof Error) {
      return this.handleKnownError(error, context);
    }

    if (typeof error === 'string') {
      return this.createErrorDetails(error, this.ERROR_TYPES.UNKNOWN_ERROR);
    }

    if (error && typeof error === 'object' && 'message' in error) {
      return this.handleKnownError(new Error(String(error.message)), context);
    }

    return this.createErrorDetails(
      'An unexpected error occurred',
      this.ERROR_TYPES.UNKNOWN_ERROR
    );
  }

  /**
   * Handles known error types and maps them to appropriate error details
   */
  private static handleKnownError(error: Error, context?: string): AIErrorDetails {
    const message = error.message.toLowerCase();
    
    // API Key errors
    if (message.includes('api key') || message.includes('unauthorized') || message.includes('authentication')) {
      return this.createErrorDetails(
        error.message,
        this.ERROR_TYPES.API_KEY_MISSING,
        401
      );
    }

    // Rate limiting errors
    if (message.includes('rate limit') || message.includes('too many requests') || message.includes('quota')) {
      return this.createErrorDetails(
        error.message,
        this.ERROR_TYPES.RATE_LIMIT,
        429
      );
    }

    // Network errors
    if (message.includes('network') || message.includes('connection') || 
        message.includes('fetch') || message.includes('econnrefused')) {
      return this.createErrorDetails(
        error.message,
        this.ERROR_TYPES.NETWORK_ERROR,
        503
      );
    }

    // Timeout errors
    if (message.includes('timeout') || message.includes('aborted') || error.name === 'AbortError') {
      return this.createErrorDetails(
        error.message,
        this.ERROR_TYPES.TIMEOUT,
        408
      );
    }

    // Validation errors
    if (message.includes('validation') || message.includes('invalid') || 
        message.includes('malicious') || message.includes('suspicious')) {
      return this.createErrorDetails(
        error.message,
        this.ERROR_TYPES.VALIDATION_ERROR,
        400
      );
    }

    // Service unavailable
    if (message.includes('service unavailable') || message.includes('server error') || 
        message.includes('internal error')) {
      return this.createErrorDetails(
        error.message,
        this.ERROR_TYPES.SERVICE_UNAVAILABLE,
        503
      );
    }

    // OpenAI specific errors
    if (message.includes('openai')) {
      if (message.includes('quota') || message.includes('billing')) {
        return this.createErrorDetails(
          error.message,
          this.ERROR_TYPES.QUOTA_EXCEEDED,
          429
        );
      }
    }

    // Gemini specific errors
    if (message.includes('gemini') || message.includes('google')) {
      if (message.includes('quota') || message.includes('limit')) {
        return this.createErrorDetails(
          error.message,
          this.ERROR_TYPES.QUOTA_EXCEEDED,
          429
        );
      }
    }

    // Default unknown error
    return this.createErrorDetails(
      error.message,
      this.ERROR_TYPES.UNKNOWN_ERROR,
      500,
      { context, originalError: error.name }
    );
  }

  /**
   * Creates standardized error details object
   */
  private static createErrorDetails(
    message: string,
    type: string,
    statusCode = 500,
    metadata?: Record<string, any>
  ): AIErrorDetails {
    return {
      message,
      type,
      code: type,
      statusCode,
      retryable: this.RETRYABLE_ERRORS.has(type),
      userMessage: this.USER_FRIENDLY_MESSAGES[type] || this.USER_FRIENDLY_MESSAGES[this.ERROR_TYPES.UNKNOWN_ERROR],
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata
      }
    };
  }

  /**
   * Determines if an error is retryable
   */
  static isRetryable(error: AIErrorDetails): boolean {
    return error.retryable === true;
  }

  /**
   * Gets appropriate HTTP status code for an error
   */
  static getStatusCode(error: AIErrorDetails): number {
    return error.statusCode || 500;
  }

  /**
   * Gets user-friendly error message
   */
  static getUserMessage(error: AIErrorDetails): string {
    return error.userMessage || 'An unexpected error occurred. Please try again.';
  }

  /**
   * Logs error with appropriate level based on type
   */
  static logError(error: AIErrorDetails, logger: any = console): void {
    const logData = {
      type: error.type,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      retryable: error.retryable,
      metadata: error.metadata
    };

    // Log as warning for retryable errors, error for others
    if (error.retryable) {
      logger.warn?.('AI Agent Warning:', logData) || logger.log('AI Agent Warning:', logData);
    } else {
      logger.error?.('AI Agent Error:', logData) || logger.log('AI Agent Error:', logData);
    }
  }

  /**
   * Creates error response object for API endpoints
   */
  static createAPIResponse(error: AIErrorDetails): {
    error: string;
    code: string;
    retryable: boolean;
    details?: any;
  } {
    return {
      error: this.getUserMessage(error),
      code: error.code || error.type,
      retryable: error.retryable || false,
      details: process.env.NODE_ENV === 'development' ? {
        originalMessage: error.message,
        metadata: error.metadata
      } : undefined
    };
  }

  /**
   * Wraps async functions with error handling
   */
  static async wrapAsync<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const errorDetails = this.create(error, context);
      this.logError(errorDetails);
      throw errorDetails;
    }
  }

  /**
   * Creates error with retry information
   */
  static createRetryError(
    originalError: unknown,
    attemptNumber: number,
    maxAttempts: number,
    context?: string
  ): AIErrorDetails {
    const baseError = this.create(originalError, context);
    
    return {
      ...baseError,
      message: `${baseError.message} (Attempt ${attemptNumber}/${maxAttempts})`,
      metadata: {
        ...baseError.metadata,
        attemptNumber,
        maxAttempts,
        willRetry: attemptNumber < maxAttempts
      }
    };
  }
}
