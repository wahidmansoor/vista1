import React, { useReducer, useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { Stethoscope, User, Activity, AlertTriangle, CheckCircle, FileText, Database } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { generateClinicalRecommendations, ClinicalParameters } from '@/services/clinicalDecisionSupport';

// Clinical Protocol Database
const CLINICAL_PROTOCOLS = {
  'NSCLC_Stage_IV': {
    egfr_positive: [
      {
        name: 'Osimertinib',
        dosage: '80mg daily',
        indication: 'First-line EGFR-mutated NSCLC',
        evidenceLevel: 'NCCN Category 1',
        trialData: 'FLAURA: mPFS 18.9 vs 10.2 months',
        responseRate: '80%',
        medianPFS: '18.9 months',
        monitoring: ['QTc interval', 'LFTs', 'CBC'],
        contraindications: ['QTc >470ms', 'Severe hepatic impairment']
      }
    ],
    alk_positive: [
      {
        name: 'Alectinib',
        dosage: '600mg BID',
        indication: 'First-line ALK+ NSCLC',
        evidenceLevel: 'NCCN Category 1',
        trialData: 'ALEX: mPFS 34.8 vs 10.9 months',
        responseRate: '83%',
        medianPFS: '34.8 months',
        monitoring: ['LFTs', 'CPK', 'Bradycardia'],
        contraindications: ['Severe hepatic impairment']
      }
    ],
    pdl1_high: [
      {
        name: 'Pembrolizumab',
        dosage: '200mg Q3W',
        indication: 'First-line PD-L1 ≥50% NSCLC',
        evidenceLevel: 'NCCN Category 1',
        trialData: 'KEYNOTE-024: mPFS 10.3 vs 6.0 months',
        responseRate: '45%',
        medianPFS: '10.3 months',
        monitoring: ['Immune-related AEs', 'TSH', 'LFTs'],
        contraindications: ['Active autoimmune disease', 'Organ transplant']
      }
    ],
    chemotherapy: [
      {
        name: 'Carboplatin + Pemetrexed',
        dosage: 'Carbo AUC 5 + Pemetrexed 500mg/m²',
        indication: 'Non-squamous NSCLC',
        evidenceLevel: 'NCCN Category 1',
        trialData: 'Standard of care',
        responseRate: '30%',
        medianPFS: '4.5 months',
        monitoring: ['CBC', 'Creatinine', 'B12/Folate'],
        contraindications: ['CrCl <45 mL/min', 'Severe cytopenias']
      }
    ]
  },
  'Breast_Cancer_Stage_IV': {
    her2_positive: [
      {
        name: 'T-DM1 (Kadcyla)',
        dosage: '3.6 mg/kg Q3W',
        indication: 'Second-line HER2+ metastatic breast cancer',
        evidenceLevel: 'NCCN Category 1',
        trialData: 'EMILIA: mPFS 9.6 vs 6.4 months',
        responseRate: '44%',
        medianPFS: '9.6 months',
        monitoring: ['LVEF', 'LFTs', 'Platelet count'],
        contraindications: ['LVEF <50%', 'Severe hepatic impairment']
      }
    ],
    hormone_positive: [
      {
        name: 'CDK4/6 Inhibitor + AI',
        dosage: 'Palbociclib 125mg daily + Letrozole 2.5mg',
        indication: 'First-line HR+/HER2- metastatic breast cancer',
        evidenceLevel: 'NCCN Category 1',
        trialData: 'PALOMA-2: mPFS 24.8 vs 14.5 months',
        responseRate: '42%',
        medianPFS: '24.8 months',
        monitoring: ['CBC', 'QTc interval'],
        contraindications: ['Severe hepatic impairment', 'QTc >480ms']
      }
    ]
  }
};

// Cancer types with comprehensive options
const CANCER_TYPES = [
  'Non-Small Cell Lung Cancer',
  'Small Cell Lung Cancer',
  'Breast Cancer',
  'Colorectal Cancer',
  'Prostate Cancer',
  'Melanoma',
  'Ovarian Cancer',
  'Pancreatic Cancer',
  'Gastric Cancer',
  'Hepatocellular Carcinoma',
  'Renal Cell Carcinoma',
  'Other'
] as const;

const BIOMARKER_OPTIONS = {
  'Non-Small Cell Lung Cancer': ['EGFR', 'ALK', 'ROS1', 'BRAF', 'KRAS', 'PD-L1', 'MET'],
  'Breast Cancer': ['HER2', 'HR (ER/PR)', 'BRCA1/2', 'PIK3CA'],
  'Colorectal Cancer': ['KRAS', 'BRAF', 'MSI', 'HER2'],
  'Melanoma': ['BRAF', 'NRAS', 'KIT'],
  'Prostate Cancer': ['AR', 'BRCA1/2', 'MSI'],
  'Other': ['PD-L1', 'MSI', 'TMB', 'HRD']
};

// Clinical input state interface
interface ClinicalInputState {
  cancerType: string;
  stage: string;
  histology: string;
  performanceStatus: string;
  age: string;
  comorbidities: string[];
  biomarkers: { [key: string]: string };
  treatmentLine: string;
  priorTreatments: string[];
  treatmentGoal: string;
}

// Initial state
const initialClinicalState: ClinicalInputState = {
  cancerType: '',
  stage: '',
  histology: '',
  performanceStatus: '',
  age: '',
  comorbidities: [],
  biomarkers: {},
  treatmentLine: 'first-line',
  priorTreatments: [],
  treatmentGoal: 'curative'
};

// Reducer for clinical input management
const clinicalInputReducer = (state: ClinicalInputState, action: any): ClinicalInputState => {
  switch (action.type) {
    case 'UPDATE_CANCER_TYPE':
      return { ...state, cancerType: action.payload, biomarkers: {} };
    case 'UPDATE_STAGE':
      return { ...state, stage: action.payload };
    case 'UPDATE_HISTOLOGY':
      return { ...state, histology: action.payload };
    case 'UPDATE_PERFORMANCE_STATUS':
      return { ...state, performanceStatus: action.payload };
    case 'UPDATE_AGE':
      return { ...state, age: action.payload };
    case 'UPDATE_BIOMARKERS':
      return { ...state, biomarkers: { ...state.biomarkers, ...action.payload } };
    case 'UPDATE_TREATMENT_LINE':
      return { ...state, treatmentLine: action.payload };
    case 'UPDATE_TREATMENT_GOAL':
      return { ...state, treatmentGoal: action.payload };
    case 'ADD_COMORBIDITY':
      return { ...state, comorbidities: [...state.comorbidities, action.payload] };
    case 'REMOVE_COMORBIDITY':
      return { ...state, comorbidities: state.comorbidities.filter(c => c !== action.payload) };
    case 'RESET':
      return initialClinicalState;
    default:
      return state;
  }
};

const tabs = [
  { title: 'Clinical Parameters', icon: Stethoscope },
  { title: 'Patient Factors', icon: User },
  { title: 'Treatment Recommendations', icon: Activity }
];

const TreatmentGuidanceTool: React.FC = () => {
  const { toast } = useToast();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [clinicalInput, dispatch] = useReducer(clinicalInputReducer, initialClinicalState);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [clinicalWarnings, setClinicalWarnings] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Clinical validation function
  const validateClinicalInput = (input: ClinicalInputState): string[] => {
    const warnings: string[] = [];
    
    // Performance status vs treatment intensity
    const ecogScore = parseInt(input.performanceStatus, 10);
    if (ecogScore >= 3) {
      warnings.push('⚠️ Consider supportive care focus for ECOG ≥3 patients');
    }
    if (ecogScore === 2) {
      warnings.push('⚠️ Consider dose reduction for ECOG 2 patients');
    }
    
    // Age considerations
    const age = parseInt(input.age, 10);
    if (age >= 75) {
      warnings.push('⚠️ Consider geriatric assessment and dose modifications for elderly patients');
    }
    
    // Biomarker-treatment matching
    if (input.biomarkers.egfr && !input.cancerType.includes('Lung')) {
      warnings.push('⚠️ EGFR mutations primarily relevant for lung cancer');
    }
    
    // Stage IV with curative intent
    if (input.stage === 'IV' && input.treatmentGoal === 'curative') {
      warnings.push('⚠️ Curative intent unusual for Stage IV disease - consider palliative approach');
    }
    
    return warnings;
  };  // Generate evidence-based treatment recommendations
  const generateTreatmentRecommendations = (input: ClinicalInputState) => {
    const recommendations: any[] = [];
    
    console.log('Generating recommendations for:', {
      cancerType: input.cancerType,
      stage: input.stage,
      biomarkers: input.biomarkers
    });
    
    // NSCLC Stage IV recommendations
    if (input.cancerType === 'Non-Small Cell Lung Cancer' && input.stage === 'IV') {
      console.log('NSCLC Stage IV pathway');
      
      if (input.biomarkers['egfr'] === 'Positive') {
        console.log('EGFR positive pathway');
        recommendations.push(...CLINICAL_PROTOCOLS.NSCLC_Stage_IV.egfr_positive);
      } else if (input.biomarkers['alk'] === 'Positive') {
        console.log('ALK positive pathway');
        recommendations.push(...CLINICAL_PROTOCOLS.NSCLC_Stage_IV.alk_positive);
      } else if (input.biomarkers['pd-l1'] === 'High (≥50%)') {
        console.log('PD-L1 high pathway');
        recommendations.push(...CLINICAL_PROTOCOLS.NSCLC_Stage_IV.pdl1_high);
      } else {
        console.log('Chemotherapy pathway (fallback for NSCLC Stage IV)');
        recommendations.push(...CLINICAL_PROTOCOLS.NSCLC_Stage_IV.chemotherapy);
      }
    }
    
    // Breast Cancer Stage IV recommendations
    if (input.cancerType === 'Breast Cancer' && input.stage === 'IV') {
      console.log('Breast Cancer Stage IV pathway');
      
      if (input.biomarkers['her2'] === 'Positive') {
        console.log('HER2 positive pathway');
        recommendations.push(...CLINICAL_PROTOCOLS.Breast_Cancer_Stage_IV.her2_positive);
      } else if (input.biomarkers['hr (er/pr)'] === 'Positive') {
        console.log('HR positive pathway');
        recommendations.push(...CLINICAL_PROTOCOLS.Breast_Cancer_Stage_IV.hormone_positive);
      } else {
        console.log('No specific biomarker match for breast cancer');
      }
    }
    
    // Fallback: if no specific recommendations found, provide general guidelines
    if (recommendations.length === 0 && input.cancerType && input.stage) {
      console.log('No specific recommendations found, using fallback');
      recommendations.push({
        name: 'Multidisciplinary Team Discussion',
        dosage: 'N/A',
        indication: `${input.cancerType} Stage ${input.stage} - Requires individualized approach`,
        evidenceLevel: 'Clinical Judgment',
        trialData: 'Consult oncology guidelines and literature',
        responseRate: 'Variable',
        medianPFS: 'Depends on treatment selected',
        monitoring: ['Regular follow-up', 'Performance status', 'Disease assessment'],
        contraindications: ['Poor performance status', 'Organ dysfunction']
      });
    }
    
    console.log('Final recommendations:', recommendations);
    return recommendations;
  };  const handleGenerateRecommendations = async () => {
    console.log('Generate Recommendations button clicked');
    console.log('Current clinical input:', clinicalInput);
    
    setIsGenerating(true);
    
    try {
      // Validate clinical input
      const warnings = validateClinicalInput(clinicalInput);
      setClinicalWarnings(warnings);
      
      // Prepare clinical parameters for the service
      const clinicalParams: ClinicalParameters = {
        cancerType: clinicalInput.cancerType,
        stage: clinicalInput.stage,
        histology: clinicalInput.histology,
        performanceStatus: clinicalInput.performanceStatus,
        age: clinicalInput.age,
        comorbidities: clinicalInput.comorbidities,
        biomarkers: clinicalInput.biomarkers,
        treatmentLine: clinicalInput.treatmentLine,
        priorTreatments: clinicalInput.priorTreatments,
        treatmentGoal: clinicalInput.treatmentGoal
      };

      // Generate recommendations using Supabase database
      console.log('Fetching recommendations from Supabase...');
      const newRecommendations = await generateClinicalRecommendations(clinicalParams);
      
      setRecommendations(newRecommendations);
      
      if (newRecommendations.length === 0) {
        toast({
          title: "No Specific Recommendations",
          description: "No matching protocols found in database. Please verify clinical parameters.",
          variant: "default"
        });
      } else {
        toast({
          title: "Recommendations Generated",
          description: `Found ${newRecommendations.length} evidence-based treatment option(s) from clinical database`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Error generating recommendations:", error);
      toast({
        title: "Database Error",
        description: "Failed to fetch treatment recommendations from database. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const resetAllInputs = () => {
    dispatch({ type: 'RESET' });
    setRecommendations([]);
    setClinicalWarnings([]);
    toast({
      title: "Reset Complete",
      description: "All clinical parameters have been cleared",
      variant: "default"
    });
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">🎯 Treatment Guidance Tool</h2>
        <button
          type="button"
          onClick={resetAllInputs}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:opacity-90 transition"
        >
          🔄 Reset All
        </button>
      </div>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        {/* Tab List */}
        <Tab.List className="flex space-x-4 border-b pb-3 mb-6">
          {tabs.map((tab, index) => (
            <Tab key={index} className={({ selected }) => `
              flex items-center gap-2 cursor-pointer py-2 px-4 rounded-lg shadow transition-all duration-300
              ${selected 
                ? "bg-gradient-to-r from-indigo-500 to-teal-500 text-white" 
                : "bg-white text-gray-600 hover:text-indigo-500 hover:shadow-md"}
            `}>
              <tab.icon className="w-5 h-5" />
              {tab.title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">

          {/* Clinical Parameters Tab */}
          <Tab.Panel>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Clinical Parameters</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cancer Type */}
                <div>
                  <label htmlFor="cancer-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cancer Type
                  </label>
                  <select 
                    id="cancer-type"
                    value={clinicalInput.cancerType} 
                    onChange={(e) => dispatch({ type: 'UPDATE_CANCER_TYPE', payload: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Cancer Type</option>
                    {CANCER_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Stage */}
                <div>
                  <label htmlFor="stage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Current Stage
                  </label>
                  <select 
                    id="stage"
                    value={clinicalInput.stage} 
                    onChange={(e) => dispatch({ type: 'UPDATE_STAGE', payload: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Stage</option>
                    <option value="I">Stage I</option>
                    <option value="II">Stage II</option>
                    <option value="III">Stage III</option>
                    <option value="IV">Stage IV</option>
                  </select>
                </div>

                {/* Histology */}
                <div>
                  <label htmlFor="histology" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Histology/Subtype
                  </label>
                  <input
                    id="histology"
                    type="text"
                    value={clinicalInput.histology}
                    onChange={(e) => dispatch({ type: 'UPDATE_HISTOLOGY', payload: e.target.value })}
                    placeholder="e.g., Adenocarcinoma, Squamous cell"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Treatment Line */}
                <div>
                  <label htmlFor="treatment-line" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Treatment Line
                  </label>
                  <select 
                    id="treatment-line"
                    value={clinicalInput.treatmentLine} 
                    onChange={(e) => dispatch({ type: 'UPDATE_TREATMENT_LINE', payload: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="first-line">First Line</option>
                    <option value="second-line">Second Line</option>
                    <option value="third-line">Third Line</option>
                    <option value="salvage">Salvage</option>
                  </select>
                </div>
              </div>

              {/* Biomarker Panel */}
              {clinicalInput.cancerType && BIOMARKER_OPTIONS[clinicalInput.cancerType as keyof typeof BIOMARKER_OPTIONS] && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <h4 className="text-md font-semibold text-blue-800 dark:text-blue-200 mb-3">Biomarker Status</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {BIOMARKER_OPTIONS[clinicalInput.cancerType as keyof typeof BIOMARKER_OPTIONS].map((biomarker) => (
                      <div key={biomarker}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {biomarker}
                        </label>
                        <select 
                          value={clinicalInput.biomarkers[biomarker.toLowerCase()] || ''}
                          onChange={(e) => dispatch({ 
                            type: 'UPDATE_BIOMARKERS', 
                            payload: { [biomarker.toLowerCase()]: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Unknown</option>
                          <option value="Positive">Positive</option>
                          <option value="Negative">Negative</option>
                          {biomarker === 'PD-L1' && (
                            <>
                              <option value="Low (<1%)">Low (&lt;1%)</option>
                              <option value="Intermediate (1-49%)">Intermediate (1-49%)</option>
                              <option value="High (≥50%)">High (≥50%)</option>
                            </>
                          )}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Tab.Panel>

          {/* Patient Factors Tab */}
          <Tab.Panel>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Patient Factors</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Status */}
                <div>
                  <label htmlFor="performance-status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    ECOG Performance Status
                  </label>
                  <select 
                    id="performance-status"
                    value={clinicalInput.performanceStatus} 
                    onChange={(e) => dispatch({ type: 'UPDATE_PERFORMANCE_STATUS', payload: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select ECOG Score</option>
                    <option value="0">0 - Fully active</option>
                    <option value="1">1 - Restricted in strenuous activity</option>
                    <option value="2">2 - Ambulatory but unable to work</option>
                    <option value="3">3 - Limited self-care</option>
                    <option value="4">4 - Completely disabled</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={clinicalInput.age}
                    onChange={(e) => dispatch({ type: 'UPDATE_AGE', payload: e.target.value })}
                    placeholder="Patient age"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {/* Treatment Goal */}
                <div className="md:col-span-2">
                  <label htmlFor="treatment-goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Treatment Goal
                  </label>
                  <select 
                    id="treatment-goal"
                    value={clinicalInput.treatmentGoal} 
                    onChange={(e) => dispatch({ type: 'UPDATE_TREATMENT_GOAL', payload: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="curative">Curative Intent</option>
                    <option value="palliative">Palliative Care</option>
                    <option value="life-extending">Life Extending</option>
                    <option value="symptom-control">Symptom Control</option>
                  </select>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Treatment Recommendations Tab */}
          <Tab.Panel>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Treatment Recommendations</h3>                <button 
                  onClick={handleGenerateRecommendations}
                  disabled={isGenerating || !clinicalInput.cancerType}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-3 border-t-transparent border-white rounded-full animate-spin mr-3" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Activity className="w-5 h-5 mr-2" />
                      <span>Generate Recommendations</span>
                    </>
                  )}
                </button>
              </div>

              {/* Clinical Warnings */}
              {clinicalWarnings.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-md font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Clinical Considerations</h4>
                      <ul className="space-y-1">
                        {clinicalWarnings.map((warning, index) => (
                          <li key={index} className="text-yellow-700 dark:text-yellow-300 text-sm">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}              {/* Treatment Recommendations */}
              {recommendations.length > 0 && (
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900 rounded-xl shadow-lg border border-blue-100 dark:border-blue-800">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-blue-800 dark:text-blue-200 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                            {rec.name}
                          </h4>
                          {rec.protocol_code && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Protocol: {rec.protocol_code}
                            </p>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
                          {rec.evidenceLevel}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dosage</p>
                          <p className="text-gray-800 dark:text-gray-200">{rec.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</p>
                          <p className="text-gray-800 dark:text-gray-200">{rec.responseRate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Median PFS</p>
                          <p className="text-gray-800 dark:text-gray-200">{rec.medianPFS}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Trial Data</p>
                          <p className="text-gray-800 dark:text-gray-200 text-sm">{rec.trialData}</p>
                        </div>
                      </div>

                      {/* Drug Details */}
                      {rec.drugs && rec.drugs.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Drug Components</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {rec.drugs.map((drug, idx) => (
                              <div key={idx} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <p className="font-medium text-gray-800 dark:text-gray-200">{drug.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {drug.dose} - {drug.route} - {drug.frequency}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Biomarker Requirements */}
                      {rec.biomarker_requirements && rec.biomarker_requirements.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Required Biomarkers</p>
                          <div className="flex flex-wrap gap-2">
                            {rec.biomarker_requirements.map((biomarker, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 text-xs rounded">
                                {biomarker}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3">
                        {/* Monitoring Requirements */}
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Monitoring Requirements</p>
                          <div className="flex flex-wrap gap-2">
                            {rec.monitoring.map((item: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contraindications */}
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Contraindications</p>
                          <div className="flex flex-wrap gap-2">
                            {rec.contraindications.map((item: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 text-xs rounded">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Supportive Care */}
                        {rec.supportive_care && rec.supportive_care.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Supportive Care</p>
                            <div className="flex flex-wrap gap-2">                              {rec.supportive_care.map((item: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs rounded">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Eligibility Criteria */}
                        {rec.eligibility && rec.eligibility.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Eligibility Criteria</p>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              <ul className="list-disc list-inside space-y-1">                                {rec.eligibility.slice(0, 3).map((criteria: string, idx: number) => (
                                  <li key={idx}>{criteria}</li>
                                ))}
                                {rec.eligibility.length > 3 && (
                                  <li className="text-gray-500">... and {rec.eligibility.length - 3} more criteria</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No recommendations message */}
              {!isGenerating && recommendations.length === 0 && clinicalInput.cancerType && (
                <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No specific recommendations available for the current parameters. Please ensure all required fields are completed.
                  </p>
                </div>
              )}
            </div>
          </Tab.Panel>

        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default TreatmentGuidanceTool;
