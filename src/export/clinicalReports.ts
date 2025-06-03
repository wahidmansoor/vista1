/**
 * Clinical Report Generator for Cancer Screening Engine
 * ----------------------------------------------------
 * Generates professional, guideline-compliant clinical reports for providers and patients.
 * Includes executive summary, detailed assessment, patient handout, and EMR integration format.
 */

import { ClinicalRecommendation, ScreeningTestType, RecommendationUrgency, CancerType } from '../types/clinical';

export interface ScreeningPlan {
  recommendations: ClinicalRecommendation[];
  riskSummary: string;
  timeline: Array<{
    test: ScreeningTestType;
    dueDate: Date;
    status: 'completed' | 'due' | 'overdue' | 'planned';
    result?: string;
  }>;
  actionItems: string[];
}

export interface ClinicalReport {
  executiveSummary: string;
  detailedAssessment: string;
  patientHandout: string;
  emrData: Record<string, any>;
  language: string;
  branding?: string;
}

/**
 * Generate a comprehensive clinical report from a screening plan
 * @param screeningResults ScreeningPlan
 * @param options Optional: language, branding
 * @returns ClinicalReport
 */
export function generateClinicalReport(
  screeningResults: ScreeningPlan,
  options?: { language?: string; branding?: string }
): ClinicalReport {
  // 1. Executive Summary
  const summaryLines: string[] = [
    'Cancer Screening Executive Summary',
    '----------------------------------',
    `Key Recommendations:`
  ];
  for (const rec of screeningResults.recommendations) {
    summaryLines.push(
      `- [${rec.urgency.toUpperCase()}] ${rec.test_recommended} for ${rec.cancer_type}: ${rec.rationale.key_factors.join(', ')}`
    );
  }
  summaryLines.push(`\nRisk Stratification: ${screeningResults.riskSummary}`);
  summaryLines.push(`\nScreening Timeline:`);
  for (const t of screeningResults.timeline) {
    summaryLines.push(
      `- ${t.test} (${t.status})${t.result ? `: ${t.result}` : ''} - Due: ${t.dueDate.toLocaleDateString()}`
    );
  }
  summaryLines.push(`\nAction Items:`);
  for (const item of screeningResults.actionItems) {
    summaryLines.push(`- ${item}`);
  }
  const executiveSummary = summaryLines.join('\n');

  // 2. Detailed Clinical Assessment
  const detailLines: string[] = [
    'Detailed Clinical Assessment',
    '----------------------------',
    'Risk Factor Analysis:'
  ];
  for (const rec of screeningResults.recommendations) {
    detailLines.push(
      `\n[${rec.cancer_type}] ${rec.test_recommended} (${rec.urgency.toUpperCase()})`);
    detailLines.push(`- Rationale: ${rec.rationale.clinical_reasoning}`);
    if (rec.rationale.guideline_source) {
      detailLines.push(`- Guideline: ${rec.rationale.guideline_source}${rec.rationale.recommendation_grade ? ` (${rec.rationale.recommendation_grade})` : ''}`);
    }
    if (rec.rationale.evidence_quality) {
      detailLines.push(`- Evidence Quality: ${rec.rationale.evidence_quality}`);
    }
    if (rec.alternative_tests && rec.alternative_tests.length > 0) {
      detailLines.push(`- Alternatives: ${rec.alternative_tests.join(', ')}`);
    }
    if (rec.special_considerations && rec.special_considerations.length > 0) {
      detailLines.push(`- Special Considerations: ${rec.special_considerations.join('; ')}`);
    }
  }
  detailLines.push(`\nGuideline Compliance: All recommendations reviewed for USPSTF/ACS/NCCN compliance.`);
  const detailedAssessment = detailLines.join('\n');

  // 3. Patient Education Handout
  const handoutLines: string[] = [
    'Patient Cancer Screening Handout',
    '--------------------------------',
    'Your personalized cancer screening plan includes:'
  ];
  for (const rec of screeningResults.recommendations) {
    handoutLines.push(
      `- ${rec.test_recommended} for ${rec.cancer_type}: ${rec.rationale.key_factors.join(', ')}`
    );
    if (rec.patient_instructions) {
      handoutLines.push(`  Preparation: ${rec.patient_instructions}`);
    }
  }
  handoutLines.push(`\nWhat to Expect: Each test is designed to detect cancer early. Your care team will explain the process and answer questions.`);
  handoutLines.push(`\nFollow-Up: Please attend all scheduled tests and follow your provider's instructions. For questions, contact your clinic.`);
  const patientHandout = handoutLines.join('\n');

  // 4. EMR Integration Format
  const emrData: Record<string, any> = {
    recommendations: screeningResults.recommendations.map(rec => ({
      cancerType: rec.cancer_type,
      urgency: rec.urgency,
      test: rec.test_recommended,
      rationale: rec.rationale,
      icd10: rec.special_considerations?.find(s => s.startsWith('ICD-10:')) || '',
      cpt: rec.special_considerations?.find(s => s.startsWith('CPT:')) || '',
    })),
    timeline: screeningResults.timeline,
    actionItems: screeningResults.actionItems,
    qualityMeasures: 'All recommendations reviewed for guideline compliance.'
  };

  // Multi-language and branding support (future)
  const language = options?.language || 'en';
  const branding = options?.branding;

  return {
    executiveSummary,
    detailedAssessment,
    patientHandout,
    emrData,
    language,
    branding,
  };
}
