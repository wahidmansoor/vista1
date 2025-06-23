import React from 'react';
import { Route } from 'react-router-dom';
import CDU from '@/modules/cdu';
import ProtocolDashboard from '@/modules/cdu/components/ProtocolDashboard';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtocolDetailPageContainer from '@/modules/cdu/treatmentProtocols/ProtocolDetailPageContainer';

import type { ReactElement } from 'react';

const cduRoutes: ReactElement[] = [
  <Route key="cdu" path="/cdu/*" element={
    <ErrorBoundary moduleName="CDU">
      <CDU />
    </ErrorBoundary>
  } />,
  <Route key="cdu-explorer" path="/cdu/explorer" element={
    <ErrorBoundary moduleName="Protocol Explorer">
      <ProtocolDashboard />
    </ErrorBoundary>
  } />,
];

export default cduRoutes;
