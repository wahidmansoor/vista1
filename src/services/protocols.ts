import { supabase } from '@/lib/supabaseClient';
import type { 
  Protocol,
  Drug,
  Eligibility,
  ToxicityMonitoring,
  SupportiveCare,
  Monitoring,
  Interactions,
  Medications,
  DrugClass
} from '@/types/protocol';

interface DatabaseProtocol {
  id: string;
  code: string;
  tumour_group: string;
  treatment_intent?: string;
  treatment?: any;
  eligibility?: any;
  tests?: any;
  dose_modifications?: any;
  precautions?: any;
  reference_list?: any;
  toxicity_monitoring?: any;
  supportive_care?: any;
  monitoring?: any;
  drug_class?: any;
  interactions?: any;
  administration_notes?: string[];
  pre_medications?: any;
  post_medications?: any;
  rescue_agents?: any;
  created_at?: string;
  updated_at?: string;
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
const toProtocol = (dbProtocol: DatabaseProtocol): Protocol => {
  // Safely parse a value as JSON only if it looks like JSON.
  const safeJSONParse = (data: any): any => {
    if (typeof data === 'string') {
      const trimmed = data.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        try {
          return JSON.parse(trimmed);
        } catch (err) {
          console.warn('Invalid JSON:', data);
          return data;
        }
      }
      return data; // plain non-JSON string (e.g., "CBC and LFTs")
    }
    return data; // already an object, array, or other type
  };

  // Add debug logging
  console.log('Raw treatment data:', dbProtocol.treatment);

  const protocol: Protocol = {
    id: dbProtocol.id,
    code: dbProtocol.code,
    tumour_group: dbProtocol.tumour_group,
    treatment_intent: dbProtocol.treatment_intent || '',
    eligibility: safeJSONParse(dbProtocol.eligibility),
    treatment: safeJSONParse(dbProtocol.treatment),
    tests: safeJSONParse(dbProtocol.tests),
    dose_modifications: safeJSONParse(dbProtocol.dose_modifications),
    precautions: safeJSONParse(dbProtocol.precautions),
    reference_list: safeJSONParse(dbProtocol.reference_list),
    toxicity_monitoring: safeJSONParse(dbProtocol.toxicity_monitoring),
    supportive_care: safeJSONParse(dbProtocol.supportive_care),
    drug_class: safeJSONParse(dbProtocol.drug_class),
    interactions: safeJSONParse(dbProtocol.interactions),
    administration_notes: dbProtocol.administration_notes || [],
    pre_medications: safeJSONParse(dbProtocol.pre_medications),
    post_medications: safeJSONParse(dbProtocol.post_medications),
    rescue_agents: safeJSONParse(dbProtocol.rescue_agents)
  };

  // Add debug logging for transformed protocol
  console.log('Transformed protocol:', {
    id: protocol.id,
    code: protocol.code,
    treatment: protocol.treatment
  });

  return protocol;
};

export const getSupergroups = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('cd_protocols')
    .select('tumour_supergroup')
    .order('tumour_supergroup');

  if (error) {
    console.error('Error fetching tumour supergroups:', error);
    throw new Error('Failed to fetch tumour supergroups.');
  }

  if (!Array.isArray(data)) {
    console.error('Invalid response format for tumour supergroups');
    return [];
  }

  // Extract unique supergroups and ensure they're strings
  const uniqueSupergroups = [...new Set(data
    .map(row => row.tumour_supergroup)
    .filter((sg): sg is string => typeof sg === 'string')
  )];

  return uniqueSupergroups;
};

export const getTumorGroups = async (supergroup?: string): Promise<string[]> => {
  let query = supabase
    .from('cd_protocols')
    .select('tumour_group, tumour_supergroup')
    .order('tumour_group');

  if (supergroup) {
    query = query.eq('tumour_supergroup', supergroup);
  }

  const { data, error } = await query;

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
    .from('cd_protocols') // MIGRATED
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
        const protocol = toProtocol(item);
        
        // Add overview object with fields from the top-level protocol
        protocol.overview = {
          treatment_intent: protocol.treatment_intent,
          version: protocol.version,
          last_reviewed: protocol.last_reviewed,
          summary: protocol.summary,
          cycle_info: protocol.cycle_info,
          clinical_scenario: protocol.clinical_scenario,
          status: protocol.status
        };
        
        validProtocols.push(protocol);
      } catch (err) {
        console.warn(`Failed to process protocol at index ${index}:`, err);
      }
    } else {
      console.warn(`Invalid protocol data at index ${index}`);
    }
  });

  return validProtocols;
};

export interface ProtocolFilters {
  tumorGroup: string | null;
  drugName: string | null;
  treatmentIntent: string | null;
}

export const getProtocols = async (filters: ProtocolFilters): Promise<Protocol[]> => {
  try {
    let query = supabase
      .from('cd_protocols') // MIGRATED
      .select('*');

    if (filters) {
      if (filters.tumorGroup) {
        query = query.eq('tumour_group', filters.tumorGroup);
      }
      if (filters.treatmentIntent) {
        query = query.eq('treatment_intent', filters.treatmentIntent);
      }
      if (filters.drugName) {
        query = query.contains('treatment->>drugs', filters.drugName);
      }
    }

    const { data, error } = await query;
    console.log('[CDU] cd_protocols data:', data); // AUDIT
    if (error) throw error;
    if (!data?.length) return [];

    // Warn in dev if required fields are missing
    if (process.env.NODE_ENV === 'development') {
      data.forEach((row, idx) => {
        ['id', 'code', 'tumour_group', 'treatment'].forEach(field => {
          if (!(field in row)) {
            console.warn(`[CDU] cd_protocols row missing field: ${field} (row #${idx})`, row);
          }
        });
      });
    }    // Validate and transform the data
    const validProtocols: Protocol[] = [];
    data.forEach((item, index) => {
      if (isDatabaseProtocol(item)) {
        try {
          const protocol = toProtocol(item);
          
          // Add overview object with fields from the top-level protocol
          protocol.overview = {
            treatment_intent: protocol.treatment_intent,
            version: protocol.version,
            last_reviewed: protocol.last_reviewed,
            summary: protocol.summary,
            cycle_info: protocol.cycle_info,
            clinical_scenario: protocol.clinical_scenario,
            status: protocol.status
          };
          
          validProtocols.push(protocol);
        } catch (err) {
          console.warn(`Failed to process protocol at index ${index}:`, err);
        }
      } else {
        console.warn(`Invalid protocol data at index ${index}`);
      }
    });

    return validProtocols;
  } catch (error) {
    console.error('Error fetching protocols:', error);
    throw new Error(`Failed to fetch protocols: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const getProtocolById = async (id: string): Promise<Protocol | null> => {
  try {
    const { data, error } = await supabase
      .from('cd_protocols') // MIGRATED
      .select(`
        id,
        code,
        tumour_group,
        treatment_intent,
        eligibility,
        treatment,
        tests,
        dose_modifications,
        precautions,
        reference_list,
        toxicity_monitoring,
        supportive_care,
        monitoring,
        drug_class,
        interactions,
        administration_notes,
        pre_medications,
        post_medications,
        rescue_agents,
        created_at,
        updated_at,
        pharmacokinetics,
        comments,
        tags,
        clinical_scenario,
        last_reviewed,
        summary,
        ai_notes,
        natural_language_prompt,
        supportive_meds,
        cycle_info,
        dose_reductions
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching protocol:', error);
      throw error;
    }

    // Add debug logging for raw data
    console.log('Raw protocol data:', JSON.stringify(data, null, 2));

    if (!data) {
      return null;
    }

    if (!isDatabaseProtocol(data)) {
      console.warn('Invalid protocol data structure:', data);
      return null;
    }    try {
      const protocol = toProtocol(data);
      
      // Add overview object with fields from the top-level protocol
      protocol.overview = {
        treatment_intent: protocol.treatment_intent,
        version: protocol.version,
        last_reviewed: protocol.last_reviewed,
        summary: protocol.summary,
        cycle_info: protocol.cycle_info,
        clinical_scenario: protocol.clinical_scenario,
        status: protocol.status
      };
      
      console.log('Transformed protocol:', {
        id: protocol.id,
        code: protocol.code,
        treatment: protocol.treatment,
        overview: protocol.overview
      });
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
