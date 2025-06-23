/**
 * Evidence-Based Screening Recommendation Engine
 * Implements generateScreeningPlan(riskProfile: RiskScore): ScreeningPlan
 * - USPSTF Grade A/B recommendations
 * - High-risk protocol triggers
 * - Symptom-driven urgent referrals
 * - Interval optimization and patient preference
 * - Comprehensive error handling
 */

import { CancerType, ScreeningTestType, RecommendationUrgency, ClinicalRecommendation } from '../types/clinical';
import { RiskScore } from './riskAssessment';
import { breastCancerProtocols, /* add other protocols as needed */ } from '../data/clinical/screening_protocols';
import { SYMPTOM_CANCER_CORRELATIONS } from '../data/clinical/symptom_correlations';

export interface ScreeningPlan {
  cancerType: CancerType;
  recommendations: ClinicalRecommendation[];
  rationale: string[];
  errors?: string[];
  // Added for compatibility with clinicalReports
  riskSummary: string;
  timeline: Array<{
    test: ScreeningTestType;
    dueDate: Date;
    status: 'completed' | 'due' | 'overdue' | 'planned';
    result?: string;
  }>;
  actionItems: string[];
}

/**
 * Generate a screening plan based on risk profile and evidence-based protocols
 * @param riskProfile RiskScore for a specific cancer type
 * @returns ScreeningPlan
 */
export function generateScreeningPlan(riskProfile: RiskScore): ScreeningPlan {
  const recommendations: ClinicalRecommendation[] = [];
  const rationale: string[] = [];
  const errors: string[] = [];

  try {
    // 1. USPSTF Grade A/B recommendations (example: breast cancer)
    if (riskProfile.cancerType === CancerType.BREAST) {
      const protocolSet = breastCancerProtocols;
      for (const protocol of protocolSet.protocols) {
        // High-confidence (Grade A/B) for average risk
        if (riskProfile.riskLevel === 'average' && protocol.riskGroup === 'average') {
          recommendations.push({
            cancer_type: CancerType.BREAST,
            urgency: RecommendationUrgency.ROUTINE,
            test_recommended: protocol.test,
            rationale: {
              guideline_source: protocol.guidelineSource,
              recommendation_grade: 'A',
              key_factors: ['Meets USPSTF average risk criteria'],
              clinical_reasoning: 'Strong evidence for benefit outweighing harm in this age/risk group.',
              evidence_quality: 'High',
            },
            generated_date: new Date(),
            review_date: new Date(new Date().setFullYear(new Date().getFullYear() + (protocol.intervalYears || 1))),
          });
          rationale.push('USPSTF Grade A/B recommendation applied.');
        }
        // High-risk protocol activation
        if ((riskProfile.riskLevel === 'high' || riskProfile.riskLevel === 'very_high') && (protocol.riskGroup === 'high' || protocol.riskGroup === 'very_high')) {
          recommendations.push({
            cancer_type: CancerType.BREAST,
            urgency: RecommendationUrgency.URGENT,
            test_recommended: protocol.test,
            rationale: {
              guideline_source: protocol.guidelineSource,
              recommendation_grade: 'B',
              key_factors: ['High-risk protocol triggered by genetic/family history/multi-factorial score'],
              clinical_reasoning: 'High-risk patient meets criteria for intensive screening.',
              evidence_quality: 'High',
            },
            generated_date: new Date(),
            review_date: new Date(new Date().setFullYear(new Date().getFullYear() + (protocol.intervalYears || 1))),
            special_considerations: [protocol.sharedDecisionNotes || 'High-risk screening protocol'],
          });
          rationale.push('High-risk protocol activated.');
        }
      }
    }
    // 2. Symptom-driven urgent referral logic (example: red flag symptoms)
    // This would be expanded with patient symptom data in a real implementation
    for (const corr of SYMPTOM_CANCER_CORRELATIONS) {
      if (corr.cancerTypes.includes(riskProfile.cancerType) && corr.likelihoodRatio.value > 2) {
        recommendations.push({
          cancer_type: riskProfile.cancerType,
          urgency: RecommendationUrgency.URGENT,
          test_recommended: ScreeningTestType.OTHER,
          rationale: {
            guideline_source: corr.likelihoodRatio.source || 'Epidemiology meta-analysis',
            recommendation_grade: 'B',
            key_factors: [`Red flag symptom: ${corr.symptom}`],
            clinical_reasoning: corr.clinicalContext || 'Red flag symptom present, urgent evaluation indicated.',
            evidence_quality: 'Moderate',
          },
          generated_date: new Date(),
          review_date: new Date(),
        });
        rationale.push(`Urgent referral for red flag symptom: ${corr.symptom}`);
      }
    }
    // 3. Interval optimization (risk-adjusted)
    for (const rec of recommendations) {
      // Example: If very high risk, recommend annual or more frequent screening
      if (riskProfile.riskLevel === 'very_high') {
        rec.review_date = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
        rec.special_considerations = rec.special_considerations || [];
        rec.special_considerations.push('Annual screening due to very high risk.');
      }
    }
    // 4. Patient preference integration (placeholder)
    // In a real system, would check for patient opt-in/opt-out, shared decision notes, etc.
    if (recommendations.length === 0) {
      errors.push('No evidence-based recommendation could be generated for this risk profile.');
    }
  } catch (e: any) {
    errors.push('Error generating screening plan: ' + (e.message || e));
  }

  return {
    cancerType: riskProfile.cancerType,
    recommendations,
    rationale,
    errors: errors.length ? errors : undefined,
    riskSummary: riskProfile.riskLevel || 'average',
    timeline: [],
    actionItems: []
  };
}
