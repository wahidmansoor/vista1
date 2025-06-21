/**
 * Supportive Care Tab Component
 * Displays supportive care measures for treatment protocols
 */

import React from 'react';
import { Heart, AlertTriangle, Info, Check } from 'lucide-react';

interface SupportiveCareTabProps {
  protocol?: any;
}

export const SupportiveCareTab: React.FC<SupportiveCareTabProps> = ({ protocol }) => {
  if (!protocol) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No protocol selected</p>
      </div>
    );
  }

  const supportiveCare = protocol.supportive_care || {};
  const required = supportiveCare.required || [];
  const optional = supportiveCare.optional || [];
  const monitoring = supportiveCare.monitoring || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Heart className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Supportive Care</h3>
      </div>

      {/* Required Supportive Care */}
      {required.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Required Supportive Care
          </h4>
          <ul className="space-y-2">
            {required.map((item: any, index: number) => (
              <li key={index} className="text-green-800 flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <div>
                  <span className="font-medium">{typeof item === 'string' ? item : item.name}</span>
                  {typeof item === 'object' && item.description && (
                    <p className="text-sm text-green-700 mt-1">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Optional Supportive Care */}
      {optional.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3 flex items-center">
            <Info className="h-5 w-5 mr-2" />
            Optional Supportive Care
          </h4>
          <ul className="space-y-2">
            {optional.map((item: any, index: number) => (
              <li key={index} className="text-blue-800 flex items-start space-x-2">
                <span className="text-blue-600 mt-1">○</span>
                <div>
                  <span className="font-medium">{typeof item === 'string' ? item : item.name}</span>
                  {typeof item === 'object' && item.description && (
                    <p className="text-sm text-blue-700 mt-1">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Monitoring Requirements */}
      {monitoring.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Monitoring Requirements
          </h4>
          <ul className="space-y-2">
            {monitoring.map((item: string, index: number) => (
              <li key={index} className="text-yellow-800 flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">⚠</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* General Guidelines */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">General Supportive Care Guidelines</h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Assess patient's supportive care needs regularly</li>
          <li>• Individualize supportive care based on patient factors</li>
          <li>• Monitor for drug interactions with supportive medications</li>
          <li>• Educate patients and families about supportive care measures</li>
          <li>• Document all supportive care interventions</li>
          <li>• Coordinate with multidisciplinary team members</li>
        </ul>
      </div>

      {/* No Supportive Care Message */}
      {required.length === 0 && optional.length === 0 && monitoring.length === 0 && (
        <div className="text-center py-8">
          <Info className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No specific supportive care measures defined for this protocol</p>
          <p className="text-sm text-gray-400 mt-2">Standard supportive care guidelines should still be followed</p>
        </div>
      )}
    </div>
  );
};

export default SupportiveCareTab;
