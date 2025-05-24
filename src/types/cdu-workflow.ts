// CDU Workflow Type Definitions

import { type Protocol, type Drug } from './protocol';
import { type CancerType } from './cancer-pathways';

// Patient Demographics and Diagnosis
export interface PatientDemographics {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  bsa: number; // Body Surface Area
  contact: {
    phone: string;
    email?: string;
    emergencyContact: string;
  };
}

export interface OncologyDiagnosis {
  cancerType: CancerType;
  histology: string;
  stage: string;
  diagnosisDate: string;
  biomarkers: Array<{
    name: string;
    result: string;
    date: string;
    interpretation: string;
  }>;
  metastaticSites?: string[];
  previousTreatments?: Array<{
    type: 'surgery' | 'radiation' | 'chemotherapy' | 'immunotherapy' | 'targeted' | 'other';
    details: string;
    date: string;
    response?: string;
  }>;
}

// Treatment Plan
export interface TreatmentPlan {
  protocol: Protocol;
  intent: 'Curative' | 'Adjuvant' | 'Neoadjuvant' | 'Palliative';
  cycleNumber: number;
  totalPlannedCycles: number;
  dayInCycle: number;
  bsaUsed: number;
  doseModifications?: Array<{
    drug: string;
    reason: string;
    percentReduction: number;
    newDose: string;
  }>;
  supportiveCare: {
    required: Drug[];
    optional: Drug[];
    growth_factors?: {
      name: string;
      schedule: string;
      duration: string;
    }[];
  };
}

// Pre-treatment Assessment
export interface PreTreatmentAssessment {
  date: string;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
    bsa: number;
  };
  ecogScore: 0 | 1 | 2 | 3 | 4;
  labResults: {
    date: string;
    complete_blood_count: {
      wbc: number;
      anc: number;
      platelets: number;
      hemoglobin: number;
    };
    chemistry: {
      creatinine: number;
      bilirubin: number;
      alt: number;
      ast: number;
    };
    other?: Record<string, number>;
  };
  organFunction: {
    renal: {
      creatinineClearance: number;
      requiresDoseAdjustment: boolean;
    };
    hepatic: {
      childPughScore?: number;
      requiresDoseAdjustment: boolean;
    };
    cardiac?: {
      lvef?: number;
      ecgFindings?: string;
    };
  };
  toxicities?: Array<{
    type: string;
    grade: 1 | 2 | 3 | 4 | 5;
    attribution: string;
    action: string;
  }>;
  consentStatus: {
    signed: boolean;
    date?: string;
    witness?: string;
    scannedDocumentUrl?: string;
  };
}

// Drug Preparation and Administration
export interface DrugPreparation {
  drug: Drug;
  finalDose: string;
  dilution: {
    solution: string;
    volume: string;
    concentration: string;
  };
  stability: {
    roomTemperature: string;
    refrigerated?: string;
    lightProtection: boolean;
  };
  preparation: {
    safetyMeasures: string[];
    specialInstructions?: string[];
  };
  qualityChecks: Array<{
    type: string;
    checker: string;
    timestamp: string;
    result: 'pass' | 'fail';
    notes?: string;
  }>;
}

export interface AdministrationDetails {
  drug: Drug;
  route: 'IV' | 'SC' | 'IM' | 'PO' | 'IT';
  method: 'bolus' | 'infusion' | 'continuous infusion';
  duration?: string;
  sequence: number;
  specialInstructions?: string[];
  administrationChecklist: Array<{
    step: string;
    completed: boolean;
    timestamp?: string;
    notes?: string;
  }>;
}

// Monitoring and Events
export interface InfusionMonitoring {
  checkpoints: Array<{
    timestamp: string;
    vitals: {
      bloodPressure: string;
      heartRate: number;
      temperature: number;
      spO2?: number;
    };
    symptoms?: string[];
    interventions?: string[];
    nurseInitials: string;
  }>;
  reactions?: Array<{
    type: string;
    severity: 'mild' | 'moderate' | 'severe';
    onset: string;
    management: string[];
    outcome: string;
  }>;
}

export interface AdverseEvent {
  type: string;
  grade: 1 | 2 | 3 | 4 | 5;
  onset: string;
  ctcaeCode: string;
  attribution: 'definite' | 'probable' | 'possible' | 'unlikely' | 'unrelated';
  management: {
    interventions: string[];
    medications?: Drug[];
    outcome: string;
    followUp?: string;
  };
  reportingStatus: {
    reportRequired: boolean;
    reportedDate?: string;
    reportNumber?: string;
  };
}

// Follow-up and Documentation
export interface CDUVisitSummary {
  visitDate: string;
  cycle: number;
  day: number;
  treatmentCompleted: boolean;
  summary: string;
  medications: {
    administered: Drug[];
    prescribedForHome?: Drug[];
  };
  nextVisit: {
    plannedDate: string;
    requiredTests: string[];
    specialInstructions?: string[];
  };
  clinicianNotes: Array<{
    timestamp: string;
    author: string;
    role: string;
    note: string;
    cosignedBy?: string;
  }>;
  aiSummary?: {
    keyPoints: string[];
    suggestedActions?: string[];
    predictiveAlerts?: string[];
  };
}

// Workflow State Management
export interface CDUWorkflowState {
  patient: PatientDemographics;
  diagnosis: OncologyDiagnosis;
  treatmentPlan: TreatmentPlan;
  currentAssessment: PreTreatmentAssessment;
  drugPreparation: DrugPreparation[];
  administration: AdministrationDetails[];
  monitoring: InfusionMonitoring;
  adverseEvents: AdverseEvent[];
  visitSummary: CDUVisitSummary;
  status: 'scheduled' | 'checked-in' | 'assessment' | 'preparation' | 'administration' | 'monitoring' | 'completed' | 'cancelled';
  lastUpdated: string;
  nextSteps: string[];
}
