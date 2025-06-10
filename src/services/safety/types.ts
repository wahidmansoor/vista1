import { SymptomAssessmentResult } from '../symptomAssessment/types';

export interface SafetyValidation {
  isValid: boolean;
  issues: SafetyIssue[];
  recommendations: string[];
}

export interface SafetyIssue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  code: string;
  context?: Record<string, unknown>;
}

export interface SafetyCheck<T = unknown> {
  id: string;
  name: string;
  description: string;
  validate: (data: T) => Promise<SafetyIssue[]>;
}

export interface SafetySystemConfig {
  enabledChecks: string[];
  autoRemediate: boolean;
  strictMode: boolean;
  maxRetries: number;
}

export class SafetySystem {
  private config: SafetySystemConfig;
  private checks: Map<string, SafetyCheck<any>>;

  constructor(config: SafetySystemConfig) {
    this.config = config;
    this.checks = new Map();
    this.initializeChecks();
  }

  private initializeChecks() {
    // Add symptom assessment specific safety checks
    this.addCheck<SymptomAssessmentResult>({
      id: 'SYMPT-001',
      name: 'Emergency Symptoms Check',
      description: 'Validates proper handling of emergency-level symptoms',
      validate: async (data) => {
        const issues: SafetyIssue[] = [];
        
        if (this.isSymptomAssessment(data)) {
          // Check if emergency symptoms are properly flagged
          const hasEmergencySymptoms = data.symptoms.some(s => 
            s.severity.requiresImmediate && !data.requiresMedicalAttention
          );

          if (hasEmergencySymptoms) {
            issues.push({
              severity: 'critical',
              message: 'Emergency symptoms detected but medical attention not flagged',
              code: 'EMERGENCY_FLAG_MISSING'
            });
          }
        }

        return issues;
      }
    });

    this.addCheck<SymptomAssessmentResult>({
      id: 'SYMPT-002',
      name: 'Recommendation Consistency',
      description: 'Validates recommendations match symptom severity',
      validate: async (data) => {
        const issues: SafetyIssue[] = [];

        if (this.isSymptomAssessment(data)) {
          // Check recommendation priorities against symptom severities
          data.symptoms.forEach(symptom => {
            if (symptom.severity.level === 'severe') {
              const hasUrgentRec = data.recommendations.some(r => 
                r.priority === 'urgent' || r.priority === 'immediate'
              );
              
              if (!hasUrgentRec) {
                issues.push({
                  severity: 'warning',
                  message: `Severe symptom "${symptom.name}" lacks urgent recommendations`,
                  code: 'URGENT_REC_MISSING'
                });
              }
            }
          });
        }

        return issues;
      }
    });
  }

  private isSymptomAssessment(data: unknown): data is SymptomAssessmentResult {
    return (
      typeof data === 'object' &&
      data !== null &&
      'symptoms' in data &&
      Array.isArray((data as SymptomAssessmentResult).symptoms) &&
      'recommendations' in data &&
      Array.isArray((data as SymptomAssessmentResult).recommendations)
    );
  }

  addCheck<T>(check: SafetyCheck<T>) {
    this.checks.set(check.id, check);
  }

  async validateAssessment(assessment: SymptomAssessmentResult): Promise<SafetyValidation> {
    const issues: SafetyIssue[] = [];
    const recommendations: string[] = [];

    // Run enabled checks
    for (const checkId of this.config.enabledChecks) {
      const check = this.checks.get(checkId);
      if (check) {
        const checkIssues = await check.validate(assessment);
        issues.push(...checkIssues);
      }
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
    
    return {
      isValid: !hasCritical || !this.config.strictMode,
      issues,
      recommendations
    };
  }
}
