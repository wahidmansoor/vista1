import React, { Component, ReactNode } from 'react';
import { AlertOctagon, ArrowLeft, RefreshCcw, ChevronDown, LifeBuoy } from 'lucide-react';
import LogRocket from 'logrocket';
import { getEnvVar } from '@/utils/environment';

interface Props {
  children?: ReactNode;
  moduleName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  isRetrying: boolean;
  isDetailsOpen: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    isRetrying: false,
    isDetailsOpen: false
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });

    // Development logging with detailed information
    if (getEnvVar('NODE_ENV') === 'development') {
      console.group('Error caught by ErrorBoundary:');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Module:', this.props.moduleName || 'global');
      console.groupEnd();
    }
    
    // Enhanced production error tracking
    LogRocket.captureException(error, {
      tags: {
        module: this.props.moduleName || 'global',
        errorName: error.name,
        errorType: error.constructor.name,
      },
      extra: {
        componentStack: errorInfo.componentStack || 'No component stack available',
        message: error.message,
        environment: getEnvVar('NODE_ENV') || 'development',
        timestamp: new Date().toISOString(),
      },
    });
  }

  handleReset = async () => {
    this.setState({ isRetrying: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      window.location.reload();
    } catch (err) {
      this.setState({ isRetrying: false });
    }
  };

  handleNavigateHome = () => {
    window.location.href = '/';
  };

  handleToggleDetails = () => {
    this.setState(prev => ({ isDetailsOpen: !prev.isDetailsOpen }));
  };

  renderErrorUI() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="w-full max-w-2xl p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 transform transition-all duration-300 ease-out">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 mb-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-105">
              <AlertOctagon className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {this.props.moduleName ? `Error in ${this.props.moduleName}` : 'Something went wrong'}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              We apologize for the inconvenience. Our team has been notified and is working to resolve this issue.
            </p>

            {this.state.error && (
              <details 
                open={this.state.isDetailsOpen}
                onToggle={this.handleToggleDetails}
                className="w-full mb-8 text-left group"
              >
                <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${this.state.isDetailsOpen ? 'rotate-180' : ''}`} />
                  Technical Details
                </summary>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono overflow-auto max-h-[200px] transition-all">
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p className="font-semibold">Error:</p>
                    <pre className="whitespace-pre-wrap mb-4 pl-4 border-l-2 border-red-500/30">
                      {this.state.error?.toString()}
                    </pre>
                    {this.state.errorInfo && (
                      <>
                        <p className="font-semibold">Component Stack:</p>
                        <pre className="whitespace-pre-wrap pl-4 border-l-2 border-gray-500/30">
                          {this.state.errorInfo?.componentStack}
                        </pre>
                      </>
                    )}
                  </div>
                </div>
              </details>
            )}

            <div className="flex gap-4">
              <button
                onClick={this.handleNavigateHome}
                className="px-6 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Home
              </button>
              <button
                onClick={this.handleReset}
                disabled={this.state.isRetrying}
                className="px-6 py-3 flex items-center gap-2 text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
              >
                <RefreshCcw className={`w-4 h-4 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
                {this.state.isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            </div>

            <div className="mt-8 text-sm text-center">
              <a 
                href="mailto:support@oncovista.com" 
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <LifeBuoy className="w-4 h-4" />
                Contact technical support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError || !this.props.children) {
      return this.props.fallback || this.renderErrorUI();
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
