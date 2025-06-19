import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import CDU from '@/modules/cdu';
import ProtocolDashboard from '@/modules/cdu/components/ProtocolDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';

// Use dynamic import for better code splitting
const ProtocolDetailPageContainer = lazy(() => import('@/modules/cdu/treatmentProtocols/ProtocolDetailPageContainer'));

import type { ReactElement } from 'react';

const cduRoutes: ReactElement[] = [
  <Route key="cdu" path="/cdu/*" element={
    <ErrorBoundary moduleName="CDU">
      <CDU />
    </ErrorBoundary>
  } />,  <Route key="cdu-explorer" path="/cdu/explorer" element={
    <ErrorBoundary moduleName="Protocol Explorer">
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>}>
        <ProtocolDashboard />
      </Suspense>
    </ErrorBoundary>
  } />,
];

export default cduRoutes;
