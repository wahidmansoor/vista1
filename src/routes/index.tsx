import { Routes, Route } from "react-router-dom";
import HomeDashboard from "./HomeDashboard";
import OPDModule from "../modules/opd";
import CDUModule from "../modules/cdu";
import InpatientModule from "../modules/inpatient";
import PalliativeModule from "../modules/palliative";
import Tools from "../modules/tools";
import Handbook from "../modules/handbook";
import { createBrowserRouter } from 'react-router-dom';
import InpatientLayout from '@/modules/inpatient/InpatientLayout';
import DischargeGuidelines from '@/modules/inpatient/sections/discharge/DischargeGuidelines';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'inpatient',
        element: <InpatientLayout />,
        children: [
          { path: '', redirect: 'overview' },
          { path: 'overview', element: <InpatientOverview /> },
          { path: 'discharge', element: <DischargeGuidelines /> },
          { path: 'orders', element: <InpatientOrders /> }
        ]
      }
    ]
  }
]);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeDashboard />} />
      <Route path="/opd" element={<OPDModule />} />
      <Route path="/cdu" element={<CDUModule />} />
      <Route path="/inpatient" element={<InpatientModule />} />
      <Route path="/palliative" element={<PalliativeModule />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/handbook" element={<Handbook />} />
      <Route path="/handbook/:section/*" element={<Handbook />} />
    </Routes>
  );
}
