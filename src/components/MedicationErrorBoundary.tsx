import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class MedicationErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Medication component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-red-600 font-medium mb-2">
            <AlertTriangle className="h-5 w-5" />
            <h2>Error loading medication data</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
