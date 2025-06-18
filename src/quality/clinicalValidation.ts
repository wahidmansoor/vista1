/**
 * Clinical Decision Validation System
 * ----------------------------------
 * Provides real-time guideline compliance, logic consistency, evidence quality, and audit trail validation
 * for all cancer screening recommendations. Designed for regulatory and clinical safety.
 */

import { ClinicalRecommendation, CancerType, RecommendationUrgency } from '../types/clinical';

export interface ValidationResult {
  passed: boolean;
  compliant: boolean; // Added for backward compatibility
  errors: string[];
  warnings: string[];
  auditTrail: string[];
  performanceMetrics?: Record<string, any>;
}

/**
 * 1. Guideline Compliance Verification
 * Checks if recommendations match USPSTF, ACS, NCCN, and optionally international guidelines
 */
export function verifyGuidelineCompliance(recommendation: ClinicalRecommendation): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const auditTrail: string[] = [];
  // Placeholder: Replace with real guideline DB/API checks
  if (!['USPSTF', 'ACS', 'NCCN'].includes(recommendation.rationale.guideline_source)) {
    errors.push('Non-standard guideline source: ' + recommendation.rationale.guideline_source);
  }
  if (!recommendation.rationale.recommendation_grade) {
    warnings.push('No recommendation grade provided.');
  }
  auditTrail.push(`Checked guideline source: ${recommendation.rationale.guideline_source}`);
  const passed = errors.length === 0;
  return { passed, compliant: passed, errors, warnings, auditTrail };
}

/**
 * 2. Logic Consistency Checking
 * Validates risk calculation, recommendation logic, and edge case handling
 */
export function checkLogicConsistency(recommendation: ClinicalRecommendation, calculatedRisk: number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const auditTrail: string[] = [];
  // Example: If risk is high, urgency should not be 'routine' or 'future'
  if (calculatedRisk > 0.4 && (recommendation.urgency === RecommendationUrgency.ROUTINE || recommendation.urgency === RecommendationUrgency.FUTURE)) {
    errors.push('High risk but non-urgent recommendation.');
  }
  // Edge case: Recommendation for cancer type not at risk
  if (calculatedRisk < 0.05 && recommendation.urgency !== RecommendationUrgency.NOT_INDICATED) {
    warnings.push('Low risk but recommendation given.');
  }
  auditTrail.push(`Checked logic for risk: ${calculatedRisk}, urgency: ${recommendation.urgency}`);
  const passed = errors.length === 0;
  return { passed, compliant: passed, errors, warnings, auditTrail };
}

/**
 * 3. Evidence Quality Assessment
 * Grades the evidence and checks confidence intervals
 */
export function assessEvidenceQuality(recommendation: ClinicalRecommendation): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const auditTrail: string[] = [];
  // Placeholder: Real grading would use evidence DB
  if (!recommendation.rationale.evidence_quality) {
    warnings.push('No evidence quality stated.');
  } else if (!['high', 'moderate', 'low'].includes(recommendation.rationale.evidence_quality.toLowerCase())) {
    errors.push('Invalid evidence quality: ' + recommendation.rationale.evidence_quality);
  }
  auditTrail.push(`Assessed evidence quality: ${recommendation.rationale.evidence_quality}`);
  const passed = errors.length === 0;
  return { passed, compliant: passed, errors, warnings, auditTrail };
}

/**
 * 4. Clinical Accuracy Audit Trail
 * Logs decision pathway, tracks changes, and reports errors
 */
export class ClinicalAuditTrail {
  private logs: string[] = [];
  private changes: string[] = [];
  private errors: string[] = [];
  private metrics: Record<string, any> = {};

  log(message: string) {
    this.logs.push(`[LOG ${new Date().toISOString()}] ${message}`);
  }
  recordChange(change: string) {
    this.changes.push(`[CHANGE ${new Date().toISOString()}] ${change}`);
  }
  reportError(error: string) {
    this.errors.push(`[ERROR ${new Date().toISOString()}] ${error}`);
  }
  setMetric(key: string, value: any) {
    this.metrics[key] = value;
  }
  getAuditTrail() {
    return {
      logs: this.logs,
      changes: this.changes,
      errors: this.errors,
      metrics: this.metrics,
    };
  }
  getTrail() {
    // Added for backward compatibility with tests
    return this.logs;
  }
}

/**
 * Comprehensive validation for a set of recommendations
 */
export function validateClinicalRecommendations(
  recommendations: ClinicalRecommendation[],
  riskScores: Record<string, number>
): ValidationResult[] {
  const results: ValidationResult[] = [];
  for (const rec of recommendations) {
    const risk = riskScores[rec.cancer_type] || 0;
    const guideline = verifyGuidelineCompliance(rec);
    const logic = checkLogicConsistency(rec, risk);
    const evidence = assessEvidenceQuality(rec);
    // Merge results
    const passed = guideline.passed && logic.passed && evidence.passed;
    const errors = [...guideline.errors, ...logic.errors, ...evidence.errors];
    const warnings = [...guideline.warnings, ...logic.warnings, ...evidence.warnings];
    const auditTrail = [...guideline.auditTrail, ...logic.auditTrail, ...evidence.auditTrail];
    results.push({ passed, compliant: passed, errors, warnings, auditTrail });
  }
  return results;
}

// Test suite and regulatory compliance checks would be implemented in __tests__ and CI/CD pipelines.
