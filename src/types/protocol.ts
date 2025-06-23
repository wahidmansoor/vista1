import { supabase } from '@/lib/supabaseClient';
// Import types from existing files
import { type Protocol } from './protocolUpdated'; // Changed to named import
export type { Protocol }; // Re-export Protocol
export type { Drug, Medication, PreMedication, PostMedication, Interactions, RescueAgent, Eligibility, SupportiveCareItem, DoseModification, CycleInfo, MonitoringItem, ToxicityMonitoring, SupportiveCare, Test } from './protocolUpdated'; // Added Test and other exports
import type { ProtocolFilters } from '@/services/protocols';
import { cleanProtocol } from './protocolUpdated';

// Export the cleanProtocol function
export { cleanProtocol };

// Utility function for safe JSON parsing
export const safeJsonParse = (jsonString: string | null | undefined): any => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return null;
  }
};

// Utility function to validate drug lists
export const isValidDrugList = (drugs: any): boolean => {
  return Array.isArray(drugs) && drugs.every(drug => 
    drug && typeof drug === 'object' && typeof drug.name === 'string'
  );
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

    if (filters.tumour_group) query = query.eq('tumour_group', filters.tumour_group);
    else if (filters.tumorGroup) query = query.eq('tumour_group', filters.tumorGroup);

    if (filters.tumour_supergroup) query = query.eq('tumour_supergroup', filters.tumour_supergroup);

    if (filters.treatment_intent) query = query.eq('treatment_intent', filters.treatment_intent);
    else if (filters.treatmentIntent) query = query.eq('treatment_intent', filters.treatmentIntent);

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

    if (filters.drugName) {
      query = query.contains('treatment->>drugs', filters.drugName);
    }

    const { data, error } = await query.order('code', { ascending: true });

    if (error) throw error;
    if (!data?.length) return [];

    return data
      .map((raw) => cleanProtocol(raw))
      .filter((p): p is Protocol => p !== null);
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

  return data
    .map((raw) => cleanProtocol(raw))
    .filter((p): p is Protocol => p !== null);
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

  return data ? cleanProtocol(data) : null;
};

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
