import type { FC } from "react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary"; // ✅ updated to match filename
import NotFoundRedirect from "@/components/NotFoundRedirect";
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import ProtectedPage from "@/pages/ProtectedPage";
import CallbackPage from "@/pages/CallbackPage";
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
import opdRoutes from './opdRoutes';
import cduRoutes from './cduRoutes';
import ProtocolDetailPageContainer from "@/modules/cdu/safe/treatmentProtocols/TreatmentProtocols";

const AppRoutes: FC = () => {
  return (    <Routes>      <Route path="/" element={
        <ErrorBoundary moduleName="Landing">
          <LandingPage />
        </ErrorBoundary>
      } />      <Route path="/dashboard" element={
        <ErrorBoundary moduleName="Dashboard">
          <Dashboard />
        </ErrorBoundary>
      } />      <Route path="/callback" element={
        <ErrorBoundary moduleName="Auth Callback">
          <CallbackPage />
        </ErrorBoundary>
      } />

      <Route path="/protected" element={
        <ErrorBoundary moduleName="Protected Page">
          <ProtectedPage />
        </ErrorBoundary>
      } />

      <Route path="/handbook/*" element={
        <ErrorBoundary moduleName="Handbook">
          <Handbook />
        </ErrorBoundary>
      } />

      <Route path="/search" element={
        <ErrorBoundary moduleName="Handbook Search">
          <SearchPage />
        </ErrorBoundary>
      } />

      {opdRoutes}
      {cduRoutes}

      <Route path="/inpatient" element={
        <ErrorBoundary moduleName="Inpatient">
          <Inpatient />
        </ErrorBoundary>
      } />
      <Route path="/palliative" element={
        <ErrorBoundary moduleName="Palliative">
          <Palliative />
        </ErrorBoundary>
      } />

      <Route path="/tools" element={
        <ErrorBoundary moduleName="Tools">
          <Tools />
        </ErrorBoundary>
      } />
      <Route path="/tools/calculators" element={
        <ErrorBoundary moduleName="Clinical Calculators">
          <Calculators />
        </ErrorBoundary>
      } />
      <Route path="/tools/calculators/bsa" element={
        <ErrorBoundary moduleName="BSA Calculator">
          <BSACalculator />
        </ErrorBoundary>
      } />
      <Route path="/tools/calculators/crcl" element={
        <ErrorBoundary moduleName="CrCl Calculator">
          <CrClCalculator />
        </ErrorBoundary>
      } />
      <Route path="/tools/calculators/anc" element={
        <ErrorBoundary moduleName="ANC Calculator">
          <ANCCalculator />
        </ErrorBoundary>
      } />
      <Route path="/tools/redflags" element={
        <ErrorBoundary moduleName="Red Flags">
          <RedFlagsPage />
        </ErrorBoundary>
      } />

      <Route path="/cdu/treatment-protocols/:id" element={
        <ErrorBoundary moduleName="Protocol Detail">
          <ProtocolDetailPageContainer />
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
