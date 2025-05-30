import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, AlertCircle, FileText } from 'lucide-react';
import type { Protocol } from '@/types/protocol';

interface EligibilityTabProps {
  protocol: Protocol;
}

const EligibilityTab: React.FC<EligibilityTabProps> = ({ protocol }) => {
  const eligibility = protocol.eligibility || {};
  const hasInclusionCriteria = Array.isArray(eligibility.inclusion_criteria) && eligibility.inclusion_criteria.length > 0;
  const hasExclusionCriteria = Array.isArray(eligibility.exclusion_criteria) && eligibility.exclusion_criteria.length > 0;
  const hasData = hasInclusionCriteria || hasExclusionCriteria;
  
  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Eligibility Criteria</h2>
      
      {!hasData ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2 text-amber-500">
              <AlertCircle className="h-5 w-5" />
              <p>No eligibility criteria available for this protocol.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Inclusion Criteria */}
          {hasInclusionCriteria && (
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <Check className="h-5 w-5 text-green-500" />
                <h3 className="text-xl font-semibold">Inclusion Criteria</h3>
              </div>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {eligibility.inclusion_criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Exclusion Criteria */}
          {hasExclusionCriteria && (
            <div>
              <div className="flex items-center mb-4 space-x-2">
                <X className="h-5 w-5 text-red-500" />
                <h3 className="text-xl font-semibold">Exclusion Criteria</h3>
              </div>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3">
                    {eligibility.exclusion_criteria.map((criterion, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Protocol References if available */}
          {protocol.references && protocol.references.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center mb-4 space-x-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <h3 className="text-xl font-semibold">References</h3>
              </div>
              <Card>
                <CardContent className="p-6">
                  <ul className="space-y-3 list-decimal pl-5">
                    {protocol.references.map((reference, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">
                        {reference}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export { EligibilityTab };
