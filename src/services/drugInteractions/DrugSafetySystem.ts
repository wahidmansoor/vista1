import type { SafetyIssue, SafetyValidation } from '../safety/types';
import type { DrugAssessmentResult } from './types';

export class DrugSafetySystem {
  private enabledChecks = ['DRUG-001', 'DRUG-002'];
  private strictMode = true;

  async validateDrugAssessment(assessment: DrugAssessmentResult): Promise<SafetyValidation> {
    const issues: SafetyIssue[] = [];
    const recommendations: string[] = [];

    // Run each check
    for (const checkId of this.enabledChecks) {
      const checkIssues = await this.runCheck(checkId, assessment);
      issues.push(...checkIssues);
    }

    // Generate recommendations based on issues
    issues.forEach(issue => {
      if (issue.severity === 'critical') {
        recommendations.push(`REQUIRED: ${issue.message}`);
      } else if (issue.severity === 'warning') {
        recommendations.push(`RECOMMENDED: Review and address - ${issue.message}`);
      }
    });

    const hasCritical = issues.some(i => i.severity === 'critical');
    
    // Add drug-specific recommendations
    const criticalInteractions = issues.filter(i => i.severity === 'critical');
    if (criticalInteractions.length > 0) {
      recommendations.push(
        'REQUIRED: Pharmacist consultation needed for critical drug interactions'
      );
    }

    return {
      isValid: !hasCritical || !this.strictMode,
      issues,
      recommendations
    };
  }

  private async runCheck(checkId: string, data: DrugAssessmentResult): Promise<SafetyIssue[]> {
    switch (checkId) {
      case 'DRUG-001':
        return this.checkCriticalInteractions(data);
      case 'DRUG-002':
        return this.checkTimingIssues(data);
      default:
        return [];
    }
  }

  private async checkCriticalInteractions(data: DrugAssessmentResult): Promise<SafetyIssue[]> {
    const issues: SafetyIssue[] = [];
    
    if (data.requiresMedicalAttention) {
      issues.push({
        severity: 'critical',
        message: 'One or more critical drug interactions detected',
        code: 'CRITICAL_INTERACTION'
      });
    }

    return issues;
  }

  private async checkTimingIssues(data: DrugAssessmentResult): Promise<SafetyIssue[]> {
    const issues: SafetyIssue[] = [];

    // Check if medications have timing requirements
    const hasMedicationTimingIssues = data.medications.some(med => 
      med.interactions.some(interaction => 
        interaction.severity === 'severe' || 
        interaction.severity === 'life-threatening'
      )
    );

    if (hasMedicationTimingIssues) {
      issues.push({
        severity: 'warning',
        message: 'Medication timing adjustments required',
        code: 'TIMING_ADJUSTMENT_NEEDED'
      });
    }

    return issues;
  }
}
