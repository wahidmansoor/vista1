/**
 * Drug List Tab Component
 * Displays the list of drugs in a treatment protocol
 */

import React from 'react';
import { Pill, Clock, AlertTriangle, Info } from 'lucide-react';

interface DrugListTabProps {
  protocol?: any;
}

export const DrugListTab: React.FC<DrugListTabProps> = ({ protocol }) => {
  if (!protocol) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No protocol selected</p>
      </div>
    );
  }

  const drugs = protocol.drugs || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Pill className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Drug List</h3>
      </div>

      {drugs.length === 0 ? (
        <div className="text-center py-8">
          <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No drugs specified for this protocol</p>
        </div>
      ) : (
        <div className="space-y-4">
          {drugs.map((drug: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-3">
                <Pill className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {drug.name} {drug.generic_name && `(${drug.generic_name})`}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 mb-1">
                        <strong>Dose:</strong> {drug.dose} {drug.dose_unit}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Route:</strong> {drug.administration_route}
                      </p>
                      <p className="text-gray-600 mb-1">
                        <strong>Class:</strong> {drug.drug_class}
                      </p>
                    </div>
                    
                    <div>
                      {drug.schedule && (
                        <p className="text-gray-600 mb-1">
                          <strong>Schedule:</strong> Day {drug.schedule.day_of_cycle?.join(', ') || 'N/A'}
                        </p>
                      )}
                      {drug.duration && (
                        <p className="text-gray-600 mb-1">
                          <strong>Duration:</strong> {drug.duration}
                        </p>
                      )}
                      {drug.schedule?.infusion_duration && (
                        <p className="text-gray-600 mb-1">
                          <strong>Infusion Time:</strong> {drug.schedule.infusion_duration} {drug.schedule.infusion_duration_unit}
                        </p>
                      )}
                    </div>
                  </div>

                  {drug.special_instructions && drug.special_instructions.length > 0 && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-md">
                      <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Special Instructions
                      </h5>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {drug.special_instructions.map((instruction: string, idx: number) => (
                          <li key={idx}>• {instruction}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {drug.premedications && drug.premedications.length > 0 && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-md">
                      <h5 className="font-medium text-blue-900 mb-2">Premedications</h5>
                      <ul className="text-sm text-blue-800 space-y-1">
                        {drug.premedications.map((premed: any, idx: number) => (
                          <li key={idx}>
                            • {premed.name} - {premed.dose} {premed.route} ({premed.timing})
                            {premed.required && <span className="text-red-600 ml-1">*Required</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrugListTab;
