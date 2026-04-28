/**
 * TypeScript interfaces for Disease Progress Tracker
 * Comprehensive type definitions for patient data management
 */

// Core data interfaces
export interface DiseaseStatus {
  primaryDiagnosis: string;
  otherPrimaryDiagnosis?: string;
  histology?: string;
  stageAtDiagnosis: StageType;
  biomarkers: PatientBiomarker[];
  dateOfDiagnosis: string;
  diseaseNotes?: string;
}

export interface PatientBiomarker {
  name: string;
  status: BiomarkerStatus;
  value?: string;
  testDate?: string;
}

export type BiomarkerStatus = 'Positive' | 'Negative' | 'Wild-type' | 'Mutant' | 'Amplified' | 'Non-amplified' | 'High' | 'Low' | 'Unknown' | 'High (>=50%)' | 'Positive (1-49%)' | 'Negative (<1%)' | 'Intermediate/Poor' | '>=5' | 'Sensitive' | 'Resistant' | '';

export interface PerformanceStatus {
  assessmentDate: string;
  performanceScale: PerformanceScaleType;
  performanceScore: PerformanceScoreType;
  performanceNotes?: string;
}

export interface ProgressionData {
  reassessmentDate: string;
  imagingType: ImagingType;
  findingsSummary?: string;
  markerType?: string;
  markerValue?: string;
  progressionNotes?: string;
}

export interface TreatmentLine {
  treatmentLine: TreatmentLineType;
  treatmentRegimen: string;
  agents: string[];
  startDate: string;
  endDate?: string;
  treatmentResponse: TreatmentResponseType;
  treatmentNotes?: string;
}

// Combined patient data interface
export interface PatientData {
  id: string;
  lastUpdated: Date;
  diseaseStatus: DiseaseStatus;
  performanceStatus: PerformanceStatus;
  progression: ProgressionData;
  treatmentHistory: TreatmentLine[];
  metadata: PatientDataMetadata;
}

export interface PatientDataMetadata {
  version: string;
  createdAt: Date;
  modifiedAt: Date;
  dataIntegrityChecks: {
    lastValidated: Date;
    isValid: boolean;
    validationErrors?: string[];
  };
}

// Treatment protocol interfaces
export interface TreatmentProtocol {
  id: string;
  diagnosis: string;
  histology?: string[]; // Optional specific histologies (e.g., Squamous, Non-squamous)
  stageEligibility: StageType[] | ['Any'];
  lineOfTherapy: number[];
  treatmentIntent: TreatmentIntent;
  intentSetting?: string; // e.g., 'Metastatic', 'Adjuvant'
  
  // Biomarker Logic
  biomarkerLogic: 'ALL_OF' | 'ANY_OF';
  requiredBiomarkers: BiomarkerRequirement[];
  excludedBiomarkers?: BiomarkerRequirement[];
  
  maxEcog: number;
  name: string; // regimenName
  agents: string[];
  preferredOption?: boolean; // NCCN Category 1 "Preferred" vs "Other Recommended"
  
  evidenceLevel: EvidenceLevel;
  guidelineSource?: string; // e.g., 'NCCN 2024.1', 'ESMO 2023'
  lastReviewed?: string; // ISO date
  clinicalReviewRequired: boolean; // Must always be true for these local protocols
  
  rationale: string;
  warnings: string[];
  contraindications?: string[];
  contraindicationSeverity?: 'Absolute' | 'Relative';
  monitoringRequirements?: string[];
  references: string[];
  knowledgeLinks?: string[]; // Anchors to handbook sections
}

export interface BiomarkerRequirement {
  name: string;
  status: BiomarkerStatus;
  urgency?: 'Hard' | 'Soft'; // Hard = Missing data blocks match, Soft = Missing data just warns
}

export type EvidenceLevel = 'Category 1' | 'Category 2A' | 'Category 2B' | 'Category 3';
export type TreatmentIntent = 'Curative' | 'Palliative' | 'Adjuvant' | 'Neo-adjuvant' | 'Maintenance';

export interface ProtocolMatch {
  protocol: TreatmentProtocol;
  isEligible: boolean;
  matchScore: number;
  warnings: string[];
  rationale: string;
  status: 'Eligible option' | 'Potential option' | 'Action required' | 'Not recommended' | 'Not eligible';
  matchedFactors?: string[]; // Added: For "Why This Match Matters"
}

export interface DoseInfo {
  standard: string;
  adjustments: DoseAdjustment[];
  schedule: string;
  cycleLenth: string;
}

export interface DoseAdjustment {
  condition: string;
  modification: string;
  performanceScoreThreshold?: number;
}

// Enumeration types
export type StageType = 'I' | 'II' | 'III' | 'IV';

export type PerformanceScaleType = 'ecog' | 'karnofsky' | '';

export type PerformanceScoreType = '0' | '1' | '2' | '3' | '4' | '';

export type ImagingType = 'CT' | 'MRI' | 'PET' | 'XRay' | '';

export type TreatmentLineType = '1st Line' | '2nd Line' | '3rd Line' | 'Maintenance' | '';

export type TreatmentResponseType = 
  | 'Complete Response' 
  | 'Partial Response' 
  | 'Stable Disease' 
  | 'Progressive Disease' 
  | '';

// Tab configuration
export interface TabConfig {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  isEnabled: boolean;
}

// Form validation interfaces
export interface FieldValidation {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export interface FormValidationState {
  diseaseStatus: Record<keyof DiseaseStatus, FieldValidation>;
  performanceStatus: Record<keyof PerformanceStatus, FieldValidation>;
  progression: Record<keyof ProgressionData, FieldValidation>;
  treatmentLine: Record<keyof TreatmentLine, FieldValidation>;
  isFormValid: boolean;
  globalErrors: string[];
}

// AI Assistant interfaces
export interface AiSuggestionContext {
  patientData: PatientData;
  userInput?: string;
  focusArea?: 'protocol' | 'dosing' | 'monitoring' | 'toxicity';
}

export interface AiSuggestionResponse {
  suggestions: string;
  confidence: number;
  warnings: string[];
  references?: string[];
}

// Local storage interfaces
export interface StorageData {
  diseaseStatus: DiseaseStatus;
  performanceStatus: PerformanceStatus;
  progression: ProgressionData;
  linesOfTreatment: TreatmentLine;
  metadata?: {
    version: string;
    lastSaved: string;
  };
}

// Error handling interfaces
export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface DataMigration {
  fromVersion: string;
  toVersion: string;
  migrate: (data: any) => StorageData;
}

// Action types for useReducer
export type PatientDataAction =
  | { type: 'SET_DISEASE_STATUS'; payload: Partial<DiseaseStatus> }
  | { type: 'SET_PERFORMANCE_STATUS'; payload: Partial<PerformanceStatus> }
  | { type: 'SET_PROGRESSION'; payload: Partial<ProgressionData> }
  | { type: 'SET_TREATMENT_LINE'; payload: Partial<TreatmentLine> }
  | { type: 'ADD_TREATMENT_LINE'; payload: TreatmentLine }
  | { type: 'UPDATE_TREATMENT_LINE'; payload: { index: number; data: Partial<TreatmentLine> } }
  | { type: 'REMOVE_TREATMENT_LINE'; payload: number }
  | { type: 'LOAD_DATA'; payload: StorageData }
  | { type: 'RESET_ALL' }
  | { type: 'SET_VALIDATION_ERROR'; payload: { field: string; error: ValidationError } }
  | { type: 'CLEAR_VALIDATION_ERRORS' };

// State interface for useReducer
export interface PatientDataState {
  diseaseStatus: DiseaseStatus;
  performanceStatus: PerformanceStatus;
  progression: ProgressionData;
  treatmentLine: TreatmentLine;
  treatmentHistory: TreatmentLine[];
  validationErrors: Record<string, ValidationError>;
  isLoading: boolean;
  lastSaved?: Date;
}

// Hook return types
export interface UsePatientDataReturn {
  state: PatientDataState;
  actions: {
    updateDiseaseStatus: (data: Partial<DiseaseStatus>) => void;
    updatePerformanceStatus: (data: Partial<PerformanceStatus>) => void;
    updateProgression: (data: Partial<ProgressionData>) => void;
    updateTreatmentLine: (data: Partial<TreatmentLine>) => void;
    addTreatmentLine: (data: TreatmentLine) => void;
    removeTreatmentLine: (index: number) => void;
    saveToStorage: () => Promise<void>;
    loadFromStorage: () => Promise<void>;
    resetAll: () => void;
    validateField: (field: string, value: any) => FieldValidation;
  };
  computed: {
    getSuggestedProtocols: () => TreatmentProtocol[];
    getSuggestedPremeds: () => string[];
    getValidationSummary: () => FormValidationState;
    canSave: () => boolean;
  };
}

export interface UseProtocolSuggestionsReturn {
  protocols: TreatmentProtocol[];
  matches: ProtocolMatch[];
  premedications: string[];
  isLoading: boolean;
  error?: string;
  refetch: () => void;
  contraindications?: string[];
  doseAdjustments?: string[];
  recommendations?: {
    hasContraindications: boolean;
    needsDoseAdjustment: boolean;
    performanceBasedWarning: boolean;
  };
}
