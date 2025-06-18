import React, { useState, useCallback } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

// Import our modular components
import DiseaseStatusForm from './forms/DiseaseStatusForm';
import PerformanceStatusForm from './forms/PerformanceStatusForm';
import ProgressionAssessmentForm from './forms/ProgressionAssessmentForm';
import TreatmentHistoryForm from './forms/TreatmentHistoryForm';
import RecommendationDisplay from './RecommendationDisplay';

// Import types and engine
import { 
  DiseaseStatus, 
  PerformanceStatus, 
  ProgressionData, 
  TreatmentHistory,
  TreatmentRecommendation 
} from '../engine/models';
import { ClinicalDecisionEngine } from '../engine/ClinicalDecisionEngine';
import { generateMockRecommendation } from '../utils/validators';

// Constants
const TABS = [
  { id: 'disease', label: 'Disease Status', icon: '🎯' },
  { id: 'performance', label: 'Performance Status', icon: '📊' },
  { id: 'progression', label: 'Progression Assessment', icon: '📈' },
  { id: 'treatment', label: 'Treatment History', icon: '💊' },
  { id: 'recommendations', label: 'Recommendations', icon: '🔬' }
];

const EnhancedDiseaseProgressTracker: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<TreatmentRecommendation | null>(null);

  // Form data state
  const [diseaseStatus, setDiseaseStatus] = useState<DiseaseStatus>({
    primaryDiagnosis: '',
    stageAtDiagnosis: '',
    histologyMutation: '',
    dateOfDiagnosis: '',
    diseaseNotes: '',
    organSystem: 'other',
    cellType: '',
    gradeDifferentiation: '',
    riskStratification: 'standard'
  });

  const [performanceStatus, setPerformanceStatus] = useState<PerformanceStatus>({
    ecogScore: 0,
    karnofskyScore: 100,
    functionalAssessment: '',
    cognitiveFunctioning: 'normal',
    socialSupport: 'adequate',
    assessmentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [progressionData, setProgressionData] = useState<ProgressionData>({
    lastAssessmentDate: new Date().toISOString().split('T')[0],
    overallResponse: 'stable_disease',
    responseAssessment: {
      target_lesions: {
        response: 'stable_disease',
        measurements: []
      }
    },
    qualityOfLifeScore: 7,
    symptomBurden: 'mild',
    biomarkerTrends: [],
    imagingFindings: '',
    clinicalNotes: ''
  });

  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentHistory>({
    currentLine: 1,
    previousTreatments: [],
    currentTreatment: null,
    allergies: [],
    intolerances: [],
    comorbidities: [],
    priorSurgeries: [],
    radiationHistory: [],
    lastTreatmentDate: '',
    treatmentResponse: 'stable_disease',
    durationOfTreatment: '',
    reasonForDiscontinuation: '',
    currentMedications: [],
    concomitantMedications: []
  });

  // Initialize decision engine
  const decisionEngine = new ClinicalDecisionEngine();

  // Generate recommendation handler
  const handleGenerateRecommendation = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = decisionEngine.generateTreatmentRecommendation(
        diseaseStatus,
        performanceStatus,
        progressionData,
        treatmentHistory
      );

      if (!result) {
        throw new Error('Failed to generate recommendation');
      }

      setRecommendation(result);
      setActiveTab(4); // Switch to recommendations tab
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      
      // Fallback to mock recommendation for demo purposes
      const mockRecommendation = generateMockRecommendation(diseaseStatus);
      setRecommendation(mockRecommendation);
      setActiveTab(4);
    } finally {
      setIsProcessing(false);
    }
  }, [diseaseStatus, performanceStatus, progressionData, treatmentHistory, decisionEngine]);

  // Validation state
  const isFormValid = diseaseStatus.primaryDiagnosis.trim() !== '' && 
                     diseaseStatus.stageAtDiagnosis.trim() !== '';

  return (
    <div className="enhanced-disease-progress-tracker bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Enhanced Disease Progress Tracker
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive oncology assessment and treatment recommendation system
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Error
              </h3>
              <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <Tabs 
        selectedIndex={activeTab} 
        onSelect={setActiveTab}
        className="tabs-container"
      >
        <TabList className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          {TABS.map((tab, index) => (
            <Tab
              key={tab.id}
              className={`
                flex-1 px-4 py-3 text-sm font-medium text-center cursor-pointer
                transition-colors duration-200
                ${activeTab === index 
                  ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-900' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Tab>
          ))}
        </TabList>

        {/* Tab Panels */}
        <div className="p-6">
          <TabPanel>
            <DiseaseStatusForm 
              data={diseaseStatus}
              onChange={setDiseaseStatus}
            />
          </TabPanel>

          <TabPanel>
            <PerformanceStatusForm 
              data={performanceStatus}
              onChange={setPerformanceStatus}
            />
          </TabPanel>

          <TabPanel>
            <ProgressionAssessmentForm 
              data={progressionData}
              onChange={setProgressionData}
            />
          </TabPanel>

          <TabPanel>
            <TreatmentHistoryForm 
              data={treatmentHistory}
              onChange={setTreatmentHistory}
            />
          </TabPanel>

          <TabPanel>
            <RecommendationDisplay 
              recommendation={recommendation}
              isProcessing={isProcessing}
            />
          </TabPanel>
        </div>
      </Tabs>

      {/* Action Bar */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Form Status: 
              <span className={`ml-2 font-medium ${
                isFormValid 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {isFormValid ? 'Ready' : 'Incomplete'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateRecommendation}
              disabled={isProcessing || !isFormValid}
              className={`
                px-6 py-2 rounded-md font-medium text-sm transition-all duration-200
                ${isProcessing || !isFormValid
                  ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-sm hover:shadow-md'
                }
              `}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                '🔬 Generate Recommendation'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDiseaseProgressTracker;
