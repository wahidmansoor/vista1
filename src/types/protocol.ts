// src/types/protocol.ts
import type { Medication } from './medications';

export interface SupportiveCareItem {
  name?: string;
  dose?: string;
  timing?: string;
  route?: string;
  purpose?: string;
}

export interface ContraindicationItem {
  condition?: string;
  severity?: string;
  management?: string;
}

export interface SpecialNote {
  title?: string;
  description?: string;
}

export interface Drug {
  name: string;
  dose: string;
  timing?: string;
  administration: string;
  alternative_switches?: string[];
  supportiveCare?: (string | SupportiveCareItem)[];
  contraindications?: (string | ContraindicationItem)[];
  special_notes?: (string | SpecialNote)[];
  details?: {
    dosing?: string;
    schedule?: string;
    supportiveCare?: string[];
    contraindications?: string[];
  };
}

export interface Protocol {
  id: string;
  code: string;
  title?: string; // For display purposes
  tumour_group: string;
  treatment_intent?: string;
  eligibility?: string[];
  treatment?: {
    drugs: Drug[];
    protocol?: string;
  };
  exclusions?: {
    criteria: string[];
  };
  tests?: {
    baseline: string[];
    monitoring: string[];
  };
  dose_modifications?: {
    hematological?: string[];
    nonHematological?: string[];
    renal?: string[];
    hepatic?: string[];
  };
  precautions?: string[];
  reference_list?: string[];

  // New fields
  pharmacokinetics?: Record<string, any>;
  interactions?: {
    drugs: string[];
    contraindications: string[];
    precautions: string[];
  };
  drug_class?: {
    name?: string;
    mechanism?: string;
    classification?: string;
  };
  administration_notes?: string[];
  supportive_care?: {
    required: string[];
    optional: string[];
    monitoring: string[];
  };
  toxicity_monitoring?: {
    parameters: string[];
    frequency: string;
    thresholds: Record<string, any>;
  };
  rescue_agents?: Array<{
    name: string;
    indication: string;
    dosing: string;
  }>;
  pre_medications?: {
    required: Drug[];
    optional: Drug[];
  };
  post_medications?: {
    required: Drug[];
    optional: Drug[];
  };
  monitoring?: {
    baseline: string[];
    ongoing: string[];
    frequency: string;
  };
  supportive_meds?: Drug[];
  ai_notes?: {
    recommendations: string[];
    warnings: string[];
    considerations: string[];
  };
  tags?: string[];

  comments?: string;
  summary?: string;
  created_by?: string;
  updated_by?: string;
  version?: string;
  clinical_scenario?: string;
  natural_language_prompt?: string;
  cycle_info?: string;
  dose_reductions?: {
    criteria: string[];
    levels: Record<string, any>;
  };

  created_at?: string;
  updated_at?: string;
  last_reviewed?: string;

  // UI helper fields
  count?: number; // For UI display of drug count
  drugs?: Drug[]; // Flattened array for UI convenience
}
