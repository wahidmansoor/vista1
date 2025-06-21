import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary"; // ✅ updated to match filename
import NotFoundRedirect from "@/components/NotFoundRedirect";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedPage from "@/pages/ProtectedPage";
import CallbackPage from "@/pages/CallbackPage";
import ProtectedRoute from "@/auth/ProtectedRoute";

// Lazy load heavy modules for better code splitting and performance
const Handbook = lazy(() => import("@/modules/handbook/Handbook"));
const SearchPage = lazy(() => import("@/components/HandbookSearch").then(module => ({ default: module.SearchPage })));
const OPD = lazy(() => import("@/modules/opd/OPD"));
const CDU = lazy(() => import("@/modules/cdu/CDU"));
const ProtocolDashboard = lazy(() => import("@/modules/cdu/components/ProtocolDashboard"));
const Inpatient = lazy(() => import("@/modules/inpatient"));
const Palliative = lazy(() => import("@/modules/palliative/Palliative"));
const Tools = lazy(() => import("@/modules/tools"));
const Calculators = lazy(() => import("@/modules/tools/Calculators"));
const RedFlagsPage = lazy(() => import("@/modules/tools/RedFlags"));
const BSACalculator = lazy(() => import("@/modules/tools/calculators/BSA"));
const CrClCalculator = lazy(() => import("@/modules/tools/calculators/CrCl"));
const ANCCalculator = lazy(() => import("@/modules/tools/calculators/ANC"));

// Additional lazy loading for large components to optimize bundle size
const PsychosocialCare = lazy(() => import("@/modules/palliative/sections/psychosocial_support/PsychosocialCare"));
const TreatmentProtocols = lazy(() => import("@/modules/cdu/treatmentProtocols/TreatmentProtocols"));

import type { ReactElement } from 'react';

// Lazy load protocol components for better code splitting
const ProtocolDetailPageContainer = lazy(() => import("@/modules/cdu/safe/treatmentProtocols/TreatmentProtocols"));

// Loading component for lazy modules
const ModuleLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

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

      <Route path="/protected" element={
        <ErrorBoundary moduleName="Protected Page">
          <ProtectedRoute>
            <ProtectedPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />      <Route path="/handbook/*" element={
        <ErrorBoundary moduleName="Handbook">
          <ProtectedRoute>
            <Suspense fallback={<ModuleLoader />}>
              <Handbook />
            </Suspense>
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/search" element={
        <ErrorBoundary moduleName="Handbook Search">
          <ProtectedRoute>
            <Suspense fallback={<ModuleLoader />}>
              <SearchPage />
            </Suspense>
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
