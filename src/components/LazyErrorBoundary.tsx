import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Loader2 } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  moduleName: string;
}

const LazyErrorBoundary: React.FC<Props> = ({ children, moduleName }) => {
  return (
    <ErrorBoundary moduleName={moduleName}>
      <Suspense fallback={
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      }>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

export default LazyErrorBoundary;