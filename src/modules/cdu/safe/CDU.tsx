import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import TreatmentProtocols from "./treatmentProtocols/TreatmentProtocols";
import Toxicity from "./toxicity/Toxicity";
import Premedications from "./premedications/Premedications";
import PreMedicationManager from "./premedications/PreMedicationManager";
import Calculations from "./calculations/Calculations";

const CDU = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sections = ["Treatment Protocols", "Toxicity", "Premedications", "Calculations"];

  const renderSection = (index: number) => {
    switch(index) {
      case 0:
        return <TreatmentProtocols />;
      case 1:
        return <Toxicity />;
      case 2:
        return (
          <div className="space-y-8">
            <PreMedicationManager />
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Simple View</h3>
              <Premedications />
            </div>
          </div>
        );
      case 3:
        return <Calculations />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">Chemotherapy Day Unit (CDU)</h1>
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-4 border-b pb-3 mb-6">
          {sections.map((section, index) => (
            <Tab 
              key={index} 
              className={({ selected }) => `
                cursor-pointer py-2 px-4 rounded-lg shadow transition-all duration-300 
                ${selected 
                  ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white" 
                  : "bg-white text-gray-600 hover:text-indigo-500 hover:shadow-md"}
              `}
            >
              {section}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="bg-white rounded-lg shadow">
          {sections.map((_, index) => (
            <Tab.Panel key={index} className="focus:outline-none">
              {renderSection(index)}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CDU;
