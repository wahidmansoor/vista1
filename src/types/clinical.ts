/**
 * Clinical Cancer Screening Engine Type System
 * --------------------------------------------
 * Comprehensive, production-grade TypeScript interfaces, enums, and Zod schemas
 * for clinical data modeling and validation. All types are designed for clinical
 * accuracy, extensibility, and robust type safety.
 */

import { z } from 'zod';

/**
 * Biological sex at birth (for risk stratification)
 */
export enum BiologicalSex {
  MALE = 'male',
  FEMALE = 'female',
  INTERSEX = 'intersex',
  UNKNOWN = 'unknown',
}

/**
 * Major ethnicity categories (for risk stratification)
 */
export enum Ethnicity {
  CAUCASIAN = 'caucasian',
  AFRICAN_AMERICAN = 'african_american',
  HISPANIC = 'hispanic',
  ASIAN = 'asian',
  NATIVE_AMERICAN = 'native_american',
  PACIFIC_ISLANDER = 'pacific_islander',
  MIDDLE_EASTERN = 'middle_eastern',
  MULTIRACIAL = 'multiracial',
  OTHER = 'other',
  UNKNOWN = 'unknown',
}

/**
 * Cancer types for recommendations
 */
export enum CancerType {
  BREAST = 'breast',
  COLORECTAL = 'colorectal',
  LUNG = 'lung',
  PROSTATE = 'prostate',
  CERVICAL = 'cervical',
  SKIN = 'skin',
  OVARIAN = 'ovarian',
  ENDOMETRIAL = 'endometrial',
  PANCREATIC = 'pancreatic',
  GASTRIC = 'gastric',
  LIVER = 'liver',
  BLADDER = 'bladder',
  THYROID = 'thyroid',
  LYMPHOMA = 'lymphoma',
  LEUKEMIA = 'leukemia',
  OTHER = 'other',
}

/**
 * Genetic mutations of clinical significance
 */
export enum GeneticMutation {
  BRCA1 = 'BRCA1',
  BRCA2 = 'BRCA2',
  LYNCH = 'Lynch',
  TP53 = 'TP53',
  PALB2 = 'PALB2',
  OTHER = 'other',
}

/**
 * Severity scale for symptoms
 */
export enum SymptomSeverity {
  NONE = 0,
  MILD = 1,
  MODERATE = 2,
  SEVERE = 3,
  EXTREME = 4,
}

/**
 * Screening test types
 */
export enum ScreeningTestType {
  MAMMOGRAM = 'mammogram',
  COLONOSCOPY = 'colonoscopy',
  PAP_SMEAR = 'pap_smear',
  HPV_TEST = 'hpv_test',
  LOW_DOSE_CT = 'low_dose_ct',
  PSA = 'psa',
  SKIN_EXAM = 'skin_exam',
  BREAST_MRI = 'breast_mri',
  FECAL_OCCULT_BLOOD = 'fecal_occult_blood',
  SIGMOIDOSCOPY = 'sigmoidoscopy',
  OTHER = 'other',
}

/**
 * Screening result types
 */
export enum ScreeningResultType {
  NORMAL = 'normal',
  ABNORMAL = 'abnormal',
  INCONCLUSIVE = 'inconclusive',
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  PENDING = 'pending',
  OTHER = 'other',
}

/**
 * Recommendation urgency levels
 */
export enum RecommendationUrgency {
  EMERGENT = 'emergent',
  URGENT = 'urgent',
  SOON = 'soon',
  ROUTINE = 'routine',
  FUTURE = 'future',
  NOT_INDICATED = 'not_indicated',
}

/**
 * PatientDemographics: Basic patient info for risk stratification
 */
export interface PatientDemographics {
  /** Age in years */
  age: number;
  /** Biological sex at birth */
  sex: BiologicalSex;
  /** Ethnicity */
  ethnicity: Ethnicity;  /** Family history of cancer */
  family_history: Array<{
    cancer_type: CancerType;
    relationship: string;
    age_at_diagnosis?: number;
  }>;
  /** Insurance information */
  insurance?: string;
}

/**
 * RiskScore: Calculated risk scores for cancer types
 */
export interface RiskScore {
  cancer_type: CancerType;
  score: number; // 0-100
  high_risk: boolean;
  absolute_risk: number; // 0-1 for percentage
  risk_level: string; // 'low', 'moderate', 'high', 'very high'
}

/**
 * GeneticProfile: Key mutations, variants, penetrance scores
 */
export interface GeneticProfile {
  mutations: Array<{
    mutation: GeneticMutation;
    confirmed: boolean;
    details?: string;
  }>;
  variants?: Array<{
    gene: string;
    variant: string;
    significance?: string;
  }>;
  penetrance_scores?: Array<{
    mutation: GeneticMutation;
    score: number; // 0-1
  }>;
}

/**
 * RiskFactorProfile: Lifestyle, environmental, medical history
 */
export interface RiskFactorProfile {
  lifestyle: {
    current_smoker: boolean;
    pack_years?: number;
    alcohol_drinks_per_week?: number;
    bmi?: number;
    exercise_minutes_per_week?: number;
    other?: Record<string, any>;
  };
  environmental: {
    occupational_exposures?: string[];
    radiation_exposure?: boolean;
    known_carcinogen_exposure?: string[];
    other?: Record<string, any>;
  };
  medical_history: {
    chronic_conditions?: string[];
    previous_cancers?: Array<{
      cancer_type: CancerType;
      age_at_diagnosis: number;
      treatment?: string;
      current_status: string;
    }>;
    immunosuppressed?: boolean;
    hormone_replacement_therapy?: {
      current: boolean;
      years?: number;
    };
    other?: Record<string, any>;
  };
}

/**
 * SymptomProfile: Current symptoms, severity, duration
 */
export interface SymptomProfile {
  current_symptoms: Array<{
    symptom: string;
    severity: SymptomSeverity;
    duration_days: number;
    worsening: boolean;
    associated_factors?: string[];
  }>;
  assessment_date: Date;
  changes_since_last_assessment?: string;
  resolved_symptoms?: Array<{
    symptom: string;
    resolved_date: Date;
  }>;
}

/**
 * ScreeningHistory: Test type, date, result, follow-up
 */
export interface ScreeningHistory {
  screenings: Array<{
    test_type: ScreeningTestType;
    date: Date;
    result: ScreeningResultType;
    result_details?: string;
    follow_up_needed: boolean;
    recommended_follow_up?: string;
    follow_up_completed?: boolean;
    location?: string;
  }>;
  missed_screenings?: Array<{
    test_type: ScreeningTestType;
    recommended_date: Date;
    reason?: string;
  }>;
  next_planned_screening?: {
    test_type: ScreeningTestType;
    planned_date: Date;
  };
}

/**
 * ClinicalRecommendation: Cancer type, urgency, test, rationale
 */
export interface ClinicalRecommendation {
  cancer_type: CancerType;
  urgency: RecommendationUrgency;
  test_recommended: ScreeningTestType;
  rationale: {
    guideline_source: string;
    recommendation_grade?: string;
    key_factors: string[];
    clinical_reasoning: string;
    evidence_quality?: string;
  };
  alternative_tests?: ScreeningTestType[];
  generated_date: Date;
  review_date: Date;
  patient_instructions?: string;
  special_considerations?: string[];
}

// ------------------- Zod Schemas -------------------

export const PatientDemographicsSchema = z.object({
  age: z.number().int().min(0).max(120),
  sex: z.nativeEnum(BiologicalSex),
  ethnicity: z.nativeEnum(Ethnicity),
  family_history: z.array(
    z.object({
      cancer_type: z.nativeEnum(CancerType),
      relationship: z.string().min(1),
      age_at_diagnosis: z.number().int().min(0).max(120).optional(),
    })
  ),
});

export const GeneticProfileSchema = z.object({
  mutations: z.array(
    z.object({
      mutation: z.nativeEnum(GeneticMutation),
      confirmed: z.boolean(),
      details: z.string().optional(),
    })
  ),
  variants: z
    .array(
      z.object({
        gene: z.string().min(1),
        variant: z.string().min(1),
        significance: z.string().optional(),
      })
    )
    .optional(),
  penetrance_scores: z
    .array(
      z.object({
        mutation: z.nativeEnum(GeneticMutation),
        score: z.number().min(0).max(1),
      })
    )
    .optional(),
});

export const RiskFactorProfileSchema = z.object({
  lifestyle: z.object({
    current_smoker: z.boolean(),
    pack_years: z.number().min(0).optional(),
    alcohol_drinks_per_week: z.number().min(0).optional(),
    bmi: z.number().min(10).max(100).optional(),
    exercise_minutes_per_week: z.number().min(0).optional(),
    other: z.record(z.any()).optional(),
  }),
  environmental: z.object({
    occupational_exposures: z.array(z.string()).optional(),
    radiation_exposure: z.boolean().optional(),
    known_carcinogen_exposure: z.array(z.string()).optional(),
    other: z.record(z.any()).optional(),
  }),
  medical_history: z.object({
    chronic_conditions: z.array(z.string()).optional(),
    previous_cancers: z
      .array(
        z.object({
          cancer_type: z.nativeEnum(CancerType),
          age_at_diagnosis: z.number().int().min(0).max(120),
          treatment: z.string().optional(),
          current_status: z.string(),
        })
      )
      .optional(),
    immunosuppressed: z.boolean().optional(),
    hormone_replacement_therapy: z
      .object({
        current: z.boolean(),
        years: z.number().min(0).optional(),
      })
      .optional(),
    other: z.record(z.any()).optional(),
  }),
});

export const SymptomProfileSchema = z.object({
  current_symptoms: z.array(
    z.object({
      symptom: z.string().min(1),
      severity: z.nativeEnum(SymptomSeverity),
      duration_days: z.number().min(0),
      worsening: z.boolean(),
      associated_factors: z.array(z.string()).optional(),
    })
  ),
  assessment_date: z.date(),
  changes_since_last_assessment: z.string().optional(),
  resolved_symptoms: z
    .array(
      z.object({
        symptom: z.string().min(1),
        resolved_date: z.date(),
      })
    )
    .optional(),
});

export const ScreeningHistorySchema = z.object({
  screenings: z.array(
    z.object({
      test_type: z.nativeEnum(ScreeningTestType),
      date: z.date(),
      result: z.nativeEnum(ScreeningResultType),
      result_details: z.string().optional(),
      follow_up_needed: z.boolean(),
      recommended_follow_up: z.string().optional(),
      follow_up_completed: z.boolean().optional(),
      location: z.string().optional(),
    })
  ),
  missed_screenings: z
    .array(
      z.object({
        test_type: z.nativeEnum(ScreeningTestType),
        recommended_date: z.date(),
        reason: z.string().optional(),
      })
    )
    .optional(),
  next_planned_screening: z
    .object({
      test_type: z.nativeEnum(ScreeningTestType),
      planned_date: z.date(),
    })
    .optional(),
});

export const ClinicalRecommendationSchema = z.object({
  cancer_type: z.nativeEnum(CancerType),
  urgency: z.nativeEnum(RecommendationUrgency),
  test_recommended: z.nativeEnum(ScreeningTestType),
  rationale: z.object({
    guideline_source: z.string().min(1),
    recommendation_grade: z.string().optional(),
    key_factors: z.array(z.string()),
    clinical_reasoning: z.string().min(1),
    evidence_quality: z.string().optional(),
  }),
  alternative_tests: z.array(z.nativeEnum(ScreeningTestType)).optional(),
  generated_date: z.date(),
  review_date: z.date(),
  patient_instructions: z.string().optional(),
  special_considerations: z.array(z.string()).optional(),
});
