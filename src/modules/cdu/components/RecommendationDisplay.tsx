/**
 * Recommendation Display Component
 * Shows clinical decision recommendations and treatment protocols
 */

import React, { useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Download, 
  Eye, 
  Brain,
  Target,
  Shield,
  Calendar,
  AlertCircle,
  TrendingUp,
  Heart,
  Users
} from 'lucide-react';
import {
  ClinicalDecisionOutput,
  TreatmentRecommendation,
  RiskLevel,
  EvidenceLevel
} from '../engine/models';

interface RecommendationDisplayProps {
  recommendation: ClinicalDecisionOutput | null;
  isGenerating: boolean;
  onGenerateRecommendation: () => void;
  onExportReport?: () => void;
}

const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  recommendation,
  isGenerating,
  onGenerateRecommendation,
  onExportReport
}) => {
  const [activeTab, setActiveTab] = useState<'primary' | 'alternatives' | 'monitoring' | 'support'>('primary');
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getRiskLevelColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.LOW:
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case RiskLevel.INTERMEDIATE:
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
      case RiskLevel.HIGH:
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';
      case RiskLevel.VERY_HIGH:
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getEvidenceLevelColor = (evidence: EvidenceLevel) => {
    switch (evidence) {
      case EvidenceLevel.LEVEL_1A:
      case EvidenceLevel.LEVEL_1B:
        return 'text-green-600 dark:text-green-400';
      case EvidenceLevel.LEVEL_2A:
      case EvidenceLevel.LEVEL_2B:
        return 'text-blue-600 dark:text-blue-400';
      case EvidenceLevel.LEVEL_3:
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderProtocolCard = (protocolRec: TreatmentRecommendation, isPrimary: boolean = false) => (
    <div className={`p-6 rounded-lg border-2 transition-all duration-300 ${
      isPrimary 
        ? 'border-indigo-200 dark:border-indigo-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20' 
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={`text-xl font-bold ${isPrimary ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-200'} mb-2`}>
            {protocolRec.protocol.name}
            {isPrimary && (
              <span className="ml-2 px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-full">
                RECOMMENDED
              </span>
            )}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className={`px-2 py-1 rounded-full ${getEvidenceLevelColor(protocolRec.evidenceStrength)}`}>
              Evidence: {protocolRec.evidenceStrength}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Priority: {protocolRec.priority}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {protocolRec.riskBenefitRatio}
          </div>
          <div className="text-xs text-gray-500">Risk/Benefit</div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Protocol Details */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Treatment Regimen</h4>
          <div className="grid gap-2">
            {protocolRec.protocol.regimen.map((drug, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{drug.drugName}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{drug.dosage}</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {drug.route} • {drug.frequency}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rationale */}
        <div>
          <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Clinical Rationale</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {protocolRec.rationale}
          </p>
        </div>

        {/* Expected Benefit */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Expected Benefit</h5>
            <p className="text-sm text-blue-600 dark:text-blue-400">{protocolRec.expectedBenefit}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h5 className="font-medium text-purple-800 dark:text-purple-200 mb-1">Evidence Source</h5>
            <p className="text-sm text-purple-600 dark:text-purple-400">{protocolRec.protocol.guidelineSource}</p>
          </div>
        </div>

        {/* Protocol Modifications */}
        {protocolRec.modifications && protocolRec.modifications.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Recommended Modifications</h4>
            <div className="space-y-2">
              {protocolRec.modifications.map((mod, index) => (
                <div key={index} className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border-l-4 border-amber-400">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-1" />
                    <div>
                      <div className="font-medium text-amber-800 dark:text-amber-200">{mod.description}</div>
                      <div className="text-sm text-amber-600 dark:text-amber-400">{mod.reason}</div>
                      <div className="text-xs text-amber-500 dark:text-amber-500 mt-1">{mod.impact}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!recommendation && !isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <Brain className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Generate Treatment Recommendations
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Click the button below to generate personalized treatment recommendations based on the patient data you've entered.
          </p>
        </div>
        
        <button
          onClick={onGenerateRecommendation}
          disabled={isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5" />
            <span>Generate Recommendations</span>
          </div>
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin">
              <div className="w-8 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Analyzing Patient Data...
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Our clinical decision engine is processing your patient data to generate personalized treatment recommendations.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Clinical Recommendations</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Confidence Score: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{recommendation?.confidenceScore}%</span>
          </p>
        </div>
        
        <div className="flex gap-3">
          {onExportReport && (
            <button
              onClick={onExportReport}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </button>
          )}
          
          <button
            onClick={onGenerateRecommendation}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-100 dark:bg-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-700 text-indigo-700 dark:text-indigo-300 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Regenerate
          </button>
        </div>
      </div>      {/* Risk Assessment Summary */}
      {recommendation && (
        <div className={`p-6 rounded-lg ${getRiskLevelColor(recommendation.riskAssessment.overallRisk)}`}>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6" />
            <h3 className="text-xl font-bold">Risk Assessment</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold mb-2">{recommendation.riskAssessment.overallRisk.toUpperCase()}</div>
              <div className="text-sm opacity-80 mb-4">Overall Risk Level</div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Key Risk Factors:</h4>
                <ul className="space-y-1">
                  {recommendation.riskAssessment.riskFactors.slice(0, 3).map((factor, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                      {factor.factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Mitigation Strategies:</h4>
              <ul className="space-y-1">
                {recommendation.riskAssessment.mitigationStrategies.slice(0, 4).map((strategy, index) => (
                  <li key={index} className="text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    {strategy}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'primary', label: 'Primary Recommendation', icon: Target },
            { id: 'alternatives', label: 'Alternatives', icon: Eye },
            { id: 'monitoring', label: 'Monitoring', icon: Calendar },
            { id: 'support', label: 'Supportive Care', icon: Heart }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'primary' && (
          <div className="space-y-6">
            {renderProtocolCard(recommendation.primaryRecommendation, true)}
            
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Clinical Rationale</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {recommendation.rationaleExplanation}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'alternatives' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Alternative Treatment Options</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Additional protocols ranked by evidence and suitability
              </p>
            </div>
            
            {recommendation.alternativeRecommendations.length > 0 ? (
              recommendation.alternativeRecommendations.map((altRec, index) => (
                <div key={index}>
                  {renderProtocolCard(altRec)}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No alternative recommendations available
              </div>
            )}
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pre-treatment Monitoring */}
              <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4">Pre-treatment</h3>
                <div className="space-y-3">
                  {recommendation.monitoringPlan.pretreatment.map((item, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{item.test}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.frequency}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {item.parameters.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* During Treatment Monitoring */}
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">During Treatment</h3>
                <div className="space-y-3">
                  {recommendation.monitoringPlan.duringTreatment.map((item, index) => (
                    <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded border">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{item.test}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{item.frequency}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {item.parameters.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Guidelines */}
            {recommendation.emergencyGuidelines.length > 0 && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-400">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Emergency Guidelines
                </h3>
                <div className="space-y-4">
                  {recommendation.emergencyGuidelines.map((guideline, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded">
                      <div className="font-medium text-gray-800 dark:text-gray-200 mb-2">{guideline.scenario}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <strong>Signs:</strong> {guideline.signs.join(', ')}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Actions:</strong> {guideline.immediateActions.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Supportive Care Plan</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive support to optimize treatment outcomes and quality of life
              </p>
            </div>
            
            <div className="grid gap-4">
              {recommendation.supportiveCare.map((care, index) => (
                <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-purple-800 dark:text-purple-200">{care.intervention}</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400 capitalize">{care.category.replace('_', ' ')}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Provider: {care.provider}</div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      care.priority === 'high' ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300' :
                      care.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' :
                      'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300'
                    }`}>
                      {care.priority} priority
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Follow-up Plan */}
            {recommendation.followUpPlan.schedule.length > 0 && (
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Follow-up Schedule
                </h3>
                <div className="space-y-3">
                  {recommendation.followUpPlan.schedule.map((visit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded border">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{visit.timepoint}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{visit.assessments.join(', ')}</div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {visit.provider} • {visit.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationDisplay;
