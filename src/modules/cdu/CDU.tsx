import React, { useState, Suspense, lazy } from "react";
import { Tab } from "@headlessui/react";
import { Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import CDULayout from "./components/CDULayout";

// Lazy load components for better performance
const TreatmentProtocols = lazy(() => import("./treatmentProtocols/TreatmentProtocols"));
const ProtocolDetailPageContainer = lazy(() => import("./safe/treatmentProtocols/TreatmentProtocols"));
const Toxicity = lazy(() => import("./toxicity/Toxicity"));
const EnhancedDiseaseProgressTracker = lazy(() => import("./sections/EnhancedDiseaseProgressTracker"));
const MedicationsView = lazy(() => import("./medications/MedicationsView"));

/**
 * Loading component for tab lazy loading
 */
const TabLoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--cdu-primary)' }}></div>
  </div>
);

/**
 * CDU (Chemotherapy Day Unit) Module
 * 
 * Main container component for the CDU module that provides
 * tabbed navigation between various chemotherapy management features:
 * - Treatment Protocols: Standardized treatment regimens
 * - Medications: Medication database and interactions
 * - Toxicity: Side effect management and protocols
 * - Disease Progress: Enhanced patient disease tracking with AI recommendations
 */
const CDU = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const TABS = [
    { id: 'treatment-protocols', label: 'Treatment Protocols', component: <TreatmentProtocols /> },
    { id: 'medications', label: 'Medications', component: <MedicationsView /> },
    { id: 'toxicity', label: 'Toxicity', component: <Toxicity /> },
    { id: 'disease-progress', label: 'Disease Progress', component: <EnhancedDiseaseProgressTracker /> },
  ];

  return (
    <ErrorBoundary moduleName="Chemotherapy Day Unit">
      <CDULayout>
        {/* Header with proper spacing */}
        <div className="cdu-header mb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              Chemotherapy Day Unit
            </h1>
          </div>
        </div>

        {/* Main content with responsive padding */}
        <div className="px-4 sm:px-6 lg:px-8 pb-8">          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List 
              className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-lg p-1 mb-8 overflow-x-auto scrollbar-hide"
              aria-label="CDU Module Navigation"
            >
              {TABS.map((tab, index) => (
                <Tab 
                  key={index} 
                  className={({ selected }) => `
                    whitespace-nowrap px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium rounded-md
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50
                    min-w-[120px] text-center
                    ${selected 
                      ? "cdu-tab-selected" 
                      : "cdu-tab-unselected"}
                  `}
                >
                  {tab.label}
                </Tab>
              ))}
            </Tab.List>

            <Tab.Panels>
              {TABS.map((tab, index) => (                <Tab.Panel 
                  key={index} 
                  className="focus:outline-none"
                  tabIndex={0}
                >
                  <div className="cdu-content-panel p-6">
                    <Suspense fallback={<TabLoadingSpinner />}>
                      {tab.id === 'treatment-protocols' ? (
                        <Routes>
                          <Route index element={tab.component} />
                          <Route path="treatment-protocols/:id" element={<ProtocolDetailPageContainer />} />
                        </Routes>
                      ) : (
                        tab.component
                      )}
                    </Suspense>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </div>
      </CDULayout>
    </ErrorBoundary>
  );
};

export default CDU;
