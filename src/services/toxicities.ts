import { supabase } from '../lib/supabaseClient';

export interface ToxicityData {
  // Basic fields
  id: string;
  name: string;
  severity: string;
  grading_scale: string;
  recognition: string;
  symptoms: string[];
  signs: string[];
  imaging: string[];
  labs: string[];
  clinical_category: string;
  symptom_onset: string;
  expected_onset: string;
  onset_timing_days: number;
  reversibility: string;
  toxicity_type: string;
  is_dose_limiting: boolean;
  requires_hospitalization: boolean;
  toxicity_risk_factors: string[];

  // Arrays
  management: string[];
  dose_guidance: string[];
  culprit_drugs: string[];
  culprit_classes: string[];
  intervention_required: string[];
  monitoring_recommendations: string[];
  lab_triggers: string[];
  related_toxicity_ids: string[];

  // Special formats
  monitoring_frequency: {
    initial: string;
    followup: string;
    longterm: string;
  };
  reference_data: Record<string, any>;
  source_reference: string;
  notes: string;
  notes_clinical_pearls: string;
  notes_ui_display: string;
  toxicity_score_weight: number;

  // Timestamps
  created_at: string;
  updated_at: string;
}

/**
 * Sanitizes toxicity data to ensure it has expected structure and types
 * @param data Partial toxicity data that may be missing fields
 * @returns Complete toxicity data with defaults for missing fields
 */
export const sanitizeToxicity = (data: Partial<ToxicityData>): ToxicityData => ({
  // Basic fields
  id: data.id || crypto.randomUUID(),
  name: data.name || 'Not specified',
  severity: data.severity || 'Not specified',
  grading_scale: data.grading_scale || 'CTCAE v5.0',
  recognition: data.recognition || '',
  symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
  signs: Array.isArray(data.signs) ? data.signs : [],
  imaging: Array.isArray(data.imaging) ? data.imaging : [],
  labs: Array.isArray(data.labs) ? data.labs : [],
  clinical_category: data.clinical_category || 'Uncategorized',
  symptom_onset: data.symptom_onset || '',
  expected_onset: data.expected_onset || '',
  onset_timing_days: data.onset_timing_days || 0,
  reversibility: data.reversibility || 'Unknown',
  toxicity_type: data.toxicity_type || 'Unknown',
  is_dose_limiting: !!data.is_dose_limiting,
  requires_hospitalization: !!data.requires_hospitalization,
  toxicity_risk_factors: Array.isArray(data.toxicity_risk_factors) ? data.toxicity_risk_factors : [],

  // Arrays
  management: Array.isArray(data.management) ? data.management : [],
  dose_guidance: Array.isArray(data.dose_guidance) ? data.dose_guidance : [],
  culprit_drugs: Array.isArray(data.culprit_drugs) ? data.culprit_drugs : [],
  culprit_classes: Array.isArray(data.culprit_classes) ? data.culprit_classes : [],
  intervention_required: Array.isArray(data.intervention_required) ? data.intervention_required : [],
  monitoring_recommendations: Array.isArray(data.monitoring_recommendations) ? data.monitoring_recommendations : [],
  lab_triggers: Array.isArray(data.lab_triggers) ? data.lab_triggers : [],
  related_toxicity_ids: Array.isArray(data.related_toxicity_ids) ? data.related_toxicity_ids : [],

  // Special formats
  monitoring_frequency: {
    initial: data.monitoring_frequency?.initial || 'Not specified',
    followup: data.monitoring_frequency?.followup || 'Not specified',
    longterm: data.monitoring_frequency?.longterm || 'Not specified'
  },
  reference_data: data.reference_data || {},
  source_reference: data.source_reference || '',
  notes: data.notes || '',
  notes_clinical_pearls: data.notes_clinical_pearls || '',
  notes_ui_display: data.notes_ui_display || '',
  toxicity_score_weight: data.toxicity_score_weight || 0,

  // Timestamps
  created_at: data.created_at || new Date().toISOString(),
  updated_at: data.updated_at || new Date().toISOString()
});

/**
 * Fetches all toxicity data from the database
 * @returns Promise resolving to array of toxicity data
 */
export const getAllToxicities = async (): Promise<ToxicityData[]> => {
  try {
    const { data, error } = await supabase
      .from('toxicities')
      .select(`
        id, name, severity, grading_scale, recognition,
        symptoms, signs, imaging, labs, clinical_category,
        symptom_onset, expected_onset, onset_timing_days,
        reversibility, toxicity_type, is_dose_limiting,
        requires_hospitalization, toxicity_risk_factors,
        management, dose_guidance, culprit_drugs,
        culprit_classes, intervention_required,
        monitoring_recommendations, lab_triggers,
        related_toxicity_ids, monitoring_frequency,
        reference_data, source_reference, notes,
        notes_clinical_pearls, notes_ui_display,
        toxicity_score_weight, created_at, updated_at
      `);
    
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

// Add error handling and logging for Supabase queries
export const fetchToxicities = async (): Promise<ToxicityData[]> => {
  try {
    const { data, error } = await supabase.from('toxicities').select('*');
    if (error) {
      console.error('Error fetching toxicities:', error);
      throw error;
    }
    return data.map(sanitizeToxicity);
  } catch (err) {
    console.error('Unexpected error fetching toxicities:', err);
    return [];
  }
};