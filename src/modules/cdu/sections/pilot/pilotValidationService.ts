import { PilotCase } from './sampleCases';
import { ProtocolMatch } from '../types/diseaseProgress.types';

export interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
  caseId: string;
}

export const pilotValidationService = {
  validateCaseData: (caseData: PilotCase): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const { data } = caseData;

    // Check required fields
    if (!data.diseaseStatus?.primaryDiagnosis) errors.push('Missing Primary Diagnosis');
    if (!data.diseaseStatus?.stageAtDiagnosis) errors.push('Missing Stage');
    if (!data.performanceStatus?.performanceScore) errors.push('Missing Performance Score');

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      caseId: caseData.id
    };
  },

  validateCdsOutput: (caseId: string, matches: ProtocolMatch[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Ensure at least one match
    if (matches.length === 0) {
      errors.push('CDS engine returned no results for this case');
    }

    // Safety checks for unsafe wording
    const unsafeWords = [
      'best treatment',
      'recommended treatment',
      'safe treatment',
      'guaranteed',
      'should use'
    ];

    const allowedStatuses = [
      'Eligible option',
      'Potential option',
      'Not eligible',
      'Requires clinician review', // Added for robustness
      'Action required' // From types
    ];

    matches.forEach(match => {
      const combinedText = `${match.protocol.name} ${match.rationale} ${match.protocol.rationale}`.toLowerCase();
      
      unsafeWords.forEach(word => {
        if (combinedText.includes(word)) {
          errors.push(`Unsafe language detected: "${word}" in protocol ${match.protocol.name}`);
        }
      });

      if (!allowedStatuses.includes(match.status)) {
        warnings.push(`Non-standard status encountered: ${match.status} in protocol ${match.protocol.name}`);
      }
    });

    return {
      passed: errors.length === 0,
      errors,
      warnings,
      caseId
    };
  }
};
