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
      <div className="inpatient-container p-6">
        <h1 className="text-3xl font-bold mb-6 text-white drop-shadow-lg">Inpatient Department</h1>
        <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <Tab.List className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-lg p-1 mb-8 overflow-x-auto scrollbar-hide">
            {sections.map((section, index) => (
              <Tab key={index} className={({ selected }) => `
                whitespace-nowrap px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium rounded-md
                transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50
                min-w-[120px] text-center
                ${selected 
                  ? "inpatient-tab-selected" 
                  : "inpatient-tab-unselected"}
              `}>
                {section}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="inpatient-content-panel">
            {sections.map((_, index) => (
              <Tab.Panel key={index} className="focus:outline-none">
                <div className="p-6">
                  {renderSection(index)}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ErrorBoundary>
  );
};

export default Inpatient;
