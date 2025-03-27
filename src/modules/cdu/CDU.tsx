// src/modules/cdu/CDU.tsx
import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import { BookOpen, Syringe, HeartPulse } from "lucide-react";
import TreatmentProtocols from "./treatmentProtocols/TreatmentProtocols";
import Toxicity from "./toxicity/Toxicity";
import Premedications from "./premedications/Premedications";
import BSACalculator from "./calculations/Calculations";

const CDU = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const sections = [
    { name: "Treatment Protocols", icon: <BookOpen size={24} /> },
    { name: "Toxicity", icon: <Syringe size={24} /> },
    { name: "Premedications", icon: <HeartPulse size={24} /> },
    { name: "Calculations", icon: <Syringe size={24} /> },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6 text-indigo-600">Chemotherapy Day Unit (CDU)</h1>

      {/* Tabs */}
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-6 border-b pb-2 mb-4">
          {sections.map((section, index) => (
            <Tab
              key={index}
              className={`cursor-pointer py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                selectedIndex === index
                  ? "bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 text-white"
                  : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {section.icon}
              {section.name}
            </Tab>
          ))}
        </Tab.List>

        {/* Tab Panels */}
        <Tab.Panels>
          <Tab.Panel className="p-4 transition-all duration-300">
            <TreatmentProtocols />
          </Tab.Panel>
          <Tab.Panel className="p-4 transition-all duration-300">
            <Toxicity />
          </Tab.Panel>
          <Tab.Panel className="p-4 transition-all duration-300">
            <Premedications />
          </Tab.Panel>
          <Tab.Panel className="p-4 transition-all duration-300">
            <BSACalculator />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default CDU;
