import type { TriageLevel } from '../drugInteractions/types';

export interface LabPanel {
  id: string;
  name: string;
  category: 'basic' | 'comprehensive' | 'cancer' | 'therapeutic' | 'specialized';
  results: LabResult[];
  timestamp: string;
  orderingProvider: string;
  facility: string;
}

export interface LabResult {
  id: string;
  testName: string;
  value: number;
  unit: LabValueUnit;
  timestamp: string;
  labId: string;
  isAbnormal: boolean;
  isCritical: boolean;
  referenceRange: ReferenceRange;
  criticalLevel: 'low' | 'normal' | 'high' | 'critical';
  requiredActions: string[];
}

export interface ReferenceRange {
  low: number;
  high: number;
  unit: LabValueUnit;
  ageMin?: number;
  ageMax?: number;
  gender?: 'male' | 'female';
  condition?: string;
  pregnancy?: boolean;
}

export interface TrendAnalysis {
  testName: string;
  trend: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  timeSpan: string;
  percentChange: number;
  dataPoints: Array<{
    value: number;
    timestamp: string;
    isAbnormal: boolean;
  }>;
  clinicalSignificance: string;
}

export interface CancerMarkerAnalysis {
  markerName: string;
  currentValue: number;
  unit: LabValueUnit;
  trend: TrendAnalysis;
  interpretation: string;
  suggestedFollowUp: string;
  monitoringFrequency: string;
  relatedDiagnosis?: string;
}

export interface TherapeuticDrugLevel {
  drugName: string;
  value: number;
  unit: LabValueUnit;
  therapeuticRange: ReferenceRange;
  interpretation: string;
  doseAdjustmentNeeded: boolean;
  nextMonitoringDate: string;
  recommendations: string[];
}

export interface LabValueInfo {
  testName: string;
  value: number;
  unit: LabValueUnit;
  timestamp: string;
  criticalLevel: 'low' | 'normal' | 'high' | 'critical';
  recommendations: string[];
  requiredActions: string[];
}

export type LabValueUnit = 'mg/dL' | 'mmol/L' | 'g/dL' | 'U/L' | 'ng/mL' | '%' | 'cells/μL';

export interface LabInterpretation {
  panel: LabPanel;
  trends: TrendAnalysis[];
  criticalValues: LabValueInfo[];
  cancerMarkers?: CancerMarkerAnalysis[];
  therapeuticLevels?: TherapeuticDrugLevel[];
  recommendations: Array<{
    category: 'follow-up' | 'urgent' | 'monitoring' | 'medication';
    description: string;
    priority: TriageLevel;
    timeframe: string;
  }>;
  patientEducation: Array<{
    topic: string;
    explanation: string;
    actionItems: string[];
    resources: Array<{
      title: string;
      url: string;
      type: 'article' | 'video' | 'infographic';
    }>;
  }>;
  timestamp: string;
}

export interface PatientFactors {
  age: number;
  gender: 'male' | 'female';
  weight?: number;
  height?: number;
  conditions: string[];
  medications: string[];
  isPregnant?: boolean;
  gfr?: number;
  previousPanels?: LabPanel[];
}

export interface LabAssessmentInput {
  type: 'LAB_INTERPRETATION';
  panelId: string;
  timestamp: string;
}

export interface LabAssessmentResult {
  type: 'LAB_INTERPRETATION';
  panelId: string;
  timestamp: string;
  hasCriticalValues: boolean;
}

export interface PatientContext {
  age: number;
  gender: 'male' | 'female';
  medicalHistory: string[];
  previousLabs?: LabPanel[];
}

export interface LabInterpretationOptions {
  includeTrends: boolean;
  includeCriticalValues: boolean;
  includeCancerMarkers: boolean;
  includeTherapeuticLevels: boolean;
  includePatientEducation: boolean;
  languageLevel: string;
  urgentNotificationThreshold: string;
}

export interface CriticalValue {
  testName: string;
  value: number;
  unit: LabValueUnit;
  isCritical: boolean;
  requiresEmergencyCare: boolean;
  urgencyLevel: 'urgent' | 'immediate' | 'routine';
  timestamp: string;
  recommendations: string[];
  requiredActions: string[];
  criticalLevel: 'low' | 'normal' | 'high' | 'critical';
}
