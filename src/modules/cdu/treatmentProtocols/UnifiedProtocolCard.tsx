import React from 'react';
import type { Protocol } from '@/types/protocol';

interface UnifiedProtocolCardProps {
  protocol: Protocol;
}

// Helper: Return glass morphism badge styles
const getIntentColor = (intent: string | undefined) => {
  if (!intent) return 'bg-white/20 text-white border border-white/30';

  const lowered = intent.toLowerCase();
  if (lowered.includes('curative')) return 'bg-green-500/20 text-green-100 border border-green-400/30';
  if (lowered.includes('palliative')) return 'bg-rose-500/20 text-rose-100 border border-rose-400/30';
  if (lowered.includes('adjuvant')) return 'bg-blue-500/20 text-blue-100 border border-blue-400/30';
  if (lowered.includes('neoadjuvant')) return 'bg-purple-500/20 text-purple-100 border border-purple-400/30';

  return 'bg-white/20 text-white border border-white/30';
};

const UnifiedProtocolCard: React.FC<UnifiedProtocolCardProps> = ({ protocol }) => {
  return (
    <div className="cdu-card p-4 cursor-pointer group">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
            {protocol.code}
          </h2>
          {protocol.treatment_intent && (
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getIntentColor(protocol.treatment_intent)}`}>
              {protocol.treatment_intent}
            </span>
          )}
        </div>
        
        <span className="text-sm font-medium text-blue-200">
          {protocol.tumour_group}
        </span>
        
        {protocol.summary && (
          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed">
            {protocol.summary}
          </p>
        )}
        
        {/* Progress indicator */}
        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full w-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full bg-white/40"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedProtocolCard;
