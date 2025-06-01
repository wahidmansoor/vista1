export interface Medication {
  id: string;
  name: string;
  brand_names: string[];
  classification: string;
  mechanism: string;
  administration: string;
  indications: {
    cancer_types: string[];
    [key: string]: any;
  };
  dosing: {
    standard: string;
    adjustments?: string[];
    [key: string]: any;
  };
  side_effects: string[];
  monitoring: {
    labs: string[];
    frequency: string;
    precautions: string[];
    [key: string]: any;
  };
  interactions: string[];
  search_vector?: any; // tsvector from PostgreSQL
  created_at: string;
  updated_at: string;
  reference_sources: string[];
  summary?: string;
  black_box_warning?: string;
  special_considerations?: string;
  pharmacokinetics?: string | {
    half_life?: string;
    metabolism?: string;
    excretion?: string;
    bioavailability?: string;
    protein_binding?: string;
    [key: string]: string | undefined;
  };
  contraindications?: string[];
  routine_monitoring?: string[];
  pre_treatment_tests?: string[];
  is_chemotherapy?: boolean;
  is_immunotherapy?: boolean;
  is_targeted_therapy?: boolean;
  is_orphan_drug?: boolean;
}

// Type alias for backward compatibility
export type Premedication = Medication;
export type PredicatedPremedication = Medication;
