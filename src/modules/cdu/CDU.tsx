import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import TreatmentProtocols from "./treatmentProtocols/TreatmentProtocols";
import ProtocolDetailPageContainer from "./safe/treatmentProtocols/TreatmentProtocols";
import Toxicity from "./toxicity/Toxicity";
import DiseaseProgressTracker from "./sections/DiseaseProgressTracker";
import MedicationsView from "./medications/MedicationsView";

/**
 * CDU (Chemotherapy Day Unit) Module
 * 
 * Main container component for the CDU module that provides
 * tabbed navigation between various chemotherapy management features:
 * - Treatment Protocols: Standardized treatment regimens
 * - Medications: Medication database and interactions
 * - Toxicity: Side effect management and protocols
 * - Disease Progress: Patient disease tracking
 */
const CDU = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const TABS = [
    { id: 'treatment-protocols', label: 'Treatment Protocols', component: <TreatmentProtocols /> },
    { id: 'medications', label: 'Medications', component: <MedicationsView /> },
    { id: 'toxicity', label: 'Toxicity', component: <Toxicity /> },
    { id: 'disease-progress', label: 'Disease Progress', component: <DiseaseProgressTracker /> },
  ];

  return (
    <ErrorBoundary moduleName="Chemotherapy Day Unit">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Chemotherapy Day Unit</h1>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-4 border-b pb-3 mb-6">
            {TABS.map((tab, index) => (
              <Tab key={index} className={({ selected }) => `
                cursor-pointer py-2 px-4 rounded-lg shadow transition-all duration-300
                ${selected 
                  ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white" 
                  : "bg-white text-gray-600 hover:text-indigo-500 hover:shadow-md"}
              `}>
                {tab.label}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {TABS.map((tab, index) => (
              <Tab.Panel key={index}>
                {tab.id === 'treatment-protocols' ? (
                  <Routes>
                    <Route index element={tab.component} />
                    <Route path="treatment-protocols/:id" element={<ProtocolDetailPageContainer />} />
                  </Routes>
                ) : (
                  tab.component
                )}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ErrorBoundary>
  );
};

export default CDU;
