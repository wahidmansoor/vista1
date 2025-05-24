import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { format } from 'date-fns';
import type { Protocol, Drug } from '../../../types/protocol';
// Removed MonitoringTab import
import TreatmentTab from './TreatmentTab';
import TestsSectionTab from './TestsSectionTab';

interface DrawerOverlayProps {
  isOpen: boolean;
  protocol: Protocol;
  onClose: () => void;
  onDrugSelect: (drug: Drug) => void;
  showDebug?: boolean;
  showFullProtocolData?: boolean;
  onTabChange?: (tab: string) => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="font-semibold text-lg mb-2 text-indigo-800">{title}</h3>
    <div>{children}</div>
  </div>
);

const OverviewSection = ({ protocol }: { protocol?: Protocol }) => (
  <div className="space-y-4">
    <div>
      <h3 className="font-semibold text-lg mb-2">Protocol Details</h3>
      <div className="space-y-2">
        <p><span className="font-medium">Code:</span> {protocol?.code}</p>
        <p><span className="font-medium">Tumor Group:</span> {protocol?.tumour_group}</p>
        {protocol?.treatment_intent && (
          <p><span className="font-medium">Intent:</span> {protocol?.treatment_intent}</p>
        )}
        {protocol?.summary && (
          <div className="mt-4">
            <h4 className="font-semibold">Summary</h4>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{protocol.summary}</p>
          </div>
        )}
      </div>
    </div>

    {protocol?.eligibility && (
      <div>
        <h4 className="text-lg font-semibold mb-2">Eligibility Criteria</h4>
        <ul className="list-disc pl-5 space-y-2">
          {Array.isArray(protocol.eligibility) 
            ? protocol.eligibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))
            : Object.entries(protocol.eligibility).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong>{" "}
                  {Array.isArray(value) ? value.join(", ") : value}
                </li>
              ))
          }
        </ul>
      </div>
    )}
  </div>
);

const PrecautionsTab = ({ precautions }: { precautions?: string[] }) => (
  <div>
    <h3 className="font-semibold text-lg mb-2">Precautions</h3>
    {precautions && precautions.length > 0 ? (
      <ul className="list-disc list-inside space-y-1">
        {precautions.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-muted-foreground">No precautions specified.</p>
    )}
  </div>
);

const DrawerOverlay: React.FC<DrawerOverlayProps> = ({ 
  isOpen, 
  protocol, 
  onClose, 
  onDrugSelect, 
  showDebug = false,
  showFullProtocolData = false,
  onTabChange
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  // Handle debugging logs
  useEffect(() => {
    if (showDebug) {
      console.log('Protocol in DrawerOverlay:', protocol);
      console.log('Protocol code:', protocol?.code);
      console.log('Protocol monitoring:', protocol?.monitoring);
      console.log('Protocol treatment:', protocol?.treatment);
      console.log('Protocol tests:', protocol?.tests);
      console.log('Protocol precautions:', protocol?.precautions);
    }
  }, [protocol, showDebug]);

  if (!isOpen) return null;
  if (!protocol) {
    console.warn('Protocol is undefined in DrawerOverlay');
    return null;
  }
  
  // Set up data with fallbacks for each section to prevent errors
  const monitoringData = protocol.monitoring || { baseline: [], ongoing: [] };
  const treatmentData = protocol.treatment || { drugs: [] };
  const testsData = protocol.tests || [];
  const precautionsData = protocol.precautions || [];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 h-full w-full md:w-4/5 lg:w-2/3 xl:max-w-xl z-50 bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = offset.x > 100 || velocity.x > 300;
          if (swipe) {
            onClose();
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex-1">
            <span className="text-xl font-bold text-indigo-900 dark:text-indigo-100">{protocol.code}</span>
            {protocol.version && <span className="ml-2 text-xs text-gray-500">v{protocol.version}</span>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Content */}
        <ScrollArea className="flex-1 overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="p-4">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="treatment">Treatment</TabsTrigger>
                {/* Removed MonitoringTab tab */}
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="precautions">Precautions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <OverviewSection protocol={protocol} />
              </TabsContent>
              
              <TabsContent value="treatment">
                <TreatmentTab treatment={protocol.treatment} />
              </TabsContent>
              
              {/* Removed MonitoringTab content */}
                <TabsContent value="tests">
                <TestsSectionTab tests={protocol.tests} />
              </TabsContent>
              
              <TabsContent value="precautions">
                <PrecautionsTab precautions={protocol.precautions} />
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default DrawerOverlay;
