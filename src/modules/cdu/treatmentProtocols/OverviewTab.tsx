import React from 'react';
import { Calendar, Info, Pill } from 'lucide-react';
import type { Protocol } from '../../../types/protocol';
import { 
  getProtocolMedications,
  getAllPrecautions, // Added
  getProtocolReferences // Added
} from '../../../utils/protocolHelpers';
import { RichTextBlock, TagList } from '../components/medicationComponents';

interface OverviewTabProps {
  protocol: Protocol;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ protocol }) => {
  const preMedications = getProtocolMedications(protocol, 'pre', 'all'); // Ensure 'all' is used if that's the desired default
  const postMedications = getProtocolMedications(protocol, 'post', 'all'); // Ensure 'all' is used if that's the desired default
  const precautions = getAllPrecautions(protocol); // Use new helper
  const references = getProtocolReferences(protocol); // Use new helper
  
  return (
    <div className="space-y-8">
      {/* Treatment Schedule */}
      {protocol.cycle_info && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Treatment Schedule
          </h3>
          <RichTextBlock content={protocol.cycle_info} />
        </div>
      )}

      {/* Pre/Post Medications */}
      <div className="grid gap-6 md:grid-cols-2">
        {preMedications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Pre-Medications
            </h3>
            <TagList items={preMedications} />
          </div>
        )}
        
        {postMedications.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Post-Medications
            </h3>
            <TagList items={postMedications} />
          </div>
        )}
      </div>

      {/* Precautions */}
      {precautions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Precautions & Warnings
          </h3>
          <TagList items={precautions} />
        </div>
      )}

      {/* Reference Sources */}
      {references.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            References
          </h3>
          <TagList items={references} />
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
