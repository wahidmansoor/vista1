import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary"; // ✅ updated to match filename
import NotFoundRedirect from "@/components/NotFoundRedirect";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedPage from "@/pages/ProtectedPage";
import CallbackPage from "@/pages/CallbackPage";
import AutoLogoutTest from "@/pages/AutoLogoutTest";
import ProtectedRoute from "@/auth/ProtectedRoute";
import Handbook from "@/modules/handbook/Handbook";
import { SearchPage } from "@/components/HandbookSearch";
import OPD from "@/modules/opd/OPD";
import CDU from "@/modules/cdu/CDU";
import ProtocolDashboard from "@/modules/cdu/components/ProtocolDashboard";
import Inpatient from "@/modules/inpatient";
import Palliative from "@/modules/palliative/Palliative";
import Tools from "@/modules/tools";
import Calculators from "@/modules/tools/Calculators";
import RedFlagsPage from "@/modules/tools/RedFlags";
import BSACalculator from "@/modules/tools/calculators/BSA";
import CrClCalculator from "@/modules/tools/calculators/CrCl";
import ANCCalculator from "@/modules/tools/calculators/ANC";

import type { ReactElement } from 'react';
import ProtocolDetailPageContainer from "@/modules/cdu/safe/treatmentProtocols/TreatmentProtocols";

const AppRoutes: FC = () => {
  return (
    <Routes>
      {/* Public routes - no authentication required */}
      <Route path="/" element={
        <ErrorBoundary moduleName="Landing">
          <LandingPage />
        </ErrorBoundary>
      } />
      
      <Route path="/callback" element={
        <ErrorBoundary moduleName="Auth Callback">
          <CallbackPage />
        </ErrorBoundary>
      } />

      {/* Protected routes - authentication required */}
      <Route path="/dashboard" element={
        <ErrorBoundary moduleName="Dashboard">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/auto-logout-test" element={
        <ErrorBoundary moduleName="Auto-Logout Test">
          <ProtectedRoute>
            <AutoLogoutTest />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/protected" element={
        <ErrorBoundary moduleName="Protected Page">
          <ProtectedRoute>
            <ProtectedPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/handbook/*" element={
        <ErrorBoundary moduleName="Handbook">
          <ProtectedRoute>
            <Handbook />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/search" element={
        <ErrorBoundary moduleName="Handbook Search">
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      {/* Protected OPD Routes */}
      <Route path="/opd/*" element={
        <ErrorBoundary moduleName="OPD">
          <ProtectedRoute>
            <OPD />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      {/* Protected CDU Routes */}
      <Route path="/cdu/*" element={
        <ErrorBoundary moduleName="CDU">
          <ProtectedRoute>
            <CDU />
          </ProtectedRoute>
        </ErrorBoundary>
      } />      <Route path="/inpatient/*" element={
        <ErrorBoundary moduleName="Inpatient">
          <ProtectedRoute>
            <Inpatient />
          </ProtectedRoute>
        </ErrorBoundary>
      } />
      
      <Route path="/palliative/*" element={
        <ErrorBoundary moduleName="Palliative">
          <ProtectedRoute>
            <Palliative />
          </ProtectedRoute>
        </ErrorBoundary>
      } />      <Route path="/tools/*" element={
        <ErrorBoundary moduleName="Tools">
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        </ErrorBoundary>
      } />
      
      <Route path="/tools/calculators" element={
        <ErrorBoundary moduleName="Clinical Calculators">
          <ProtectedRoute>
            <Calculators />
          </ProtectedRoute>
        </ErrorBoundary>
      } />
      
      <Route path="/tools/calculators/bsa" element={
        <ErrorBoundary moduleName="BSA Calculator">
          <ProtectedRoute>
            <BSACalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />
      
      <Route path="/tools/calculators/crcl" element={
        <ErrorBoundary moduleName="CrCl Calculator">
          <ProtectedRoute>
            <CrClCalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />
      
      <Route path="/tools/calculators/anc" element={
        <ErrorBoundary moduleName="ANC Calculator">
          <ProtectedRoute>
            <ANCCalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />
      
      <Route path="/tools/redflags" element={
        <ErrorBoundary moduleName="Red Flags">
          <ProtectedRoute>
            <RedFlagsPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/cdu/treatment-protocols/:id" element={
        <ErrorBoundary moduleName="Protocol Detail">
          <ProtectedRoute>
            <ProtocolDetailPageContainer />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="*" element={
        <ErrorBoundary moduleName="Not Found">
          <NotFoundRedirect />
        </ErrorBoundary>
      } />
    </Routes>
  );
};

export default AppRoutes;
