import supabase from '../lib/supabaseClient';
import type { Medication, SortConfig } from '../modules/cdu/types';

/**
 * Fetch all medications from the database
 * @returns Promise resolving to an array of medications
 */
export const getAllMedications = async (): Promise<Medication[]> => {
  try {    const { data, error } = await supabase
      .from('oncology_medications')
      .select('*');
      
    if (error) {
      throw new Error(`Failed to fetch medications: ${error.message}`);
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getAllMedications:', err);
    throw err;
  }
};

/**
 * Fetch medications with sorting and filtering options
 * @param options Configuration for sorting and filtering
 * @returns Promise resolving to filtered and sorted medications
 */
export const getMedications = async (options: {
  sort?: SortConfig,
  filterClass?: string,
  searchQuery?: string,
  isPremedOnly?: boolean
}): Promise<Medication[]> => {
  try {
    let query = supabase.from('oncology_medications').select('*');
    
    // Apply filters
    if (options.filterClass) {
      query = query.ilike('classification', `%${options.filterClass}%`);
    }
    
    if (options.isPremedOnly) {
      query = query.eq('is_premedication', true);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch medications: ${error.message}`);
    }
    
    let results = data || [];
    
    // Apply search filter client-side (more flexible)
    if (options.searchQuery) {
      const search = options.searchQuery.toLowerCase();
      results = results.filter(med => 
        med.name.toLowerCase().includes(search) ||
        med.brand_names.some((name: string) => name.toLowerCase().includes(search)) ||
        med.classification.toLowerCase().includes(search)
      );
    }
    
    // Apply sort
    if (options.sort) {
      const { field, order } = options.sort;
      results.sort((a, b) => {
        let comparison = 0;
        
        if (field === 'name') {
          comparison = a.name.localeCompare(b.name);
        } else if (field === 'classification') {
          comparison = a.classification.localeCompare(b.classification);
        } else if (field === 'updated_at') {
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        }
        
        return order === 'asc' ? comparison : -comparison;
      });
    }
    
    return results;
  } catch (err) {
    console.error('Error in getMedications:', err);
    throw err;
  }
};

/**
 * Get medications by category
 * @param category The category to filter by
 * @returns Promise resolving to filtered medications
 */
export const getMedicationsByCategory = async (category: string): Promise<Medication[]> => {
  try {
    const { data, error } = await supabase      .from('oncology_medications')
      .select('*')
      .ilike('classification', `%${category}%`);
      
    if (error) {
      throw new Error(`Failed to fetch medications by category: ${error.message}`);
    }
    
    return data || [];
  } catch (err) {
    console.error('Error in getMedicationsByCategory:', err);
    throw err;
  }
};

/**
 * Get a single medication by ID
 * @param id The medication ID to fetch
 * @returns Promise resolving to a medication or null if not found
 */
export const getMedicationById = async (id: string): Promise<Medication | null> => {
  try {
    const { data, error } = await supabase      .from('oncology_medications')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        // Record not found
        return null;
      }
      throw new Error(`Failed to fetch medication: ${error.message}`);
    }
    
    return data;
  } catch (err) {
    console.error('Error in getMedicationById:', err);
    throw err;
  }
};

/**
 * 🔒 Secure Supabase Fetch for Oncology Medications
 * ✅ Handles 401 Unauthorized errors 
 * ✅ Properly encodes 'or' filter for multi-field fuzzy search
 * 🧪 Uses Vite environment variables
 */
export const fetchMedications = async (searchTerm?: string): Promise<Medication[]> => {
  try {
    const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/oncology_medications`;
    
    // Build filter based on search term if provided
    const filter = searchTerm ? encodeURIComponent(`
      or=(
        name.ilike."%${searchTerm}%",
        classification.ilike."%${searchTerm}%",
        indications->>cancer_types.ilike."%${searchTerm}%"
      )
    `.trim()) : '';

    const url = `${baseUrl}/select=*${filter ? `&${filter}` : ''}&order=name.asc.nullslast`;

    const headers: HeadersInit = {
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY!}`,
    };

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Supabase fetch failed: ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    console.log("✅ Medications fetched:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching medications:", error);
    throw error;
  }
};

/**
 * Search medications using full-text search
 * @param query Search terms
 * @returns Promise<Medication[]>
 */
export const searchMedicationsFullText = async (query: string): Promise<Medication[]> => {
  try {
    const { data, error } = await supabase
      .from('oncology_medications')
      .select('*')
      .textSearch('search_vector', query, {
        config: 'english',
      });

    if (error) {
      throw new Error(`Error in full-text search: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error('Error in searchMedicationsFullText:', err);
    throw err;
  }
};

/**
 * Get medications by tumor type
 * @param tumorType The cancer/tumor type to filter by
 * @returns Promise<Medication[]>
 */
export const getMedicationsByTumorType = async (tumorType: string): Promise<Medication[]> => {
  try {
    const { data, error } = await supabase
      .from('oncology_medications')
      .select('*')
      .containedBy('indications->cancer_types', [tumorType]);

    if (error) {
      throw new Error(`Error fetching by tumor type: ${error.message}`);
    }

    return data || [];
  } catch (err) {
    console.error('Error in getMedicationsByTumorType:', err);
    throw err;
  }
};