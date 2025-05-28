import React, { useState, useEffect } from 'react';
import { AlertTriangle, Copy, Download, RefreshCcw } from 'lucide-react';

interface ErrorReport {
  id: string;
  timestamp: string;
  error: string;
  stack: string;
  module: string;
  userAgent: string;
  url: string;
  retryCount: number;
}

const ErrorDebugPage: React.FC = () => {
  const [errors, setErrors] = useState<ErrorReport[]>([]);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    // Check if there are any stored errors in localStorage
    const storedErrors = localStorage.getItem('app_errors');
    if (storedErrors) {
      try {
        setErrors(JSON.parse(storedErrors));
      } catch (e) {
        console.error('Failed to parse stored errors:', e);
      }
    }

    // Set up global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      const errorReport: ErrorReport = {
        id: `unhandled_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        error: event.error?.message || event.message,
        stack: event.error?.stack || 'No stack trace available',
        module: 'Global',
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: 0,
      };

      setErrors(prev => {
        const updated = [errorReport, ...prev].slice(0, 50); // Keep only last 50 errors
        localStorage.setItem('app_errors', JSON.stringify(updated));
        return updated;
      });
    };

    // Set up promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorReport: ErrorReport = {
        id: `rejection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        error: event.reason?.message || String(event.reason),
        stack: event.reason?.stack || 'No stack trace available',
        module: 'Promise',
        userAgent: navigator.userAgent,
        url: window.location.href,
        retryCount: 0,
      };

      setErrors(prev => {
        const updated = [errorReport, ...prev].slice(0, 50);
        localStorage.setItem('app_errors', JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const copyErrorToClipboard = (error: ErrorReport) => {
    const errorText = `
Error ID: ${error.id}
Timestamp: ${error.timestamp}
Module: ${error.module}
URL: ${error.url}
User Agent: ${error.userAgent}
Retry Count: ${error.retryCount}

Error Message:
${error.error}

Stack Trace:
${error.stack}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      alert('Error details copied to clipboard!');
    });
  };

  const downloadErrorReport = () => {
    const report = JSON.stringify(errors, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearErrors = () => {
    setErrors([]);
    localStorage.removeItem('app_errors');
  };

  const triggerTestError = () => {
    throw new Error('Test error from debug page');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Error Debug Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={triggerTestError}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Test Error
              </button>
              <button
                onClick={downloadErrorReport}
                disabled={errors.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button
                onClick={clearErrors}
                disabled={errors.length === 0}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Production Error Debugging</h3>
            <p className="text-yellow-700 mt-1">
              This page captures and displays all JavaScript errors that occur in the application. 
              Use this to debug the production error you're experiencing.
            </p>
          </div>
        </div>

        <div className="p-6">
          {errors.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No errors captured yet</h3>
              <p className="text-gray-600">
                Navigate around the app to capture any errors that occur. 
                Try clicking "Test Error" to verify the system is working.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Captured Errors ({errors.length})
              </h2>
              
              {errors.map((error) => (
                <div key={error.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className="p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => setShowDetails(showDetails === error.id ? null : error.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                            {error.module}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(error.timestamp).toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {error.id}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {error.error}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyErrorToClipboard(error);
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Copy error details"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {showDetails === error.id && (
                    <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-700">URL:</label>
                          <p className="text-sm text-gray-900 break-all">{error.url}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">User Agent:</label>
                          <p className="text-sm text-gray-900 break-all">{error.userAgent}</p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">Error Message:</label>
                          <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                            {error.error}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700">Stack Trace:</label>
                          <pre className="text-xs text-gray-900 font-mono bg-gray-50 p-2 rounded overflow-auto max-h-60">
                            {error.stack}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDebugPage;
