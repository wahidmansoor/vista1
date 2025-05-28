/**
 * Global Error Tracking Service
 * Captures unhandled errors and provides debugging information for production issues
 */

export interface ErrorReport {
  id: string;
  timestamp: string;
  error: string;
  stack: string;
  module: string;
  userAgent: string;
  url: string;
  retryCount: number;
  props?: Record<string, any>;
  state?: Record<string, any>;
  additionalContext?: Record<string, any>;
}

class ErrorTrackingService {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;
  private storageKey = 'app_error_reports';

  constructor() {
    this.initializeGlobalHandlers();
    this.loadStoredErrors();
  }

  private initializeGlobalHandlers() {
    // Capture unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.captureError({
        error: event.error || new Error(event.message),
        module: 'Global',
        additionalContext: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          type: 'unhandled_error'
        }
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        error: event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
        module: 'Promise',
        additionalContext: {
          type: 'unhandled_rejection',
          reason: event.reason
        }
      });
    });

    // Capture React errors via global error reporting function
    (window as any).reportError = (module: string, error: Error, errorInfo: any) => {
      this.captureError({
        error,
        module,
        additionalContext: {
          componentStack: errorInfo?.componentStack,
          type: 'react_error_boundary'
        }
      });
    };
  }

  private loadStoredErrors() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.errors = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load stored errors:', e);
    }
  }

  private saveErrors() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.errors));
    } catch (e) {
      console.warn('Failed to save errors to localStorage:', e);
    }
  }

  captureError({
    error,
    module = 'Unknown',
    additionalContext = {}
  }: {
    error: Error;
    module?: string;
    additionalContext?: Record<string, any>;
  }) {
    const errorReport: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack || 'No stack trace available',
      module,
      userAgent: navigator.userAgent,
      url: window.location.href,
      retryCount: 0,
      additionalContext
    };

    // Add to beginning of array and limit size
    this.errors.unshift(errorReport);
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    this.saveErrors();

    // Log to console for immediate debugging
    console.group(`🚨 Error Tracked [${errorReport.id}]`);
    console.error('Module:', module);
    console.error('Error:', error);
    console.error('Additional Context:', additionalContext);
    console.error('Full Report:', errorReport);
    console.groupEnd();

    // Send to external logging service if available
    this.sendToExternalService(errorReport);

    return errorReport.id;
  }

  private sendToExternalService(errorReport: ErrorReport) {
    // LogRocket integration
    if (typeof window !== 'undefined' && (window as any).LogRocket) {
      try {
        (window as any).LogRocket.captureException(new Error(errorReport.error), {
          tags: {
            module: errorReport.module,
            errorId: errorReport.id,
            url: errorReport.url
          },
          extra: errorReport.additionalContext
        });
      } catch (e) {
        console.warn('Failed to send error to LogRocket:', e);
      }
    }

    // You can add other services here (Sentry, etc.)
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  getErrorById(id: string): ErrorReport | undefined {
    return this.errors.find(error => error.id === id);
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem(this.storageKey);
  }

  exportErrors(): string {
    return JSON.stringify(this.errors, null, 2);
  }

  // Method to analyze the specific production error you're experiencing
  analyzeProductionError(stackTrace: string): {
    possibleCauses: string[];
    suggestedActions: string[];
    relatedComponents: string[];
  } {
    const analysis = {
      possibleCauses: [] as string[],
      suggestedActions: [] as string[],
      relatedComponents: [] as string[]
    };

    // Analyze the stack trace patterns
    if (stackTrace.includes('PZ') && stackTrace.includes('FZ')) {
      analysis.possibleCauses.push('Component rendering error in React tree');
      analysis.possibleCauses.push('State update on unmounted component');
      analysis.possibleCauses.push('Async operation completing after component unmount');
    }

    if (stackTrace.includes('router')) {
      analysis.possibleCauses.push('Routing-related error');
      analysis.possibleCauses.push('Navigation occurring during component lifecycle');
      analysis.relatedComponents.push('AppRoutes', 'ProtectedRoute', 'BrowserRouter');
    }

    if (stackTrace.includes('div') && stackTrace.includes('pt')) {
      analysis.possibleCauses.push('DOM manipulation error');
      analysis.possibleCauses.push('Component prop type mismatch');
    }

    // Suggested actions based on patterns
    analysis.suggestedActions.push('Check for memory leaks in useEffect cleanup');
    analysis.suggestedActions.push('Verify all async operations have proper error handling');
    analysis.suggestedActions.push('Review recent changes to routing configuration');
    analysis.suggestedActions.push('Enable source maps for better debugging');
    analysis.suggestedActions.push('Add more granular ErrorBoundaries around suspect components');

    return analysis;
  }
}

// Create global instance
export const errorTracker = new ErrorTrackingService();

// Export for debugging in console
if (typeof window !== 'undefined') {
  (window as any).errorTracker = errorTracker;
}
