/**
 * Dose Modifications Tab Component
 * Displays dose modification guidelines for treatment protocols
 */

import React from 'react';
import { AlertTriangle, Info, Minus, Plus } from 'lucide-react';

interface DoseModificationsTabProps {
  protocol?: any;
}

export const DoseModificationsTab: React.FC<DoseModificationsTabProps> = ({ protocol }) => {
  if (!protocol) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No protocol selected</p>
      </div>
    );
  }

  const doseModifications = protocol.dose_modifications || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Minus className="h-6 w-6 text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Dose Modifications</h3>
      </div>

      {doseModifications.length === 0 ? (
        <div className="text-center py-8">
          <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No dose modifications specified for this protocol</p>
        </div>
      ) : (
        <div className="space-y-4">
          {doseModifications.map((modification: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {modification.action === 'reduce' && <Minus className="h-5 w-5 text-orange-500 mt-1" />}
                  {modification.action === 'hold' && <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />}
                  {modification.action === 'discontinue' && <AlertTriangle className="h-5 w-5 text-red-600 mt-1" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-2">{modification.condition}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Action:</strong> {modification.action}
                  </p>
                  {modification.dose_reduction_percent && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Reduction:</strong> {modification.dose_reduction_percent}%
                    </p>
                  )}
                  {modification.alternative_drug && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Alternative:</strong> {modification.alternative_drug}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">{modification.rationale}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* General Guidelines */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">General Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Dose modifications should be based on the worst toxicity grade</li>
          <li>• Consider patient-specific factors (age, performance status, comorbidities)</li>
          <li>• Document all dose modifications and rationale</li>
          <li>• Monitor closely after dose modifications</li>
        </ul>
      </div>
    </div>
  );
};

export default DoseModificationsTab;
