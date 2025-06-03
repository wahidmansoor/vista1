/**
 * Genetic Risk Profiles Database
 * --------------------------------
 * Maps high-penetrance cancer susceptibility genes to associated cancer risks, penetrance, age-specific risk curves,
 * and screening modification factors. Data is based on NCCN Genetic/Familial High-Risk Assessment: Breast, Ovarian, and Pancreatic v4.2025.
 */

import { CancerType, GeneticMutation } from '../../types/clinical';

/**
 * Penetrance and risk curve type
 */
export interface CancerRisk {
  /** Cancer type */
  cancerType: CancerType;
  /** Lifetime risk percentage (if available) */
  lifetimeRisk?: number;
  /** Age-specific risk curve (age: risk%) */
  ageRiskCurve?: Array<{ age: number; risk: number }>;
  /** Screening modification notes */
  screeningModifications?: string;
}

/**
 * Genetic risk mapping for major cancer susceptibility genes
 */
export const GENETIC_RISK_PROFILES: Record<GeneticMutation, CancerRisk[]> = {
  [GeneticMutation.BRCA1]: [
    { cancerType: CancerType.BREAST, lifetimeRisk: 85, ageRiskCurve: [
      { age: 30, risk: 3 }, { age: 40, risk: 19 }, { age: 50, risk: 50 }, { age: 70, risk: 72 }, { age: 80, risk: 85 }
    ], screeningModifications: 'Annual MRI age 25-29, add mammogram age 30+, consider risk-reducing mastectomy.' },
    { cancerType: CancerType.OVARIAN, lifetimeRisk: 44, ageRiskCurve: [
      { age: 40, risk: 10 }, { age: 50, risk: 20 }, { age: 60, risk: 35 }, { age: 80, risk: 44 }
    ], screeningModifications: 'Consider risk-reducing salpingo-oophorectomy age 35-40.' },
    { cancerType: CancerType.PANCREATIC, lifetimeRisk: 3, screeningModifications: 'Consider pancreatic screening if family history.' },
    { cancerType: CancerType.PROSTATE, screeningModifications: 'Consider earlier PSA screening.' },
  ],
  [GeneticMutation.BRCA2]: [
    { cancerType: CancerType.BREAST, lifetimeRisk: 84, ageRiskCurve: [
      { age: 30, risk: 3 }, { age: 40, risk: 13 }, { age: 50, risk: 38 }, { age: 70, risk: 69 }, { age: 80, risk: 84 }
    ], screeningModifications: 'Annual MRI age 25-29, add mammogram age 30+, consider risk-reducing mastectomy.' },
    { cancerType: CancerType.OVARIAN, lifetimeRisk: 17, ageRiskCurve: [
      { age: 40, risk: 2 }, { age: 50, risk: 7 }, { age: 60, risk: 12 }, { age: 80, risk: 17 }
    ], screeningModifications: 'Consider risk-reducing salpingo-oophorectomy age 40-45.' },
    { cancerType: CancerType.PANCREATIC, lifetimeRisk: 7, screeningModifications: 'Consider pancreatic screening if family history.' },
    { cancerType: CancerType.PROSTATE, screeningModifications: 'Consider earlier PSA screening.' },
    { cancerType: CancerType.BREAST, lifetimeRisk: 8, screeningModifications: 'Male breast cancer risk; consider clinical breast exam.' },
  ],
  [GeneticMutation.LYNCH]: [
    { cancerType: CancerType.COLORECTAL, lifetimeRisk: 80, ageRiskCurve: [
      { age: 30, risk: 2 }, { age: 40, risk: 10 }, { age: 50, risk: 30 }, { age: 70, risk: 60 }, { age: 80, risk: 80 }
    ], screeningModifications: 'Colonoscopy every 1-2 years starting age 20-25.' },
    { cancerType: CancerType.ENDOMETRIAL, lifetimeRisk: 60, screeningModifications: 'Consider annual endometrial sampling age 30-35.' },
    { cancerType: CancerType.GASTRIC, screeningModifications: 'Consider upper endoscopy every 3-5 years.' },
    { cancerType: CancerType.OVARIAN, screeningModifications: 'Consider risk-reducing salpingo-oophorectomy age 40-45.' },
  ],
  [GeneticMutation.TP53]: [
    { cancerType: CancerType.BREAST, screeningModifications: 'Annual breast MRI age 20-29, add mammogram age 30+.' },
    { cancerType: CancerType.BRAIN, screeningModifications: 'Annual brain MRI.' },
    { cancerType: CancerType.LEUKEMIA, screeningModifications: 'Annual CBC, clinical assessment.' },
    { cancerType: CancerType.OTHER, screeningModifications: 'Li-Fraumeni: multi-cancer risk, consider whole-body MRI.' },
  ],
  [GeneticMutation.PALB2]: [
    { cancerType: CancerType.BREAST, lifetimeRisk: 35, screeningModifications: 'Annual MRI age 30-35, add mammogram age 40+.' },
  ],
  [GeneticMutation.APC]: [
    { cancerType: CancerType.COLORECTAL, screeningModifications: 'Familial adenomatous polyposis: annual colonoscopy age 10-15.' },
  ],
  [GeneticMutation.OTHER]: [],
};

/**
 * Utility: Get all cancer risks for a given mutation
 */
export function getRisksForMutation(mutation: GeneticMutation): CancerRisk[] {
  return GENETIC_RISK_PROFILES[mutation] || [];
}
