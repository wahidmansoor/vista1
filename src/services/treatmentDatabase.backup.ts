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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
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
          patient_id: result.patient_id,
          biomarker_id: result.biomarker_id,
          test_date: result.test_date,
          status: result.status,
          value: result.value,
          unit: result.unit,
          test_method: result.test_method,
          laboratory: result.laboratory,
          clinical_significance: result.clinical_significance
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
export class TreatmentDatabaseService {
  private supabase: SupabaseClient;
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // ==================== CANCER TYPES ==================== //

  /**
   * Get all cancer types with optional filtering
   */
  async getCancerTypes(category?: string): Promise<CancerType[]> {
    try {
      let query = this.supabase
        .from('cancer_types')
        .select('*')
        .order('name');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'cancer_types', 'SELECT');

      return data || [];
    } catch (error) {
      this.handleError(error, 'getCancerTypes');
      throw error;
    }
  }

  /**
   * Get cancer type by ID
   */
  async getCancerType(id: string): Promise<CancerType | null> {
    try {
      const { data, error } = await this.supabase
        .from('cancer_types')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new TreatmentDatabaseError(error.message, error.code, error.details, 'cancer_types', 'SELECT');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'getCancerType');
      throw error;
    }
  }

  // ==================== TREATMENT PROTOCOLS ==================== //
  /**
   * Get treatment protocols with advanced filtering and caching
   */
  async getProtocols(filters: Partial<FilterCriteria> = {}, sort: SortOrder = { field: 'name', direction: 'asc' }): Promise<TreatmentProtocol[]> {
    try {
      const cacheKey = `protocols_${JSON.stringify(filters)}_${JSON.stringify(sort)}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      let query = this.supabase
        .from('treatment_protocols')
        .select(`
          *,
          protocol_effectiveness_metrics(*)
        `)
        .eq('is_active', true);

      // Apply filters
      if (filters.cancer_types?.length) {
        query = query.overlaps('cancer_types', filters.cancer_types);
      }

      if (filters.treatment_lines?.length) {
        query = query.overlaps('treatment_lines', filters.treatment_lines);
      }

      if (filters.evidence_levels?.length) {
        query = query.in('evidence_level', filters.evidence_levels);
      }

      // Apply sorting
      query = query.order(sort.field, { ascending: sort.direction === 'asc' });

      const { data, error } = await query;
      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'treatment_protocols', 'SELECT');

      const protocols = data || [];
      this.setCache(cacheKey, protocols);

      return protocols;
    } catch (error) {
      this.handleError(error, 'getProtocols');
      throw error;
    }
  }

  /**
   * Get protocols specifically for a cancer type and treatment line
   */
  async getProtocolsForCancer(cancerTypeId: string, lineOfTherapy?: string): Promise<TreatmentProtocol[]> {
    try {
      let query = this.supabase
        .from('treatment_protocols')
        .select(`
          *,
          protocol_effectiveness_metrics(*)
        `)
        .contains('cancer_types', [cancerTypeId])
        .eq('is_active', true);

      if (lineOfTherapy) {
        query = query.contains('treatment_lines', [lineOfTherapy]);
      }

      const { data, error } = await query;
      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'treatment_protocols', 'SELECT');

      return data || [];
    } catch (error) {
      this.handleError(error, 'getProtocolsForCancer');
      throw error;
    }
  }

  /**
   * Get single protocol by ID with full details
   */
  async getProtocol(id: string): Promise<TreatmentProtocol | null> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_protocols')
        .select(`
          *,
          protocol_effectiveness_metrics(*)
        `)
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new TreatmentDatabaseError(error.message, error.code, error.details, 'treatment_protocols', 'SELECT');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'getProtocol');
      throw error;
    }
  }

  // ==================== PATIENT MANAGEMENT ==================== //

  /**
   * Create new patient profile
   */
  async createPatient(patientData: Omit<PatientProfile, 'id' | 'created_at' | 'updated_at'>): Promise<PatientProfile> {
    try {
      // Validate patient data
      const validation = this.validatePatientData(patientData);
      if (!validation.valid) {
        throw new TreatmentDatabaseError(
          `Validation failed: ${validation.errors.map(e => e.message).join(', ')}`,
          'VALIDATION_ERROR',
          'Invalid patient data',
          'patient_profiles',
          'INSERT'
        );
      }

      const { data, error } = await this.supabase
        .from('patient_profiles')
        .insert(patientData)
        .select()
        .single();

      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'patient_profiles', 'INSERT');

      return data;
    } catch (error) {
      this.handleError(error, 'createPatient');
      throw error;
    }
  }

  /**
   * Update patient profile
   */
  async updatePatient(id: string, updates: Partial<PatientProfile>): Promise<PatientProfile> {
    try {
      const { data, error } = await this.supabase
        .from('patient_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'patient_profiles', 'UPDATE');

      return data;
    } catch (error) {
      this.handleError(error, 'updatePatient');
      throw error;
    }
  }

  /**
   * Get patient profile by ID
   */
  async getPatient(id: string): Promise<PatientProfile | null> {
    try {
      const { data, error } = await this.supabase
        .from('patient_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new TreatmentDatabaseError(error.message, error.code, error.details, 'patient_profiles', 'SELECT');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'getPatient');
      throw error;
    }
  }

  /**
   * Get patient treatment history
   */
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

      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'treatment_history', 'SELECT');

      return data || [];
    } catch (error) {
      this.handleError(error, 'getPatientTreatmentHistory');
      throw error;
    }
  }

  // ==================== TREATMENT MATCHING ==================== //

  /**
   * Generate treatment recommendations for a patient
   */
  async generateTreatmentRecommendations(request: TreatmentMatchRequest): Promise<TreatmentMatchResponse> {
    try {
      const patient = await this.getPatient(request.patient_id);
      if (!patient) {
        throw new TreatmentDatabaseError('Patient not found', 'PATIENT_NOT_FOUND', undefined, 'patient_profiles', 'SELECT');
      }

      // Get eligible protocols
      const protocols = await this.getEligibleProtocols(patient, request);

      // Calculate match scores and generate recommendations
      const recommendations: TreatmentRecommendation[] = [];
      
      for (const protocol of protocols) {
        const match = await this.calculateProtocolMatch(patient, protocol);
        
        if (match.match_score > 0.3) { // Minimum threshold
          const recommendation: TreatmentRecommendation = {
            id: crypto.randomUUID(),
            patient_id: request.patient_id,
            protocol_id: protocol.id,
            match_score: match.match_score,
            eligibility_status: match.eligibility_assessment.eligible ? 'eligible' : 
                             match.eligibility_assessment.violations.length > 0 ? 'partially_eligible' : 'ineligible',
            contraindications: match.safety_concerns.filter(c => c.category === 'contraindication').map(c => c.description),
            warnings: match.safety_concerns.filter(c => c.category === 'precaution').map(c => c.description),
            recommended_modifications: match.eligibility_assessment.modifications_needed.map(mod => ({
              parameter: mod,
              modification: 'Adjust based on patient factors',
              reason: 'Patient-specific optimization',
              impact_on_efficacy: 'minimal' as const
            })),
            confidence_level: this.calculateConfidenceLevel(match.match_score, match.eligibility_assessment),
            evidence_summary: `Based on ${protocol.evidence_level} level evidence from ${protocol.guideline_sources.join(', ')}`,
            alternative_options: [],
            generated_at: new Date(),
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          };

          recommendations.push(recommendation);
        }
      }

      // Sort by match score
      recommendations.sort((a, b) => b.match_score - a.match_score);

      // Limit results
      const limitedRecommendations = recommendations.slice(0, request.max_results || 5);

      // Save recommendations to database
      if (limitedRecommendations.length > 0) {
        await this.saveRecommendations(limitedRecommendations);
      }

      return {
        recommendations: limitedRecommendations,
        total_protocols_evaluated: protocols.length,
        evaluation_criteria: ['eligibility', 'safety', 'efficacy', 'evidence_level'],
        generated_at: new Date(),
        valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };

    } catch (error) {
      this.handleError(error, 'generateTreatmentRecommendations');
      throw error;
    }
  }

  /**
   * Save treatment recommendations
   */
  private async saveRecommendations(recommendations: TreatmentRecommendation[]): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('treatment_recommendations')
        .insert(recommendations);

      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'treatment_recommendations', 'INSERT');
    } catch (error) {
      this.handleError(error, 'saveRecommendations');
      throw error;
    }
  }

  /**
   * Get eligible protocols for a patient
   */
  private async getEligibleProtocols(patient: PatientProfile, request: TreatmentMatchRequest): Promise<TreatmentProtocol[]> {
    let query = this.supabase
      .from('treatment_protocols')
      .select('*')
      .eq('is_active', true);

    // Filter by cancer type if specified
    if (request.cancer_type_id || patient.disease_status.cancer_type_id) {
      const cancerTypeId = request.cancer_type_id || patient.disease_status.cancer_type_id;
      query = query.contains('cancer_types', [cancerTypeId]);
    }

    // Filter by treatment line if specified
    if (request.treatment_line) {
      query = query.contains('treatment_lines', [request.treatment_line]);
    }

    // Include experimental protocols if requested
    if (!request.include_experimental) {
      query = query.in('evidence_level', ['A', 'B', 'C']);
    }

    const { data, error } = await query;
    if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'treatment_protocols', 'SELECT');

    return data || [];
  }

  /**
   * Calculate protocol match score and assessment
   */
  private async calculateProtocolMatch(patient: PatientProfile, protocol: TreatmentProtocol): Promise<ProtocolMatch> {
    // This is a simplified version - in production, this would be much more sophisticated
    let matchScore = 0;
    const eligibilityViolations: string[] = [];
    const safetyConcerns: any[] = [];

    // Performance status matching (30% weight)
    const performanceScore = this.scorePerformanceStatus(patient, protocol);
    matchScore += performanceScore * 0.3;

    // Stage appropriateness (20% weight)
    const stageScore = this.scoreStageMatch(patient, protocol);
    matchScore += stageScore * 0.2;

    // Organ function adequacy (25% weight)
    const organScore = this.scoreOrganFunction(patient, protocol);
    matchScore += organScore * 0.25;

    // Biomarker compatibility (25% weight)
    const biomarkerScore = await this.scoreBiomarkers(patient, protocol);
    matchScore += biomarkerScore * 0.25;

    // Check for violations and safety concerns
    if (performanceScore < 0.5) {
      eligibilityViolations.push('Performance status below threshold');
    }

    if (organScore < 0.5) {
      eligibilityViolations.push('Inadequate organ function');
      safetyConcerns.push({
        category: 'contraindication',
        description: 'Organ function below protocol requirements',
        severity: 'high',
        mitigation_strategies: ['Consider dose reduction', 'Enhanced monitoring'],
        monitoring_requirements: ['Weekly lab monitoring']
      });
    }

    return {
      protocol,
      match_score: Math.min(matchScore, 1.0),
      eligibility_assessment: {
        eligible: eligibilityViolations.length === 0,
        violations: eligibilityViolations,
        modifications_needed: eligibilityViolations.length > 0 ? ['Dose modification may be required'] : [],
        risk_factors: [],
        alternative_approaches: []
      },
      safety_concerns: safetyConcerns,
      implementation_notes: []
    };
  }

  // Scoring helper methods
  private scorePerformanceStatus(patient: PatientProfile, protocol: TreatmentProtocol): number {
    const ecogScore = patient.performance_metrics.ecog_score;
    const requiredEcog = protocol.eligibility_criteria.performance_status.ecog;
    
    if (requiredEcog.includes(ecogScore)) {
      return 1.0;
    } else if (ecogScore <= Math.max(...requiredEcog) + 1) {
      return 0.7;
    } else {
      return 0.3;
    }
  }

  private scoreStageMatch(patient: PatientProfile, protocol: TreatmentProtocol): number {
    const patientStage = patient.disease_status.stage;
    const protocolStages = protocol.eligibility_criteria.stage_requirements;
    
    if (protocolStages.includes(patientStage) || protocolStages.includes('Any')) {
      return 1.0;
    } else {
      return 0.5; // Partial match based on disease extent
    }
  }

  private scoreOrganFunction(patient: PatientProfile, protocol: TreatmentProtocol): number {
    // Simplified organ function scoring
    // In production, this would analyze actual lab values against protocol requirements
    const organFunction = protocol.eligibility_criteria.organ_function;
    
    // Assume patient meets basic organ function requirements for now
    // This would be replaced with actual lab value analysis
    return 0.8;
  }

  private async scoreBiomarkers(patient: PatientProfile, protocol: TreatmentProtocol): Promise<number> {
    // Simplified biomarker scoring
    // In production, this would match patient genetic profile against protocol requirements
    const requiredBiomarkers = protocol.eligibility_criteria.biomarkers;
    
    if (requiredBiomarkers.length === 0) {
      return 1.0; // No biomarker requirements
    }
    
    // Simplified scoring - would need actual biomarker matching logic
    return 0.7;
  }
  private calculateConfidenceLevel(matchScore: number, eligibility: EligibilityAssessment): 'low' | 'moderate' | 'high' | 'very_high' {
    if (matchScore >= 0.9 && eligibility.eligible) {
      return 'very_high';
    } else if (matchScore >= 0.7 && eligibility.eligible) {
      return 'high';
    } else if (matchScore >= 0.5) {
      return 'moderate';
    } else {
      return 'low';
    }
  }

  // ==================== OUTCOMES TRACKING ==================== //

  /**
   * Record treatment outcome
   */
  async recordTreatmentOutcome(outcome: Omit<TreatmentOutcome, 'id' | 'recorded_at'>): Promise<TreatmentOutcome> {
    try {
      const { data, error } = await this.supabase
        .from('treatment_outcomes')
        .insert({
          ...outcome,
          recorded_at: new Date()
        })
        .select()
        .single();

      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'treatment_outcomes', 'INSERT');

      // Trigger effectiveness metrics recalculation
      await this.updateProtocolEffectivenessMetrics(outcome.protocol_id);

      return data;
    } catch (error) {
      this.handleError(error, 'recordTreatmentOutcome');
      throw error;
    }
  }

  /**
   * Get protocol effectiveness metrics
   */
  async getProtocolEffectiveness(protocolId: string): Promise<ProtocolEffectivenessMetrics | null> {
    try {
      const { data, error } = await this.supabase
        .from('protocol_effectiveness_metrics')
        .select('*')
        .eq('protocol_id', protocolId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new TreatmentDatabaseError(error.message, error.code, error.details, 'protocol_effectiveness_metrics', 'SELECT');
      }

      return data;
    } catch (error) {
      this.handleError(error, 'getProtocolEffectiveness');
      throw error;
    }
  }

  /**
   * Update protocol effectiveness metrics
   */
  private async updateProtocolEffectivenessMetrics(protocolId: string): Promise<void> {
    try {
      const { error } = await this.supabase.rpc('calculate_protocol_effectiveness', {
        protocol_uuid: protocolId
      });

      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'protocol_effectiveness_metrics', 'UPDATE');
    } catch (error) {
      this.handleError(error, 'updateProtocolEffectivenessMetrics');
      // Don't re-throw as this is a background operation
      console.error('Failed to update protocol effectiveness metrics:', error);
    }
  }

  // ==================== REFERENCE DATA ==================== //

  /**
   * Get biomarkers
   */
  async getBiomarkers(): Promise<Biomarker[]> {
    try {
      const cached = this.getFromCache('biomarkers');
      if (cached) return cached;

      const { data, error } = await this.supabase
        .from('biomarkers')
        .select('*')
        .order('name');

      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'biomarkers', 'SELECT');

      const biomarkers = data || [];
      this.setCache('biomarkers', biomarkers);

      return biomarkers;
    } catch (error) {
      this.handleError(error, 'getBiomarkers');
      throw error;
    }
  }

  /**
   * Get drug interactions
   */
  async getDrugInteractions(drugA: string, drugB?: string): Promise<DrugInteraction[]> {
    try {
      let query = this.supabase
        .from('drug_interactions')
        .select('*');

      if (drugB) {
        query = query.or(`and(drug_a.eq.${drugA},drug_b.eq.${drugB}),and(drug_a.eq.${drugB},drug_b.eq.${drugA})`);
      } else {
        query = query.or(`drug_a.eq.${drugA},drug_b.eq.${drugA}`);
      }

      const { data, error } = await query;
      if (error) throw new TreatmentDatabaseError(error.message, error.code, error.details, 'drug_interactions', 'SELECT');

      return data || [];
    } catch (error) {
      this.handleError(error, 'getDrugInteractions');
      throw error;
    }
  }

  // ==================== UTILITY METHODS ==================== //

  /**
   * Validate patient data
   */
  private validatePatientData(data: any): ValidationResult {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Required fields validation
    if (!data.demographics?.age) {
      errors.push({ field: 'demographics.age', message: 'Age is required', severity: 'error' });
    }

    if (!data.disease_status?.cancer_type_id) {
      errors.push({ field: 'disease_status.cancer_type_id', message: 'Cancer type is required', severity: 'error' });
    }

    if (!data.performance_metrics?.ecog_score && data.performance_metrics?.ecog_score !== 0) {
      warnings.push({ field: 'performance_metrics.ecog_score', message: 'ECOG score is recommended', recommendation: 'Assess performance status' });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + this.CACHE_DURATION
    });
  }

  /**
   * Error handling
   */
  private handleError(error: any, operation: string): void {
    console.error(`TreatmentDatabaseService.${operation}:`, error);
    
    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Add monitoring/logging service integration here
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      const { data, error } = await this.supabase
        .from('cancer_types')
        .select('count')
        .limit(1);

      if (error) {
        return {
          status: 'unhealthy',
          details: { error: error.message, code: error.code }
        };
      }

      return {
        status: 'healthy',
        details: { connection: 'ok', cache_size: this.cache.size }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}

// Export singleton instance
export const treatmentDatabase = new TreatmentDatabaseService();
