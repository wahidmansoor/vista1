import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const ErrorTestPage: React.FC = () => {
  const [testType, setTestType] = useState<string>('');

  const triggerJavaScriptError = () => {
    setTestType('JavaScript Error');
    // Simulate the type of error that might occur in production
    setTimeout(() => {
      throw new Error('Test JavaScript Error - Similar to production PZ/FZ error');
    }, 100);
  };

  const triggerReactError = () => {
    setTestType('React Error');
    // This will be caught by ErrorBoundary
    throw new Error('Test React Component Error - ErrorBoundary test');
  };

  const triggerPromiseRejection = () => {
    setTestType('Promise Rejection');
    // Simulate async error
    Promise.reject(new Error('Test Promise Rejection - Async operation failure'));
  };

  const triggerNetworkError = () => {
    setTestType('Network Error');
    // Simulate network failure
    fetch('/non-existent-endpoint')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network Error: ${response.status}`);
        }
      })
      .catch(error => {
        console.error('Network operation failed:', error);
        throw error;
      });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Error Tracking Test Page</CardTitle>
          <CardDescription>
            Test different types of errors to verify our enhanced error tracking system.
            Check the console and visit /debug/errors to see captured errors.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={triggerJavaScriptError}
              variant="destructive"
              className="h-20"
            >
              <div className="text-center">
                <div className="font-semibold">JavaScript Error</div>
                <div className="text-sm opacity-90">Unhandled exception</div>
              </div>
            </Button>

            <Button 
              onClick={triggerReactError}
              variant="destructive"
              className="h-20"
            >
              <div className="text-center">
                <div className="font-semibold">React Error</div>
                <div className="text-sm opacity-90">Component error (ErrorBoundary)</div>
              </div>
            </Button>

            <Button 
              onClick={triggerPromiseRejection}
              variant="destructive"
              className="h-20"
            >
              <div className="text-center">
                <div className="font-semibold">Promise Rejection</div>
                <div className="text-sm opacity-90">Async operation failure</div>
              </div>
            </Button>

            <Button 
              onClick={triggerNetworkError}
              variant="destructive"
              className="h-20"
            >
              <div className="text-center">
                <div className="font-semibold">Network Error</div>
                <div className="text-sm opacity-90">Failed HTTP request</div>
              </div>
            </Button>
          </div>

          {testType && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800">
                <strong>Test Triggered:</strong> {testType}
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Check the browser console and visit <a href="/debug/errors" className="underline font-medium">/debug/errors</a> to see the captured error details.
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Open browser DevTools (F12) before triggering errors</li>
              <li>Open <a href="/debug/errors" className="underline font-medium">/debug/errors</a> in another tab</li>
              <li>Trigger an error using the buttons above</li>
              <li>Check console for enhanced error logging</li>
              <li>Verify error appears in the debug errors page</li>
              <li>Note the unique error ID and enhanced context</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorTestPage;
