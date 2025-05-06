import { supabase } from '../lib/supabase';
import type { Medication, SortConfig } from '../modules/cdu/types';

/**
 * Fetch all medications from the database
 * @returns Promise resolving to an array of medications
 */
export const getAllMedications = async (): Promise<Medication[]> => {
  try {
    const { data, error } = await supabase
      .from('medications')
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
    let query = supabase.from('medications').select('*');
    
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
    const { data, error } = await supabase
      .from('medications')
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
    const { data, error } = await supabase
      .from('medications')
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