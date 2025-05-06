import { CancerType } from '../modules/opd/types/evaluation';
import { supabase } from '../lib/supabaseClient';

interface PatientEvaluation {
  cancerType: CancerType;
  formData: Record<string, string>;
  timestamp: string;
}

class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function savePatientEvaluation(data: PatientEvaluation): Promise<void> {
  const { error } = await supabase
    .from('patient_evaluations')
    .insert([{
      cancer_type: data.cancerType,
      form_data: data.formData,
      timestamp: data.timestamp
    }]);

  if (error) {
    console.error('Failed to save patient evaluation:', error);
    throw new APIError(error.message);
  }
}

export async function getPatientEvaluations(): Promise<PatientEvaluation[]> {
  const { data, error } = await supabase
    .from('patient_evaluations')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error('Failed to fetch patient evaluations:', error);
    throw new APIError(error.message);
  }

  return data.map(row => ({
    cancerType: row.cancer_type,
    formData: row.form_data,
    timestamp: row.timestamp
  }));
}

export async function getPatientEvaluation(id: string): Promise<PatientEvaluation> {
  const { data, error } = await supabase
    .from('patient_evaluations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch patient evaluation:', error);
    throw new APIError(error.message);
  }

  return {
    cancerType: data.cancer_type,
    formData: data.form_data,
    timestamp: data.timestamp
  };
}