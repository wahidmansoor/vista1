import { Route } from 'react-router-dom';
import OPD from '@/modules/opd/OPD';
import ErrorBoundary from '@/components/ErrorBoundary';

import type { ReactElement } from 'react';

const opdRoutes: ReactElement[] = [
  <Route key="opd" path="opd/*" element={
    <ErrorBoundary moduleName="OPD">
      <OPD />
    </ErrorBoundary>
  } />
];

export default opdRoutes;
