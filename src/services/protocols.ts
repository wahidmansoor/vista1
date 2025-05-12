// src/services/protocols.ts

import { supabase } from '../lib/supabaseClient';
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
        reference_list,
        pharmacokinetics,
        interactions,
        drug_class,
        administration_notes,
        supportive_care,
        toxicity_monitoring,
        rescue_agents,
        pre_medications,
        post_medications,
        monitoring,
        supportive_meds,
        ai_notes,
        tags,
        comments,
        summary,
        created_by,
        updated_by,
        version,
        clinical_scenario,
        natural_language_prompt,
        cycle_info,
        dose_reductions,
        created_at,
        updated_at,
        last_reviewed
      `);

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

    if (error) throw error;
    if (!data?.length) return [];

    // Process and validate each protocol
    let protocols: Protocol[] = data
      .map((item): Protocol | null => {
        try {
          const treatment = safeJSONParse<{ drugs: Drug[]; protocol?: string }>(
            item.treatment,
            { drugs: [] }
          );
          
          // Validate drugs array structure
          if (!Array.isArray(treatment.drugs)) {
            console.warn(`Invalid drugs array for protocol ${item.code}`);
            return null;
          }

          return {
            id: item.id,
            code: item.code,
            tumour_group: item.tumour_group,
            treatment_intent: item.treatment_intent,
            eligibility: safeJSONParse<string[]>(item.eligibility, []),
            treatment,
            tests: safeJSONParse(item.tests, { baseline: [], monitoring: [] }),
            dose_modifications: safeJSONParse(item.dose_modifications, {
              hematological: [],
              nonHematological: [],
              renal: [],
              hepatic: []
            }),
            precautions: safeJSONParse<string[]>(item.precautions, []),
            reference_list: safeJSONParse<string[]>(item.reference_list, []),

            // New fields
            pharmacokinetics: safeJSONParse(item.pharmacokinetics, {}),
            interactions: safeJSONParse(item.interactions, {
              drugs: [],
              contraindications: [],
              precautions: []
            }),
            drug_class: safeJSONParse(item.drug_class, {
              name: '',
              mechanism: '',
              classification: ''
            }),
            administration_notes: safeJSONParse<string[]>(item.administration_notes, []),
            supportive_care: safeJSONParse(item.supportive_care, {
              required: [],
              optional: [],
              monitoring: []
            }),
            toxicity_monitoring: safeJSONParse(item.toxicity_monitoring, {
              parameters: [],
              frequency: '',
              thresholds: {}
            }),
            rescue_agents: safeJSONParse(item.rescue_agents, []),
            pre_medications: safeJSONParse(item.pre_medications, {
              required: [],
              optional: []
            }),
            post_medications: safeJSONParse(item.post_medications, {
              required: [],
              optional: []
            }),
            monitoring: safeJSONParse(item.monitoring, {
              baseline: [],
              ongoing: [],
              frequency: ''
            }),
            supportive_meds: safeJSONParse<Drug[]>(item.supportive_meds, []),
            ai_notes: safeJSONParse(item.ai_notes, {
              recommendations: [],
              warnings: [],
              considerations: []
            }),
            tags: safeJSONParse<string[]>(item.tags, []),

            comments: item.comments,
            summary: item.summary,
            created_by: item.created_by,
            updated_by: item.updated_by,
            version: item.version,
            clinical_scenario: item.clinical_scenario,
            natural_language_prompt: item.natural_language_prompt,
            cycle_info: item.cycle_info,
            dose_reductions: safeJSONParse(item.dose_reductions, {
              criteria: [],
              levels: {}
            }),

            created_at: item.created_at,
            updated_at: item.updated_at,
            last_reviewed: item.last_reviewed
          };
        } catch (error) {
          console.error(`Error processing protocol ${item.code}:`, error);
          return null;
        }
      })
      .filter((protocol): protocol is Protocol => {
        if (!protocol) return false;
        const isValid = isValidProtocol(protocol);
        if (!isValid) {
          console.warn('Invalid protocol data:', { code: protocol?.code, id: protocol?.id });
        }
        return isValid;
      });

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
      reference_list,
      pharmacokinetics,
      interactions,
      drug_class,
      administration_notes,
      supportive_care,
      toxicity_monitoring,
      rescue_agents,
      pre_medications,
      post_medications,
      monitoring,
      supportive_meds,
      ai_notes,
      tags,
      comments,
      summary,
      created_by,
      updated_by,
      version,
      clinical_scenario,
      natural_language_prompt,
      cycle_info,
      dose_reductions,
      created_at,
      updated_at,
      last_reviewed
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
      reference_list: safeJSONParse<string[]>(data.reference_list, []),

      // New fields
      pharmacokinetics: safeJSONParse(data.pharmacokinetics, {}),
      interactions: safeJSONParse(data.interactions, {
        drugs: [],
        contraindications: [],
        precautions: []
      }),
      drug_class: safeJSONParse(data.drug_class, {}),
      administration_notes: safeJSONParse<string[]>(data.administration_notes, []),
      supportive_care: safeJSONParse(data.supportive_care, {
        required: [],
        optional: [],
        monitoring: []
      }),
      toxicity_monitoring: safeJSONParse(data.toxicity_monitoring, {
        parameters: [],
        frequency: '',
        thresholds: {}
      }),
      rescue_agents: safeJSONParse(data.rescue_agents, []),
      pre_medications: safeJSONParse(data.pre_medications, {
        required: [],
        optional: []
      }),
      post_medications: safeJSONParse(data.post_medications, {
        required: [],
        optional: []
      }),
      monitoring: safeJSONParse(data.monitoring, {
        baseline: [],
        ongoing: [],
        frequency: ''
      }),
      supportive_meds: safeJSONParse<Drug[]>(data.supportive_meds, []),
      ai_notes: safeJSONParse(data.ai_notes, {
        recommendations: [],
        warnings: [],
        considerations: []
      }),
      tags: safeJSONParse<string[]>(data.tags, []),

      comments: data.comments,
      summary: data.summary,
      created_by: data.created_by,
      updated_by: data.updated_by,
      version: data.version,
      clinical_scenario: data.clinical_scenario,
      natural_language_prompt: data.natural_language_prompt,
      cycle_info: data.cycle_info,
      dose_reductions: safeJSONParse(data.dose_reductions, {
        criteria: [],
        levels: {}
      }),

      created_at: data.created_at,
      updated_at: data.updated_at,
      last_reviewed: data.last_reviewed
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
