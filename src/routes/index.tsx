import { Routes, Route } from "react-router-dom";
import HomeDashboard from "./HomeDashboard";
import OPDModule from "../modules/opd";
import CDUModule from "../modules/cdu";
import InpatientModule from "../modules/inpatient";
import PalliativeModule from "../modules/palliative";
import Tools from "../modules/tools";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/opd" element={<OPDModule />} />
      <Route path="/cdu" element={<CDUModule />} />
      <Route path="/inpatient" element={<InpatientModule />} />
      <Route path="/palliative" element={<PalliativeModule />} />
      <Route path="/tools" element={<Tools />} />
    </Routes>
  );
}
