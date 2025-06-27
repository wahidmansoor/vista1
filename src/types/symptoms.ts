export type Severity = 'mild' | 'moderate' | 'severe';

export interface Intervention {
  id: string;
  name: string;
  type: 'pharmacological' | 'nonPharmacological';
  description?: string;
  dosing?: string;
}

export interface SymptomTemplate {
  id: string;
  name: string;
  description?: string;
  interventions?: {
    pharmacological: Intervention[];
    nonPharmacological: Intervention[];
  };
}

export interface Symptom extends SymptomTemplate {
  severity: Severity;
  onset: string;
  notes: string;
  interventions: {
    pharmacological: Intervention[];
    nonPharmacological: Intervention[];
  };
  suggestedInterventions: {
    pharmacological: Intervention[];
    nonPharmacological: Intervention[];
  };
}

// Removed EnhancedSymptom, InterventionOutcome, and SymptomMonitor interfaces

export interface SymptomScale {
  scaleType: 'numeric' | 'visual-analog' | 'faces' | 'categorical';
  range: { min: number; max: number };
  descriptors: string[];
  visualElements?: React.ComponentType;
}

// --- Supporting Types for EnhancedSymptom and Related Interfaces ---

export interface SymptomAssessment {
  date: Date;
  scale: SymptomScale;
  score: number;
  notes?: string;
}

export interface InterventionRecord {
  intervention: Intervention;
  outcome: InterventionOutcome;
  dateStarted: Date;
  dateEnded?: Date;
  notes?: string;
}

export interface QualityOfLifeImpact {
  domains: string[]; // e.g., ['mobility', 'sleep', 'mood']
  impactScore: number; // 0-10
  notes?: string;
}

export interface CareNote {
  author: string;
  date: Date;
  note: string;
}

export interface PatientGoal {
  goal: string;
  achieved: boolean;
  dateSet: Date;
  dateAchieved?: Date;
}

export interface AlertThreshold {
  symptom: string;
  threshold: number;
  direction: 'above' | 'below';
  action: string;
}

export interface SideEffect {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

export interface EscalationRule {
  trigger: string;
  action: string;
  notify: string[];
}

export interface NotificationConfig {
  enabled: boolean;
  methods: ('email' | 'sms' | 'inApp')[];
  recipients: string[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}export type Severity = 'mild' | 'moderate' | 'severe';

export interface Intervention {
  id: string;
  name: string;
  type: 'pharmacological' | 'nonPharmacological';
  description?: string;
  dosing?: string;
}

export interface SymptomTemplate {
  id: string;
  name: string;
  description?: string;
  interventions?: {
    pharmacological: Intervention[];
    nonPharmacological: Intervention[];
  };
}

export interface Symptom extends SymptomTemplate {
  severity: Severity;
  onset: string;
  notes: string;
  interventions: {
    pharmacological: Intervention[];
    nonPharmacological: Intervention[];
  };
  suggestedInterventions: {
    pharmacological: Intervention[];
    nonPharmacological: Intervention[];
  };
}