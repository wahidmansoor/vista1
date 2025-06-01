import React from 'react';
import { Protocol } from '@/types/protocol';
import { TreatmentTab } from '@/modules/cdu/treatmentProtocols/tabs/TreatmentTab';
import { DrugListTab } from '@/modules/cdu/treatmentProtocols/tabs/DrugListTab';
import { DoseModificationsTab } from '@/modules/cdu/treatmentProtocols/tabs/DoseModificationsTab';
import { EligibilityTab } from '@/modules/cdu/treatmentProtocols/tabs/EligibilityTab';
import { TestsSectionTab } from '@/modules/cdu/treatmentProtocols/tabs/TestsSectionTab';
import { RescueAgentsTab } from '@/modules/cdu/treatmentProtocols/tabs/RescueAgentsTab';
import { SupportiveCareTab } from '@/modules/cdu/treatmentProtocols/tabs/SupportiveCareTab';


// Define the tab types
export type TabType = 
  | 'treatment' 
  | 'drugs' 
  | 'dose' 
  | 'eligibility' 
  | 'tests' 
  | 'rescue'
  | 'supportive';

interface TabContentProps {
  protocol: Protocol;
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ protocol, activeTab }) => {
  // Map of tab content
  const content: Record<TabType, React.ReactNode> = {
    treatment: protocol.treatment ? <TreatmentTab protocol={protocol} /> : <div>No treatment information available</div>,
    drugs: <DrugListTab protocol={protocol} />,
    dose: <DoseModificationsTab protocol={protocol} />,
    eligibility: <EligibilityTab protocol={protocol} />,
    tests: <TestsSectionTab protocol={protocol} />,
    rescue: <RescueAgentsTab protocol={protocol} />,
    supportive: <SupportiveCareTab protocol={protocol} />
  };

  // Fallback content if tab doesn't exist
  if (!content[activeTab as TabType]) {
    return <div className="p-4 text-gray-500">Tab content not available</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow-inner">
      {content[activeTab as TabType]}
    </div>
  );
};

export default TabContent;
