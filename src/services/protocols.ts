// src/services/protocols.ts

import { supabase } from '../lib/supabase';
import type { Protocol, Drug } from '../types/protocol';

export interface ProtocolFilters {
  tumorGroup: string | null;
  drugName: string | null;
  treatmentIntent: string | null;
}

// Utility function to validate protocol data
export const isValidProtocol = (protocol: Partial<Protocol>): boolean => {
  return !!(
    protocol.id &&
    protocol.code &&
    protocol.tumour_group &&
    protocol.treatment?.drugs?.length
  );
};

// Safely parse JSON string or return default value
const safeJSONParse = <T>(value: unknown, defaultValue: T): T => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.warn('Error parsing JSON:', error);
      return defaultValue;
    }
  }
  return value as T || defaultValue;
};

export const getProtocols = async (filters?: ProtocolFilters): Promise<Protocol[]> => {
  try {
    let query = supabase
      .from('protocols')
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
        reference_list
      `);

    // Apply filters if provided
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

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Error fetching protocols: ${error.message}`);
    }

    if (!data?.length) {
      console.info('No protocols found matching filters:', filters);
      return [];
    }

    // Process and validate each protocol
    const protocols: Protocol[] = data
      .map((item): Protocol => ({
        id: item.id,
        code: item.code,
        tumour_group: item.tumour_group,
        treatment_intent: item.treatment_intent,
        eligibility: safeJSONParse<string[]>(item.eligibility, []),
        tests: safeJSONParse(item.tests, { baseline: [], monitoring: [] }),
        treatment: safeJSONParse<{ drugs: Drug[]; protocol?: string }>(
          item.treatment,
          { drugs: [] }
        ),
        dose_modifications: safeJSONParse(item.dose_modifications, {
          hematological: [],
          nonHematological: [],
          renal: [],
          hepatic: []
        }),
        precautions: safeJSONParse<string[]>(item.precautions, []),
        reference_list: safeJSONParse<string[]>(item.reference_list, [])
      }))
      .filter(protocol => {
        const isValid = isValidProtocol(protocol);
        if (!isValid) {
          console.warn('Invalid protocol data:', { code: protocol.code, id: protocol.id });
        }
        return isValid;
      });

    // Group by tumor group for the RegimensLibrary component
    return protocols;

  } catch (error) {
    console.error('Protocol service error:', error);
    throw error;
  }
};

export const getProtocolByCode = async (code: string): Promise<Protocol | null> => {
  const { data, error } = await supabase
    .from('protocols')
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
      reference_list
    `)
    .eq('code', code)
    .single();

  if (error) {
    console.error('Error fetching protocol by code:', error);
    return null;
  }

  if (!data) return null;

  try {
    const protocol: Protocol = {
      id: data.id,
      code: data.code,
      tumour_group: data.tumour_group,
      treatment_intent: data.treatment_intent,
      eligibility: safeJSONParse<string[]>(data.eligibility, []),
      treatment: safeJSONParse<{ drugs: Drug[]; protocol?: string }>(
        data.treatment,
        { drugs: [] }
      ),
      tests: safeJSONParse(data.tests, { baseline: [], monitoring: [] }),
      dose_modifications: safeJSONParse(data.dose_modifications, {
        hematological: [],
        nonHematological: [],
        renal: [],
        hepatic: []
      }),
      precautions: safeJSONParse<string[]>(data.precautions, []),
      reference_list: safeJSONParse<string[]>(data.reference_list, [])
    };

    if (!isValidProtocol(protocol)) {
      console.warn('Invalid protocol data for code:', code);
      return null;
    }

    return protocol;
  } catch (parseError) {
    console.error('Error parsing protocol data:', parseError);
    return null;
  }
};
