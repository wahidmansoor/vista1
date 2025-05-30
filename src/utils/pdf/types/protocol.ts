// This is a simplified version of the Protocol interface to fix TypeScript errors

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

export interface ProtocolNote {
  note: string;
}

export interface ProtocolDrug {
  name: string;
  dose: string;
  administration: string;
  special_notes: string[];
  supportiveCare?: string[];
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

export interface SupportiveCare {
  required: Drug[];
  optional: Drug[];
  monitoring: string[];
}

export interface Medications {
  required: Drug[];
  optional: Drug[];
}

export interface AIInsights {
  recommendations: string[];
  warnings: string[];
}

export interface Protocol {
  id: string;
  code: string;
  tumour_group: string;
  treatment_intent?: string;
  treatment?: {
    drugs: ProtocolDrug[];
  };
  tests?: {
    baseline?: Test[] | string[];
    monitoring?: Test[] | string[];
  } | Test[];
  precautions: ProtocolNote[];
  supportive_care?: SupportiveCare;
  toxicity_monitoring?: ToxicityMonitoring;
  pre_medications?: Medications;
  post_medications?: Medications;
  ai_notes?: AIInsights;
  [key: string]: any;  // Allow any other properties
}
