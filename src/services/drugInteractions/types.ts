import type { LabValueUnit } from '../labInterpretation/types';

export type DrugInteractionSeverity = 'Minor' | 'Moderate' | 'Major' | 'Contraindicated';
export type TriageLevel = 'immediate' | 'urgent' | 'routine';

export interface DrugInfo {
  id: string;
  name: string;
  genericName: string;
  drugClass: string;
  isChemotherapy: boolean;
  isTargetedTherapy: boolean;
  isImmunoTherapy: boolean;
  isSupportiveCare: boolean;
}

export interface DrugInteractionEffect {
  severity: DrugInteractionSeverity;
  description: string;
  mechanism: string;
  onset?: string;
  duration?: string;
  requiresPharmacistConsult: boolean;
  requiresPhysicianConsult: boolean;
  recommendedActions: string[];
}

export interface DrugInteraction {
  drug1: DrugInfo;
  drug2: DrugInfo;
  effects: DrugInteractionEffect[];
  evidenceLevel: 'high' | 'moderate' | 'low';
  reference?: string;
}

export interface DrugAssessmentResult {
  timestamp: string;
  symptoms: Array<{
    name: string;
    severity: {
      level: 'mild' | 'moderate' | 'severe' | 'life-threatening';
      score: number;
      requiresImmediate: boolean;
    };
    relatedToTreatment: boolean;
    possibleCauses: string[];
  }>;
  trends: Array<{
    parameter: string;
    values: Array<{ date: string; value: number }>;
    trend: 'increasing' | 'decreasing' | 'stable';
  }>;
  recommendations: string[];
  requiresMedicalAttention: boolean;
  triageLevel: TriageLevel;
  educationalResources: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  medications: Array<{
    name: string;
    interactions: Array<{
      withDrug: string;
      severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
      description: string;
      mechanism: string;
    }>;
  }>;
}

export interface DoseAdjustment {
  drugId: string;
  drugName: string;
  originalDose: string;
  adjustedDose: string;
  reason: string;
  recommendations: string[];
}

export interface DrugInteractionAnalysis {
  interactions: DrugInteraction[];
  patientSpecificWarnings: string[];
  doseAdjustments: DoseAdjustment[];
  consultationRequired: boolean;
  adherenceRecommendations: string[];
  educationPoints: string[];
  overallRiskLevel: DrugInteractionSeverity;
  timestamp: string;
}

export interface DrugInteractionHandlerOptions {
  enableLocalDatabase: boolean;
  includePatientFactors: boolean;
  checkFoodInteractions: boolean;
  checkSupplementInteractions: boolean;
  includeEducationPoints: boolean;
  confidenceThreshold: number;
  safetySystemEnabled: boolean;
}

export interface PatientFactors {
  age: number;
  weight: number;
  height: number;
  gfr: number;
  hepaticFunction: 'Normal' | 'Mild' | 'Moderate' | 'Severe';
}
