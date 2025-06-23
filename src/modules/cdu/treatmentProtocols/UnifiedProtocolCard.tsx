import React from 'react';
import { Card } from '@/components/ui/card';
import type { Protocol } from '@/types/protocol';

interface UnifiedProtocolCardProps {
  protocol: Protocol;
}

// Helper: Return Tailwind color class based on treatment intent
const getIntentColor = (intent: string | undefined) => {
  if (!intent) return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  const lowered = intent.toLowerCase();
  if (lowered.includes('curative')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  if (lowered.includes('palliative')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  if (lowered.includes('adjuvant')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  if (lowered.includes('neoadjuvant')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';

  return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

const UnifiedProtocolCard: React.FC<UnifiedProtocolCardProps> = ({ protocol }) => {
  return (
    <Card className="p-4 bg-white dark:bg-gray-900 shadow-md rounded-xl cursor-pointer hover:shadow-xl transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-800 dark:text-indigo-300">{protocol.code}</h2>
          {protocol.treatment_intent && (
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${getIntentColor(
                protocol.treatment_intent
              )}`}
            >
              {protocol.treatment_intent}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">{protocol.tumour_group}</span>
        {protocol.summary && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{protocol.summary}</p>
        )}
      </div>
    </Card>
  );
};

export default UnifiedProtocolCard;
