import type { DrugInfo } from '../../../services/drugInteractions/types';

export interface TreatmentProtocol {
  id: string;
  name: string;
  type: 'chemotherapy' | 'immunotherapy' | 'targeted' | 'supportive';
  status: 'active' | 'completed' | 'discontinued' | 'planned';
  startDate: string;
  endDate?: string;
  cycles?: number;
  currentCycle?: number;
  drugs: DrugInfo[];
  commonSideEffects: Array<{
    symptom: string;
    severity: string;
    frequency: string;
    management: string[];
  }>;
  contraindications: string[];
  requiresMonitoring: boolean;
  monitoringParameters?: Array<{
    parameter: string;
    frequency: string;
    threshold: string;
    action: string;
  }>;
  supportiveCare?: Array<{
    category: string;
    recommendations: string[];
    timing: string;
  }>;
  patientInstructions?: string[];
  references?: Array<{
    title: string;
    url: string;
    type: 'guideline' | 'study' | 'resource';
  }>;
}

export interface ProtocolAdjustment {
  protocolId: string;
  adjustmentType: 'dose' | 'frequency' | 'duration' | 'discontinuation';
  reason: string;
  details: Record<string, unknown>;
  recommendedBy?: string;
  approvedBy?: string;
  timestamp: string;
}

export interface ProtocolCompliance {
  protocolId: string;
  adherenceScore: number; // 0-100
  missedDoses: number;
  delayedDoses: number;
  sideEffectsReported: boolean;
  requiresIntervention: boolean;
  recommendations: string[];
}

export interface ProtocolSearchCriteria {
  type?: TreatmentProtocol['type'];
  status?: TreatmentProtocol['status'];
  drugName?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface ProtocolValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}
