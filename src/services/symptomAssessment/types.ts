import type { EmergencyCondition } from '../emergency/types';
import type { TreatmentProtocol } from '../modules/cdu/treatmentProtocols/types';

export interface SymptomSeverity {
  level: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  score: number;
  requiresImmediate: boolean;
}

export interface Symptom {
  name: string;
  severity: SymptomSeverity;
  relatedToTreatment: boolean;
  possibleCauses: string[];
}

export interface SymptomTrend {
  symptom: string;
  trend: 'improving' | 'worsening' | 'stable' | 'fluctuating';
  timeFrame: string;
  dataPoints: Array<{
    date: string;
    severity: number;
  }>;
}

export interface ManagementRecommendation {
  action: string;
  priority: EmergencyCondition['severity'];
  rationale: string;
  evidenceLevel: 'high' | 'moderate' | 'low';
  reference?: string;
}

export interface SymptomAssessmentInput {
  patientId: string;
  symptoms: Array<{
    name: string;
    description: string;
    duration: string;
    severity: number;
    frequency: string;
  }>;
  currentTreatments?: TreatmentProtocol[];
  previousAssessments?: SymptomAssessmentResult[];
}

export interface EducationalResource {
  topic: string;
  url: string;
  type: 'article' | 'video' | 'infographic' | 'document' | 'interactive';
}

export interface SymptomAssessmentResult {
  timestamp: string;
  symptoms: Symptom[];
  trends: SymptomTrend[];
  recommendations: ManagementRecommendation[];
  requiresMedicalAttention: boolean;
  triageLevel: EmergencyCondition['severity'];
  educationalResources: EducationalResource[];
}
