import React from 'react';
import { Card } from '@/components/ui/card';
import type { Protocol } from '@/types/protocol';

interface UnifiedProtocolCardProps {
  protocol: Protocol;
}

const UnifiedProtocolCard: React.FC<UnifiedProtocolCardProps> = ({ protocol }) => {
  return (
    <Card className="p-4 bg-white dark:bg-gray-900 shadow rounded-lg cursor-pointer hover:shadow-lg transition-all">
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold text-indigo-800">{protocol.code}</span>
        <span className="text-sm text-gray-600">{protocol.tumour_group}</span>
        {protocol.treatment_intent && (
          <span className="text-xs text-gray-500">{protocol.treatment_intent}</span>
        )}
      </div>
    </Card>
  );
};

export default UnifiedProtocolCard;
