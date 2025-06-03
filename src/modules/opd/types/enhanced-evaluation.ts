// Enhanced TypeScript types for the advanced Patient Evaluation system
// filepath: d:\Mansoor\mwoncovista\vista1\src\modules\opd\types\enhanced-evaluation.ts

export type CancerType = 
  | 'breast'
  | 'lung'
  | 'colorectal'
  | 'prostate'
  | 'ovarian'
  | 'gastric'
  | 'pancreatic'
  | 'lymphoma'
  | 'head_neck'
  | 'bladder'
  | 'liver'
  | 'kidney'
  | 'cervical'
  | 'endometrial'
  | 'leukemia'
  | 'sarcoma'
  | 'brain'
  | 'thyroid'
  | 'melanoma';

export type RiskCategory = 'minimal' | 'low' | 'intermediate' | 'high' | 'very_high';
export type EvaluationStatus = 'draft' | 'pending_review' | 'reviewed' | 'approved' | 'revised' | 'archived';
export type TreatmentIntent = 'curative' | 'palliative' | 'adjuvant' | 'neoadjuvant';
export type EvidenceLevel = '1A' | '1B' | '2A' | '2B' | '3' | '4' | '5';
export type MSIStatus = 'MSI-H' | 'MSS' | 'MSI-L' | 'unknown';

export interface TNMStage {
  t: string;
  n: string;
  m: string;
  stage?: string;
  ajccVersion?: string;
}

export interface PerformanceStatus {
  ecog: number;
  kps: number;
  notes?: string;
  assessmentDate?: string;
}

export interface ReceptorStatus {
  er?: {
    status: 'positive' | 'negative' | 'unknown';
    percentage?: number;
    intensity?: 'weak' | 'moderate' | 'strong';
  };
  pr?: {
    status: 'positive' | 'negative' | 'unknown';
    percentage?: number;
    intensity?: 'weak' | 'moderate' | 'strong';
  };
  her2?: {
    status: 'positive' | 'negative' | 'equivocal' | 'unknown';
    score?: '0' | '1+' | '2+' | '3+';
    fish?: 'amplified' | 'not_amplified' | 'unknown';
  };
  ki67?: {
    percentage?: number;
    proliferationIndex?: 'low' | 'intermediate' | 'high';
  };
}

export interface MutationStatus {
  brca1?: 'pathogenic' | 'benign' | 'vus' | 'unknown';
  brca2?: 'pathogenic' | 'benign' | 'vus' | 'unknown';
  tp53?: 'mutated' | 'wild_type' | 'unknown';
  pik3ca?: 'mutated' | 'wild_type' | 'unknown';
  kras?: 'mutated' | 'wild_type' | 'unknown';
  egfr?: 'mutated' | 'wild_type' | 'unknown';
  alk?: 'rearranged' | 'wild_type' | 'unknown';
  pdl1?: {
    status: 'positive' | 'negative' | 'unknown';
    percentage?: number;
    assay?: string;
  };
  other?: Array<{
    gene: string;
    status: string;
    significance?: string;
  }>;
}

export interface ComorbidityScore {
  charlson?: number;
  ace27?: 'none' | 'mild' | 'moderate' | 'severe';
  ecog?: number;
  custom?: Array<{
    condition: string;
    severity: 'mild' | 'moderate' | 'severe';
    impact: 'low' | 'medium' | 'high';
  }>;
}

export interface OrganFunction {
  hepatic?: {
    bilirubin?: number;
    alt?: number;
    ast?: number;
    alkalinePhosphatase?: number;
    childPugh?: 'A' | 'B' | 'C';
  };
  renal?: {
    creatinine?: number;
    bun?: number;
    gfr?: number;
    ckdStage?: '1' | '2' | '3a' | '3b' | '4' | '5';
  };
  cardiac?: {
    ejectionFraction?: number;
    nyhaClass?: 'I' | 'II' | 'III' | 'IV';
    priorCardiotoxicity?: boolean;
  };
  pulmonary?: {
    fev1?: number;
    dlco?: number;
    oxygenSaturation?: number;
  };
}

export interface RiskFactor {
  id: string;
  factor: string;
  category: 'genetic' | 'lifestyle' | 'environmental' | 'medical';
  impact: 'low' | 'medium' | 'high';
  confidence: number; // 0-100
  evidence?: string;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  type: 'chemotherapy' | 'immunotherapy' | 'targeted' | 'hormonal' | 'radiation' | 'surgery' | 'combination';
  regimen?: string;
  cycles?: number;
  duration?: string;
  intent: TreatmentIntent;
  contraindications?: string[];
  sideEffects?: string[];
  monitoring?: string[];
  evidenceLevel?: EvidenceLevel;
  guidelineSource?: string;
}

export interface RedFlag {
  id: string;
  type: 'critical' | 'warning' | 'info';
  category: 'clinical' | 'laboratory' | 'imaging' | 'pathology';
  message: string;
  recommendation?: string;
  urgency: 'immediate' | 'urgent' | 'routine';
  triggered: boolean;
  timestamp?: string;
  
  // Extended properties for enhanced red flag engine
  severity?: number; // 1-5 scale
  actionRequired?: string[];
  timeframe?: string;
  specialties?: string[];
  acknowledged?: boolean;
  acknowledgedAt?: string;
  resolved?: boolean;
  resolvedAt?: string;
  resolution?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'diagnostic' | 'therapeutic' | 'monitoring' | 'referral';
  category: string;
  recommendation: string;
  reasoning: string;
  confidence: number; // 0-100
  evidenceLevel: EvidenceLevel;
  sources?: string[];
  alternatives?: string[];
  contraindications?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

export interface EvaluationField {
  id: string;
  text: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean' | 'staging' | 'performance';
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string; description?: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  redFlags?: string[];
  aiAssisted?: boolean;
  cancerSpecific?: CancerType[];
}

export interface EvaluationSection {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  items: EvaluationField[];
  cancerSpecificNotes?: string[];
  aiGuidance?: string[];
  requiredForCompletion?: boolean;
  dependencies?: string[]; // IDs of sections that must be completed first
}

export interface EvaluationTemplate {
  id: string;
  cancerType: CancerType;
  title: string;
  description: string;
  version: string;
  sections: EvaluationSection[];
  staging?: {
    system: 'tnm' | 'figo' | 'rai' | 'binet' | 'durie_salmon' | 'ann_arbor';
    version?: string;
    specificFields?: string[];
  };
  biomarkers?: {
    required: string[];
    optional: string[];
    emerging: string[];
  };
  notes: string[];
  redFlags: string[];
  aiEnabled: boolean;
  lastUpdated: string;
  guidelineReferences: Array<{
    source: string;
    version: string;
    url?: string;
  }>;
}

export interface EnhancedPatientEvaluation {
  id: string;
  patient_id?: string;
  
  // Core Clinical Data (matching database schema)
  cancer_type: CancerType;
  cancer_subtype?: string;
  primary_site: string;
  histology: string;
  tumor_grade?: string;
  
  // Staging (JSONB fields)
  tnm_stage: TNMStage;
  ajcc_version?: string;
  stage_clinical?: string;
  stage_pathological?: string;
  
  // Biomarkers & Molecular (JSONB fields)
  receptor_status?: ReceptorStatus;
  mutation_status?: MutationStatus;
  immunohistochemistry?: Record<string, any>;
  molecular_subtype?: string;
  msi_status?: MSIStatus;
  tmb_score?: number;
  
  // Performance & Comorbidities (JSONB fields)
  performance_status: PerformanceStatus;
  comorbidity_score?: ComorbidityScore;
  organ_function?: OrganFunction;
  
  // Risk Assessment
  risk_category: RiskCategory;
  risk_score?: number;
  risk_factors: RiskFactor[];
  protective_factors: RiskFactor[];
  
  // Treatment Planning (JSONB fields)
  treatment_intent?: TreatmentIntent;
  treatment_line: string;
  recommended_plan: TreatmentPlan;
  alternative_plans: TreatmentPlan[];
  contraindications: string[];
  
  // Clinical Decision Support (JSONB fields)
  red_flags: RedFlag[];
  ai_recommendations: AIRecommendation[];
  evidence_level?: EvidenceLevel;
  guideline_references: Array<{
    source: string;
    recommendation: string;
    url?: string;
  }>;
  
  // Form Management (JSONB field)
  form_data: Record<string, any>;
  validation_errors: ValidationError[];
  completion_percentage: number;
  
  // Workflow & Collaboration
  status: EvaluationStatus;
  submitted_by?: string;
  reviewed_by?: string;
  mdt_discussed: boolean;
  mdt_date?: string;
  
  // Versioning & Audit
  version: number;
  parent_evaluation_id?: string;
  clinician_notes?: string;
  revision_reason?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  reviewed_at?: string;
  
  // Computed
  overall_stage?: string;
  days_since_creation?: number;
}

// Context type for the enhanced evaluation provider
export interface EnhancedEvaluationContextType {
  // Current evaluation state
  evaluation: Partial<EnhancedPatientEvaluation>;
  updateEvaluation: (updates: Partial<EnhancedPatientEvaluation>) => void;
  
  // Form state
  formData: Record<string, any>;
  updateFormField: (fieldId: string, value: any) => void;
  clearFormData: () => void;
  
  // Template and cancer type
  selectedCancerType: CancerType | '';
  setSelectedCancerType: (type: CancerType | '') => void;
  currentTemplate: EvaluationTemplate | null;
  
  // Validation and submission
  validationErrors: ValidationError[];
  isFormSubmitting: boolean;
  setIsFormSubmitting: (value: boolean) => void;
  
  // AI and clinical decision support
  aiRecommendations: AIRecommendation[];
  redFlags: RedFlag[];
  riskAssessment: {
    category: RiskCategory;
    score: number;
    factors: RiskFactor[];
  };
  
  // Progress and completion
  completionPercentage: number;
  currentSection: string | null;
  setCurrentSection: (sectionId: string | null) => void;
  
  // Actions
  saveEvaluation: () => Promise<void>;
  submitForReview: () => Promise<void>;
  calculateRisk: () => void;
  generateAIRecommendations: () => Promise<void>;
  validateForm: () => ValidationError[];
  
  // Status and messaging
  formError: string | null;
  setFormError: (error: string | null) => void;
  formSuccess: boolean;
  setFormSuccess: (success: boolean) => void;
}

// Step interface for the enhanced stepper
export interface EvaluationStep {
  id: string;
  name: string;
  description: string;
  icon?: string;
  status: 'complete' | 'current' | 'upcoming' | 'error';
  sectionId: string;
  required: boolean;
  estimated_time?: number; // in minutes
  dependencies?: string[];
}

// Color system for clinical contexts
export interface ClinicalColorSystem {
  risk: {
    minimal: string;
    low: string;
    intermediate: string;
    high: string;
    veryHigh: string;
  };
  biomarker: {
    positive: string;
    negative: string;
    unknown: string;
    equivocal: string;
  };
  status: {
    draft: string;
    pending: string;
    reviewed: string;
    approved: string;
    revised: string;
    archived: string;
  };
  redFlag: {
    critical: string;
    warning: string;
    info: string;
  };
}

export const clinicalColors: ClinicalColorSystem = {
  risk: {
    minimal: 'bg-green-50 border-green-200 text-green-800',
    low: 'bg-blue-50 border-blue-200 text-blue-800',
    intermediate: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    high: 'bg-orange-50 border-orange-200 text-orange-800',
    veryHigh: 'bg-red-50 border-red-200 text-red-800'
  },
  biomarker: {
    positive: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    negative: 'bg-slate-50 border-slate-200 text-slate-800',
    unknown: 'bg-amber-50 border-amber-200 text-amber-800',
    equivocal: 'bg-purple-50 border-purple-200 text-purple-800'
  },
  status: {
    draft: 'bg-gray-50 border-gray-200 text-gray-800',
    pending: 'bg-blue-50 border-blue-200 text-blue-800',
    reviewed: 'bg-purple-50 border-purple-200 text-purple-800',
    approved: 'bg-green-50 border-green-200 text-green-800',
    revised: 'bg-orange-50 border-orange-200 text-orange-800',
    archived: 'bg-red-50 border-red-200 text-red-800'
  },
  redFlag: {
    critical: 'bg-red-100 border-red-300 text-red-900',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-900',
    info: 'bg-blue-100 border-blue-300 text-blue-900'
  }
};
