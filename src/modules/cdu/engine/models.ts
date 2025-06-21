/**
 * Enhanced Disease Progress Tracker - Core Models and Types
 * This file contains all interfaces, enums, and type definitions used throughout the application
 */

// Core Enums
export enum CancerType {
  BREAST = 'breast',
  LUNG = 'lung',
  COLORECTAL = 'colorectal',
  PROSTATE = 'prostate',
  PANCREATIC = 'pancreatic',
  OVARIAN = 'ovarian',
  GASTRIC = 'gastric',
  LYMPHOMA = 'lymphoma',
  MELANOMA = 'melanoma',
  BLADDER = 'bladder',
  HEAD_NECK = 'head_neck',
  ESOPHAGEAL = 'esophageal',
  HEPATOCELLULAR = 'hepatocellular',
  TESTICULAR = 'testicular',
  BRAIN = 'brain',
  SARCOMA = 'sarcoma',
  THYROID = 'thyroid',
  OTHER = 'other'
}

export enum OrganSystem {
  GASTROINTESTINAL = 'gastrointestinal',
  RESPIRATORY = 'respiratory',
  GENITOURINARY = 'genitourinary',
  HEMATOLOGIC = 'hematologic',
  NERVOUS = 'nervous',
  ENDOCRINE = 'endocrine',
  SKIN = 'skin',
  MUSCULOSKELETAL = 'musculoskeletal',
  HEAD_NECK = 'head_neck',
  REPRODUCTIVE = 'reproductive'
}

export enum TreatmentLine {
  FIRST_LINE = '1st Line',
  SECOND_LINE = '2nd Line',
  THIRD_LINE = '3rd Line',
  FOURTH_LINE = '4th Line',
  MAINTENANCE = 'Maintenance',
  SALVAGE = 'Salvage'
}

export enum TreatmentResponse {
  COMPLETE_RESPONSE = 'Complete Response',
  PARTIAL_RESPONSE = 'Partial Response',
  STABLE_DISEASE = 'Stable Disease',
  PROGRESSIVE_DISEASE = 'Progressive Disease',
  NOT_EVALUABLE = 'Not Evaluable'
}

export enum PerformanceScale {
  ECOG = 'ecog',
  KARNOFSKY = 'karnofsky'
}

export enum ImagingType {
  CT = 'CT',
  MRI = 'MRI',
  PET = 'PET',
  PET_CT = 'PET-CT',
  XRAY = 'XRay',
  ULTRASOUND = 'Ultrasound',
  BONE_SCAN = 'Bone Scan'
}

export enum EvidenceLevel {
  LEVEL_1A = '1A',
  LEVEL_1B = '1B',
  LEVEL_2A = '2A',
  LEVEL_2B = '2B',
  LEVEL_3 = '3',
  LEVEL_4 = '4',
  LEVEL_5 = '5'
}

export enum TreatmentType {
  CHEMOTHERAPY = 'chemotherapy',
  IMMUNOTHERAPY = 'immunotherapy',
  TARGETED_THERAPY = 'targeted_therapy',
  HORMONAL_THERAPY = 'hormonal_therapy',
  RADIATION_THERAPY = 'radiation_therapy',
  SURGERY = 'surgery',
  COMBINATION = 'combination',
  SUPPORTIVE_CARE = 'supportive_care'
}

export enum RiskLevel {
  LOW = 'low',
  INTERMEDIATE = 'intermediate',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

// Core Interfaces
export interface DiseaseStatus {
  primaryDiagnosis: string;
  otherPrimaryDiagnosis?: string;
  stageAtDiagnosis: string;
  histologyMutation?: string;
  dateOfDiagnosis: string;
  diseaseNotes?: string;
  organSystem?: OrganSystem;
  cellType?: string;
  gradeDifferentiation?: string;
  riskStratification?: RiskLevel;
  biomarkers?: Biomarker[];
  geneticMutations?: GeneticMutation[];
}

export interface PerformanceStatus {
  assessmentDate: string;
  performanceScale: PerformanceScale;
  performanceScore: string;
  performanceNotes?: string;
  functionalStatus?: FunctionalStatus;
  qualityOfLife?: QualityOfLife;
}

export interface ProgressionData {
  reassessmentDate: string;
  imagingType: ImagingType;
  findingsSummary?: string;
  markerType?: string;
  markerValue?: string;
  progressionNotes?: string;
  responseAssessment?: ResponseAssessment;
  adverseEvents?: AdverseEvent[];
}

export interface TreatmentLineData {
  treatmentLine: TreatmentLine;
  treatmentRegimen: string;
  startDate: string;
  endDate?: string;
  treatmentResponse: TreatmentResponse;
  treatmentNotes?: string;
  dosageModifications?: DosageModification[];
  toxicities?: Toxicity[];
  reasonForDiscontinuation?: string;
}

// Extended Interfaces
export interface Biomarker {
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  testDate: string;
  significance?: string;
}

export interface GeneticMutation {
  gene: string;
  mutation: string;
  status: 'positive' | 'negative' | 'variant_of_unknown_significance';
  testMethod?: string;
  testDate?: string;
  clinicalSignificance?: string;
}

export interface FunctionalStatus {
  independentLiving: boolean;
  workCapacity: number; // Percentage
  socialFunction: number; // 1-5 scale
  physicalLimitations: string[];
}

export interface QualityOfLife {
  overallScore: number; // 1-10 scale
  painLevel: number; // 1-10 scale
  fatigueLevel: number; // 1-10 scale
  emotionalWellbeing: number; // 1-10 scale
  concerns: string[];
}

export interface ResponseAssessment {
  method: 'RECIST' | 'iRECIST' | 'WHO' | 'Clinical';
  targetLesions: TargetLesion[];
  nonTargetLesions: NonTargetLesion[];
  newLesions: boolean;
  overallResponse: TreatmentResponse;
  assessorName?: string;
}

export interface TargetLesion {
  id: string;
  location: string;
  size: number; // in mm
  previousSize?: number;
  percentChange?: number;
}

export interface NonTargetLesion {
  id: string;
  location: string;
  status: 'stable' | 'progressed' | 'resolved';
}

export interface AdverseEvent {
  event: string;
grade: number;
  startDate: string;
  endDate?: string;
  causality: 'definite' | 'probable' | 'possible' | 'unlikely' | 'unrelated';
  action: 'none' | 'dose_reduction' | 'treatment_delay' | 'discontinuation';
}

export interface DosageModification {
  date: string;
  reason: string;
  oldDose: string;
  newDose: string;
  drugName: string;
}

export interface Toxicity {
  type: string;
grade: number;
  onset: string;
  resolution?: string;
  management: string;
  preventiveMeasures?: string[];
}

// Treatment Protocol Interfaces
export interface TreatmentProtocol {
  id: string;
  name: string;
  cancerType: CancerType;
  stage: string[];
  treatmentType: TreatmentType;
  line: TreatmentLine[];
  regimen: DrugRegimen[];
  eligibilityCriteria: EligibilityCriteria;
  contraindicationsCriteria: ContraindicationsCriteria;
  monitoring: MonitoringPlan;
  expectedOutcomes: ExpectedOutcomes;
  evidenceLevel: EvidenceLevel;
  guidelineSource: string;
  lastUpdated: string;
}

export interface DrugRegimen {
  drugName: string;
  dosage: string;
  route: 'IV' | 'PO' | 'SC' | 'IM' | 'IT' | 'Other';
  frequency: string;
  cycleDuration: string;
  totalCycles?: number;
  premedications?: string[];
}

export interface EligibilityCriteria {
  performanceStatus: {
    ecog?: number[];
    karnofsky?: number[];
  };
  organFunction: OrganFunctionCriteria;
  biomarkers?: BiomarkerCriteria[];
  priorTreatments?: string[];
  ageRange?: {
    min?: number;
    max?: number;
  };
}

export interface ContraindicationsCriteria {
  absolute: string[];
  relative: string[];
  drugInteractions: string[];
  comorbidities: string[];
}

export interface OrganFunctionCriteria {
  hepatic?: {
    bilirubin?: string;
    ast?: string;
    alt?: string;
  };
  renal?: {
    creatinine?: string;
    gfr?: string;
  };
  cardiac?: {
    ejectionFraction?: string;
    ecg?: string[];
  };
  hematologic?: {
    hemoglobin?: string;
    neutrophils?: string;
    platelets?: string;
  };
}

export interface BiomarkerCriteria {
  name: string;
  status: 'positive' | 'negative' | 'high' | 'low';
  threshold?: string;
  required: boolean;
}

export interface MonitoringPlan {
  pretreatment: MonitoringItem[];
  duringTreatment: MonitoringItem[];
  postTreatment: MonitoringItem[];
  emergencyContacts: EmergencyContact[];
}

export interface MonitoringItem {
  test: string;
  frequency: string;
  parameters: string[];
  alertThresholds?: AlertThreshold[];
}

export interface AlertThreshold {
  parameter: string;
  value: string;
  action: string;
}

export interface EmergencyContact {
  role: string;
  phone: string;
  availability: string;
}

export interface ExpectedOutcomes {
  responseRate: string;
  progressionFreeSesurvival: string;
  overallSurvival?: string;
  commonSideEffects: SideEffect[];
  qualityOfLifeImpact: string;
}

export interface SideEffect {
  name: string;
  frequency: string;
  severity: string;
  management: string;
}

// Clinical Decision Engine Interfaces
export interface ClinicalDecisionInput {
  diseaseStatus: DiseaseStatus;
  performanceStatus: PerformanceStatus;
  progression: ProgressionData;
  treatmentHistory: TreatmentLineData[];
  patientPreferences?: PatientPreferences;
  comorbidities?: Comorbidity[];
}

export interface PatientPreferences {
  qualityVsQuantity: 'quality' | 'quantity' | 'balanced';
  treatmentIntensity: 'aggressive' | 'moderate' | 'conservative';
  participationInTrials: boolean;
  supportiveCarePriorities: string[];
}

export interface Comorbidity {
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  impact: RiskLevel;
  medications: string[];
}

export interface ClinicalDecisionOutput {
  primaryRecommendation: TreatmentRecommendation;
  alternativeRecommendations: TreatmentRecommendation[];
  riskAssessment: RiskAssessment;
  monitoringPlan: MonitoringPlan;
  supportiveCare: SupportiveCareRecommendation[];
  followUpPlan: FollowUpPlan;
  emergencyGuidelines: EmergencyGuideline[];
  confidenceScore: number; // 0-100
  rationaleExplanation: string;
}

export interface TreatmentRecommendation {
  protocol: TreatmentProtocol;
  priority: number;
  rationale: string;
  modifications?: ProtocolModification[];
  expectedBenefit: string;
  riskBenefitRatio: string;
  evidenceStrength: EvidenceLevel;
}

export interface ProtocolModification {
  type: 'dose_reduction' | 'schedule_modification' | 'drug_substitution' | 'additional_monitoring';
  description: string;
  reason: string;
  impact: string;
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  specificRisks: SpecificRisk[];
  mitigationStrategies: string[];
  riskFactors: RiskFactor[];
}

export interface SpecificRisk {
  category: 'toxicity' | 'progression' | 'mortality' | 'functional_decline';
  risk: RiskLevel;
  probability: string;
  timeframe: string;
  prevention: string[];
}

export interface RiskFactor {
  factor: string;
  impact: RiskLevel;
  modifiable: boolean;
  interventions?: string[];
}

export interface SupportiveCareRecommendation {
  category: 'symptom_management' | 'nutrition' | 'psychosocial' | 'rehabilitation';
  intervention: string;
  priority: 'high' | 'medium' | 'low';
  provider: string;
  timing: string;
}

export interface FollowUpPlan {
  schedule: FollowUpVisit[];
  imagingPlan: ImagingSchedule[];
  laboratoryPlan: LabSchedule[];
  emergencyInstructions: string[];
}

export interface FollowUpVisit {
  timepoint: string;
  assessments: string[];
  provider: string;
  duration: string;
}

export interface ImagingSchedule {
  type: ImagingType;
  frequency: string;
  duration: string;
  indication: string;
}

export interface LabSchedule {
  tests: string[];
  frequency: string;
  duration: string;
  alertValues: AlertThreshold[];
}

export interface EmergencyGuideline {
  scenario: string;
  signs: string[];
  immediateActions: string[];
  contactInformation: EmergencyContact[];
  timeframe: string;
}

// Validation Interfaces
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completionPercentage: number;
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  recommendation?: string;
}

// Form State Management
export interface FormState {
  diseaseStatus: DiseaseStatus;
  performanceStatus: PerformanceStatus;
  progression: ProgressionData;
  treatmentLine: TreatmentLineData;
  isLoading: boolean;
  lastSaved?: string;
  isDirty: boolean;
}

export interface FormActions {
  updateDiseaseStatus: (updates: Partial<DiseaseStatus>) => void;
  updatePerformanceStatus: (updates: Partial<PerformanceStatus>) => void;
  updateProgression: (updates: Partial<ProgressionData>) => void;
  updateTreatmentLine: (updates: Partial<TreatmentLineData>) => void;
  saveToStorage: () => Promise<void>;
  loadFromStorage: () => void;
  resetAll: () => void;
  validateForm: () => ValidationResult;
}

// AI Assistant Interfaces
export interface AIAssistantState {
  isLoading: boolean;
  response: string | null;
  hasInsufficientData: boolean;
  suggestions: AISuggestion[];
}

export interface AISuggestion {
  type: 'protocol' | 'investigation' | 'monitoring' | 'referral';
  content: string;
  confidence: number;
  reasoning: string;
}

export interface AIAssistantActions {
  askAi: (input: string) => Promise<void>;
  clearResponse: () => void;
  generateSuggestions: () => Promise<void>;
}

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
