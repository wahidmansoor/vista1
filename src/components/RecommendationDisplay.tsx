/**
 * Recommendation Display Component
 * Shows treatment recommendations with detailed information
 */

import React from 'react';
import {
  ClinicalDecisionOutput,
  TreatmentRecommendation,
  RiskAssessment,
  MonitoringPlan,
  SupportiveCareRecommendation,
  FollowUpPlan,
  EmergencyGuideline
} from '../modules/cdu/engine/models';

interface RecommendationDisplayProps {
  recommendation: ClinicalDecisionOutput | null;
  onGenerateRecommendation: () => void;
  isProcessing: boolean;
  error?: string;
}

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  recommendation,
  onGenerateRecommendation,
  isProcessing,
  error
}) => {
  const formatPercent = (value: number) => `${Math.round(value * 100)}%`;

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'very_high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getEvidenceLevelColor = (level: string) => {
    switch (level) {
      case '1A':
      case '1B': return 'text-green-600 bg-green-50 border-green-200';
      case '2A':
      case '2B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case '3': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case '4':
      case '5': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (!recommendation && !error) {
    return (
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate Recommendation</h3>
            <p className="text-gray-600 mb-6">
              Complete the patient information in the forms above, then click the button below to generate a personalized treatment recommendation.
            </p>
            <button
              onClick={onGenerateRecommendation}
              disabled={isProcessing}
              className={`px-6 py-3 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isProcessing
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Recommendation...
                </div>
              ) : (
                'Generate Treatment Recommendation'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Generating Recommendation</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={onGenerateRecommendation}
            disabled={isProcessing}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Treatment Recommendation</h3>
            <p className="text-sm text-gray-600 mt-1">
              AI-generated personalized treatment recommendation based on clinical data
            </p>
          </div>
          <button
            onClick={onGenerateRecommendation}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Regenerate
          </button>
        </div>
      </div>

      {/* Primary Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">Primary Recommendation</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <div>
              <span className="text-sm font-medium text-gray-700">Protocol:</span>
              <p className="text-gray-900">{recommendation?.primaryRecommendation.protocol.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Evidence Level:</span>
              <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ml-2 ${getEvidenceLevelColor(recommendation?.primaryRecommendation.evidenceStrength || '')}`}>
                {recommendation?.primaryRecommendation.evidenceStrength}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Expected Response Rate:</span>
<p className="text-gray-900">
  {recommendation?.primaryRecommendation.protocol?.expectedOutcomes?.responseRate
    ? recommendation.primaryRecommendation.protocol.expectedOutcomes.responseRate
    : 'N/A'}
</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Priority Score:</span>
              <p className="text-gray-900">{recommendation?.primaryRecommendation.priority}</p>
            </div>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-700">Rationale:</span>
            <p className="text-gray-900 mt-1">{recommendation?.primaryRecommendation.rationale}</p>
          </div>          {recommendation?.primaryRecommendation.protocol.regimen && recommendation.primaryRecommendation.protocol.regimen.length > 0 && (
            <div>
              <span className="text-sm font-medium text-gray-700">Drug Regimen:</span>
              <div className="mt-2 space-y-2">
                {recommendation.primaryRecommendation.protocol.regimen.map((drug: any, index: number) => (
                  <div key={index} className="bg-white p-3 rounded border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm">
                      <div><strong>{drug.drugName}</strong></div>
                      <div>{drug.dosage}</div>
                      <div>{drug.route}</div>
                      <div>{drug.frequency}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Risk Assessment */}
      {recommendation?.riskAssessment && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h4>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-3">Overall Risk:</span>
              <span className={`px-3 py-1 text-sm font-medium rounded border ${getRiskLevelColor(recommendation.riskAssessment.overallRisk)}`}>
                {recommendation.riskAssessment.overallRisk.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {recommendation.riskAssessment.specificRisks && recommendation.riskAssessment.specificRisks.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Specific Risks:</span>
                <div className="mt-2 space-y-2">
                  {recommendation.riskAssessment.specificRisks.map((risk: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-sm">{risk.riskType}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getRiskLevelColor(risk.severity)}`}>
                        {risk.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendation.riskAssessment.mitigationStrategies && recommendation.riskAssessment.mitigationStrategies.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Mitigation Strategies:</span>
                <ul className="mt-2 space-y-1">
                  {recommendation.riskAssessment.mitigationStrategies.map((strategy: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {strategy}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}      {/* Alternative Recommendations */}
      {recommendation?.alternativeRecommendations && recommendation.alternativeRecommendations.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-yellow-900 mb-4">Alternative Recommendations</h4>
          <div className="space-y-4">
            {recommendation.alternativeRecommendations.map((alt: TreatmentRecommendation, index: number) => (
              <div key={index} className="bg-white p-4 rounded border">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Protocol:</span>
                    <p className="text-gray-900">{alt.protocol.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Evidence Level:</span>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ml-2 ${getEvidenceLevelColor(alt.evidenceStrength)}`}>
                      {alt.evidenceStrength}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Priority:</span>
                    <p className="text-gray-900">{alt.priority}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700">Rationale:</span>
                  <p className="text-gray-600 text-sm mt-1">{alt.rationale}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Monitoring Plan */}
      {recommendation?.monitoringPlan && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-4">Monitoring Plan</h4>
          <div className="space-y-4">
            {recommendation.monitoringPlan.duringTreatment && recommendation.monitoringPlan.duringTreatment.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">During Treatment Monitoring:</span>
                <div className="mt-2 space-y-2">
                  {recommendation.monitoringPlan.duringTreatment.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                      <span className="text-sm">{item.test}</span>
                      <span className="text-sm text-gray-600">{item.frequency}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendation.monitoringPlan.pretreatment && recommendation.monitoringPlan.pretreatment.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Pre-treatment Assessment:</span>
                <ul className="mt-2 space-y-1">
                  {recommendation.monitoringPlan.pretreatment.map((item: any, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      {item.test}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Supportive Care */}
      {recommendation?.supportiveCare && recommendation.supportiveCare.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-purple-900 mb-4">Supportive Care Recommendations</h4>
          <div className="space-y-3">
            {recommendation.supportiveCare.map((care: SupportiveCareRecommendation, index: number) => (
              <div key={index} className="bg-white p-4 rounded border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900">{care.category}</h5>
                    <p className="text-sm text-gray-600 mt-1">{care.intervention}</p>
                  </div>
                  {care.priority && (
                    <span className={`px-2 py-1 text-xs font-medium rounded border ml-3 ${
                      care.priority === 'high' ? 'text-red-600 bg-red-50 border-red-200' :
                      care.priority === 'medium' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                      'text-green-600 bg-green-50 border-green-200'
                    }`}>
                      {care.priority}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}      {/* Follow-up Plan */}
      {recommendation?.followUpPlan && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-indigo-900 mb-4">Follow-up Plan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendation.followUpPlan.schedule && recommendation.followUpPlan.schedule.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Visit Schedule:</span>
                <div className="mt-2 space-y-2">
                  {recommendation.followUpPlan.schedule.map((visit: any, index: number) => (
                    <div key={index} className="p-2 bg-white rounded border">
                      <p className="text-sm font-medium">{visit.timepoint}</p>
                      <p className="text-sm text-gray-600">{visit.assessments?.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {recommendation.followUpPlan.imagingPlan && recommendation.followUpPlan.imagingPlan.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700">Imaging Schedule:</span>
                <div className="mt-2 space-y-2">
                  {recommendation.followUpPlan.imagingPlan.map((imaging: any, index: number) => (
                    <div key={index} className="p-2 bg-white rounded border">
                      <p className="text-sm font-medium">{imaging.type}</p>
                      <p className="text-sm text-gray-600">Every {imaging.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {recommendation.followUpPlan.emergencyInstructions && recommendation.followUpPlan.emergencyInstructions.length > 0 && (
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">Emergency Instructions:</span>
              <ul className="mt-2 space-y-1">
                {recommendation.followUpPlan.emergencyInstructions.map((instruction: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}      {/* Emergency Guidelines */}
      {recommendation?.emergencyGuidelines && recommendation.emergencyGuidelines.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-red-900 mb-4">Emergency Guidelines</h4>
          <div className="space-y-3">
            {recommendation.emergencyGuidelines.map((guideline: EmergencyGuideline, index: number) => (
              <div key={index} className="bg-white p-4 rounded border border-red-200">
                <h5 className="text-sm font-medium text-red-900">{guideline.scenario}</h5>
                <div className="mt-2">
                  <p className="text-sm text-red-700">Signs: {guideline.signs?.join(', ')}</p>
                  <p className="text-sm text-red-700 mt-1">Actions: {guideline.immediateActions?.join(', ')}</p>
                </div>
                {guideline.contactInformation && guideline.contactInformation.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">
                      <strong>Emergency Contacts:</strong>
                    </p>
                    {guideline.contactInformation.map((contact: any, contactIndex: number) => (
                      <p key={contactIndex} className="text-sm text-red-600">
                        {contact.role}: {contact.phone}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-center space-x-4">
          <button
            onClick={onGenerateRecommendation}
            disabled={isProcessing}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Regenerate Recommendation
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};
