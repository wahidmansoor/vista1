// src/types/protocol.ts

// Supporting interfaces for nested structures
export interface SupportiveCareItem {
  name?: string;
  description?: string;
  dose?: string;
  timing?: string;
  route?: string;
  category?: string;
}

export interface Drug {
  name: string;
  dose?: string;
  route?: string;
  timing?: string;
  frequency?: string;
  duration?: string;
  administration_notes?: string;
  administration?: string;
  infusion_time?: string;
  special_notes?: string[];
}

export interface DoseModification {
  condition?: string;
  modification?: string;
  threshold?: string;
}

export interface Test {
  test?: string;
  purpose?: string;
  frequency?: string;
}

export interface CycleInfo {
  duration?: string;
  totalCycles?: number;
  schedule?: string;
}

export interface Medication {
  id?: string;
  name: string;
  dose?: string;
  route?: string;
  timing?: string;
  notes?: string;
  category?: string;
  standard_dose?: string;
}

export interface PreMedication {
  required?: Medication[];
  optional?: Medication[];
}

export interface PostMedication {
  required?: Medication[];
  optional?: Medication[];
}

export interface SupportiveCare {
  required?: SupportiveCareItem[];
  optional?: SupportiveCareItem[];
  monitoring?: SupportiveCareItem[];
}

export interface RescueAgent {
  name?: string;
  indication?: string;
  dosing?: string;
}

export interface MonitoringItem {
  parameter?: string;
  frequency?: string;
  threshold?: string;
}

export interface ToxicityMonitoring {
  expected_toxicities?: string[];
  monitoring_parameters?: string;
  frequency_details?: string;
  thresholds_for_action?: Record<string, string>;
}

export interface Interactions {
  drugs_to_avoid?: string[];
  contraindications?: string[];
  precautions_with_other_drugs?: string[];
}

export interface Eligibility {
  inclusion_criteria?: string[];
  exclusion_criteria?: string[];
}

// Base Protocol interface matching database schema
export interface Protocol {
  // Required fields
  id: string;
  code: string;
  tumour_group: string;
  tumour_supergroup?: string;

  // Optional fields
  treatment_intent?: string;
  summary?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  last_reviewed?: string;
 version?: string;
  created_by?: string;
  updated_by?: string;
  name?: string;
  tags?: string[];
  supportive_meds?: SupportiveCare;

  // JSONB fields
  treatment?: {
    drugs: Drug[];
    protocol?: string;
  };
  eligibility?: Eligibility | string[];
  precautions?: string[];
  tests?: {
    baseline: Test[];
    monitoring: Test[];
  } | string[];
  dose_modifications?: {
    hematological?: DoseModification[];
    nonHematological?: DoseModification[];
    renal?: DoseModification[];
    hepatic?: DoseModification[];
  };
  reference_list?: string[];
  cycle_info?: string[] | CycleInfo;
  pre_medications?: Medication[] | PreMedication;
  post_medications?: Medication[] | PostMedication;
  supportive_care?: SupportiveCareItem[] | SupportiveCare;
  rescue_agents?: RescueAgent[];
  monitoring?: {
    baseline: MonitoringItem[];
    ongoing: MonitoringItem[];
    frequency?: string;
  };
  toxicity_monitoring?: ToxicityMonitoring;
  interactions?: Interactions;
    // Additional properties for AI and dose modifications
  natural_language_prompt?: string;
  dose_reductions?: DoseModification[];
  administration?: string;
  contraindications?: string[];
  protocol_version?: string;
  approval_date?: string;
  review_date?: string;
  approved_by?: string;
  emesis_risk?: string;
  cycle_duration?: string;
  total_cycles?: number;
  ai_notes?: any;
}

/**
 * Helper function to safely parse JSON fields
 */
export const parseJsonSafe = <T>(value: unknown, fieldName: string, defaultValue?: T): T | null => {
  if (value === null || value === undefined) return defaultValue ?? null;
  
  if (typeof value === 'object') return value as T;
  
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch (e) {
      console.warn(`Error parsing ${fieldName} as JSON:`, e);
      return defaultValue ?? null;
    }
  }
  
  return defaultValue ?? null;
};

/**
 * Clean and normalize a raw protocol object from Supabase
 */
export const cleanProtocol = (raw: any): Protocol | null => {
  if (!raw || typeof raw !== 'object') return null;
  
  // Create base protocol with required fields
  const cleaned: Protocol = {
    id: raw.id ?? '',
    code: raw.code ?? '',
    tumour_group: raw.tumour_group ?? '',
    tumour_supergroup: raw.tumour_supergroup ?? '',
    name: raw.name ?? raw.code ?? '',
    
    // Optional fields with default values
    treatment_intent: raw.treatment_intent ?? '',
    summary: raw.summary ?? '',
    status: raw.status ?? 'active',
    created_at: raw.created_at ? new Date(raw.created_at).toISOString() : undefined,
    updated_at: raw.updated_at ? new Date(raw.updated_at).toISOString() : undefined,
    
    // JSONB fields with safe parsing
    eligibility: parseJsonSafe(raw.eligibility, 'eligibility') ?? { inclusion_criteria: [], exclusion_criteria: [] },
    treatment: parseJsonSafe(raw.treatment, 'treatment') ?? { drugs: [] },
    tests: parseJsonSafe(raw.tests, 'tests') ?? { baseline: [], monitoring: [] },
    dose_modifications: parseJsonSafe(raw.dose_modifications, 'dose_modifications') ?? {
      hematological: [],
      nonHematological: [],
      renal: [],
      hepatic: []
    },
    precautions: parseJsonSafe(raw.precautions, 'precautions') ?? [],
    reference_list: parseJsonSafe(raw.reference_list, 'reference_list') ?? [],
    cycle_info: parseJsonSafe(raw.cycle_info, 'cycle_info') ?? {},
    pre_medications: parseJsonSafe(raw.pre_medications, 'pre_medications') ?? [],
    post_medications: parseJsonSafe(raw.post_medications, 'post_medications') ?? [],
    supportive_care: parseJsonSafe(raw.supportive_care, 'supportive_care') ?? { required: [], optional: [], monitoring: [] },
    rescue_agents: parseJsonSafe(raw.rescue_agents, 'rescue_agents') ?? [],
    monitoring: parseJsonSafe(raw.monitoring, 'monitoring') ?? { baseline: [], ongoing: [] },
    toxicity_monitoring: parseJsonSafe(raw.toxicity_monitoring, 'toxicity_monitoring') ?? { 
      expected_toxicities: [], 
      monitoring_parameters: '',
      frequency_details: '',
      thresholds_for_action: {} 
    },
    interactions: parseJsonSafe(raw.interactions, 'interactions') ?? { 
      drugs_to_avoid: [],
      contraindications: [],
      precautions_with_other_drugs: []
    },
    contraindications: parseJsonSafe(raw.contraindications, 'contraindications') ?? [],
    version: raw.version ?? '',
    protocol_version: raw.protocol_version ?? '',
    approval_date: raw.approval_date ?? '',
    review_date: raw.review_date ?? '',
    approved_by: raw.approved_by ?? '',
    emesis_risk: raw.emesis_risk ?? '',
    cycle_duration: raw.cycle_duration ?? '',
    total_cycles: raw.total_cycles ?? undefined,
    ai_notes: parseJsonSafe(raw.ai_notes, 'ai_notes') ?? {},
    created_by: raw.created_by ?? '',
    updated_by: raw.updated_by ?? '',
    last_reviewed: raw.last_reviewed ? new Date(raw.last_reviewed).toISOString() : undefined
  };

  // Ensure nested structures like treatment.drugs are arrays
  if (cleaned.treatment && !Array.isArray(cleaned.treatment.drugs)) {
    cleaned.treatment.drugs = [];
  }
  // Add or update the cleanProtocol function to include proper pre_medication parsing
  if (cleaned.pre_medications) {
    if (typeof cleaned.pre_medications === 'string') {
      try {
        cleaned.pre_medications = JSON.parse(cleaned.pre_medications);
      } catch (e) {
        console.warn('Could not parse pre_medications:', e);
      }
    } else if (Array.isArray(cleaned.pre_medications)) {
      cleaned.pre_medications = cleaned.pre_medications.map((item: any) =>
        typeof item === 'string' ? { name: item } : item
      );
    }
  }
  
  return cleaned;
};

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

// Universal safe JSON parse helper
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
