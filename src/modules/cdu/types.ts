export interface Medication {
  id: string;
  name: string;
  brand_names: string[];
  classification: string;
  mechanism: string;
  administration: string;
  is_premedication?: boolean;
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
  reference_sources?: string[];
  additional_info?: {
    warnings?: string[];
    special_populations?: string[];
    storage?: string;
    cost_considerations?: string;
  };
  created_at: string;
  updated_at: string;
}

export type SortField = 'name' | 'classification' | 'updated_at';
export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  order: SortOrder;
}
