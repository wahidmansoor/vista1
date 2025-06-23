/**
 * Constants and configuration data for Disease Progress Tracker
 */

import { TabConfig, TreatmentProtocol, StageType, PerformanceScoreType } from './types/diseaseProgress.types';
import { 
  Activity, 
  FileText, 
  TrendingUp, 
  Pill, 
  Brain 
} from 'lucide-react';

// Local storage configuration
export const STORAGE_KEY = 'disease-progress-tracker-data';
export const STORAGE_VERSION = '1.0.0';

// Primary diagnosis options
export const PRIMARY_DIAGNOSES = [
  'Breast Cancer',
  'Colorectal Cancer', 
  'Lung Cancer',
  'Ovarian Cancer',
  'Lymphoma',
  'Leukemia',
  'Melanoma',
  'Prostate Cancer',
  'Pancreatic Cancer',
  'Liver Cancer',
  'Kidney Cancer',
  'Bladder Cancer',
  'Esophageal Cancer',
  'Gastric Cancer',
  'Head and Neck Cancer',
  'Sarcoma',
  'Brain Tumor',
  'Thyroid Cancer',
  'Other'
] as const;

// Histology and mutation options
export const HISTOLOGY_MUTATIONS = [
  'HER2 Positive',
  'HER2 Negative', 
  'KRAS Mutant',
  'KRAS Wild-type',
  'EGFR Mutant',
  'EGFR Wild-type',
  'PD-L1 Positive',
  'PD-L1 Negative',
  'BRCA1 Mutant',
  'BRCA2 Mutant',
  'BRAF Mutant',
  'PIK3CA Mutant',
  'p53 Mutant',
  'Microsatellite Instability High (MSI-H)',
  'Microsatellite Stable (MSS)',
  'TP53 Mutant',
  'ALK Positive',
  'ROS1 Positive',
  'NTRK Fusion',
  'IDH1 Mutant',
  'IDH2 Mutant',
  'Other'
] as const;

// Tab configuration
export const tabs: TabConfig[] = [
  {
    id: 'disease-status',
    title: 'Disease Status',
    icon: Activity,
    isEnabled: true
  },
  {
    id: 'performance-status', 
    title: 'Performance Status',
    icon: FileText,
    isEnabled: true
  },
  {
    id: 'progression',
    title: 'Progression',
    icon: TrendingUp,
    isEnabled: true
  },
  {
    id: 'treatment-lines',
    title: 'Lines of Treatment',
    icon: Pill,
    isEnabled: true
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    icon: Brain,
    isEnabled: true
  }
];

// Treatment protocols data
export const TREATMENT_PROTOCOLS: TreatmentProtocol[] = [
  { 
    diagnosis: "Breast Cancer", 
    stage: "I", 
    name: "AC-T Protocol", 
    premedications: ["Dexamethasone", "Ondansetron", "Diphenhydramine", "Fosaprepitant"] 
  },
  { 
    diagnosis: "Breast Cancer", 
    stage: "II", 
    name: "FEC-T Protocol", 
    premedications: ["Dexamethasone", "Aprepitant", "Ondansetron", "Lorazepam"] 
  },
  { 
    diagnosis: "Breast Cancer", 
    stage: "III", 
    name: "TCHP Protocol", 
    premedications: ["Dexamethasone", "Ondansetron", "Diphenhydramine", "Famotidine"] 
  },
  { 
    diagnosis: "Breast Cancer", 
    stage: "IV", 
    name: "Palliative Capecitabine", 
    premedications: ["Dexamethasone", "Ondansetron"] 
  },
  { 
    diagnosis: "Colorectal Cancer", 
    stage: "II", 
    name: "FOLFOX6", 
    premedications: ["Dexamethasone", "Ondansetron", "Calcium gluconate", "Magnesium sulfate"] 
  },
  { 
    diagnosis: "Colorectal Cancer", 
    stage: "III", 
    name: "FOLFOX + Avastin", 
    premedications: ["Dexamethasone", "Ranitidine", "Ondansetron", "Calcium gluconate"] 
  },
  { 
    diagnosis: "Colorectal Cancer", 
    stage: "IV", 
    name: "FOLFIRI + Avastin", 
    premedications: ["Dexamethasone", "Ondansetron", "Atropine", "Diphenhydramine"] 
  },
  { 
    diagnosis: "Lung Cancer", 
    stage: "I", 
    name: "Surgery + Observation", 
    premedications: [] 
  },
  { 
    diagnosis: "Lung Cancer", 
    stage: "III", 
    name: "Concurrent Chemoradiation", 
    premedications: ["Dexamethasone", "Ondansetron", "Fosaprepitant"] 
  },
  { 
    diagnosis: "Lung Cancer", 
    stage: "IV", 
    name: "Platinum Doublet", 
    premedications: ["Dexamethasone", "Granisetron", "Fosaprepitant", "Lorazepam"] 
  },
  { 
    diagnosis: "Ovarian Cancer", 
    stage: "III", 
    name: "Carboplatin + Paclitaxel", 
    premedications: ["Dexamethasone", "Diphenhydramine", "Ranitidine", "Ondansetron"] 
  },
  { 
    diagnosis: "Lymphoma", 
    stage: "Any", 
    name: "R-CHOP", 
    premedications: ["Acetaminophen", "Diphenhydramine", "Ondansetron", "Mesna"] 
  },
  { 
    diagnosis: "Leukemia", 
    stage: "Any", 
    name: "7+3 Induction", 
    premedications: ["Dexamethasone", "Ondansetron", "Allopurinol"] 
  },
  { 
    diagnosis: "Melanoma", 
    stage: "IV", 
    name: "Immunotherapy (PD-1)", 
    premedications: ["Acetaminophen", "Diphenhydramine"] 
  },
  { 
    diagnosis: "Prostate Cancer", 
    stage: "IV", 
    name: "ADT + Docetaxel", 
    premedications: ["Dexamethasone", "Ondansetron", "Famotidine"] 
  },
  { 
    diagnosis: "Other", 
    stage: "Any", 
    name: "Consider Clinical Trial", 
    premedications: [] 
  }
];

// Diagnosis to protocol mapping
export const DIAGNOSIS_PROTOCOL_MAP: Record<string, string[]> = {
  'Breast Cancer': [
    'AC-T Protocol',
    'FEC-T Protocol', 
    'TCHP Protocol',
    'Palliative Capecitabine'
  ],
  'Colorectal Cancer': [
    'FOLFOX6',
    'FOLFOX + Avastin',
    'FOLFIRI + Avastin'
  ],
  'Lung Cancer': [
    'Surgery + Observation',
    'Concurrent Chemoradiation',
    'Platinum Doublet'
  ],
  'Ovarian Cancer': [
    'Carboplatin + Paclitaxel'
  ],
  'Lymphoma': [
    'R-CHOP'
  ],
  'Leukemia': [
    '7+3 Induction'
  ],
  'Melanoma': [
    'Immunotherapy (PD-1)'
  ],
  'Prostate Cancer': [
    'ADT + Docetaxel'
  ],
  'Other': [
    'Consider Clinical Trial'
  ]
};

// Performance score interpretations
export const PERFORMANCE_SCORE_INTERPRETATIONS: Record<PerformanceScoreType, {
  label: string;
  description: string;
  treatmentRecommendation: string;
  dosageModification?: string;
}> = {
  '0': {
    label: 'Fully active',
    description: 'Able to carry on all pre-disease performance without restriction',
    treatmentRecommendation: 'Patient fit for full dose therapy',
    dosageModification: 'No dose reduction needed'
  },
  '1': {
    label: 'Restricted in strenuous activity',
    description: 'Restricted in physically strenuous activity but ambulatory',
    treatmentRecommendation: 'Patient fit for standard therapy with close monitoring',
    dosageModification: 'Consider minor dose modifications if toxicity develops'
  },
  '2': {
    label: 'Ambulatory but unable to work',
    description: 'Ambulatory and capable of all selfcare but unable to carry out work activities',
    treatmentRecommendation: 'Consider dose reduction or weekly regimens',
    dosageModification: 'Dose reduction recommended (75-80% of standard dose)'
  },
  '3': {
    label: 'Limited self-care',
    description: 'Capable of only limited selfcare, confined to bed or chair >50% of waking hours',
    treatmentRecommendation: 'Best supportive care may be most appropriate',
    dosageModification: 'Significant dose reduction or avoid aggressive therapy'
  },
  '4': {
    label: 'Completely disabled',
    description: 'Cannot carry on any selfcare, totally confined to bed or chair',
    treatmentRecommendation: 'Best supportive care recommended',
    dosageModification: 'Avoid chemotherapy unless exceptional circumstances'
  },
  '': {
    label: 'Not assessed',
    description: 'Performance status not yet assessed',
    treatmentRecommendation: 'Assessment required before treatment planning'
  }
};

// Validation rules
export const VALIDATION_RULES = {
  required: ['primaryDiagnosis', 'stageAtDiagnosis', 'dateOfDiagnosis'],
  dateFields: ['dateOfDiagnosis', 'assessmentDate', 'reassessmentDate', 'startDate', 'endDate'],
  numericFields: ['markerValue'],
  dependencies: {
    'otherPrimaryDiagnosis': 'primaryDiagnosis', // Required when primaryDiagnosis is 'Other'
    'otherHistologyMutation': 'histologyMutation' // Required when histologyMutation is 'Other'
  }
} as const;

// Default values for form fields
export const DEFAULT_VALUES = {
  diseaseStatus: {
    primaryDiagnosis: '',
    otherPrimaryDiagnosis: '',
    stageAtDiagnosis: '',
    histologyMutation: '',
    otherHistologyMutation: '',
    dateOfDiagnosis: '',
    diseaseNotes: ''
  },
  performanceStatus: {
    assessmentDate: '',
    performanceScale: '',
    performanceScore: '',
    performanceNotes: ''
  },
  progression: {
    reassessmentDate: '',
    imagingType: '',
    findingsSummary: '',
    markerType: '',
    markerValue: '',
    progressionNotes: ''
  },
  treatmentLine: {
    treatmentLine: '',
    treatmentRegimen: '',
    startDate: '',
    endDate: '',
    treatmentResponse: '',
    treatmentNotes: ''
  }
} as const;

// AI Assistant prompt templates
export const AI_PROMPT_TEMPLATES = {
  treatmentSuggestion: (context: { diagnosis?: string; stage?: string; histology?: string; performanceScore?: string }) => {
    return `Based on the following patient information, provide treatment recommendations:
    - Primary Diagnosis: ${context.diagnosis || 'Not specified'}
    - Stage: ${context.stage || 'Not specified'} 
    - Histology/Mutation: ${context.histology || 'Not specified'}
    - Performance Score: ${context.performanceScore || 'Not assessed'}
    
    Please provide:
    1. Recommended treatment protocols
    2. Dose modifications based on performance status
    3. Key monitoring parameters
    4. Potential toxicities to watch for`;
  },
  
  progressionAnalysis: (context: { treatmentHistory?: string; imagingFindings?: string; tumorMarkers?: string }) => {
    return `Analyze disease progression based on:
    - Treatment History: ${context.treatmentHistory || 'Not provided'}
    - Recent Imaging: ${context.imagingFindings || 'Not provided'}
    - Tumor Markers: ${context.tumorMarkers || 'Not provided'}
    
    Please assess:
    1. Evidence of progression vs. response
    2. Next line treatment options
    3. Clinical trial considerations
    4. Supportive care needs`;
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  required: (field: string) => `${field} is required`,
  invalidDate: (field: string) => `Please enter a valid date for ${field}`,
  invalidNumber: (field: string) => `Please enter a valid number for ${field}`,
  dateOrder: (earlierField: string, laterField: string) => 
    `${earlierField} must be before ${laterField}`,
  storageError: 'Failed to save data to local storage',
  loadError: 'Failed to load saved data',
  validationError: 'Please correct the validation errors before saving'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  saved: (section: string) => `${section} saved successfully!`,
  loaded: 'Previous session data loaded successfully!',
  cleared: 'All data cleared successfully!',
  exported: 'Data exported successfully!'
} as const;
