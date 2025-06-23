/**
 * Symptom-Cancer Correlation Engine
 * ----------------------------------
 * Maps symptoms to cancer types with likelihood ratios, age/duration/severity modifiers, and clinical context.
 * Based on major cancer epidemiology studies and meta-analyses.
 */

import { CancerType, SymptomSeverity } from '../../types/clinical';

/**
 * Likelihood ratio with confidence interval
 */
export interface LikelihoodRatio {
  value: number;
  ci95?: [number, number];
  source?: string;
}

/**
 * Symptom-to-cancer mapping entry
 */
export interface SymptomCancerCorrelation {
  symptom: string;
  cancerTypes: CancerType[];
  likelihoodRatio: LikelihoodRatio;
  ageModifiers?: Array<{ minAge: number; maxAge: number; modifier: number; context?: string }>;
  durationWeeksModifier?: Array<{ minWeeks: number; modifier: number; context?: string }>;
  severityModifier?: Array<{ severity: SymptomSeverity; modifier: number; context?: string }>;
  combinationPattern?: string[];
  clinicalContext?: string;
}

/**
 * Red flag symptoms with cancer-specific likelihood ratios
 */
export const SYMPTOM_CANCER_CORRELATIONS: SymptomCancerCorrelation[] = [
  {
    symptom: 'Rectal bleeding',
    cancerTypes: [CancerType.COLORECTAL],
    likelihoodRatio: { value: 2.4, ci95: [1.9, 3.1], source: 'Hamilton W, BMJ 2005' },
    ageModifiers: [
      { minAge: 60, maxAge: 120, modifier: 1.5, context: 'Risk increases with age >60' },
    ],
    durationWeeksModifier: [
      { minWeeks: 6, modifier: 1.3, context: 'Persistent >6 weeks increases risk' },
    ],
    clinicalContext: 'Rectal bleeding in older adults is a red flag for colorectal cancer, especially with change in bowel habits.',
  },
  {
    symptom: 'Unexplained weight loss',
    cancerTypes: [
      CancerType.COLORECTAL,
      CancerType.LUNG,
      CancerType.PANCREATIC,
      CancerType.GASTRIC,
      CancerType.LYMPHOMA,
      CancerType.LEUKEMIA,
      CancerType.BREAST,
    ],
    likelihoodRatio: { value: 3.2, ci95: [2.5, 4.1], source: 'Nicholson BD, Br J Gen Pract 2018' },
    durationWeeksModifier: [
      { minWeeks: 6, modifier: 1.4, context: 'Weight loss >6 weeks is more concerning' },
    ],
    clinicalContext: 'Unintentional weight loss is a non-specific but important cancer warning sign, especially in older adults.',
  },
  {
    symptom: 'Breast lump',
    cancerTypes: [CancerType.BREAST],
    likelihoodRatio: { value: 11.0, ci95: [7.2, 16.8], source: 'Kostopoulou O, Br J Gen Pract 2008' },
    ageModifiers: [
      { minAge: 40, maxAge: 120, modifier: 1.6, context: 'Risk higher in women >40' },
      { minAge: 20, maxAge: 39, modifier: 1.2, context: 'Still significant in younger women' },
    ],
    severityModifier: [
      { severity: SymptomSeverity.SEVERE, modifier: 1.2, context: 'Hard, fixed, or rapidly growing lumps are higher risk' },
    ],
    clinicalContext: 'Palpable breast mass is highly predictive of breast cancer, especially in older women.',
  },
  {
    symptom: 'Persistent cough',
    cancerTypes: [CancerType.LUNG],
    likelihoodRatio: { value: 2.6, ci95: [1.8, 3.7], source: 'Hamilton W, BMJ 2005' },
    durationWeeksModifier: [
      { minWeeks: 6, modifier: 1.5, context: 'Cough >6 weeks is more concerning' },
    ],
    severityModifier: [
      { severity: SymptomSeverity.SEVERE, modifier: 1.3, context: 'Hemoptysis or severe cough increases risk' },
    ],
    ageModifiers: [
      { minAge: 55, maxAge: 120, modifier: 1.4, context: 'Risk increases with age and smoking history' },
    ],
    clinicalContext: 'Chronic cough, especially with hemoptysis or in smokers, is a red flag for lung cancer.',
  },
  // B-symptoms constellation for hematologic malignancies
  {
    symptom: 'B-symptoms',
    cancerTypes: [CancerType.LYMPHOMA, CancerType.LEUKEMIA],
    likelihoodRatio: { value: 5.0, ci95: [3.0, 8.0], source: 'Swerdlow SH, WHO Classification of Tumours of Haematopoietic and Lymphoid Tissues' },
    combinationPattern: ['Fever >38°C', 'Night sweats', 'Unintentional weight loss >10% in 6 months'],
    clinicalContext: 'Presence of B-symptoms (fever, night sweats, weight loss) is highly suggestive of lymphoma or leukemia.',
  },
];

/**
 * Utility: Get all cancer correlations for a given symptom
 */
export function getCancerCorrelationsForSymptom(symptom: string): SymptomCancerCorrelation[] {
  return SYMPTOM_CANCER_CORRELATIONS.filter((entry) => entry.symptom.toLowerCase() === symptom.toLowerCase());
}

/**
 * Utility: Get all red flag symptoms for a given cancer type
 */
export function getRedFlagSymptomsForCancer(cancer: CancerType): SymptomCancerCorrelation[] {
  return SYMPTOM_CANCER_CORRELATIONS.filter((entry) => entry.cancerTypes.includes(cancer));
}
