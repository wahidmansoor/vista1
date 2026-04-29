import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary"; // ✅ updated to match filename
import NotFoundRedirect from "@/components/NotFoundRedirect";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedPage from "@/pages/ProtectedPage";
import CallbackPage from "@/pages/CallbackPage";
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
import CarboplatinCalculator from "@/modules/tools/calculators/Carboplatin";
import CorrectedCalciumCalculator from "@/modules/tools/calculators/CorrectedCalcium";
import BMICalculator from "@/modules/tools/calculators/BMI";
import MASCCCalculator from "@/modules/tools/calculators/MASCC";
import SteroidEquivalenceCalculator from "@/modules/tools/calculators/SteroidEquivalence";
import OpioidConverterCalculator from "@/modules/tools/calculators/OpioidConverter";
import QuickGuidesPage from "@/modules/tools/quickguides";
import LabsPage from "@/modules/tools/labs";
import EmergencyRegimensPage from "@/modules/tools/emergencyregimens";
import CognitiveToolsPage from "@/modules/tools/cognitive";
import ToxicitiesPage from "@/modules/tools/toxicities";
import RemindersPage from "@/modules/tools/reminders";
import AuthTest from "@/pages/AuthTest";

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

      <Route path="/auth-test" element={
        <ErrorBoundary moduleName="Auth Test">
          <ProtectedRoute>
            <AuthTest />
          </ProtectedRoute>
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
      
      <Route path="/tools/calculators/carboplatin" element={
        <ErrorBoundary moduleName="Carboplatin Calculator">
          <ProtectedRoute>
            <CarboplatinCalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/calculators/corrected-calcium" element={
        <ErrorBoundary moduleName="Corrected Calcium Calculator">
          <ProtectedRoute>
            <CorrectedCalciumCalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/calculators/bmi" element={
        <ErrorBoundary moduleName="BMI Calculator">
          <ProtectedRoute>
            <BMICalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/calculators/mascc" element={
        <ErrorBoundary moduleName="MASCC Index">
          <ProtectedRoute>
            <MASCCCalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/calculators/steroid-equivalence" element={
        <ErrorBoundary moduleName="Steroid Equivalence Calculator">
          <ProtectedRoute>
            <SteroidEquivalenceCalculator />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/calculators/opioid-converter" element={
        <ErrorBoundary moduleName="Opioid Estimator">
          <ProtectedRoute>
            <OpioidConverterCalculator />
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

      <Route path="/tools/quickguides" element={
        <ErrorBoundary moduleName="Quick Guides">
          <ProtectedRoute>
            <QuickGuidesPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/labs" element={
        <ErrorBoundary moduleName="Important Labs">
          <ProtectedRoute>
            <LabsPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/emergencyregimens" element={
        <ErrorBoundary moduleName="Emergency Regimens">
          <ProtectedRoute>
            <EmergencyRegimensPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/cognitive" element={
        <ErrorBoundary moduleName="Cognitive Tools">
          <ProtectedRoute>
            <CognitiveToolsPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/toxicities" element={
        <ErrorBoundary moduleName="Treatment Toxicities">
          <ProtectedRoute>
            <ToxicitiesPage />
          </ProtectedRoute>
        </ErrorBoundary>
      } />

      <Route path="/tools/reminders" element={
        <ErrorBoundary moduleName="Scheduling & Reminders">
          <ProtectedRoute>
            <RemindersPage />
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
