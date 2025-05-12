import { supabase } from '../lib/supabaseClient';

export interface ToxicityData {
  id: string;
  name: string;
  severity: string;
  recognition: string;
  management: string[];
  doseGuidance: string[];
  culpritDrugs: string[];
}

/**
 * Sanitizes toxicity data to ensure it has expected structure and types
 * @param data Partial toxicity data that may be missing fields
 * @returns Complete toxicity data with defaults for missing fields
 */
export const sanitizeToxicity = (data: Partial<ToxicityData>): ToxicityData => ({
  id: data.id || crypto.randomUUID(),
  name: data.name || 'Not specified',
  severity: data.severity || 'Not specified',
  recognition: data.recognition || 'Not specified',
  management: Array.isArray(data.management) ? data.management : [],
  doseGuidance: Array.isArray(data.doseGuidance) ? data.doseGuidance : [],
  culpritDrugs: Array.isArray(data.culpritDrugs) ? data.culpritDrugs : []
});

/**
 * Fetches all toxicity data from the database
 * @returns Promise resolving to array of toxicity data
 */
export const getAllToxicities = async (): Promise<ToxicityData[]> => {
  try {
    const { data, error } = await supabase.from('toxicities').select('*');
    
    if (error) {
      throw new Error(`Toxicity fetch error: ${error.message}`);
    }
    
    return (data || []).map((item: Partial<ToxicityData>) => sanitizeToxicity(item));
  } catch (err) {
    console.error('Error fetching toxicities:', err);
    throw err;
  }
};

/**
 * Fetches toxicities related to a specific medication
 * @param medicationId Medication ID to filter toxicities by
 * @returns Promise resolving to array of toxicity data
 */
export const getToxicitiesByMedication = async (medicationId: string): Promise<ToxicityData[]> => {
  try {
    const { data, error } = await supabase
      .from('medication_toxicities')
      .select('toxicity_id')
      .eq('medication_id', medicationId);
    
    if (error) {
      throw new Error(`Medication toxicity relation fetch error: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      return [];
    }
    
    const toxicityIds = data.map(item => item.toxicity_id);
    
    const { data: toxicities, error: toxicitiesError } = await supabase
      .from('toxicities')
      .select('*')
      .in('id', toxicityIds);
    
    if (toxicitiesError) {
      throw new Error(`Toxicity fetch error: ${toxicitiesError.message}`);
    }
    
    return (toxicities || []).map((item: Partial<ToxicityData>) => sanitizeToxicity(item));
  } catch (err) {
    console.error('Error fetching toxicities by medication:', err);
    throw err;
  }
};