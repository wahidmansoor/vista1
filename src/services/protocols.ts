import { supabase } from '@/lib/supabaseClient';
import type { Protocol } from '@/types/protocol';

// ✅ Interface for filters (used in RegimensLibrary.tsx etc.)
export interface ProtocolFilters {
  tumour_group?: string;
  tumour_supergroup?: string;
  treatment_intent?: string;
  search_term?: string;
  tags?: string[];
  status?: string;
  tumorGroup?: string | null; // For backward compatibility
  drugName?: string | null;   // For backward compatibility
  treatmentIntent?: string | null; // For backward compatibility
}

// Add this helper function
const parseProtocolPremedications = (protocol: any): Protocol => {
  let premeds = protocol.premedications;

  try {
    if (typeof premeds === 'string') {
      premeds = JSON.parse(premeds); // handle single stringified object
    } else if (Array.isArray(premeds)) {
      premeds = premeds.map((item) =>
        typeof item === 'string' ? JSON.parse(item) : item
      );
    }
  } catch (e) {
    console.warn('Failed to parse premedications:', e);
  }

  return {
    ...protocol,
    premedications: premeds
  } as Protocol;
};

// ✅ Get unique tumour supergroups (top-level filter)
export const getSupergroups = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('cd_protocols')
    .select('tumour_supergroup')
    .not('tumour_supergroup', 'is', null)
    .order('tumour_supergroup', { ascending: true });

  if (error) {
    console.error('Error fetching supergroups:', error);
    throw new Error('Failed to fetch tumour supergroups');
  }

  const unique = [...new Set(data.map((p) => p.tumour_supergroup))].filter(Boolean);
  return unique as string[];
};

// ✅ Get tumour groups (optionally filtered by supergroup)
export const getTumorGroups = async (supergroup?: string): Promise<string[]> => {
  let query = supabase.from('cd_protocols').select('tumour_group').not('tumour_group', 'is', null);

  if (supergroup) {
    query = query.eq('tumour_supergroup', supergroup);
  }

  const { data, error } = await query.order('tumour_group', { ascending: true });

  if (error) {
    console.error('Error fetching tumour groups:', error);
    throw new Error('Failed to fetch tumour groups');
  }

  const unique = [...new Set(data.map((p) => p.tumour_group))].filter(Boolean);
  return unique as string[];
};

// ✅ Get all protocols (with optional filters)
export const getProtocols = async (filters: ProtocolFilters = {}): Promise<Protocol[]> => {
  try {
    let query = supabase.from('cd_protocols').select('*');

    // Handle new filter format
    if (filters.tumour_group) query = query.eq('tumour_group', filters.tumour_group);
    else if (filters.tumorGroup) query = query.eq('tumour_group', filters.tumorGroup); // For backward compatibility

    if (filters.tumour_supergroup) query = query.eq('tumour_supergroup', filters.tumour_supergroup);
    
    if (filters.treatment_intent) query = query.eq('treatment_intent', filters.treatment_intent);
    else if (filters.treatmentIntent) query = query.eq('treatment_intent', filters.treatmentIntent); // For backward compatibility
    
    if (filters.status) query = query.eq('status', filters.status);
    
    if (filters.tags && filters.tags.length > 0) {
      for (const tag of filters.tags) {
        query = query.contains('tags', [tag]);
      }
    }
    
    if (filters.search_term) {
      query = query.textSearch('search_vector', filters.search_term, {
        type: 'websearch',
        config: 'english'
      });
    }
    
    // Handle old filter format for drug name
    if (filters.drugName) {
      query = query.contains('treatment->>drugs', filters.drugName);
    }

    const { data, error } = await query.order('code', { ascending: true });

    if (error) throw error;
    if (!data?.length) return [];

    return data.map(parseProtocolPremedications);
  } catch (error) {
    console.error('Error fetching filtered protocols:', error);
    throw new Error(`Failed to fetch protocols: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// ✅ Get protocols by tumor group (basic mode)
export const getProtocolsByTumorGroup = async (tumorGroup: string): Promise<Protocol[]> => {
  const { data, error } = await supabase
    .from('cd_protocols')
    .select('*')
    .eq('tumour_group', tumorGroup)
    .order('code', { ascending: true });

  if (error) {
    console.error('Error fetching protocols by group:', error);
    throw new Error('Failed to fetch protocols');
  }

  return data.map(parseProtocolPremedications);
};

// ✅ Get a single protocol by ID
export const getProtocolById = async (id: string): Promise<Protocol | null> => {
  const { data, error } = await supabase
    .from('cd_protocols')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching protocol by ID:', error);
    return null;
  }

  return data ? parseProtocolPremedications(data) : null;
}

// ✅ Get all group options (tumour group and supergroup combinations)
export const getAllGroupOptions = async (): Promise<
  { label: string; group: string; supergroup: string }[]
> => {
  const { data, error } = await supabase
    .from('cd_protocols')
    .select('tumour_group, tumour_supergroup')
    .not('tumour_group', 'is', null)
    .not('tumour_supergroup', 'is', null);

  if (error) {
    console.error('Error fetching group options:', error);
    throw new Error('Failed to fetch tumour group options');
  }

  const seen = new Set();
  const options: { label: string; group: string; supergroup: string }[] = [];

  for (const item of data) {
    const key = `${item.tumour_group}||${item.tumour_supergroup}`;
    if (!seen.has(key)) {
      seen.add(key);
      options.push({
        label: `${item.tumour_group} – ${item.tumour_supergroup}`,
        group: item.tumour_group,
        supergroup: item.tumour_supergroup
      });
    }
  }

  return options;
};
