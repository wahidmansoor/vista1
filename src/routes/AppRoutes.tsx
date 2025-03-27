import LandingPage from "../pages/LandingPage";
import { Routes, Route } from "react-router-dom";
import Handbook from "../modules/handbook/Handbook";
import OPD from "../modules/opd/OPD";
import CDU from "../modules/cdu/CDU";
import Inpatient from "../modules/inpatient/Inpatient";
import Palliative from "../modules/palliative/Palliative";
import Tools from "../modules/tools/Tools";  // Add the Tools route
import Calculators from "../modules/tools/Calculators";  // Add the Calculators route
import RedFlags from "../modules/tools/RedFlags";  // Add the RedFlags route

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/handbook" element={<Handbook />} />
      <Route path="/opd" element={<OPD />} />
      <Route path="/cdu" element={<CDU />} />
      <Route path="/inpatient" element={<Inpatient />} />
      <Route path="/palliative" element={<Palliative />} />
      
      {/* Add the Tools module routes */}
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/calculators" element={<Calculators />} />
      <Route path="/tools/redflags" element={<RedFlags />} />
    </Routes>
  );
};

export default AppRoutes;
