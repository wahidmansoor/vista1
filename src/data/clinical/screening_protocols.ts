/**
 * Clinical Screening Protocol Matrix
 * ----------------------------------
 * USPSTF 2024-2025 guideline-compliant screening protocols for major cancers.
 * Includes risk stratification, test intervals, preparation, and follow-up.
 * All protocols are evidence-based and production-ready.
 */

import { CancerType, ScreeningTestType, RecommendationUrgency } from '../../types/clinical';

/**
 * Age range for screening eligibility
 */
export interface AgeRange {
  min: number;
  max: number;
}

/**
 * Preparation and follow-up details for a screening test
 */
export interface ScreeningTestProtocol {
  test: ScreeningTestType;
  intervalYears?: number;
  intervalMonths?: number;
  startAge: number;
  stopAge: number;
  riskGroup: 'average' | 'high' | 'very_high';
  preparation?: string;
  abnormalFollowUp: string;
  sharedDecisionNotes?: string;
  guidelineSource: string;
}

/**
 * Protocols for a specific cancer type
 */
export interface CancerScreeningProtocols {
  cancer: CancerType;
  protocols: ScreeningTestProtocol[];
  geneticCounselingTriggers?: string[];
}

/**
 * Breast Cancer Screening Protocols (USPSTF, NCCN, ACS)
 */
export const breastCancerProtocols: CancerScreeningProtocols = {
  cancer: CancerType.BREAST,
  protocols: [
    {
      test: ScreeningTestType.MAMMOGRAM,
      intervalYears: 2,
      startAge: 50,
      stopAge: 74,
      riskGroup: 'average',
      preparation: 'No deodorant, powder, or lotion on chest/armpits before test.',
      abnormalFollowUp: 'Diagnostic mammogram, ultrasound, biopsy as indicated. Refer to breast clinic if abnormal.',
      sharedDecisionNotes: 'Consider starting at age 40 based on patient preference and risk factors.',
      guidelineSource: 'USPSTF 2024',
    },
    {
      test: ScreeningTestType.MAMMOGRAM,
      intervalYears: 1,
      startAge: 25,
      stopAge: 75,
      riskGroup: 'high',
      preparation: 'No deodorant, powder, or lotion on chest/armpits before test.',
      abnormalFollowUp: 'Diagnostic mammogram, breast MRI, biopsy as indicated. Refer to genetics if not already done.',
      sharedDecisionNotes: 'Annual screening for BRCA1/2 mutation carriers or strong family history.',
      guidelineSource: 'NCCN v4.2025',
    },
    {
      test: ScreeningTestType.BREAST_MRI,
      intervalYears: 1,
      startAge: 25,
      stopAge: 75,
      riskGroup: 'high',
      preparation: 'Schedule MRI between days 7-14 of menstrual cycle if premenopausal.',
      abnormalFollowUp: 'Targeted ultrasound, biopsy, multidisciplinary review.',
      sharedDecisionNotes: 'MRI is adjunct to mammography for high-risk women.',
      guidelineSource: 'NCCN v4.2025',
    },
    {
      test: ScreeningTestType.BREAST_MRI,
      intervalYears: 1,
      startAge: 25,
      stopAge: 75,
      riskGroup: 'very_high',
      preparation: 'Schedule MRI between days 7-14 of menstrual cycle if premenopausal.',
      abnormalFollowUp: 'Immediate referral to genetics and breast oncology.',
      sharedDecisionNotes: 'Li-Fraumeni, Cowden, or Bannayan-Riley-Ruvalcaba syndromes.',
      guidelineSource: 'NCCN v4.2025',
    },
  ],
  geneticCounselingTriggers: [
    'Known BRCA1/2, TP53, PALB2, or other high-penetrance mutation',
    'Multiple first-degree relatives with breast/ovarian cancer',
    'Early-onset breast cancer (<45 years) in family',
    'Male breast cancer in family',
  ],
};

/**
 * Colorectal Cancer Screening Protocols (USPSTF, NCCN)
 */
export const colorectalCancerProtocols: CancerScreeningProtocols = {
  cancer: CancerType.COLORECTAL,
  protocols: [
    {
      test: ScreeningTestType.COLONOSCOPY,
      intervalYears: 10,
      startAge: 45,
      stopAge: 75,
      riskGroup: 'average',
      preparation: 'Bowel prep with clear liquids and laxatives as per protocol.',
      abnormalFollowUp: 'Polypectomy, pathology review, repeat colonoscopy interval based on findings.',
      sharedDecisionNotes: 'Screening beyond age 75 individualized based on health status.',
      guidelineSource: 'USPSTF 2024',
    },
    {
      test: ScreeningTestType.FECAL_OCCULT_BLOOD,
      intervalYears: 1,
      startAge: 45,
      stopAge: 75,
      riskGroup: 'average',
      preparation: 'No red meat, NSAIDs, or vitamin C 72 hours before test.',
      abnormalFollowUp: 'Colonoscopy if positive.',
      sharedDecisionNotes: 'Annual FIT or gFOBT as alternative to colonoscopy.',
      guidelineSource: 'USPSTF 2024',
    },
    {
      test: ScreeningTestType.COLONOSCOPY,
      intervalYears: 1,
      startAge: 20,
      stopAge: 75,
      riskGroup: 'high',
      preparation: 'Bowel prep with clear liquids and laxatives as per protocol.',
      abnormalFollowUp: 'Polypectomy, pathology review, consider upper endoscopy for Lynch syndrome.',
      sharedDecisionNotes: 'Lynch syndrome: start age 20-25, repeat every 1-2 years.',
      guidelineSource: 'NCCN v4.2025',
    },
  ],
  geneticCounselingTriggers: [
    'Known Lynch syndrome or FAP mutation',
    'Colorectal cancer in first-degree relative <50 years',
    'Multiple colorectal polyps',
  ],
};

/**
 * Cervical Cancer Screening Protocols (USPSTF, ACS)
 */
export const cervicalCancerProtocols: CancerScreeningProtocols = {
  cancer: CancerType.CERVICAL,
  protocols: [
    {
      test: ScreeningTestType.PAP_SMEAR,
      intervalYears: 3,
      startAge: 21,
      stopAge: 29,
      riskGroup: 'average',
      preparation: 'No intercourse, douching, or vaginal products 48 hours before test.',
      abnormalFollowUp: 'HPV testing or colposcopy if abnormal.',
      sharedDecisionNotes: 'Screening not recommended before age 21.',
      guidelineSource: 'USPSTF 2024',
    },
    {
      test: ScreeningTestType.PAP_SMEAR,
      intervalYears: 3,
      startAge: 30,
      stopAge: 65,
      riskGroup: 'average',
      preparation: 'No intercourse, douching, or vaginal products 48 hours before test.',
      abnormalFollowUp: 'HPV testing or colposcopy if abnormal.',
      sharedDecisionNotes: 'Co-testing with HPV every 5 years is an option.',
      guidelineSource: 'USPSTF 2024',
    },
    {
      test: ScreeningTestType.HPV_TEST,
      intervalYears: 5,
      startAge: 30,
      stopAge: 65,
      riskGroup: 'average',
      preparation: 'No intercourse, douching, or vaginal products 48 hours before test.',
      abnormalFollowUp: 'Colposcopy if positive.',
      sharedDecisionNotes: 'Primary HPV testing every 5 years is an option.',
      guidelineSource: 'USPSTF 2024',
    },
  ],
  geneticCounselingTriggers: [
    'History of DES exposure',
    'Immunosuppression (e.g., HIV)',
    'High-grade cervical dysplasia or cancer in family',
  ],
};

/**
 * Lung Cancer Screening Protocols (USPSTF)
 */
export const lungCancerProtocols: CancerScreeningProtocols = {
  cancer: CancerType.LUNG,
  protocols: [
    {
      test: ScreeningTestType.LOW_DOSE_CT,
      intervalYears: 1,
      startAge: 50,
      stopAge: 80,
      riskGroup: 'high',
      preparation: 'No special preparation. Assess renal function if contrast needed.',
      abnormalFollowUp: 'Diagnostic CT, PET-CT, biopsy as indicated. Refer to pulmonology/oncology.',
      sharedDecisionNotes: 'Annual screening for adults 50-80 with 20+ pack-year smoking history, current or quit within 15 years.',
      guidelineSource: 'USPSTF 2024',
    },
  ],
  geneticCounselingTriggers: [
    'Family history of lung cancer in non-smoker',
    'Known EGFR, ALK, or other actionable mutation',
  ],
};

/**
 * Prostate Cancer Screening Protocols (USPSTF, NCCN)
 */
export const prostateCancerProtocols: CancerScreeningProtocols = {
  cancer: CancerType.PROSTATE,
  protocols: [
    {
      test: ScreeningTestType.PSA,
      intervalYears: 1,
      startAge: 50,
      stopAge: 69,
      riskGroup: 'average',
      preparation: 'No ejaculation 48 hours before test. Avoid vigorous exercise.',
      abnormalFollowUp: 'Repeat PSA, digital rectal exam, prostate biopsy as indicated.',
      sharedDecisionNotes: 'Shared decision-making is essential. Consider earlier screening for African American men or strong family history.',
      guidelineSource: 'USPSTF 2024',
    },
    {
      test: ScreeningTestType.PSA,
      intervalYears: 1,
      startAge: 40,
      stopAge: 69,
      riskGroup: 'high',
      preparation: 'No ejaculation 48 hours before test. Avoid vigorous exercise.',
      abnormalFollowUp: 'Repeat PSA, digital rectal exam, prostate biopsy as indicated.',
      sharedDecisionNotes: 'Start at age 40-45 for high-risk (African American, BRCA2, strong family history).',
      guidelineSource: 'NCCN v4.2025',
    },
  ],
  geneticCounselingTriggers: [
    'Known BRCA2 mutation',
    'Multiple first-degree relatives with prostate cancer',
  ],
};

/**
 * Export all protocols as a database
 */
export const screeningProtocolsDatabase: CancerScreeningProtocols[] = [
  breastCancerProtocols,
  colorectalCancerProtocols,
  cervicalCancerProtocols,
  lungCancerProtocols,
  prostateCancerProtocols,
];
