/**
 * Enhanced Disease Progress Tracker
 * Main component that orchestrates all form components and recommendation display
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  DiseaseStatus,
  PerformanceStatus,
  ProgressionData,
  TreatmentLineData,
  ClinicalDecisionInput,
  ClinicalDecisionOutput,
  CancerType,
  OrganSystem,
  RiskLevel,
  PerformanceScale,
  ImagingType,
  TreatmentResponse,
  TreatmentLine
} from '../modules/cdu/engine/models';
import { ClinicalDecisionEngine } from '../modules/cdu/engine/ClinicalDecisionEngine';
import { DiseaseStatusForm } from './forms/DiseaseStatusForm';
import { PerformanceStatusForm } from './forms/PerformanceStatusForm';
import { ProgressionAssessmentForm } from './forms/ProgressionAssessmentForm';
import { TreatmentHistoryForm } from './forms/TreatmentHistoryForm';
import { RecommendationDisplay } from './RecommendationDisplay';

type TabKey = 'disease' | 'performance' | 'progression' | 'treatment' | 'recommendation';

interface ValidationErrors {
  [key: string]: string;
}

export const EnhancedDiseaseProgressTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('disease');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recommendation, setRecommendation] = useState<ClinicalDecisionOutput | null>(null);
  const [error, setError] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Form Data State
  const [diseaseStatus, setDiseaseStatus] = useState<DiseaseStatus>({
    primaryDiagnosis: '',
    stageAtDiagnosis: '',
    dateOfDiagnosis: '',
    histologyMutation: '',
    diseaseNotes: '',
    organSystem: undefined,
    cellType: '',
    gradeDifferentiation: '',
    riskStratification: undefined,
    biomarkers: [],
    geneticMutations: []
  });

  const [performanceStatus, setPerformanceStatus] = useState<PerformanceStatus>({
    assessmentDate: new Date().toISOString().split('T')[0],
    performanceScale: PerformanceScale.ECOG,
    performanceScore: '',
    performanceNotes: '',
    functionalStatus: {
      independentLiving: true,
      workCapacity: 100,
      socialFunction: 5,
      physicalLimitations: []
    },
    qualityOfLife: {
      overallScore: 7,
      painLevel: 1,
      fatigueLevel: 1,
      emotionalWellbeing: 7,
      concerns: []
    }
  });

  const [progressionData, setProgressionData] = useState<ProgressionData>({
    reassessmentDate: new Date().toISOString().split('T')[0],
    imagingType: ImagingType.CT,
    findingsSummary: '',
    markerType: '',
    markerValue: '',
    progressionNotes: '',
    responseAssessment: {
      method: 'RECIST',
      targetLesions: [],
      nonTargetLesions: [],
      newLesions: false,
      overallResponse: TreatmentResponse.NOT_EVALUABLE,
      assessorName: ''
    },
    adverseEvents: []
  });

  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentLineData[]>([]);

  // Initialize clinical decision engine
  const clinicalEngine = useMemo(() => new ClinicalDecisionEngine(), []);

  // Validation function
  const validateForm = useCallback((): boolean => {
    const errors: ValidationErrors = {};

    // Disease Status validation
    if (!diseaseStatus.primaryDiagnosis.trim()) {
      errors['disease_primaryDiagnosis'] = 'Primary diagnosis is required';
    }
    if (!diseaseStatus.stageAtDiagnosis.trim()) {
      errors['disease_stageAtDiagnosis'] = 'Stage at diagnosis is required';
    }
    if (!diseaseStatus.dateOfDiagnosis) {
      errors['disease_dateOfDiagnosis'] = 'Date of diagnosis is required';
    }

    // Performance Status validation
    if (!performanceStatus.assessmentDate) {
      errors['performance_assessmentDate'] = 'Assessment date is required';
    }
    if (!performanceStatus.performanceScore.trim()) {
      errors['performance_performanceScore'] = 'Performance score is required';
    }

    // Progression Data validation
    if (!progressionData.reassessmentDate) {
      errors['progression_reassessmentDate'] = 'Reassessment date is required';
    }
    if (!progressionData.imagingType) {
      errors['progression_imagingType'] = 'Imaging type is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [diseaseStatus, performanceStatus, progressionData]);

  // Get form completion status
  const getFormCompletionStatus = useCallback(() => {
    const diseaseComplete = !!(
      diseaseStatus.primaryDiagnosis &&
      diseaseStatus.stageAtDiagnosis &&
      diseaseStatus.dateOfDiagnosis
    );

    const performanceComplete = !!(
      performanceStatus.assessmentDate &&
      performanceStatus.performanceScore
    );

    const progressionComplete = !!(
      progressionData.reassessmentDate &&
      progressionData.imagingType
    );

    const treatmentComplete = treatmentHistory.length > 0;

    return {
      disease: diseaseComplete,
      performance: performanceComplete,
      progression: progressionComplete,
      treatment: treatmentComplete,
      overall: diseaseComplete && performanceComplete && progressionComplete
    };
  }, [diseaseStatus, performanceStatus, progressionData, treatmentHistory]);

  const completionStatus = getFormCompletionStatus();

  // Generate treatment recommendation
  const generateRecommendation = useCallback(async () => {
    if (!validateForm()) {
      setError('Please complete all required fields before generating a recommendation.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const clinicalInput: ClinicalDecisionInput = {
        diseaseStatus,
        performanceStatus,
        progression: progressionData,
        treatmentHistory,
        patientPreferences: {
          qualityVsQuantity: 'balanced',
          treatmentIntensity: 'moderate',
          participationInTrials: false,
          supportiveCarePriorities: []
        },
        comorbidities: []
      };

      const result = await clinicalEngine.generateTreatmentRecommendation(clinicalInput);
      setRecommendation(result);
      setActiveTab('recommendation');
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while generating the recommendation.');
    } finally {
      setIsProcessing(false);
    }
  }, [diseaseStatus, performanceStatus, progressionData, treatmentHistory, clinicalEngine, validateForm]);

  // Tab navigation with validation
  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  // Tab configuration
  const tabs = [
    {
      key: 'disease' as TabKey,
      label: 'Disease Status',
      icon: '🏥',
      completed: completionStatus.disease
    },
    {
      key: 'performance' as TabKey,
      label: 'Performance Status',
      icon: '📊',
      completed: completionStatus.performance
    },
    {
      key: 'progression' as TabKey,
      label: 'Disease Progression',
      icon: '📈',
      completed: completionStatus.progression
    },
    {
      key: 'treatment' as TabKey,
      label: 'Treatment History',
      icon: '💊',
      completed: completionStatus.treatment
    },
    {
      key: 'recommendation' as TabKey,
      label: 'Recommendation',
      icon: '🎯',
      completed: !!recommendation
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Enhanced Disease Progress Tracker
                </h1>
                <p className="text-gray-600 mt-2">
                  Comprehensive oncology assessment and treatment recommendation system
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Form Completion: {Math.round((Object.values(completionStatus).filter(Boolean).length / 4) * 100)}%
                </div>
                <button
                  onClick={generateRecommendation}
                  disabled={isProcessing || !completionStatus.overall}
                  className={`px-6 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isProcessing || !completionStatus.overall
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Generate Recommendation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm focus:outline-none ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.completed && (
                  <span className="inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-green-500 rounded-full">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'disease' && (
          <DiseaseStatusForm
            diseaseStatus={diseaseStatus}
            onUpdate={setDiseaseStatus}
            errors={validationErrors}
          />
        )}

        {activeTab === 'performance' && (
          <PerformanceStatusForm
            performanceStatus={performanceStatus}
            onUpdate={setPerformanceStatus}
            errors={validationErrors}
          />
        )}

        {activeTab === 'progression' && (
          <ProgressionAssessmentForm
            progressionData={progressionData}
            onUpdate={setProgressionData}
            errors={validationErrors}
          />
        )}

        {activeTab === 'treatment' && (
          <TreatmentHistoryForm
            treatmentHistory={treatmentHistory}
            onUpdate={setTreatmentHistory}
            errors={validationErrors}
          />
        )}

        {activeTab === 'recommendation' && (
          <RecommendationDisplay
            recommendation={recommendation}
            onGenerateRecommendation={generateRecommendation}
            isProcessing={isProcessing}
            error={error}
          />
        )}
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1].key);
                }
              }}
              disabled={activeTab === tabs[0].key}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTab === tabs[0].key
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {tabs.map((tab, index) => (
                <div
                  key={tab.key}
                  className={`w-3 h-3 rounded-full ${
                    activeTab === tab.key
                      ? 'bg-blue-600'
                      : tab.completed
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.key === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].key);
                }
              }}
              disabled={activeTab === tabs[tabs.length - 1].key}
              className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                activeTab === tabs[tabs.length - 1].key
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
