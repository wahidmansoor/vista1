// src/types/protocol.ts

// Supporting interfaces for nested structures
export interface Test {
  name: string;
  timing?: string;
  parameters?: string[];
  frequency?: string;
  [key: string]: any;
}

export interface SupportiveCareItem {
  name?: string;
  dose?: string;
  timing?: string;
  route?: string;
  purpose?: string;
  indication?: string; // For backward compatibility
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
  drug_class?: string; // Added for compatibility
}

export interface DoseModification {
  hematological?: string[];
  nonHematological?: string[];
  renal?: string[];
  hepatic?: string[];
}

export interface ToxicityMonitoring {
  parameters?: string[];
  frequency?: string;
  expected_toxicities?: string[];
  thresholds?: Record<string, string>;
  monitoring_parameters?: string;
  frequency_details?: string;
  thresholds_for_action?: Record<string, string>;
}

export interface DrugClass {
  name?: string;
  mechanism?: string;
  classification?: string;
}

export interface SupportiveCare {
  required?: Array<SupportiveCareItem>;
  optional?: Array<SupportiveCareItem>;
  guidelines?: string[];
}

export interface Medications {
  required: Drug[];
  optional: Drug[];
}

export interface Monitoring {
  baseline: string[];
  ongoing: string[];
  frequency?: string;
}

export interface AIInsights {
  recommendations: string[];
  warnings: string[];
}

export interface DoseReductions {
  levels?: Record<string, string>;
  criteria?: string[];
}

export interface Eligibility {
  inclusion_criteria: string[];
  exclusion_criteria: string[];
}

export interface RescueAgent {
  name: string;
  indication: string;
  dosing: string;
}

export interface Interactions {
  drugs?: string[];
  contraindications?: string[];
  precautions?: string[];
  drugs_to_avoid?: string[];
  precautions_with_other_drugs?: string[];
}

// Protocol note structure for precautions and similar fields
export interface ProtocolNote {
  note: string;
}

// Overview structure that groups protocol metadata
export interface ProtocolOverview {
  treatment_intent?: string;
  version?: string;
  last_reviewed?: string;
  summary?: string;
  cycle_info?: string;
  clinical_scenario?: string;
  status?: string;
}

// Eligibility structure with inclusion/exclusion criteria as objects
export interface ProtocolEligibility {
  inclusion_criteria?: Array<{ criterion: string } | string>;
  exclusion_criteria?: Array<{ criterion: string } | string>;
}

// Drug structure for use in Protocol.treatment
export interface ProtocolDrug {
  name: string;
  dose: string;
  administration: string;
  special_notes: string[];
  supportiveCare?: string[];
  route?: string;
  timing?: string;
  contraindications?: string[];
  purpose?: string;
}

// Base Protocol interface matching database schema
export interface Protocol {
  // Required fields
  id: string;
  code: string;
  tumour_group: string;

  // Optional fields
  author?: string;
  next_review_date?: string;
  emergency_procedures?: string[];
  supportive_guidelines?: string[];
  treatment_intent?: string;
  notes?: any[];
  eligibility?: ProtocolEligibility;
  overview?: ProtocolOverview;
  treatment?: {
    drugs: ProtocolDrug[];
    cycle_length?: string;
    total_cycles?: string;
    intent?: string;
    route?: string;
    schedule?: string;
    notes?: string[];
  };
  tests?: {
    baseline?: Test[] | string[];
    monitoring?: Test[] | string[];
    frequency?: string;
  } | Test[];
  status?: string;
  dose_modifications?: DoseModification;
  precautions: ProtocolNote[];
  contraindications?: string | any[];
  reference_list?: string[];
  created_at?: string;
  updated_at?: string;
  pharmacokinetics?: Record<string, unknown>;
  interactions?: Interactions;
  drug_class?: DrugClass;
  administration_notes?: string[];
  supportive_care?: SupportiveCare;
  toxicity_monitoring?: ToxicityMonitoring;
  rescue_agents?: RescueAgent[];
  pre_medications?: Medications; // Previously named premedication
  post_medications?: Medications;
  monitoring?: any; // <-- Ensure this is present and type is any for flexibility
  comments?: string;
  created_by?: string;
  updated_by?: string;
  version?: string;
  tags?: string[];
  clinical_scenario?: string;
  last_reviewed?: string;
  summary?: string;
  ai_notes?: AIInsights;
  natural_language_prompt?: string;
  supportive_meds?: Drug[];
  cycle_info?: string;
  dose_reductions?: DoseReductions;
}

// Type guard to check if a record matches the Protocol interface
export const isProtocol = (value: unknown): value is Protocol => {
  const protocol = value as Protocol;
  return (
    typeof protocol === 'object' &&
    protocol !== null &&
    typeof protocol.id === 'string' &&
    typeof protocol.code === 'string' &&
    typeof protocol.tumour_group === 'string' &&
    (protocol.treatment === undefined || 
      (typeof protocol.treatment === 'object' &&
        protocol.treatment !== null &&
        Array.isArray(protocol.treatment.drugs)))
  );
};

// Additional utility functions
export const isValidProtocolStructure = (protocol: any): boolean => {
  return (
    protocol &&
    typeof protocol === 'object' &&
    typeof protocol.code === 'string' &&
    typeof protocol.tumour_group === 'string' &&
    protocol.treatment &&
    Array.isArray(protocol.treatment.drugs)
  );
};

export const isValidDrugList = (drugs: any): drugs is Drug[] => {
  return (
    Array.isArray(drugs) && 
    drugs.every(drug => 
      drug && 
      typeof drug === 'object' && 
      typeof drug.name === 'string'
    )
  );
};

export function safeJsonParse<T>(data: string, fallback: T): T {
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

export interface RegimenGroup {
  groupName: string;
  protocols: Protocol[];
}

export interface Medication {
  id?: string;
  name: string;
  standard_dose?: string;
  timing?: string;
  category?: string;
  [key: string]: any;
}
