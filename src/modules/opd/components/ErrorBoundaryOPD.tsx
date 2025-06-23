import React, { Component, ErrorInfo, ReactNode } from 'react';

// Declare a global interface for potential error reporting
declare global {
  interface Window {
    reportError?: (module: string, error: Error, errorInfo: ErrorInfo) => void;
  }
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundaryOPD extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('OPD Module Error:', error, errorInfo);
    
    // Store error details for potential display
    this.setState({ errorInfo });
    
    // Send to error reporting service if available
    if (typeof window.reportError === 'function') {
      window.reportError('OPD Module', error, errorInfo);
    }
    
    // Alternatively, you could implement a direct API call to your error tracking service
    // Example: sendErrorToLoggingService('OPD Module', error, errorInfo);
  }

  private sendErrorToLoggingService(module: string, error: Error, errorInfo: ErrorInfo) {
    // Implementation would depend on your error logging service
    // This is just a placeholder for the actual implementation
    try {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module,
          error: {
            message: error.message,
            name: error.name,
            stack: error.stack
          },
          componentStack: errorInfo.componentStack
        })
      });
    } catch (e) {
      console.error('Failed to send error to logging service:', e);
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Something went wrong loading the OPD module
            </h2>
            <p className="text-gray-600 mb-4">
              Please try refreshing the page. If the problem persists, contact support.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 p-4 rounded mb-4 overflow-auto max-h-40">
                <p className="font-mono text-sm text-red-700">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-700 cursor-pointer">Component Stack</summary>
                    <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}
            <div className="flex gap-3">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <button
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundaryOPD;
