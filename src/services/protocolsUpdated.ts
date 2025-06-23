// src/services/protocols.ts
import { supabase } from '@/lib/supabaseClient';
import { Protocol, parseJsonSafe } from '@/types/protocolUpdated';

interface DatabaseProtocol {
  id: string;
  code: string;
  tumour_group: string;
  tumour_supergroup?: string;
  treatment_intent?: string;
  summary?: string;
  eligibility?: any;
  precautions?: any;
  treatment: any;
  tests?: any;
  dose_modifications?: any;
  reference_list?: any;
  cycle_info?: any;
  pre_medications?: any;
  post_medications?: any;
  supportive_care?: any;
  rescue_agents?: any;
  monitoring?: any;
  toxicity_monitoring?: any;
  interactions?: any;
  version?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
  last_reviewed?: string;
  status: string;
  contraindications?: any;
}

// Type guard to check if an object matches DatabaseProtocol shape
const isDatabaseProtocol = (obj: unknown): obj is DatabaseProtocol => {
  if (!obj || typeof obj !== 'object') return false;
  const protocol = obj as Record<string, unknown>;
  return (
    typeof protocol.id === 'string' &&
    typeof protocol.code === 'string' &&
    typeof protocol.tumour_group === 'string'
  );
};

// Convert DatabaseProtocol to Protocol type
export const toProtocol = (dbProtocol: DatabaseProtocol): Protocol => {
  return {
    id: String(dbProtocol.id || ''),
    code: String(dbProtocol.code || ''),
    tumour_group: String(dbProtocol.tumour_group || ''),
    tumour_supergroup: String(dbProtocol.tumour_supergroup || ''),
    treatment_intent: String(dbProtocol.treatment_intent || ''),
    summary: String(dbProtocol.summary || ''),
    treatment: parseJsonSafe(dbProtocol.treatment, 'treatment') ?? { drugs: [] },
    eligibility: parseJsonSafe(dbProtocol.eligibility, 'eligibility') ?? [],
    tests: parseJsonSafe(dbProtocol.tests, 'tests') ?? { baseline: [], monitoring: [] },
    dose_modifications: parseJsonSafe(dbProtocol.dose_modifications, 'dose_modifications') ?? { 
      renal: [], 
      hepatic: [], 
      hematological: [], 
      nonHematological: [] 
    },
    precautions: parseJsonSafe(dbProtocol.precautions, 'precautions') ?? [],
    reference_list: parseJsonSafe(dbProtocol.reference_list, 'reference_list') ?? [],
    cycle_info: parseJsonSafe(dbProtocol.cycle_info, 'cycle_info') ?? {},
    toxicity_monitoring: parseJsonSafe(dbProtocol.toxicity_monitoring, 'toxicity_monitoring') ?? { 
      expected_toxicities: [], 
      monitoring_parameters: '',
      frequency_details: '',
      thresholds_for_action: {} 
    },
    interactions: parseJsonSafe(dbProtocol.interactions, 'interactions') ?? { 
      drugs_to_avoid: [],
      contraindications: [],
      precautions_with_other_drugs: []
    },
    supportive_care: parseJsonSafe(dbProtocol.supportive_care, 'supportive_care') ?? { 
      optional: [], 
      required: [], 
      monitoring: [] 
    },
    pre_medications: parseJsonSafe(dbProtocol.pre_medications, 'pre_medications') ?? [],
    post_medications: parseJsonSafe(dbProtocol.post_medications, 'post_medications') ?? [],
    rescue_agents: parseJsonSafe(dbProtocol.rescue_agents, 'rescue_agents') ?? [],
    monitoring: parseJsonSafe(dbProtocol.monitoring, 'monitoring') ?? { 
      ongoing: [], 
      baseline: [] 
    },
    contraindications: parseJsonSafe(dbProtocol.contraindications, 'contraindications') ?? [],
    version: String(dbProtocol.version || ''),
    created_by: String(dbProtocol.created_by || ''),
    updated_by: String(dbProtocol.updated_by || ''),
    status: String(dbProtocol.status || 'active'),
    created_at: dbProtocol.created_at ? new Date(dbProtocol.created_at).toISOString() : undefined,
    updated_at: dbProtocol.updated_at ? new Date(dbProtocol.updated_at).toISOString() : undefined,
    last_reviewed: dbProtocol.last_reviewed ? new Date(dbProtocol.last_reviewed).toISOString() : undefined
  };
};

export interface ProtocolFilters {
  tumorGroup: string | null;
  drugName: string | null;
  treatmentIntent: string | null;
}

export const getProtocols = async (filters: ProtocolFilters): Promise<Protocol[]> => {
  try {
    let query = supabase
      .from('cd_protocols')
      .select(`
        id,
        code,
        tumour_group,
        tumour_supergroup,
        treatment_intent,
        summary,
        eligibility,
        precautions,
        treatment,
        tests,
        dose_modifications,
        reference_list,
        cycle_info,
        pre_medications,
        post_medications,
        supportive_care,
        rescue_agents,
        monitoring,
        toxicity_monitoring,
        interactions,
        contraindications,
        version,
        created_by,
        updated_by,
        created_at,
        updated_at,
        last_reviewed,
        status
      `);

    // Apply filters if provided
    if (filters) {
      if (filters.tumorGroup) {
        query = query.eq('tumour_group', filters.tumorGroup);
      }
      if (filters.treatmentIntent) {
        query = query.eq('treatment_intent', filters.treatmentIntent);
      }
      if (filters.drugName && filters.drugName.trim()) {
        // Handle drug name search within JSONB
        query = query.contains('treatment->>drugs', filters.drugName);
      }
    }

    const { data, error } = await query;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[CDU] Raw protocols data:', data?.slice(0, 2));
    }
    
    if (error) throw error;
    if (!data?.length) return [];

    // Transform and validate the data
    const validProtocols = data.map(item => {
      if (isDatabaseProtocol(item)) {
        try {
          const protocol = toProtocol(item);
          return protocol;
        } catch (err) {
          console.warn(`Failed to process protocol:`, err);
          return null;
        }
      }
      console.warn(`Invalid protocol data:`, item);
      return null;
    }).filter((p): p is Protocol => p !== null);

    return validProtocols;
  } catch (error) {
    console.error('Error fetching protocols:', error);
    throw new Error(`Failed to fetch protocols: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getProtocol = async (id: string): Promise<Protocol | null> => {
  try {
    const { data, error } = await supabase
      .from("cd_protocols")
      .select(`
        id,
        code,
        tumour_group,
        tumour_supergroup,
        treatment_intent,
        summary,
        status,
        created_at,
        updated_at,
        treatment,
        eligibility,
        precautions,
        tests,
        dose_modifications,
        reference_list,
        cycle_info,
        pre_medications,
        post_medications,
        supportive_care,
        rescue_agents,
        monitoring,
        toxicity_monitoring,
        interactions,
        contraindications,
        last_reviewed,
        version,
        created_by,
        updated_by
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching protocol:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    if (!isDatabaseProtocol(data)) {
      console.warn('Invalid protocol data structure:', data);
      return null;
    }

    try {
      const protocol = toProtocol(data);
      return protocol;
    } catch (err) {
      console.error('Failed to transform protocol:', err);
      return null;
    }

  } catch (error) {
    console.error('Failed to fetch protocol:', error);
    throw error;
  }
};

export const getTumorGroups = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('cd_protocols')
    .select('tumour_group')
    .order('tumour_group');

  if (error) {
    console.error('Error fetching tumor groups:', error);
    throw new Error('Failed to fetch tumor groups.');
  }

  if (!Array.isArray(data)) {
    console.error('Invalid response format for tumor groups');
    return [];
  }

  // Extract unique tumor groups and ensure they're strings
  const uniqueGroups = [...new Set(data
    .map(row => row.tumour_group)
    .filter((group): group is string => typeof group === 'string')
  )];

  return uniqueGroups;
};

export const getProtocolsByTumorGroup = async (tumorGroup: string): Promise<Protocol[]> => {
  const { data, error } = await supabase
    .from('cd_protocols')
    .select('*')
    .eq('tumour_group', tumorGroup)
    .order('code');

  if (error) {
    console.error('Error fetching protocols for tumor group', tumorGroup, ':', error);
    throw new Error(`Failed to fetch protocols for tumor group ${tumorGroup}.`);
  }

  if (!Array.isArray(data)) {
    console.error('Invalid response format:', data);
    return [];
  }

  // Validate and transform the data
  const validProtocols: Protocol[] = [];
  data.forEach((item, index) => {
    if (isDatabaseProtocol(item)) {
      try {
        validProtocols.push(toProtocol(item));
      } catch (err) {
        console.warn(`Failed to process protocol at index ${index}:`, err);
      }
    } else {
      console.warn(`Invalid protocol data at index ${index}`);
    }
  });

  return validProtocols;
};
