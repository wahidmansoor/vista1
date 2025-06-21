/**
 * Advanced Treatment Database Service
 * Production-ready Supabase integration for cancer treatment management
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CancerType,
  TreatmentProtocol,
  PatientProfile,
  TreatmentRecommendation,
  TreatmentOutcome,
  ProtocolEffectivenessMetrics,
  BiomarkerResult,
  ImagingResult,
  TreatmentHistory,
  EligibilityStatus,
  ResponseType,
  TreatmentLine
} from '@/types/medical';

// Database error types
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: string,
    public table?: string,
    public operation?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

// Monitoring Alert interface for this service
interface MonitoringAlert {
  id: string;
  patient_id: string;
  protocol_id?: string;
  alert_type: string;
  severity: 'immediate' | 'urgent' | 'routine';
  message: string;
  monitoring_parameter?: string;
  current_value?: string;
  threshold_value?: string;
  action_required: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: Date;
  created_at: Date;
}

export class TreatmentDatabaseService {
  private supabase: SupabaseClient;
  private static instance: TreatmentDatabaseService;
  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  static getInstance(): TreatmentDatabaseService {
    if (!TreatmentDatabaseService.instance) {
      TreatmentDatabaseService.instance = new TreatmentDatabaseService();
    }
    return TreatmentDatabaseService.instance;
  }

  // Cancer Types Management
  async getCancerTypes(): Promise<CancerType[]> {
    try {
      const { data, error } = await this.supabase
        .from('cancer_types')
        .select('*')
        .order('name');

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'cancer_types', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching cancer types:', error);
      throw error;
    }
  }

  async getCancerTypeById(id: string): Promise<CancerType | null> {
    try {
      const { data, error } = await this.supabase
        .from('cancer_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError(error.message, error.code, error.details, 'cancer_types', 'select');
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching cancer type:', error);
      throw error;
    }
  }

  // Treatment Protocols Management
  async getProtocolsForCancer(
    cancerTypeId: string,
    lineOfTherapy?: TreatmentLine,
    includeInactive = false
  ): Promise<TreatmentProtocol[]> {
    try {
      let query = this.supabase
        .from('treatment_protocols')
        .select(`
          *,
          protocol_drugs(
            drug_id,
            dosing_schedule,
            administration_days,
            special_instructions,
            drugs(*)
          )
        `)
        .contains('cancer_type_ids', [cancerTypeId]);

      if (!includeInactive) {
        query = query.eq('is_active', true);
      }

      if (lineOfTherapy) {
        query = query.contains('treatment_lines', [lineOfTherapy]);
      }

      const { data, error } = await query.order('evidence_level').order('name');

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'treatment_protocols', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching protocols for cancer:', error);
      throw error;
    }
  }

  async getProtocolById(id: string): Promise<TreatmentProtocol | null> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_protocols')
        .select(`
          *,
          protocol_drugs(
            drug_id,
            dosing_schedule,
            administration_days,
            special_instructions,
            drugs(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError(error.message, error.code, error.details, 'treatment_protocols', 'select');
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching protocol:', error);
      throw error;
    }
  }

  // Patient Profile Management
  async createPatientProfile(profile: Omit<PatientProfile, 'id' | 'created_at' | 'updated_at'>): Promise<PatientProfile> {
    try {
      const { data, error } = await this.supabase
        .from('patient_profiles')
        .insert([{
          demographics: profile.demographics,
          disease_status: profile.disease_status,
          performance_metrics: profile.performance_metrics,
          laboratory_values: profile.laboratory_values,
          genetic_profile: profile.genetic_profile,
          comorbidities: profile.comorbidities,
          current_medications: profile.current_medications,
          allergies: profile.allergies,
          social_history: profile.social_history
        }])
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'patient_profiles', 'insert');
      
      return data;
    } catch (error) {
      console.error('Error creating patient profile:', error);
      throw error;
    }
  }

  async updatePatientProfile(id: string, updates: Partial<PatientProfile>): Promise<PatientProfile> {
    try {
      const { data, error } = await this.supabase
        .from('patient_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'patient_profiles', 'update');
      
      return data;
    } catch (error) {
      console.error('Error updating patient profile:', error);
      throw error;
    }
  }

  async getPatientProfile(id: string): Promise<PatientProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('patient_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError(error.message, error.code, error.details, 'patient_profiles', 'select');
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      throw error;
    }
  }

  // Treatment Recommendations Management
  async createTreatmentRecommendation(
    recommendation: Omit<TreatmentRecommendation, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TreatmentRecommendation> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_recommendations')
        .insert([recommendation])
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'treatment_recommendations', 'insert');
      
      return data;
    } catch (error) {
      console.error('Error creating treatment recommendation:', error);
      throw error;
    }
  }

  async getTreatmentRecommendations(
    patientId: string,
    limit = 10
  ): Promise<TreatmentRecommendation[]> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_recommendations')
        .select(`
          *,
          treatment_protocols(name, protocol_code, evidence_level)
        `)
        .eq('patient_id', patientId)
        .order('match_score', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'treatment_recommendations', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching treatment recommendations:', error);
      throw error;
    }
  }

  // Treatment Outcomes Management
  async recordTreatmentOutcome(outcome: Omit<TreatmentOutcome, 'id' | 'created_at'>): Promise<TreatmentOutcome> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_outcomes')
        .insert([outcome])
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'treatment_outcomes', 'insert');
      
      // Update protocol effectiveness metrics
      if (outcome.protocol_id) {
        await this.updateProtocolMetrics(outcome.protocol_id);
      }
      
      return data;
    } catch (error) {
      console.error('Error recording treatment outcome:', error);
      throw error;
    }
  }

  async getPatientOutcomes(patientId: string): Promise<TreatmentOutcome[]> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_outcomes')
        .select(`
          *,
          treatment_protocols(name, protocol_code)
        `)
        .eq('patient_id', patientId)
        .order('treatment_start_date', { ascending: false });

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'treatment_outcomes', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching patient outcomes:', error);
      throw error;
    }
  }

  // Protocol Analytics
  async getProtocolEffectiveness(protocolId: string): Promise<ProtocolEffectivenessMetrics | null> {
    try {
      const { data, error } = await this.supabase
        .from('protocol_effectiveness_metrics')
        .select('*')
        .eq('protocol_id', protocolId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new DatabaseError(error.message, error.code, error.details, 'protocol_effectiveness_metrics', 'select');
      }
      
      return data || null;
    } catch (error) {
      console.error('Error fetching protocol effectiveness:', error);
      throw error;
    }
  }

  private async updateProtocolMetrics(protocolId: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('calculate_protocol_effectiveness', {
        protocol_uuid: protocolId
      });

      if (error) {
        console.warn('Error updating protocol metrics:', error);
        // Don't throw here as this is secondary to the main operation
      }
    } catch (error) {
      console.warn('Error calling protocol metrics function:', error);
    }
  }

  // Biomarker Results Management
  async recordBiomarkerResult(result: Omit<BiomarkerResult, 'id' | 'created_at'>): Promise<BiomarkerResult> {
    try {
      const { data, error } = await this.supabase
        .from('biomarker_results')
        .insert([{
          biomarker_id: result.biomarker_id,
          status: result.status,
          value: result.value,
          method: result.method,
          test_date: result.test_date,
          interpretation: result.interpretation
        }])
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'biomarker_results', 'insert');
      
      return data;
    } catch (error) {
      console.error('Error recording biomarker result:', error);
      throw error;
    }
  }

  async getPatientBiomarkers(patientId: string): Promise<BiomarkerResult[]> {
    try {
      const { data, error } = await this.supabase
        .from('biomarker_results')
        .select(`
          *,
          biomarkers(name, type, clinical_significance)
        `)
        .eq('patient_id', patientId)
        .order('test_date', { ascending: false });

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'biomarker_results', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching patient biomarkers:', error);
      throw error;
    }
  }

  // Imaging Results Management
  async recordImagingResult(result: Omit<ImagingResult, 'id' | 'created_at'>): Promise<ImagingResult> {
    try {
      const { data, error } = await this.supabase
        .from('imaging_results')
        .insert([result])
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'imaging_results', 'insert');
      
      return data;
    } catch (error) {
      console.error('Error recording imaging result:', error);
      throw error;
    }
  }

  async getPatientImaging(patientId: string): Promise<ImagingResult[]> {
    try {
      const { data, error } = await this.supabase
        .from('imaging_results')
        .select('*')
        .eq('patient_id', patientId)
        .order('study_date', { ascending: false });

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'imaging_results', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching patient imaging:', error);
      throw error;
    }
  }

  // Treatment History Management
  async addTreatmentHistory(history: Omit<TreatmentHistory, 'id' | 'created_at' | 'updated_at'>): Promise<TreatmentHistory> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_history')
        .insert([history])
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'treatment_history', 'insert');
      
      return data;
    } catch (error) {
      console.error('Error adding treatment history:', error);
      throw error;
    }
  }

  async getPatientTreatmentHistory(patientId: string): Promise<TreatmentHistory[]> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_history')
        .select(`
          *,
          treatment_protocols(name, protocol_code)
        `)
        .eq('patient_id', patientId)
        .order('start_date', { ascending: false });

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'treatment_history', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching treatment history:', error);
      throw error;
    }
  }

  // Monitoring Alerts Management
  async createMonitoringAlert(alert: Omit<MonitoringAlert, 'id' | 'created_at'>): Promise<MonitoringAlert> {
    try {
      const { data, error } = await this.supabase
        .from('monitoring_alerts')
        .insert([alert])
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'monitoring_alerts', 'insert');
      
      return data;
    } catch (error) {
      console.error('Error creating monitoring alert:', error);
      throw error;
    }
  }

  async getActiveAlerts(patientId: string): Promise<MonitoringAlert[]> {
    try {
      const { data, error } = await this.supabase
        .from('monitoring_alerts')
        .select('*')
        .eq('patient_id', patientId)
        .eq('acknowledged', false)
        .order('severity')
        .order('created_at', { ascending: false });

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'monitoring_alerts', 'select');
      
      return data || [];
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      throw error;
    }
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<MonitoringAlert> {
    try {
      const { data, error } = await this.supabase
        .from('monitoring_alerts')
        .update({
          acknowledged: true,
          acknowledged_by: acknowledgedBy,
          acknowledged_at: new Date().toISOString()
        })
        .eq('id', alertId)
        .select()
        .single();

      if (error) throw new DatabaseError(error.message, error.code, error.details, 'monitoring_alerts', 'update');
      
      return data;
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  // Analytics and Reporting
  async getSystemHealthMetrics(): Promise<any> {
    try {
      const [
        totalPatients,
        activeProtocols,
        recentOutcomes,
        pendingAlerts
      ] = await Promise.all([
        this.supabase.from('patient_profiles').select('id', { count: 'exact', head: true }),
        this.supabase.from('treatment_protocols').select('id', { count: 'exact', head: true }).eq('is_active', true),
        this.supabase.from('treatment_outcomes').select('id', { count: 'exact', head: true }).gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        this.supabase.from('monitoring_alerts').select('id', { count: 'exact', head: true }).eq('acknowledged', false)
      ]);

      return {
        total_patients: totalPatients.count || 0,
        active_protocols: activeProtocols.count || 0,
        recent_outcomes: recentOutcomes.count || 0,
        pending_alerts: pendingAlerts.count || 0,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching system health metrics:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const treatmentDb = TreatmentDatabaseService.getInstance();
export default TreatmentDatabaseService;
