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
  if (lowered.includes('palliative')) return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200';
  if (lowered.includes('adjuvant')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  if (lowered.includes('neoadjuvant')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';

  return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
};

const UnifiedProtocolCard: React.FC<UnifiedProtocolCardProps> = ({ protocol }) => {
  return (
    <Card className="cdu-card p-4 cursor-pointer group">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h2 
            className="text-xl font-bold group-hover:text-[var(--cdu-primary)] transition-colors"
            style={{ color: 'var(--cdu-primary-dark)' }}
          >
            {protocol.code}
          </h2>
          {protocol.treatment_intent && (
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getIntentColor(protocol.treatment_intent)}`}>
              {protocol.treatment_intent}
            </span>
          )}
        </div>
        
        <span 
          className="text-sm font-medium"
          style={{ color: 'var(--cdu-primary)' }}
        >
          {protocol.tumour_group}
        </span>
        
        {protocol.summary && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {protocol.summary}
          </p>
        )}
        
        {/* Progress indicator */}
        <div className="mt-2 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"
            style={{ 
              background: `linear-gradient(to right, var(--cdu-accent), var(--cdu-accent-light))` 
            }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default UnifiedProtocolCard;
