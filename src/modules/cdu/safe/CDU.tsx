import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtocolDashboard from "../components/ProtocolDashboard";
import TreatmentProtocols from "./treatmentProtocols/TreatmentProtocols";
import Toxicity from "./toxicity/Toxicity";
import TreatmentGuidanceTool from "../sections/TreatmentGuidanceTool";
import MedicationsView from "../medications/MedicationsView";

const CDU = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);  const sections = [
    { id: 'dashboard', label: 'Dashboard', component: <ProtocolDashboard /> },
    { id: 'protocols', label: 'Treatment Protocols', component: <TreatmentProtocols /> },
    { id: 'medications', label: 'Medications', component: <MedicationsView /> },
    { id: 'toxicity', label: 'Toxicity', component: <Toxicity /> },
    { id: 'treatment-guidance', label: 'Treatment Guidance', component: <TreatmentGuidanceTool /> },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 min-h-screen dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">
        Chemotherapy Day Unit (CDU)
      </h1>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-4 border-b pb-3 mb-6">
          {sections.map((section) => (
            <Tab
              key={section.id}
              className={({ selected }) => `
                cursor-pointer py-2 px-4 rounded-lg shadow transition-all duration-300
                ${selected 
                  ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white" 
                  : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"}
              `}
            >
              {section.label}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels>
          {sections.map((section) => (
            <Tab.Panel key={section.id}>
              {section.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CDU;
