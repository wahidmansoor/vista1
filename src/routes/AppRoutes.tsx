import LandingPage from "../pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFoundRedirect from "@/components/NotFoundRedirect";
import Handbook from "../modules/handbook";
import OPD from "../modules/opd";
import CDU from "../modules/cdu";
import Inpatient from "../modules/inpatient";
import Palliative from "../modules/palliative/Palliative";
import Tools from "../modules/tools";
import Calculators from "../modules/tools/Calculators";
import RedFlagsPage from "../modules/tools/RedFlags";
import BSACalculator from "../modules/tools/calculators/BSA";
import CrClCalculator from "../modules/tools/calculators/CrCl";
import ANCCalculator from "../modules/tools/calculators/ANC";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={
        <ErrorBoundary moduleName="Landing">
          <LandingPage />
        </ErrorBoundary>
      } />
      
      {/* Consolidated handbook route that handles all handbook paths */}
      <Route path="/handbook/*" element={
        <ErrorBoundary moduleName="Handbook">
          <Handbook />
        </ErrorBoundary>
      } />
      
      {/* Other routes */}
      <Route path="/opd/*" element={<OPD />} />
      <Route path="/cdu" element={<CDU />} />
      <Route path="/inpatient" element={<Inpatient />} />
      <Route path="/palliative" element={<Palliative />} />
      
      {/* Tools module routes */}
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

      {/* Fallback catch-all route */}
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
};

export default AppRoutes;
