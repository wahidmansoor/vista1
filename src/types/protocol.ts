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
  hematological: string[];
  nonHematological: string[];
  renal: string[];
  hepatic: string[];
}

export interface ToxicityMonitoring {
  parameters: string[];
  frequency: string;
  expected_toxicities?: string[];
  thresholds: Record<string, string>;
}

export interface DrugClass {
  name?: string;
  mechanism?: string;
  classification?: string;
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
  levels: Record<string, any>;
  criteria: string[];
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
  drugs: string[];
  contraindications: string[];
  precautions: string[];
}

// Protocol note structure for precautions and similar fields
export interface ProtocolNote {
  note: string;
}

// Eligibility structure with inclusion/exclusion criteria as objects
export interface ProtocolEligibility {
  inclusion_criteria?: Array<{ criterion: string }>;
  exclusion_criteria?: Array<{ criterion: string }>;
}

// Drug structure for use in Protocol.treatment
export interface ProtocolDrug {
  name: string;
  dose: string;
  administration: string;
  special_notes: string[];
  supportiveCare?: string[];
}

// Base Protocol interface matching database schema
export interface Protocol {
  // Required fields
  id: string;
  code: string;
  tumour_group: string;

  // Optional fields
  treatment_intent?: string;
  notes?: any[];
  eligibility?: ProtocolEligibility;
  treatment?: {
    drugs: ProtocolDrug[];
  };
  tests?: {
    baseline?: Test[];
    monitoring?: Test[];
  };
  status?: string;
  dose_modifications?: DoseModification;
  precautions: ProtocolNote[];
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
  pre_medications?: Medications;
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

const ensureStringArray = (value: any): string[] => {
  if (Array.isArray(value)) {
    return value.filter(v => typeof v === 'string');
  }
  if (typeof value === 'string') {
    if (value.trim() === '') return []; // Handle empty string explicitly
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter(v => typeof v === 'string');
      } else {
        // JSON.parse succeeded but it's not an array (e.g., a stringified object)
        // console.warn(`[ensureStringArray] Parsed string "${value}" was a valid JSON but not an array. Returning empty array.`);
        return []; // Return empty array if parsed JSON is not an array
      }
    } catch {
      // If JSON.parse fails, treat as a plain string to be split
      return value
        .split(/[\\n•;-]/) // split on newline, bullets, semi-colons, hyphens
        .map(s => s.trim())
        .filter(Boolean);
    }
  }
  return []; // Default for other types (null, undefined, number, boolean, etc.)
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

/**
 * Clean and normalize a raw protocol object from Supabase
 * Ensures all fields match expected types and provides safe defaults
 */
export const cleanProtocol = (raw: any): Protocol | null => {
  if (!raw || typeof raw !== 'object') {
    console.error('[cleanProtocol] Invalid protocol data: not an object. Received:', raw);
    return null;
  }

  try {
    // Helper functions for safe parsing
    const safeString = (value: unknown): string => {
      if (value === null || value === undefined) return '';
      return String(value);
    };

    const safeOptionalString = (value: unknown): string | undefined => {
      if (value === null || value === undefined) return undefined;
      return String(value);
    };

    const safeJSONParse = <T>(value: unknown, defaultValue: T): T => {
      if (value === null || value === undefined) {
        return defaultValue;
      }
      
      if (typeof value === 'object') {
        return value as T;
      }
      
      if (typeof value === 'string') {
        try {
          return JSON.parse(value) as T;
        } catch (e) {
          console.warn('Failed to parse JSON string:', value);
          return defaultValue;
        }
      }
      
      return defaultValue;
    };

    // Process drug objects to ensure consistent structure
    const processDrugs = (drugInput: unknown): Drug[] => {
      if (!Array.isArray(drugInput)) {
        // console.warn('Invalid drugs format for processDrugs, expected array, got:', typeof drugInput);
        return [];
      }
      
      return drugInput
        .filter(drug => drug !== null && typeof drug === 'object')
        .map((drug: any) => ({ // Cast drug to any here as its structure is being validated
          name: safeString(drug.name || 'Unnamed Drug'),
          dose: safeOptionalString(drug.dose),
          timing: safeOptionalString(drug.timing),
          administration: safeOptionalString(drug.administration),
          route: safeOptionalString(drug.route),
          alternative_switches: ensureStringArray(drug.alternative_switches),
          supportiveCare: safeJSONParse(drug.supportiveCare, []), // Assuming SupportiveCareItem structure is handled by safeJSONParse or is already correct
          contraindications: ensureStringArray(drug.contraindications),
          special_notes: ensureStringArray(drug.special_notes)
        }));
    };

    // Process medications
    const processMedications = (medications: unknown): Medications => {
      const defaultMedications = { required: [], optional: [] };
      
      if (!medications) {
        return defaultMedications;
      }
      
      // Handle object format with required/optional keys
      if (typeof medications === 'object' && medications !== null) {
        const med = medications as Record<string, unknown>;
        
        if ('required' in med || 'optional' in med) {
          return {
            required: processDrugs(safeJSONParse(med.required, [])),
            optional: processDrugs(safeJSONParse(med.optional, []))
          };
        }
      }
      
      // Handle array format (legacy) - treat as required medications
      if (Array.isArray(medications)) {
        return {
          required: processDrugs(medications),
          optional: []
        };
      }
      
      return defaultMedications;
    };

    // Process monitoring data
    const processMonitoring = (monitoringInput: unknown): Monitoring => {
      const defaultMonitoring = { baseline: [], ongoing: [], frequency: undefined };
      
      if (!monitoringInput) {
        return defaultMonitoring;
      }
      
      if (typeof monitoringInput === 'object' && monitoringInput !== null) {
        const mon = monitoringInput as Record<string, unknown>;
        return {
          baseline: ensureStringArray(mon.baseline),
          ongoing: ensureStringArray(mon.ongoing),
          frequency: safeOptionalString(mon.frequency)
        };
      }
      
      // Legacy format: treat as baseline if it's an array of strings
      if (Array.isArray(monitoringInput) && monitoringInput.every(item => typeof item === 'string')) {
        return {
          baseline: ensureStringArray(monitoringInput),
          ongoing: [],
          frequency: undefined
        };
      }
      
      // If it's a string, try to parse as JSON, then as string array
      if (typeof monitoringInput === 'string') {
         try {
            const parsed = JSON.parse(monitoringInput);
            if (typeof parsed === 'object' && parsed !== null) {
                 return {
                    baseline: ensureStringArray(parsed.baseline),
                    ongoing: ensureStringArray(parsed.ongoing),
                    frequency: safeOptionalString(parsed.frequency)
                 };
            }
         } catch (e) {
            // Not a JSON object, try to treat as a list of baseline items
            return {
                baseline: ensureStringArray(monitoringInput), // ensureStringArray will split it
                ongoing: [],
                frequency: undefined
            };
         }
      }
      
      return defaultMonitoring;
    };

    const processRescueAgents = (agentInput: unknown): RescueAgent[] => {
      if (!Array.isArray(agentInput)) {
        // console.warn('Invalid rescue agents format, expected array, got:', typeof agentInput);
        // Try to parse if it's a string
        if (typeof agentInput === 'string') {
          try {
            const parsed = JSON.parse(agentInput);
            if (Array.isArray(parsed)) {
              agentInput = parsed;
            } else {
              return [];
            }
          } catch (e) {
            // console.warn('Failed to parse rescue_agents string, treating as empty:', e);
            return [];
          }
        } else {
          return []; // Not an array or parsable string
        }
      }

      return (agentInput as any[])
        .filter(agent => agent !== null && typeof agent === 'object')
        .map((agent: any) => ({
          name: safeString(agent.name),
          indication: safeString(agent.indication),
          dosing: safeString(agent.dosing),
        }));
    };
    
    // Handle treatment data - ensure we always have a valid structure with drugs array
    let parsedTreatmentField: any = {};
    try {
      parsedTreatmentField = typeof raw.treatment === 'string' ? JSON.parse(raw.treatment) : (raw.treatment || {});
    } catch (err) {
      parsedTreatmentField = {};
    }

    let drugsForProtocol: Drug[] = [];
    if (Array.isArray(parsedTreatmentField?.drugs)) {
      drugsForProtocol = processDrugs(parsedTreatmentField.drugs);
    } else {
      drugsForProtocol = [];
    }

    // Convert Drug[] to ProtocolDrug[] with required fields
    const protocolDrugs: ProtocolDrug[] = drugsForProtocol.map(drug => ({
      name: drug.name,
      dose: drug.dose || '', // Provide default for required field
      administration: drug.administration || '', // Provide default for required field
      special_notes: drug.special_notes || [],
      supportiveCare: drug.supportiveCare as string[] | undefined
    }));

    const finalTreatmentObject = {
      ...safeJSONParse(raw.treatment, {}),
      drugs: protocolDrugs,
      protocol: safeOptionalString(parsedTreatmentField?.protocol)
    };

    // Helper function to convert strings to Test objects
    const processTests = (testInput: unknown): Test[] => {
      if (!Array.isArray(testInput)) {
        if (typeof testInput === 'string') {
          try {
            const parsed = JSON.parse(testInput);
            if (Array.isArray(parsed)) {
              testInput = parsed;
            } else {
              return [];
            }
          } catch {
            // Convert single string to Test object
            return testInput ? [{ name: testInput as string }] : [];
          }
        } else {
          return [];
        }
      }
      
      return (testInput as any[])
        .filter(test => test !== null)
        .map((test: any) => {
          if (typeof test === 'string') {
            return { name: test };
          }
          return {
            name: safeString(test.name || 'Unnamed Test'),
            timing: safeOptionalString(test.timing),
            parameters: ensureStringArray(test.parameters),
            frequency: safeOptionalString(test.frequency),
            ...test // Include any additional properties
          };
        });
    };

    // Construct normalized protocol
    const protocol: Protocol = {
      // Required fields
      id: safeString(raw.id),
      code: safeString(raw.code),
      tumour_group: safeString(raw.tumour_group),

      // Optional fields with appropriate defaults
      treatment_intent: safeOptionalString(raw.treatment_intent),
      eligibility: { // Apply ensureStringArray and map to the correct structure
        inclusion_criteria: ensureStringArray(raw.eligibility?.inclusion_criteria).map(criterion => ({ criterion })),
        exclusion_criteria: ensureStringArray(raw.eligibility?.exclusion_criteria).map(criterion => ({ criterion })),
      },
      treatment: finalTreatmentObject,
      tests: {
        baseline: processTests(raw.tests?.baseline),
        monitoring: processTests(raw.tests?.monitoring),
      },
      dose_modifications: { // Apply ensureStringArray
        hematological: ensureStringArray(raw.dose_modifications?.hematological),
        nonHematological: ensureStringArray(raw.dose_modifications?.nonHematological),
        renal: ensureStringArray(raw.dose_modifications?.renal),
        hepatic: ensureStringArray(raw.dose_modifications?.hepatic),
      },
      precautions: ensureStringArray(raw.precautions).map(note => ({ note })), // Transform strings to ProtocolNote objects
      reference_list: ensureStringArray(raw.reference_list), // Apply ensureStringArray
      created_at: safeOptionalString(raw.created_at),
      updated_at: safeOptionalString(raw.updated_at),
      pharmacokinetics: safeJSONParse(raw.pharmacokinetics, {}),
      interactions: {
        drugs: ensureStringArray(raw.interactions?.drugs),
        contraindications: ensureStringArray(raw.interactions?.contraindications),
        precautions: ensureStringArray(raw.interactions?.precautions),
      },
      drug_class: safeJSONParse(raw.drug_class, {}),
      administration_notes: ensureStringArray(raw.administration_notes),
      supportive_care: {
        required: processDrugs(safeJSONParse(raw.supportive_care?.required, [])),
        optional: processDrugs(safeJSONParse(raw.supportive_care?.optional, [])),
        monitoring: ensureStringArray(raw.supportive_care?.monitoring),
      },
      toxicity_monitoring: {
        parameters: ensureStringArray(raw.toxicity_monitoring?.parameters),
        frequency: safeString(raw.toxicity_monitoring?.frequency),
        expected_toxicities: ensureStringArray(raw.toxicity_monitoring?.expected_toxicities),
        thresholds: safeJSONParse(raw.toxicity_monitoring?.thresholds, {}),
      },
      rescue_agents: processRescueAgents(raw.rescue_agents),
      pre_medications: processMedications(raw.pre_medications),
      post_medications: processMedications(raw.post_medications),
      monitoring: { // This was processMonitoring(raw.monitoring) before, ensuring it aligns with the direct object structure
        baseline: ensureStringArray(raw.monitoring?.baseline),
        ongoing: ensureStringArray(raw.monitoring?.ongoing),
        frequency: safeOptionalString(raw.monitoring?.frequency),
      },
      comments: safeOptionalString(raw.comments),
      created_by: safeOptionalString(raw.created_by),
      updated_by: safeOptionalString(raw.updated_by),
      version: safeOptionalString(raw.version),
      tags: ensureStringArray(raw.tags),
      clinical_scenario: safeOptionalString(raw.clinical_scenario),
      last_reviewed: safeOptionalString(raw.last_reviewed),
      summary: safeOptionalString(raw.summary),
      ai_notes: {
        recommendations: ensureStringArray(raw.ai_notes?.recommendations),
        warnings: ensureStringArray(raw.ai_notes?.warnings),
      },
      natural_language_prompt: safeOptionalString(raw.natural_language_prompt),
      supportive_meds: processDrugs(safeJSONParse(raw.supportive_meds, [])),
      cycle_info: safeOptionalString(raw.cycle_info),
      dose_reductions: {
        levels: safeJSONParse(raw.dose_reductions?.levels, {}),
        criteria: ensureStringArray(raw.dose_reductions?.criteria),
      }
    };

    // Validate core required fields and treatment structure
    // Allow empty string for id, code, tumour_group (do not require non-empty)
    const requiredFieldChecks: Array<{key: keyof Protocol, name: string, allowEmptyString?: boolean}> = [
      { key: 'id', name: 'ID', allowEmptyString: true },
      { key: 'code', name: 'Code', allowEmptyString: true },
      { key: 'tumour_group', name: 'Tumour Group', allowEmptyString: true }
    ];
    const invalidFieldsMessages: string[] = [];
    for (const fieldCheck of requiredFieldChecks) {
      const value = protocol[fieldCheck.key];
      if (value === undefined || value === null) {
        invalidFieldsMessages.push(`Field '${fieldCheck.name}' (${fieldCheck.key}) is missing (null or undefined). Raw value: ${raw[fieldCheck.key]}`);
      }
      // Do NOT check for empty string if allowEmptyString is true
    }
    if (invalidFieldsMessages.length > 0) {
      console.error(`[cleanProtocol] Protocol (Raw ID: ${raw.id}, Raw Code: ${raw.code}) failed validation due to missing/invalid required fields:`);
      invalidFieldsMessages.forEach(msg => console.error(`- ${msg}`));
      return null;
    }
    if (!protocol.treatment || typeof protocol.treatment !== 'object') {
      console.error(`[cleanProtocol] Protocol (ID: ${protocol.id}, Code: ${protocol.code}) has invalid treatment structure: treatment field is missing or not an object. Raw treatment:`, raw.treatment);
      return null;
    }
    if (!Array.isArray(protocol.treatment.drugs)) {
      console.error(`[cleanProtocol] Protocol (ID: ${protocol.id}, Code: ${protocol.code}) has invalid treatment.drugs: drugs field is not an array. Treatment object:`, protocol.treatment);
      return null;
    }
    return protocol;
  } catch (error) {
    console.error(`[cleanProtocol] Error cleaning protocol data (Raw ID: ${raw?.id}, Raw Code: ${raw?.code}):`, error);
    return null;
  }
};

/**
 * Additional utility functions for protocol data
 */

// Check if protocol structure is valid
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

// Check if drugs list is valid
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

export interface Medication {
  id?: string;
  name: string;
  standard_dose?: string;
  timing?: string;
  category?: string;
  [key: string]: any;
}
