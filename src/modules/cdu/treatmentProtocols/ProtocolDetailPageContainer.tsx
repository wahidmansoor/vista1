import React from 'react';
import { useParams } from 'react-router-dom';
import ProtocolDetail from './ProtocolDetail';
import ErrorBoundary from '@/components/ErrorBoundary';

interface ProtocolDetailPageContainerProps {
  protocolId?: string;
}

const ProtocolDetailPageContainer: React.FC<ProtocolDetailPageContainerProps> = ({ 
  protocolId: propProtocolId 
}) => {
  const { protocolId: routeProtocolId } = useParams<{ protocolId: string }>();
  const protocolId = propProtocolId || routeProtocolId;

  // Mock protocol data for now - in a real app this would fetch from API
  const mockProtocol = {
    id: protocolId || '1',
    code: protocolId || 'MOCK-PROTOCOL',
    name: 'Mock Protocol for Testing',
    tumour_group: 'Various',
    treatment_intent: 'Testing',
    regimen_details: 'This is a mock protocol for testing purposes',
    frequency: 'As needed',
    duration: 'Until fixed',
    drugs: [
      {
        name: 'Mock Drug',
        dosage: '100mg',
        route: 'PO',
        schedule: 'Daily'
      }
    ]
  };

  if (!protocolId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Protocol Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            No protocol ID provided. Please select a protocol to view details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary moduleName="Protocol Detail">
      <div className="h-full">
        <ProtocolDetail protocol={mockProtocol} />
      </div>
    </ErrorBoundary>
  );
};

export default ProtocolDetailPageContainer;
