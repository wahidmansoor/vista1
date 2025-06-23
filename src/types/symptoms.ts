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