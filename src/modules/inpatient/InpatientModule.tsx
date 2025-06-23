import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import DischargeGuidelines from './sections/discharge/DischargeGuidelines';
// You can add these imports later as you build other modules
// import EmergencyProtocols from './sections/emergency/EmergencyProtocols';
// import AdmissionAssistant from './sections/admission/AdmissionAssistant';
// import SupportiveCareTools from './sections/supportive/SupportiveCareTools';

const tabs = ['Emergencies', 'Admissions', 'Supportive Care', 'Discharge'] as const;
type Tab = typeof tabs[number];

const InpatientModule = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Discharge');

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center text-purple-800 mb-4">Inpatient Department</h1>

      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map(tab => (
          <Button
            key={tab}
            variant={tab === activeTab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'Discharge' && <DischargeGuidelines />}
        {/* {activeTab === 'Emergencies' && <EmergencyProtocols />} */}
        {/* {activeTab === 'Admissions' && <AdmissionAssistant />} */}
        {/* {activeTab === 'Supportive Care' && <SupportiveCareTools />} */}
      </div>
    </div>
  );
};

export default InpatientModule;
