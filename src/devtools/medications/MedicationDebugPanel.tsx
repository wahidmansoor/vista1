import React from 'react';
import { Protocol } from '@/types/medical';

interface MedicationDebugPanelProps {
  protocol?: Protocol;
}

export const MedicationDebugPanel: React.FC<MedicationDebugPanelProps> = ({ 
  protocol 
}) => {
  if (!protocol) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-semibold mb-2">Medication Debug Panel</h3>
        <p className="text-gray-600">No protocol selected</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Medication Debug Panel</h3>
      <div className="space-y-2">
        <div>
          <strong>Protocol:</strong> {protocol.name}
        </div>
        <div>
          <strong>Drugs:</strong> {protocol.drugs?.length || 0}
        </div>
        {protocol.drugs && (
          <div className="mt-2">
            <strong>Drug List:</strong>
            <ul className="list-disc ml-5">
              {protocol.drugs.map((drug, index) => (
                <li key={index}>{drug.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationDebugPanel;
