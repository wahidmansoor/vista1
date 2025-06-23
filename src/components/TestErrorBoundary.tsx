import React from 'react';
import ErrorBoundary from './ErrorBoundary';

const TestErrorBoundary = () => (
  <ErrorBoundary moduleName="Test Module">
    <div>Test Content</div>
  </ErrorBoundary>
);

export default TestErrorBoundary;
