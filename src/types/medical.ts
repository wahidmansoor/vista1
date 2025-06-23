/**
 * Advanced Cancer Treatment Management System - Complete TypeScript Definitions
 * Production-ready types with strict validation and clinical accuracy
 * 
 * This comprehensive type system provides:
 * - Evidence-based treatment protocol matching
 * - Real-time clinical decision support
 * - Complete patient profile management
 * - Treatment outcome tracking and analytics
 * - Regulatory compliance support (HIPAA-ready)
 * 
 * @version 2.0.0
 * @author Advanced Cancer Treatment Management System
 * @lastUpdated 2025-06-14
 */

// Base types and enums
export type CancerCategory = 'solid_tumor' | 'hematologic' | 'rare_cancer' | 'pediatric' | 'adolescent_young_adult';
export type EvidenceLevel = 'A' | 'B' | 'C' | 'D' | 'E'; // Added E for expert opinion
export type TriageLevel = 'immediate' | 'urgent' | 'routine' | 'deferred';
export type TreatmentLine = 'first' | 'second' | 'third' | 'fourth_plus' | 'salvage' | 'maintenance' | 'bridging';
export type TreatmentIntent = 'curative' | 'adjuvant' | 'neoadjuvant' | 'palliative' | 'supportive' | 'investigational';
export type ResponseType = 'complete_response' | 'partial_response' | 'stable_disease' | 'progressive_disease' | 'not_evaluable' | 'mixed_response';
export type EligibilityStatus = 'eligible' | 'partially_eligible' | 'ineligible' | 'contraindicated' | 'requires_review';

// Enhanced Performance Status Types
export type ECOGScore = 0 | 1 | 2 | 3 | 4 | 5;
export type KarnofskyScore = 100 | 90 | 80 | 70 | 60 | 50 | 40 | 30 | 20 | 10 | 0;

// Enhanced Disease and Treatment Types
export type DiseaseExtent = 'localized' | 'regional' | 'distant' | 'oligometastatic' | 'unknown';
export type ToxicityGrade = 0 | 1 | 2 | 3 | 4 | 5; // Added grade 0 for no toxicity
export type BiomarkerStatus = 'positive' | 'negative' | 'unknown' | 'pending' | 'indeterminate' | 'low' | 'high' | 'intermediate';
export type OrganFunctionStatus = 'adequate' | 'borderline' | 'inadequate' | 'unknown' | 'not_assessed';

// Drug administration types - expanded for precision medicine
export type DrugClass = 
  | 'alkylating_agent'
  | 'antimetabolite'
  | 'topoisomerase_inhibitor'
  | 'antimicrotubule'
  | 'targeted_therapy'
  | 'immunotherapy'
  | 'hormone_therapy'
  | 'supportive_care'
  | 'monoclonal_antibody'
  | 'small_molecule_inhibitor'
  | 'car_t_therapy'
  | 'vaccine_therapy'
  | 'radiation_sensitizer';

export type AdministrationRoute = 
  | 'IV_push'
  | 'IV_infusion'
  | 'oral'
  | 'subcutaneous'
  | 'intrathecal'
  | 'intraperitoneal'
  | 'intravesical'
  | 'intramuscular'
  | 'topical'
  | 'inhalation'
  | 'sublingual';

// Treatment matching confidence levels
export type MatchConfidence = 'very_high' | 'high' | 'medium' | 'low' | 'very_low';

// Clinical decision support levels
export type DecisionSupportLevel = 'automated' | 'suggested' | 'requires_review' | 'manual_only';

// Quality metrics
export type QualityMetric = 'excellent' | 'good' | 'acceptable' | 'needs_improvement' | 'poor';

// Supporting interfaces for enhanced cancer management
export interface StagingSystem {
  name: string; // e.g., "TNM", "Ann Arbor", "FIGO"
  version: string;
  applicable_cancers: string[];
  description: string;
  components: StagingComponent[];
}

export interface StagingComponent {
  component: string; // e.g., "T", "N", "M"
  description: string;
  possible_values: string[];
  clinical_significance: string;
}

export interface RiskStratification {
  system_name: string;
  risk_categories: RiskCategory[];
  decision_tree: DecisionNode[];
  validation_studies: ValidationStudy[];
}

export interface RiskCategory {
  name: string; // e.g., "Low Risk", "Intermediate Risk", "High Risk"
  criteria: string[];
  treatment_implications: string[];
  prognosis: PrognosisData;
  monitoring_frequency: string;
}

export interface DecisionNode {
  id: string;
  criteria: string;
  branches: DecisionBranch[];
  evidence_level: EvidenceLevel;
}

export interface DecisionBranch {
  condition: string;
  next_node?: string;
  recommendation?: string;
  confidence: MatchConfidence;
}

export interface ValidationStudy {
  study_name: string;
  publication_year: number;
  sample_size: number;
  validation_type: 'internal' | 'external' | 'prospective';
  performance_metrics: ModelPerformanceMetrics;
}

export interface ModelPerformanceMetrics {
  sensitivity: number;
  specificity: number;
  positive_predictive_value: number;
  negative_predictive_value: number;
  c_index?: number;
  auc_roc?: number;
}

export interface ScreeningGuideline {
  organization: string; // e.g., "USPSTF", "ACS", "NCCN"
  target_population: string;
  screening_method: string;
  frequency: string;
  age_range: [number, number];
  risk_factors: string[];
  evidence_level: EvidenceLevel;
  last_updated: Date;
}

export interface GeneticPredisposition {
  syndrome_name: string;
  associated_genes: string[];
  inheritance_pattern: 'autosomal_dominant' | 'autosomal_recessive' | 'x_linked' | 'multifactorial';
  penetrance: number; // 0-1
  cancer_risks: CancerRisk[];
  screening_recommendations: string[];
  family_testing_criteria: string[];
}

export interface CancerRisk {
  cancer_type: string;
  lifetime_risk: number; // percentage
  age_of_onset_range: [number, number];
  risk_modifiers: string[];
}

export interface EpidemiologyData {
  incidence_rate: number; // per 100,000
  mortality_rate: number; // per 100,000
  five_year_survival: number;
  median_age_diagnosis: number;
  gender_distribution: {
    male: number;
    female: number;
  };
  racial_ethnic_distribution: Record<string, number>;
  geographic_variation: GeographicData[];
  temporal_trends: TemporalTrend[];
}

export interface GeographicData {
  region: string;
  incidence_rate: number;
  mortality_rate: number;
  risk_factors: string[];
}

export interface TemporalTrend {
  year_range: [number, number];
  incidence_change: number; // percentage change
  mortality_change: number; // percentage change
  contributing_factors: string[];
}

export interface FollowUpSchedule {
  intent: TreatmentIntent;
  schedule_by_year: FollowUpYear[];
  surveillance_tests: SurveillanceTest[];
  symptom_monitoring: string[];
  quality_of_life_assessments: string[];
  late_effects_monitoring: LateEffectsMonitoring[];
}

export interface FollowUpYear {
  year: number;
  frequency: string; // e.g., "every 3 months", "every 6 months"
  required_assessments: string[];
  imaging_requirements: string[];
  laboratory_tests: string[];
}

export interface SurveillanceTest {
  test_name: string;
  indication: string;
  frequency: string;
  duration_years: number;
  evidence_level: EvidenceLevel;
  cost_effectiveness: QualityMetric;
}

export interface LateEffectsMonitoring {
  effect_category: string; // e.g., "Cardiotoxicity", "Secondary Malignancies"
  risk_factors: string[];
  monitoring_tests: string[];
  onset_timeframe: string;
  management_guidelines: string[];
}

export interface QualityMeasure {
  measure_name: string;
  measure_type: 'process' | 'outcome' | 'structure' | 'patient_reported';
  description: string;
  numerator: string;
  denominator: string;
  target_performance: number;
  data_source: string;
  reporting_frequency: string;  quality_organization: string; // e.g., "ASCO", "NCCN", "CMS"
}

// Advanced precision medicine and clinical decision support interfaces
export interface BiomarkerRequirement {
  biomarker_id: string;
  biomarker_name: string;
  test_method: string;
  required_result: string; // e.g., "positive", ">50%", "mutation detected"
  alternative_tests: string[];
  turnaround_time_days: number;
  cost_estimate: number;
  laboratory_requirements: string[];
  interpretation_guidelines: string[];
  expected_status?: BiomarkerStatus; // Added for treatmentMatchingEngine.ts compatibility
}

export interface ExcludedBiomarker {
  biomarker_id: string;
  biomarker_name: string;
  excluded_status: BiomarkerStatus;
  test_method?: string;
  rationale?: string;
}

export interface CompanionDiagnostic {
  fda_approval_id: string;
  test_name: string;
  manufacturer: string;
  target_biomarker: string;
  approved_indications: string[];
  sensitivity: number;
  specificity: number;
  clinical_utility: string;
  limitations: string[];
}

export interface MolecularTarget {
  target_name: string;
  target_type: 'protein' | 'pathway' | 'dna_repair' | 'immune_checkpoint' | 'growth_factor';
  mechanism_of_action: string;
  pathway_involvement: string[];
  resistance_patterns: string[];
  combination_opportunities: string[];
  clinical_validation_level: EvidenceLevel;
}

export interface ResistanceMechanism {
  mechanism_type: 'primary' | 'acquired' | 'adaptive';
  description: string;
  molecular_basis: string[];
  biomarkers: string[];
  override_strategies: OverrideStrategy[];
  clinical_implications: string[];
}

export interface OverrideStrategy {
  strategy_type: 'dose_escalation' | 'combination_therapy' | 'sequential_therapy' | 'alternative_target';
  description: string;
  success_rate: number;
  evidence_level: EvidenceLevel;
  safety_considerations: string[];
}

export interface AlertCondition {
  condition_id: string;
  trigger_type: 'laboratory' | 'clinical' | 'imaging' | 'patient_reported';
  trigger_criteria: string;
  alert_level: 'info' | 'warning' | 'critical' | 'emergency';
  action_required: string;
  escalation_path: string[];
  auto_resolve: boolean;
  documentation_required: boolean;
}

export interface DrugInteraction {
  interaction_type: 'contraindicated' | 'major' | 'moderate' | 'minor';
  interacting_drug: string;
  mechanism: string;
  clinical_effect: string;
  management_strategy: string;
  monitoring_requirements: string[];
  alternative_options: string[];
  severity_score: number; // 1-10
}

export interface ProtocolQualityMetric {
  metric_name: string;
  target_value: number;
  current_performance: number;
  measurement_method: string;
  improvement_strategies: string[];
  benchmark_source: string;
}

export interface RegulatoryApproval {
  agency: string; // e.g., "FDA", "EMA", "PMDA"
  approval_type: 'regular' | 'accelerated' | 'breakthrough' | 'orphan';
  approval_date: Date;
  indication: string;
  restrictions: string[];
  post_market_requirements: string[];
}

export interface ClinicalTrialData {
  trial_id: string;
  phase: 'I' | 'II' | 'III' | 'IV';
  primary_endpoint: string;
  secondary_endpoints: string[];
  sample_size: number;
  study_design: string;
  key_results: TrialResult[];
  publication_reference: string;
  data_cutoff_date: Date;
}

export interface TrialResult {
  endpoint: string;
  result_value: string;
  confidence_interval: string;
  p_value?: number;
  clinical_significance: string;
}

export interface CostEffectivenessData {
  cost_per_cycle: number;
  cost_per_response: number;
  cost_per_qaly?: number; // Quality-Adjusted Life Year
  cost_comparison: CostComparison[];
  economic_model: string;
  perspective: 'healthcare_system' | 'societal' | 'patient';
  time_horizon_months: number;
}

export interface CostComparison {
  comparator: string;
  cost_difference: number;
  effectiveness_difference: number;
  incremental_cost_effectiveness_ratio: number;
}

export interface ResourceRequirement {
  resource_type: 'personnel' | 'equipment' | 'facility' | 'consumable';
  description: string;
  quantity_required: number;
  availability_requirement: 'continuous' | 'scheduled' | 'on_demand';
  cost_per_cycle: number;
  training_required: boolean;
}

// Core medical entities - Enhanced for comprehensive cancer management
export interface CancerType {
  id: string;
  name: string;
  icd10_code: string;
  icd_o3_code?: string; // International Classification of Diseases for Oncology
  category: CancerCategory;
  primary_site: string;
  anatomical_location: string[];
  common_stages: Stage[];
  biomarkers: Biomarker[];
  treatment_protocols: string[]; // References to protocol IDs
  staging_systems: StagingSystem[];
  risk_stratification: RiskStratification;
  screening_guidelines: ScreeningGuideline[];
  genetic_predisposition: GeneticPredisposition[];
  epidemiology: EpidemiologyData;
  prognosis_factors: PrognosisFactor[];
  follow_up_schedule: FollowUpSchedule;
  quality_measures: QualityMeasure[];
  clinical_trials_available: boolean;
  molecular_profiling_required: boolean;
  multidisciplinary_team_required: boolean;
  created_at: Date;
  updated_at: Date;
  version: string;
  guideline_source: string;
  last_guideline_update: Date;
}

export interface Stage {
  id: string;
  name: string;
  code: string; // TNM staging code
  t_stage?: string;
  n_stage?: string;
  m_stage?: string;
  grade?: string;
  description: string;
  prognosis: PrognosisData;
  prognosis_factors: PrognosisFactor[];
}

export interface PrognosisData {
  five_year_survival: number;
  median_survival_months?: number;
  recurrence_risk: 'low' | 'moderate' | 'high';
}

export interface PrognosisFactor {
  name: string;
  value: string;
  impact: 'favorable' | 'unfavorable' | 'neutral' | 'unknown';
  weight: number; // 0-1 for AI scoring
}

export interface Biomarker {
  id: string;
  name: string;
  gene: string;
  type: 'mutation' | 'expression' | 'fusion' | 'amplification' | 'deletion';
  clinical_significance: 'diagnostic' | 'prognostic' | 'predictive' | 'therapeutic';
  actionable: boolean;
  targeted_therapies: TargetedTherapy[];
  frequency_by_cancer: Record<string, number>; // cancer_type_id -> frequency %
  testing_method: string;
}

export interface TargetedTherapy {
  drug_name: string;
  mechanism: string;
  approval_status: 'approved' | 'investigational' | 'off_label';
  cancer_types: string[];
  biomarker_requirements: string[];
  evidence_level: EvidenceLevel;
}

// Treatment Protocol System - Enhanced for precision medicine and clinical decision support
export interface TreatmentProtocol {
  id: string;
  name: string;
  protocol_code: string;
  short_name: string;
  cancer_types: string[];
  line_of_therapy: TreatmentLine;
  treatment_intent: TreatmentIntent;
  eligibility_criteria: EligibilityCriteria;
  treatment_schedule: TreatmentSchedule;
  drugs: ProtocolDrug[];
  contraindications: Contraindication[];
  monitoring_requirements: MonitoringPlan[];
  expected_outcomes: OutcomeMetrics;
  evidence_level: EvidenceLevel;
  guideline_source: string;
  
  // Enhanced precision medicine features
  biomarker_requirements: BiomarkerRequirement[];
  companion_diagnostics: CompanionDiagnostic[];
  molecular_targets: MolecularTarget[];
  resistance_mechanisms: ResistanceMechanism[];
  
  // Clinical decision support
  decision_support_level: DecisionSupportLevel;
  automated_eligibility_check: boolean;
  alert_conditions: AlertCondition[];
  drug_interactions: DrugInteraction[];
  
  // Quality and compliance
  quality_metrics: ProtocolQualityMetric[];
  regulatory_approvals: RegulatoryApproval[];
  clinical_trial_data: ClinicalTrialData[];
  cost_effectiveness_data: CostEffectivenessData;
  
  // Operational data
  implementation_complexity: 'low' | 'medium' | 'high';
  resource_requirements: ResourceRequirement[];
  training_requirements: string[];
  
  // Metadata
  last_updated: Date;
  version: string;
  is_active: boolean;
  deprecation_date?: Date;
  replacement_protocol_id?: string;
  clinical_trial_eligible?: boolean;
  
  // Audit trail
  created_by: string;
  approved_by: string[];
  approval_date: Date;
  review_cycle_months: number;
  next_review_date: Date;
}

export interface EligibilityCriteria {
  performance_status: {
    ecog_range: [number, number];
    karnofsky_range: [number, number];
  };
  organ_function: OrganFunction;
  biomarkers: BiomarkerCriteria[];
  stage_requirements: string[];
  age_range?: [number, number];
  exclusion_criteria: string[];
  comorbidity_restrictions: string[];
  prior_treatment_requirements: string[];
  // Added missing properties for treatmentMatchingEngine.ts
  stages?: string[];
  required_biomarkers?: BiomarkerRequirement[];
  excluded_biomarkers?: ExcludedBiomarker[];
  max_ecog_score?: number;
  min_age?: number;
  max_age?: number;
}

export interface OrganFunction {
  renal: {
    creatinine_max?: number;
    clearance_min?: number;
    unit: 'mg/dL' | 'mL/min';
  };
  hepatic: {
    bilirubin_max?: number;
    alt_max?: number;
    ast_max?: number;
    unit: 'mg/dL' | 'U/L';
  };
  cardiac: {
    lvef_min?: number;
    ecg_requirements?: string[];
  };
  pulmonary: {
    dlco_min?: number;
    fev1_min?: number;
    requirements?: string[];
  };
  hematologic: {
    anc_min?: number;
    platelet_min?: number;
    hemoglobin_min?: number;
  };
}

export interface BiomarkerCriteria {
  biomarker_id: string;
  required_status: 'positive' | 'negative' | 'any';
  threshold?: number;
  method: string;
}

export interface TreatmentSchedule {
  cycle_length_days: number;
  total_cycles?: number;
  frequency: 'daily' | 'weekly' | 'every_2_weeks' | 'every_3_weeks' | 'monthly';
  duration_weeks?: number;
  rest_periods: RestPeriod[];
}

export interface RestPeriod {
  after_cycle: number;
  duration_days: number;
  reason: string;
}

export interface ProtocolDrug {
  id: string;
  name: string;
  generic_name: string;
  drug_class: DrugClass;
  dose: string;
  dose_unit: 'mg' | 'mg/m2' | 'mg/kg' | 'units' | 'mL';
  administration_route: AdministrationRoute;
  schedule: DrugSchedule;
  duration: string;
  premedications?: Medication[];
  special_instructions: string[];
  monitoring_requirements: string[];
  dose_modifications: DoseModification[];
}

export interface DrugSchedule {
  day_of_cycle: number[];
  time_of_day?: string;
  infusion_duration?: number;
  infusion_duration_unit?: 'minutes' | 'hours';
}

export interface DoseModification {
  condition: string;
  action: 'reduce' | 'hold' | 'discontinue';
  dose_reduction_percent?: number;
  alternative_drug?: string;
  rationale: string;
}

export interface Medication {
  name: string;
  dose: string;
  route: AdministrationRoute;
  timing: string; // relative to main drug
  required: boolean;
}

export interface Contraindication {
  id: string;
  condition: string;
  severity: 'absolute' | 'relative';
  rationale: string;
  alternative_options?: string[];
  // Added missing properties for treatmentMatchingEngine.ts
  type?: 'absolute' | 'relative';
  reason?: string;
}

export interface MonitoringPlan {
  parameter: string;
  frequency: string;
  method: string;
  normal_range?: string;
  action_thresholds: ActionThreshold[];
}

export interface ActionThreshold {
  condition: string;
  action: string;
  urgency: 'immediate' | 'same_day' | 'next_visit' | 'routine';
}

export interface OutcomeMetrics {
  response_rates: {
    overall_response: number;
    complete_response: number;
    partial_response: number;
    stable_disease: number;
    progressive_disease: number;
  };
  survival_metrics: {
    median_os_months?: number;
    median_pfs_months?: number;
    one_year_survival?: number;
    five_year_survival?: number;
  };
  toxicity_profile: ToxicityProfile;
  quality_of_life_impact: QOLImpact;
}

export interface ToxicityProfile {
  common_toxicities: Toxicity[];
  rare_serious_toxicities: Toxicity[];
  treatment_related_mortality: number;
}

export interface Toxicity {
  name: string;
  incidence_percent: number;
  grade_distribution: Record<string, number>; // grade -> percentage
  management_strategy: string;
  reversible: boolean;
}

export interface QOLImpact {
  global_health_score_change: number;
  functional_scale_changes: Record<string, number>;
  symptom_scale_changes: Record<string, number>;
}

// Patient-specific types
export interface PatientProfile {
  id: string;
  demographics: Demographics;
  disease_status: DiseaseStatus;
  performance_metrics: PerformanceMetrics;
  treatment_history: TreatmentHistory[];
  laboratory_values: LabValues;
  imaging_results: ImagingResult[];
  genetic_profile: GeneticProfile;
  comorbidities: Comorbidity[];
  current_medications: PatientMedication[];
  preferences: PatientPreferences;
  created_at: Date;
  updated_at: Date;
}

export interface Demographics {
  age: number;
  sex: 'male' | 'female' | 'other';
  race: string;
  ethnicity: string;
  bmi: number;
  smoking_status: 'never' | 'former' | 'current';
  alcohol_use: 'none' | 'light' | 'moderate' | 'heavy';
}

export interface DiseaseStatus {
  primary_cancer_type: string;
  stage: string;
  diagnosis_date: Date;
  histology: string;
  grade: string;
  biomarker_status: Record<string, BiomarkerResult>;
  metastatic_sites: string[];
  disease_burden: 'low' | 'medium' | 'high';
  current_status: 'newly_diagnosed' | 'treatment_naive' | 'on_treatment' | 'in_remission' | 'progressive' | 'recurrent';
}

export interface BiomarkerResult {
  status: BiomarkerStatus;
  value?: number;
  method: string;
  test_date: Date;
  interpretation: string;
  // Added missing property for treatmentMatchingEngine.ts
  biomarker_id?: string;
}

export interface PerformanceMetrics {
  ecog_score: ECOGScore;
  karnofsky_score: KarnofskyScore;
  assessment_date: Date;
  functional_assessments: FunctionalAssessment[];
}

export interface FunctionalAssessment {
  tool: string; // e.g., 'FACT-G', 'EORTC QLQ-C30'
  score: number;
  max_score: number;
  assessment_date: Date;
  domains: Record<string, number>;
}

export interface TreatmentHistory {
  protocol_id: string;
  start_date: Date;
  end_date?: Date;
  cycles_completed: number;
  cycles_planned: number;
  best_response: ResponseType;
  reason_for_discontinuation?: string;
  toxicities_experienced: PatientToxicity[];
  // Added missing property for treatmentMatchingEngine.ts
  treatment_line?: TreatmentLine;
}

export interface PatientToxicity {
  toxicity_name: string;
  grade: ToxicityGrade;
  onset_date: Date;
  resolution_date?: Date;
  management_actions: string[];
  dose_modifications: boolean;
}

export interface LabValues {
  test_date: Date;
  complete_blood_count: CBC;
  comprehensive_metabolic_panel: CMP;
  liver_function_tests: LFT;
  tumor_markers: Record<string, number>;
  coagulation_studies?: CoagulationStudies;
}

export interface CBC {
  wbc: number;
  anc: number;
  hemoglobin: number;
  hematocrit: number;
  platelets: number;
}

export interface CMP {
  glucose: number;
  bun: number;
  creatinine: number;
  sodium: number;
  potassium: number;
  chloride: number;
  co2: number;
  albumin: number;
}

export interface LFT {
  total_bilirubin: number;
  direct_bilirubin: number;
  alt: number;
  ast: number;
  alkaline_phosphatase: number;
}

export interface CoagulationStudies {
  pt: number;
  ptt: number;
  inr: number;
}

export interface ImagingResult {
  study_type: string;
  study_date: Date;
  findings: string;
  response_assessment?: ResponseType;
  measurable_lesions: MeasurableLesion[];
  new_lesions: boolean;
}

export interface MeasurableLesion {
  location: string;
  size_mm: number;
  previous_size_mm?: number;
  change_percent?: number;
}

export interface GeneticProfile {
  germline_testing: GermlineTest[];
  somatic_testing: SomaticTest[];
  microsatellite_instability: 'MSI-H' | 'MSI-L' | 'MSS' | 'unknown';
  tumor_mutational_burden: number;
  homologous_recombination_deficiency?: boolean;
  // Added missing property for treatmentMatchingEngine.ts
  biomarker_results?: BiomarkerResult[];
}

export interface GermlineTest {
  gene: string;
  result: 'pathogenic' | 'likely_pathogenic' | 'VUS' | 'likely_benign' | 'benign';
  variant: string;
  test_date: Date;
  clinical_significance: string;
}

export interface SomaticTest {
  gene: string;
  alteration_type: 'mutation' | 'amplification' | 'deletion' | 'fusion';
  variant: string;
  allele_frequency: number;
  actionable: boolean;
  matched_therapies: string[];
}

export interface Comorbidity {
  condition: string;
  severity: 'mild' | 'moderate' | 'severe';
  onset_date: Date;
  impact_on_treatment: 'none' | 'minimal' | 'moderate' | 'significant';
  management_required: boolean;
}

export interface PatientMedication {
  name: string;
  dose: string;
  frequency: string;
  indication: string;
  start_date: Date;
  end_date?: Date;
  drug_interactions: string[];
}

export interface PatientPreferences {
  treatment_goals: string[];
  quality_of_life_priorities: string[];
  risk_tolerance: 'low' | 'moderate' | 'high';
  participation_in_trials: boolean;
  advance_directives: boolean;
}

// Treatment matching and recommendation types
export interface TreatmentRecommendation {
  id: string;
  patient_id: string;
  protocol_id: string;
  match_score: number;
  eligibility_status: DetailedEligibilityStatus;
  contraindications: string[];
  required_modifications: ProtocolModification[];
  alternative_options: AlternativeOption[];
  rationale: string;
  confidence_level: 'high' | 'medium' | 'low';
  clinical_trial_options: ClinicalTrialOption[];
  generated_at: Date;
  generated_by: string; // algorithm version or clinician
}

export interface DetailedEligibilityStatus {
  eligible: boolean;
  violations: EligibilityViolation[];
  warnings: string[];
  required_assessments: string[];
}

export interface EligibilityViolation {
  criterion: string;
  patient_value: string;
  required_value: string;
  severity: 'exclusionary' | 'caution' | 'monitoring_required';
}

export interface ProtocolModification {
  type: 'dose_reduction' | 'schedule_change' | 'drug_substitution' | 'additional_monitoring';
  description: string;
  rationale: string;
  safety_impact: string;
  efficacy_impact: string;
}

export interface AlternativeOption {
  protocol_id: string;
  match_score: number;
  advantages: string[];
  disadvantages: string[];
  recommendation_strength: 'strong' | 'moderate' | 'weak';
}

export interface ClinicalTrialOption {
  nct_id: string;
  title: string;
  phase: string;
  eligibility_match: number;
  institution: string;
  contact_info: string;
  key_endpoints: string[];
}

// Treatment outcome tracking
export interface TreatmentOutcome {
  id: string;
  patient_id: string;
  protocol_id: string;
  treatment_start_date: Date;
  treatment_end_date?: Date;
  cycles_completed: number;
  cycles_planned: number;
  best_response: ResponseType;
  response_evaluation_dates: Date[];
  progression_free_survival_days?: number;
  overall_survival_days?: number;
  toxicities: PatientToxicity[];
  quality_of_life_scores: QOLScore[];
  treatment_satisfaction: number; // 1-10 scale
  would_recommend: boolean;
  recorded_at: Date;
  recorded_by: string;
}

export interface QOLScore {
  tool: string;
  score: number;
  assessment_date: Date;
  change_from_baseline: number;
}

// Error and validation types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  recommendation: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    total_count?: number;
    page?: number;
    page_size?: number;
    filters_applied?: Record<string, any>;
  };
}

export interface ProtocolMatch {
  protocol: TreatmentProtocol;
  match_score: number;
  eligibility_assessment: DetailedEligibilityStatus;
  contraindications: string[];
  modifications_needed: ProtocolModification[];
}

// Treatment matching result interfaces
export interface MatchingResult {
  protocol: TreatmentProtocol;
  match_score: number;
  match_breakdown: MatchScoreBreakdown;
  eligibility_status: EligibilityAssessment;
  contraindications: ContraindicationResult[];
  safety_assessment: SafetyAssessment;
  recommendation_rationale: string;
  confidence: MatchConfidence;
  evidence_quality: EvidenceLevel;
  alternative_protocols?: string[];
  required_modifications?: ProtocolModification[];
}

export interface MatchScoreBreakdown {
  cancer_type_score: number;
  stage_score: number;
  biomarker_score: number;
  performance_score: number;
  organ_function_score: number;
  prior_treatment_score: number;
  comorbidity_score: number;
  age_score: number;
  evidence_bonus: number;
  total_weighted_score: number;
}

export interface EligibilityAssessment {
  eligible: boolean;
  violations: EligibilityViolation[];
  warnings: EligibilityWarning[];
  required_tests: string[];
  estimated_eligibility_after_optimization: number;
}

export interface EligibilityViolation {
  criterion: string;
  patient_value: string;
  required_value: string;
  severity: 'exclusionary' | 'caution' | 'monitoring_required';
  override_possible: boolean;
}

export interface EligibilityWarning {
  criterion: string;
  concern: string;
  recommendation: string;
  monitoring_required: boolean;
}

export interface ContraindicationResult {
  type: 'absolute' | 'relative' | 'monitoring_required';
  category: 'medical' | 'laboratory' | 'drug_interaction' | 'allergy';
  description: string;
  severity: 'absolute' | 'relative' | 'monitoring_required';
  override_possible: boolean;
  alternative_options: string[];
}

export interface SafetyAssessment {
  overall_safety_score: number;
  risk_level: 'low' | 'moderate' | 'high' | 'very_high';
  estimated_toxicity_risk: ToxicityRisk;
  monitoring_intensity: 'standard' | 'enhanced' | 'intensive';
  dose_modification_likelihood: number;
  hospitalization_risk: number;
  special_precautions: string[];
}

export interface ToxicityRisk {
  grade_3_4_risk: number;
  treatment_discontinuation_risk: number;
  serious_adverse_event_risk: number;
  organ_specific_risks: Record<string, number>;
}

export interface ProtocolModification {
  type: 'dose_reduction' | 'schedule_change' | 'drug_substitution' | 'additional_monitoring';
  description: string;
  rationale: string;
  impact_on_efficacy: 'minimal' | 'moderate' | 'significant';
  monitoring_changes: string[];
}

// Database schema types for Supabase
export interface DatabaseTables {
  cancer_types: CancerType;
  treatment_protocols: TreatmentProtocol;
  patient_profiles: PatientProfile;
  treatment_recommendations: TreatmentRecommendation;
  treatment_outcomes: TreatmentOutcome;
  biomarkers: Biomarker;
  drugs: ProtocolDrug;
  protocol_matches: ProtocolMatch;
}

export type DatabaseTable = keyof DatabaseTables;

// Component State Management
export interface AppState {
  patient: PatientProfile | null;
  treatment_recommendations: TreatmentRecommendation[];
  protocol_library: TreatmentProtocol[];
  matching_results: ProtocolMatch[];
  ui_state: UIState;
  errors: ErrorState;
  loading_states: LoadingState;
}

export interface UIState {
  active_tab: string;
  selected_protocol?: string;
  comparison_protocols: string[];
  filter_criteria: FilterCriteria;
  sort_order: SortOrder;
}

export interface ErrorState {
  general: string | null;
  patient_data: string | null;
  protocol_matching: string | null;
  database_connection: string | null;
}

export interface LoadingState {
  patient_data: boolean;
  protocol_matching: boolean;
  saving_data: boolean;
  generating_recommendations: boolean;
}

export interface FilterCriteria {
  cancer_types: string[];
  treatment_lines: TreatmentLine[];
  evidence_levels: EvidenceLevel[];
  include_experimental: boolean;
}

export interface SortOrder {
  field: string;
  direction: 'asc' | 'desc';
}

// Action Types for State Management
export type AppAction = 
  | { type: 'PATIENT_DATA_LOADED'; payload: PatientProfile }
  | { type: 'PATIENT_DATA_UPDATED'; payload: Partial<PatientProfile> }
  | { type: 'PROTOCOLS_MATCHED'; payload: ProtocolMatch[] }
  | { type: 'RECOMMENDATION_GENERATED'; payload: TreatmentRecommendation }
  | { type: 'RECOMMENDATION_SELECTED'; payload: string }
  | { type: 'OUTCOME_RECORDED'; payload: TreatmentOutcome }
  | { type: 'ERROR_OCCURRED'; payload: { category: keyof ErrorState; message: string } }
  | { type: 'LOADING_STARTED'; payload: keyof LoadingState }
  | { type: 'LOADING_COMPLETED'; payload: keyof LoadingState }
  | { type: 'FILTER_UPDATED'; payload: Partial<FilterCriteria> }
  | { type: 'SORT_UPDATED'; payload: SortOrder }
  | { type: 'RESET_STATE' };

// Advanced analytics and monitoring types
export interface AnalyticsData {
  population_metrics: PopulationMetrics;
  survival_data: SurvivalData;
  quality_metrics: QualityMetrics;
  biomarker_analysis: BiomarkerAnalysis;
  treatment_outcomes: TreatmentOutcome[];
  predictive_insights: PredictiveInsight[];
  generated_at: Date;
}

export interface PopulationMetrics {
  total_patients: number;
  new_patients_this_period: number;
  demographics: {
    median_age: number;
    age_range: { min: number; max: number };
    gender_distribution: { male: number; female: number; other: number };
  };
  cancer_type_distribution: Record<string, number>;
  stage_distribution: Record<string, number>;
  treatment_distribution: Record<string, number>;
  treatment_outcomes: {
    complete_response: number;
    partial_response: number;
    stable_disease: number;
    progressive_disease: number;
  };
}

export interface SurvivalData {
  overall_survival: {
    median_months: number;
    confidence_interval: { lower: number; upper: number };
    kaplan_meier_data: KaplanMeierPoint[];
  };
  progression_free_survival: {
    median_months: number;
    confidence_interval: { lower: number; upper: number };
    kaplan_meier_data: KaplanMeierPoint[];
  };
  subgroup_analysis: SubgroupSurvival[];
}

export interface KaplanMeierPoint {
  time_months: number;
  survival_probability: number;
  at_risk_count: number;
  events: number;
  censored: number;
}

export interface SubgroupSurvival {
  subgroup_name: string;
  subgroup_criteria: string;
  patient_count: number;
  median_os_months: number;
  median_pfs_months: number;
  hazard_ratio: number;
  p_value: number;
}

export interface QualityMetrics {
  protocol_adherence: {
    mean_compliance_rate: number;
    compliance_by_protocol: Record<string, number>;
    common_deviations: Array<{
      reason: string;
      frequency: number;
      impact_level: 'low' | 'medium' | 'high';
    }>;
  };
  toxicity_monitoring: {
    common_toxicities: Array<{
      name: string;
      grade: number;
      frequency: number;
      management_standard: string;
    }>;
    severe_events: {
      grade_4_frequency: number;
      grade_5_frequency: number;
      hospitalization_rate: number;
    };
  };
  data_quality: {
    completeness_rate: number;
    accuracy_rate: number;
    timeliness_score: number;
    missing_data_patterns: Record<string, number>;
  };
}

export interface BiomarkerAnalysis {
  correlations: Array<{
    biomarker_name: string;
    biomarker_type: 'genomic' | 'proteomic' | 'metabolomic' | 'imaging';
    correlation_coefficient: number;
    statistical_significance: number;
    sample_size: number;
    clinical_interpretation: string;
    therapeutic_implications: string[];
  }>;
  predictive_models: Array<{
    model_name: string;
    biomarkers_included: string[];
    model_performance: ModelPerformanceMetrics;
    clinical_utility: string;
    validation_status: 'development' | 'validation' | 'clinical_use';
  }>;
  novel_discoveries: Array<{
    discovery_type: string;
    description: string;
    statistical_evidence: number;
    clinical_relevance: 'high' | 'medium' | 'low';
    next_steps: string[];
  }>;
}

export interface PredictiveInsight {
  insight_type: 'treatment_response' | 'toxicity_risk' | 'survival_prediction' | 'resistance_pattern';
  confidence_level: number;
  description: string;
  clinical_recommendation: string;
  evidence_level: EvidenceLevel;
  applicable_population: string;
  implementation_timeline: string;
}

export interface MonitoringAlert {
  id: string;
  alert_type: 'safety' | 'efficacy' | 'quality' | 'operational';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  patient_affected?: string;
  protocol_affected?: string;
  recommended_actions: string[];
  created_at: Date;
  acknowledged: boolean;
  resolved: boolean;
}

export interface RealTimeMetrics {
  active_treatments: number;
  patients_due_for_assessment: number;
  overdue_assessments: number;
  pending_lab_results: number;
  safety_signals: number;
  system_status: 'operational' | 'degraded' | 'maintenance';
  last_updated: Date;
}
