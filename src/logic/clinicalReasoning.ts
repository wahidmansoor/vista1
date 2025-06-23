/**
 * Clinical Reasoning Generator for Cancer Screening
 * -----------------------------------------------
 * Generates structured clinical notes for EMR and medical-legal documentation.
 */

import { ClinicalRecommendation, ScreeningTestType, CancerType, RecommendationUrgency } from '../types/clinical';

export interface Screening extends ClinicalRecommendation {}

export interface ClinicalNote {
  indication: string;
  riskFactors: string[];
  guidelineCitation: string;
  evidenceQuality: 'high' | 'moderate' | 'low';
  sharedDecision: {
    benefits: string;
    limitations: string;
    alternatives: string[];
    patientPreferences: string;
    consentElements: string;
  };
  clinicalPearls: string[];
  followUp: string;
  icd10Codes: string[];
  cptCodes: string[];
  formattedNote: string;
}

/**
 * Generate a structured clinical rationale for a screening recommendation
 * @param recommendation Screening
 * @returns ClinicalNote
 */
export function generateClinicalRationale(recommendation: Screening): ClinicalNote {
  // 1. Indication
  const indication = `Screening for ${recommendation.cancer_type} due to: ${recommendation.rationale.key_factors.join(', ')}`;

  // 2. Risk factor justification
  const riskFactors = recommendation.rationale.key_factors.map(f => `- ${f}`);

  // 3. Guideline citation
  let guideline = recommendation.rationale.guideline_source || 'USPSTF 2025';
  if (recommendation.cancer_type === CancerType.BREAST) guideline = 'ACS 2024, USPSTF 2025, NCCN v4.2025';
  if (recommendation.cancer_type === CancerType.COLORECTAL) guideline = 'USPSTF 2024, NCCN v4.2025';

  // 4. Evidence quality
  const evidenceQuality = (recommendation.rationale.evidence_quality as 'high'|'moderate'|'low') || 'high';

  // 5. Shared decision-making
  const sharedDecision = {
    benefits: `Early detection of ${recommendation.cancer_type} improves outcomes and survival.`,
    limitations: 'Potential for false positives, overdiagnosis, and procedure-related risks.',
    alternatives: recommendation.alternative_tests?.map(t => t.replace('_', ' ')) || [],
    patientPreferences: 'Discussed patient values, concerns, and screening interval preferences.',
    consentElements: 'Patient informed of risks, benefits, alternatives, and provided verbal consent.'
  };

  // 6. Clinical pearls
  const pearls: string[] = [];
  if (recommendation.cancer_type === CancerType.BREAST) pearls.push('Consider earlier MRI for BRCA+ or high-risk patients.');
  if (recommendation.cancer_type === CancerType.COLORECTAL) pearls.push('Family history may warrant earlier or more frequent screening.');
  if (recommendation.urgency === RecommendationUrgency.EMERGENT) pearls.push('Red flag symptoms require urgent diagnostic workup.');
  if (recommendation.special_considerations) pearls.push(...recommendation.special_considerations);

  // 7. Follow-up guidance
  let followUp = 'Routine follow-up per guideline.';
  if (recommendation.urgency === RecommendationUrgency.EMERGENT) followUp = 'Immediate referral to specialist and expedited diagnostics.';
  else if (recommendation.urgency === RecommendationUrgency.URGENT) followUp = 'Prompt follow-up within 1-2 weeks.';
  else if (recommendation.review_date) followUp = `Next review: ${recommendation.review_date.toLocaleDateString()}`;

  // 8. ICD-10 and CPT code suggestions (simplified, real implementation would use a mapping)
  const icd10Codes: string[] = [];
  const cptCodes: string[] = [];
  switch (recommendation.cancer_type) {
    case CancerType.BREAST:
      icd10Codes.push('Z12.31'); // Encounter for screening mammogram
      cptCodes.push('77067'); // Screening mammography
      break;
    case CancerType.COLORECTAL:
      icd10Codes.push('Z12.11'); // Encounter for screening for malignant neoplasm of colon
      cptCodes.push('45378'); // Colonoscopy
      break;
    case CancerType.LUNG:
      icd10Codes.push('Z87.891'); // Personal history of nicotine dependence
      cptCodes.push('71250'); // Low dose CT
      break;
    case CancerType.CERVICAL:
      icd10Codes.push('Z12.4'); // Encounter for screening for malignant neoplasm of cervix
      cptCodes.push('88142'); // Pap smear
      break;
    default:
      icd10Codes.push('Z12.89'); // Encounter for screening for other specified malignant neoplasms
      cptCodes.push('99499'); // Unlisted E/M service
  }

  // 9. Format as structured clinical note
  const formattedNote = `---\nClinical Reasoning for ${recommendation.cancer_type} Screening\n---\nPrimary Indication: ${indication}\n\nRisk Factors:\n${riskFactors.join('\n')}\n\nGuideline: ${guideline}\nEvidence Quality: ${evidenceQuality}\n\nShared Decision-Making:\n- Benefits: ${sharedDecision.benefits}\n- Limitations: ${sharedDecision.limitations}\n- Alternatives: ${sharedDecision.alternatives.join(', ') || 'None'}\n- Patient Preferences: ${sharedDecision.patientPreferences}\n- Consent: ${sharedDecision.consentElements}\n\nClinical Pearls:\n${pearls.join('\n') || 'None'}\n\nFollow-up: ${followUp}\n\nICD-10 Codes: ${icd10Codes.join(', ')}\nCPT Codes: ${cptCodes.join(', ')}\n---`;

  return {
    indication,
    riskFactors,
    guidelineCitation: guideline,
    evidenceQuality,
    sharedDecision,
    clinicalPearls: pearls,
    followUp,
    icd10Codes,
    cptCodes,
    formattedNote
  };
}
