/**
 * Rescue Agents Tab Component
 * Displays rescue agents information for treatment protocols
 */

import React from 'react';
import { Shield, AlertTriangle, Info, Clock } from 'lucide-react';

interface RescueAgentsTabProps {
  protocol?: any;
}

export const RescueAgentsTab: React.FC<RescueAgentsTabProps> = ({ protocol }) => {
  if (!protocol) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No protocol selected</p>
      </div>
    );
  }

  const rescueAgents = protocol.rescue_agents || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Shield className="h-6 w-6 text-red-600" />
        <h3 className="text-lg font-semibold text-gray-900">Rescue Agents</h3>
      </div>

      {rescueAgents.length === 0 ? (
        <div className="text-center py-8">
          <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No rescue agents specified for this protocol</p>
        </div>
      ) : (
        <div className="space-y-4">
          {rescueAgents.map((agent: any, index: number) => (
            <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900 mb-2">{agent.name}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-red-700 mb-1">
                        <strong>Indication:</strong> {agent.indication}
                      </p>
                      <p className="text-red-700 mb-1">
                        <strong>Dose:</strong> {agent.dose}
                      </p>
                      <p className="text-red-700 mb-1">
                        <strong>Route:</strong> {agent.route}
                      </p>
                    </div>
                    
                    <div>
                      {agent.onset_time && (
                        <p className="text-red-700 mb-1">
                          <strong>Onset:</strong> {agent.onset_time}
                        </p>
                      )}
                      {agent.duration && (
                        <p className="text-red-700 mb-1">
                          <strong>Duration:</strong> {agent.duration}
                        </p>
                      )}
                      {agent.frequency && (
                        <p className="text-red-700 mb-1">
                          <strong>Frequency:</strong> {agent.frequency}
                        </p>
                      )}
                    </div>
                  </div>

                  {agent.instructions && (
                    <div className="bg-red-100 border border-red-200 rounded-md p-3 mb-3">
                      <h5 className="font-medium text-red-900 mb-2">Instructions</h5>
                      <p className="text-sm text-red-800">{agent.instructions}</p>
                    </div>
                  )}

                  {agent.contraindications && agent.contraindications.length > 0 && (
                    <div className="bg-yellow-100 border border-yellow-200 rounded-md p-3">
                      <h5 className="font-medium text-yellow-900 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Contraindications
                      </h5>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        {agent.contraindications.map((contraindication: string, idx: number) => (
                          <li key={idx}>• {contraindication}</li>
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

      {/* Emergency Contact Info */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-3 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Emergency Guidelines
        </h4>
        <ul className="text-sm text-red-800 space-y-2">
          <li>• Always contact the on-call physician before administering rescue agents</li>
          <li>• Document all rescue agent administrations thoroughly</li>
          <li>• Monitor patient closely after rescue agent administration</li>
          <li>• Have emergency equipment readily available</li>
          <li>• Follow institutional emergency protocols</li>
        </ul>
      </div>
    </div>
  );
};

export default RescueAgentsTab;
