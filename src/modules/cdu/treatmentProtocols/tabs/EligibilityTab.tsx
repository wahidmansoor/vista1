/**
 * Eligibility Tab Component
 * Displays eligibility criteria for treatment protocols
 */

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface EligibilityTabProps {
  protocol?: any;
}

export const EligibilityTab: React.FC<EligibilityTabProps> = ({ protocol }) => {
  if (!protocol) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No protocol selected</p>
      </div>
    );
  }

  const eligibility = protocol.eligibility_criteria || {};
  const inclusion = eligibility.inclusion_criteria || [];
  const exclusion = eligibility.exclusion_criteria || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <CheckCircle className="h-6 w-6 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Eligibility Criteria</h3>
      </div>

      {/* Inclusion Criteria */}
      <div className="bg-green-50 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-3 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Inclusion Criteria
        </h4>
        {inclusion.length > 0 ? (
          <ul className="space-y-2">
            {inclusion.map((criterion: string, index: number) => (
              <li key={index} className="text-green-800 flex items-start space-x-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-700">No specific inclusion criteria defined</p>
        )}
      </div>

      {/* Exclusion Criteria */}
      <div className="bg-red-50 rounded-lg p-4">
        <h4 className="font-medium text-red-900 mb-3 flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          Exclusion Criteria
        </h4>
        {exclusion.length > 0 ? (
          <ul className="space-y-2">
            {exclusion.map((criterion: string, index: number) => (
              <li key={index} className="text-red-800 flex items-start space-x-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>{criterion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-700">No specific exclusion criteria defined</p>
        )}
      </div>

      {/* Performance Status */}
      {eligibility.performance_status && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">Performance Status Requirements</h4>
          <div className="text-blue-800 space-y-2">
            {eligibility.performance_status.ecog_range && (
              <p>ECOG Performance Status: {eligibility.performance_status.ecog_range[0]} - {eligibility.performance_status.ecog_range[1]}</p>
            )}
            {eligibility.performance_status.karnofsky_range && (
              <p>Karnofsky Performance Status: {eligibility.performance_status.karnofsky_range[0]} - {eligibility.performance_status.karnofsky_range[1]}%</p>
            )}
          </div>
        </div>
      )}

      {/* Age Requirements */}
      {eligibility.age_range && (
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">Age Requirements</h4>
          <p className="text-purple-800">
            Age: {eligibility.age_range[0]} - {eligibility.age_range[1]} years
          </p>
        </div>
      )}

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-900 mb-2">Important Note</h4>
            <p className="text-sm text-yellow-800">
              These criteria should be carefully evaluated for each patient. Clinical judgment should always 
              be used in conjunction with these guidelines. Consider patient-specific factors and 
              contraindications when determining eligibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityTab;
