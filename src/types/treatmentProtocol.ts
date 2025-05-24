// Universal safe JSON parse helper
export function safeJsonParse<T>(data: string, fallback: T): T {
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
}

// Protocol type aligned with Supabase schema
export interface Drug {
  id?: string;
  name: string;
  dose?: string;
  timing?: string;
  administration?: string;
  drug_class?: string; // Use drug_class instead of class
  alternative_switches?: string[];
  supportiveCare?: string[];
  [key: string]: any; // For any extra fields
}

export interface Medication {
  id?: string;
  name: string;
  standard_dose?: string;
  timing?: string;
  category?: string;
  [key: string]: any;
}

export interface Eligibility {
  inclusion_criteria?: string[];
  exclusion_criteria?: string[];
  [key: string]: any;
}

export interface Monitoring {
  baseline?: string[];
  ongoing?: string[];
  [key: string]: any;
}

export interface Protocol {
  id: string;
  code: string;
  tumour_group?: string;
  treatment_intent?: string;
  treatment?: {
    drugs?: Drug[];
    [key: string]: any;
  } | string | null;
  eligibility?: Eligibility | string | null;
  monitoring?: Monitoring | string | null;
  precautions?: string[] | string | null;
  supportive_care?: string[] | string | null;
  toxicity_monitoring?: any;
  interactions?: {
    contraindications?: string[];
    [key: string]: any;
  };
  pre_medications?: string[] | string | null;
  post_medications?: string[] | string | null;
  cycle_info?: string;
  updated_at?: string;
  version?: string;
  [key: string]: any;
}

// TODO: If Supabase schema changes, update types accordingly.