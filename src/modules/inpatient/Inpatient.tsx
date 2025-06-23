import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import EmergencyProtocols from "./sections/emergencies/EmergencyProtocols";
import AdmissionGuidelines from "./sections/admission/AdmissionGuidelines";
import SupportiveCare from "./sections/supportive_care/SupportiveCare";
import DischargeGuidelines from "./sections/discharge/DischargeGuidelines";

const Inpatient = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sections = ["Emergencies", "Admissions", "Supportive Care", "Discharge"];

  const renderSection = (index: number) => {
    switch(index) {
      case 0:
        return <EmergencyProtocols />;
      case 1:
        return <AdmissionGuidelines />;
      case 2:
        return <SupportiveCare />;
      case 3:
        return <DischargeGuidelines />;
      default:
        return null;
    }
  };

  return (
    <ErrorBoundary moduleName="Inpatient Oncology">
      <div className="p-6 bg-gradient-to-br from-purple-50 via-indigo-50 to-teal-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Inpatient Department</h1>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-4 border-b pb-3 mb-6">
            {sections.map((section, index) => (
              <Tab key={index} className={({ selected }) => `
                cursor-pointer py-2 px-4 rounded-lg shadow transition-all duration-300
                ${selected 
                  ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white" 
                  : "bg-white text-gray-600 hover:text-indigo-500 hover:shadow-md"}
              `}>
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
    </ErrorBoundary>
  );
};

export default Inpatient;
