export interface SideEffect {
  name: string;
  severity?: 'mild' | 'moderate' | 'severe';
  description?: string;
  management?: string[];
}

export interface Medication {
  id: string;
  name: string;
  brand_names: string[];
  classification: string;
  mechanism: string;
  administration: string;
  indications: {
    cancer_types: string[];
    staging?: string[];
    biomarkers?: string[];
    line_of_therapy?: string[];
  };
  dosing: {
    standard: string;
    adjustments?: string[];
    schedule?: string;
    cycle_length?: string;
    duration?: string;
  };
  side_effects: {
    common: string[];
    severe: string[];
    monitoring: string[];
    management?: string[];
  };
  monitoring: {
    baseline: string[];
    ongoing: string[];
    frequency?: string;
    parameters?: string[];
  };
  interactions: {
    drugs: string[];
    contraindications: string[];
    precautions?: string[];
  };
  special_considerations?: {
    pregnancy?: string;
    elderly?: string;
    renal?: string;
    hepatic?: string;
    other?: string[];
  };
  pharmacokinetics?: {
    half_life?: string;
    metabolism?: string;
    excretion?: string;
    bioavailability?: string;
    protein_binding?: string;
  };
  reference_sources: string[];
  routine_monitoring?: string[];
  pre_treatment_tests?: string[];
  summary?: string;
  black_box_warning?: string;
  is_premedication?: boolean;
  is_chemotherapy?: boolean;
  is_immunotherapy?: boolean;
  is_targeted_therapy?: boolean;
  is_orphan_drug?: boolean;
  created_at: string;
  updated_at: string;
}

// Type aliases for backward compatibility
export type Premedication = Medication;
export type PredicatedPremedication = Medication;