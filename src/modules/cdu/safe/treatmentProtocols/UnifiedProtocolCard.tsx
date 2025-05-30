import React from 'react';
import { Protocol } from '@/types/protocol';
import { ArrowRight } from 'lucide-react';

interface UnifiedProtocolCardProps {
  protocol: Protocol;
  onClick?: () => void;
}

const UnifiedProtocolCard: React.FC<UnifiedProtocolCardProps> = ({ protocol, onClick }) => {
  // Format protocol display data
  const getTreatmentIntent = () => {
    if (protocol.treatment_intent) {
      return protocol.treatment_intent;
    }
    if (protocol.overview?.treatment_intent) {
      return protocol.overview.treatment_intent;
    }
    return 'Not specified';
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg p-5 cursor-pointer transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{protocol.code}</h3>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{getTreatmentIntent()}</div>
        </div>
        <div className="flex items-center justify-center rounded-full w-8 h-8 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400">
          <ArrowRight size={16} />
        </div>
      </div>
      
      {protocol.tumour_group && (
        <div className="mt-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            {protocol.tumour_group}
          </span>
        </div>
      )}

      {protocol.treatment?.drugs && protocol.treatment.drugs.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {protocol.treatment.drugs.slice(0, 3).map((drug, index) => (
            <span key={index} className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
              {drug.name}
            </span>
          ))}
          {protocol.treatment.drugs.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded">
              +{protocol.treatment.drugs.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedProtocolCard;
