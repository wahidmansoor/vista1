import React from 'react';
import { Card } from '@/components/ui/card';

interface ProtocolCardProps {
  protocol: {
    id?: string;
    code: string;
    tumour_group: string;
    treatment_intent?: string;
    name?: string;
  };
  onView?: (protocol: any) => void;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol, onView }) => {
  return (
    <Card 
      className="p-4 bg-white dark:bg-gray-900 shadow rounded-lg cursor-pointer hover:shadow-lg transition-all" 
      onClick={() => onView && onView(protocol)}
    >
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold text-indigo-800">{protocol.code}</span>
        <span className="text-sm text-gray-600">{protocol.tumour_group}</span>
        {protocol.treatment_intent && (
          <span className="text-xs text-gray-500">{protocol.treatment_intent}</span>
        )}
        {protocol.name && (
          <span className="text-sm font-medium text-gray-700">{protocol.name}</span>
        )}
      </div>
    </Card>
  );
};

export default ProtocolCard;
