// src/types/protocol.ts

// Shared interfaces
export interface EligibilityCriterion {
  criterion: string;
}

export interface ProtocolEligibility {
  inclusion_criteria: Array<string | EligibilityCriterion>;
  exclusion_criteria: Array<string | EligibilityCriterion>;
}

export interface Test {
  name: string;
  timing?: string;
  parameters?: string[];
  frequency?: string;
  [key: string]: any; // Allow additional fields for backward compatibility
}

export interface SupportiveCareItem {
  name: string;
  dose?: string;
  timing?: string;
  route?: string;
  purpose?: string;
}

export interface Drug {
  name: string;
  dose?: string;
  timing?: string;
  administration?: string;
  route?: string;
  alternative_switches?: string[];
  supportiveCare?: Array<string | SupportiveCareItem>;
  contraindications?: string[];
  special_notes?: string[];
  drug_class?: string;
}

export interface ProtocolDrug extends Drug {
  dose: string; // Required in protocol context
  supportiveCare?: string[];
}

export interface SupportiveCare {
  required: Array<string | SupportiveCareItem>;
  optional: Array<string | SupportiveCareItem>;
  monitoring: Array<string | Test>;
}

export interface RescueAgent {
  name: string;
  indication: string;
  dosing: string;
}

export interface DoseModification {
  criteria: string;
  drug_a_reduction?: string;
  drug_b_reduction?: string;
}

// Additional protocol types
export interface Eligibility {
  inclusion_criteria: string[];
  exclusion_criteria: string[];
}

export interface ToxicityMonitoring {
  parameters?: string[];
  frequency?: string;
  expected_toxicities?: string[];
  thresholds?: Record<string, string>;
}

export interface Monitoring {
  baseline: Test[];
  ongoing: Test[];
  frequency?: string;
  parameters?: string[];
}

export interface Interactions {
  drugs?: string[];
  contraindications?: string[];
  precautions?: string[];
}

export interface Medications {
  required: Array<string | Drug>;
  optional: Array<string | Drug>;
}

export interface DrugClass {
  name: string;
  mechanism?: string;
  classification?: string;
}

export interface TreatmentInfo {
  drugs: ProtocolDrug[];
  intent?: string;
  route?: string;
  schedule?: string;
  cycle_length?: string;
  total_cycles?: number;
  notes?: string[];
  protocol?: string;
}

// Main Protocol interface
export interface Protocol {
  // Core fields (required)
  id: string;
  code: string;
  name: string;
  tumour_group: string;
  version?: string;
  last_reviewed?: string;
  
  // Treatment data
  treatment: {
    drugs: ProtocolDrug[];
    intent?: string;
    route?: string;
    schedule?: string;
    cycle_length?: string;
    total_cycles?: number;
    notes?: string[];
    protocol?: string;
  };
  treatment_intent?: string;
  
  // Clinical criteria and modifications
  eligibility?: ProtocolEligibility;
  tests?: {
    baseline?: Test[] | string[];
    monitoring?: Test[] | string[];
  } | Test[];
  dose_modifications?: {
    hematological: DoseModification[];
    nonHematological: DoseModification[];
    renal: DoseModification[];
    hepatic: DoseModification[];
  };
  
  // Medications and supportive care
  supportive_care?: SupportiveCare;
  rescue_agents?: RescueAgent[];
  pre_medications?: {
    required: Array<string | Drug>;
    optional: Array<string | Drug>;
  };
  post_medications?: {
    required: Array<string | Drug>;
    optional: Array<string | Drug>;
  };
  supportive_meds?: Array<SupportiveCareItem>;
  
  // Safety and monitoring
  toxicity_monitoring?: {
    parameters?: string[];
    frequency?: string;
    expected_toxicities?: string[];
    thresholds?: Record<string, string>;
  };
  
  // Additional metadata and notes
  summary?: string;
  cycle_info?: string | {
    duration: string;
    total_cycles?: number;
    notes?: string[];
  };
  precautions?: Array<{ note: string }>;
  special_precautions?: string[];
  references?: string[];
  reference_list?: string[];
  administration_notes?: string[];
  black_box_warning?: string;

  // AI insights
  ai_notes?: {
    recommendations?: string[];
    warnings?: string[];
  };
  
  // Optional metadata
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  drug_class?: {
    name?: string;
    mechanism?: string;
    classification?: string;
  };
  pharmacokinetics?: Record<string, any>;
  interactions?: {
    drugs?: string[];
    contraindications?: string[];
    precautions?: string[];
  };
}
