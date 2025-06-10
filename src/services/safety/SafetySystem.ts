import { 
  SafetySeverityLevel,
  SafetyAlert,
  ClinicalRule,
  DrugInteraction,
  SafetyCheckResult,
  ClinicalGuideline,
  EmergencyContact,
  RuleCondition
} from './types';
import { MedicalAuditLogger, LogLevel, LogCategory } from '../utils/MedicalAuditLogger';

export class SafetySystem {
  private rules: ClinicalRule[] = [];
  private drugInteractions: DrugInteraction[] = [];
  private guidelines: ClinicalGuideline[] = [];
  private emergencyContacts: EmergencyContact[] = [];
  private auditLogger: MedicalAuditLogger;

  constructor() {
    this.auditLogger = MedicalAuditLogger.getInstance({
      retentionDays: 90,
      logLevel: LogLevel.INFO,
      enableAnonymization: true
    });
  }

  /**
   * Performs a comprehensive safety check based on provided clinical data
   */
  async performSafetyCheck(clinicalData: Record<string, any>): Promise<SafetyCheckResult> {
    const alerts: SafetyAlert[] = [];
    let maxSeverity = SafetySeverityLevel.LOW;
    const recommendations: string[] = [];
    const blockingIssues: string[] = [];

    // Check clinical rules
    const ruleViolations = await this.evaluateRules(clinicalData);
    alerts.push(...ruleViolations.alerts);
    maxSeverity = this.getHighestSeverity(maxSeverity, ruleViolations.severity);

    // Check drug interactions
    if (clinicalData.medications) {
      const interactionResults = await this.checkDrugInteractions(clinicalData.medications);
      alerts.push(...interactionResults.alerts);
      maxSeverity = this.getHighestSeverity(maxSeverity, interactionResults.severity);
    }

    // Check guideline compliance
    if (clinicalData.diagnosis) {
      const guidelineResults = await this.validateGuidelineCompliance(clinicalData);
      alerts.push(...guidelineResults.alerts);
      maxSeverity = this.getHighestSeverity(maxSeverity, guidelineResults.severity);
    }

    // Compile recommendations and blocking issues
    alerts.forEach(alert => {
      if (alert.recommendations) {
        recommendations.push(...alert.recommendations);
      }
      if (alert.severity === SafetySeverityLevel.CRITICAL) {
        blockingIssues.push(alert.message);
      }
    });

    // Log safety check results
    this.auditLogger.logError(
      new Error(`Safety check completed with severity ${maxSeverity}`),
      LogCategory.CLINICAL_DECISION,
      {
        severity: maxSeverity,
        alertCount: alerts.length,
        blockingIssueCount: blockingIssues.length,
        timestamp: new Date()
      }
    );

    return {
      passed: blockingIssues.length === 0,
      severity: maxSeverity,
      alerts,
      requiresEscalation: maxSeverity >= SafetySeverityLevel.HIGH,
      recommendations: [...new Set(recommendations)],
      blockingIssues
    };
  }

  /**
   * Evaluates all clinical rules against provided data
   */
  private async evaluateRules(data: Record<string, any>): Promise<SafetyCheckResult> {
    const alerts: SafetyAlert[] = [];
    let maxSeverity = SafetySeverityLevel.LOW;

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      const conditionsMet = rule.conditions.every(condition => 
        this.evaluateCondition(condition, data)
      );

      if (conditionsMet) {
        for (const action of rule.actions) {
          const alert: SafetyAlert = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            severity: action.severity,
            sourceModule: 'clinical_rules',
            alertType: rule.category,
            message: action.message,
            details: { ruleId: rule.id, ...action.additionalData },
            acknowledgementRequired: action.severity >= SafetySeverityLevel.HIGH
          };

          alerts.push(alert);
          maxSeverity = this.getHighestSeverity(maxSeverity, action.severity);
        }
      }
    }

    return {
      passed: alerts.length === 0,
      severity: maxSeverity,
      alerts,
      requiresEscalation: maxSeverity >= SafetySeverityLevel.HIGH,
      recommendations: [],
      blockingIssues: []
    };
  }

  /**
   * Checks for drug interactions in the provided medication list
   */
  private async checkDrugInteractions(medications: string[]): Promise<SafetyCheckResult> {
    const alerts: SafetyAlert[] = [];
    let maxSeverity = SafetySeverityLevel.LOW;

    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const interaction = this.drugInteractions.find(
          di => (di.drug1 === medications[i] && di.drug2 === medications[j]) ||
               (di.drug1 === medications[j] && di.drug2 === medications[i])
        );

        if (interaction) {
          const alert: SafetyAlert = {
            id: crypto.randomUUID(),
            timestamp: new Date(),
            severity: interaction.severity,
            sourceModule: 'drug_interactions',
            alertType: 'interaction',
            message: `Interaction detected between ${interaction.drug1} and ${interaction.drug2}: ${interaction.effect}`,
            details: interaction,
            recommendations: interaction.recommendations,
            acknowledgementRequired: interaction.severity >= SafetySeverityLevel.HIGH
          };

          alerts.push(alert);
          maxSeverity = this.getHighestSeverity(maxSeverity, interaction.severity);
        }
      }
    }

    return {
      passed: alerts.length === 0,
      severity: maxSeverity,
      alerts,
      requiresEscalation: maxSeverity >= SafetySeverityLevel.HIGH,
      recommendations: alerts.flatMap(a => a.recommendations || []),
      blockingIssues: []
    };
  }

  /**
   * Validates clinical data against applicable guidelines
   */
  private async validateGuidelineCompliance(data: Record<string, any>): Promise<SafetyCheckResult> {
    const alerts: SafetyAlert[] = [];
    let maxSeverity = SafetySeverityLevel.LOW;

    const applicableGuidelines = this.guidelines.filter(g => 
      g.applicableDiagnoses.includes(data.diagnosis)
    );

    for (const guideline of applicableGuidelines) {
      // Evaluate guideline-specific validation rules
      for (const rule of guideline.validationRules) {
        if (!rule.enabled) continue;

        const conditionsMet = rule.conditions.every(condition =>
          this.evaluateCondition(condition, data)
        );

        if (conditionsMet) {
          for (const action of rule.actions) {
            const alert: SafetyAlert = {
              id: crypto.randomUUID(),
              timestamp: new Date(),
              severity: action.severity,
              sourceModule: 'guideline_validation',
              alertType: `${guideline.source}_compliance`,
              message: action.message,
              details: { 
                guidelineId: guideline.id,
                version: guideline.version,
                ...action.additionalData 
              },
              acknowledgementRequired: action.severity >= SafetySeverityLevel.HIGH
            };

            alerts.push(alert);
            maxSeverity = this.getHighestSeverity(maxSeverity, action.severity);
          }
        }
      }
    }

    return {
      passed: alerts.length === 0,
      severity: maxSeverity,
      alerts,
      requiresEscalation: maxSeverity >= SafetySeverityLevel.HIGH,
      recommendations: alerts.flatMap(a => a.recommendations || []),
      blockingIssues: []
    };
  }

  /**
   * Evaluates a single rule condition against provided data
   */
  private evaluateCondition(condition: RuleCondition, data: Record<string, any>): boolean {
    const value = this.extractValue(condition.type, data, condition.parameters);
    
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'notEquals':
        return value !== condition.value;
      case 'greaterThan':
        return value > condition.value;
      case 'lessThan':
        return value < condition.value;
      case 'contains':
        return Array.isArray(value) ? 
          value.includes(condition.value) : 
          String(value).includes(String(condition.value));
      case 'notContains':
        return Array.isArray(value) ? 
          !value.includes(condition.value) : 
          !String(value).includes(String(condition.value));
      default:
        return false;
    }
  }

  /**
   * Extracts a value from clinical data based on condition type
   */
  private extractValue(type: string, data: Record<string, any>, parameters?: Record<string, any>): any {
    switch (type) {
      case 'age':
        return data.age;
      case 'allergy':
        return data.allergies || [];
      case 'diagnosis':
        return data.diagnosis;
      case 'medication':
        return data.medications || [];
      case 'lab':
        return parameters?.labName ? data.labs?.[parameters.labName] : null;
      case 'custom':
        return parameters?.path ? this.getNestedValue(data, parameters.path) : null;
      default:
        return null;
    }
  }

  /**
   * Gets a nested value from an object using a dot-notation path
   */
  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((curr, key) => curr?.[key], obj);
  }

  /**
   * Returns the higher severity level between two levels
   */
  private getHighestSeverity(level1: SafetySeverityLevel, level2: SafetySeverityLevel): SafetySeverityLevel {
    const severityOrder = [
      SafetySeverityLevel.LOW,
      SafetySeverityLevel.MEDIUM,
      SafetySeverityLevel.HIGH,
      SafetySeverityLevel.CRITICAL
    ];
    
    return severityOrder.indexOf(level1) >= severityOrder.indexOf(level2) ? level1 : level2;
  }

  // Public methods for managing rules, interactions, and guidelines

  addRule(rule: ClinicalRule): void {
    this.rules.push(rule);
  }

  updateRule(ruleId: string, updates: Partial<ClinicalRule>): void {
    const index = this.rules.findIndex(r => r.id === ruleId);
    if (index >= 0) {
      this.rules[index] = { ...this.rules[index], ...updates };
    }
  }

  addDrugInteraction(interaction: DrugInteraction): void {
    this.drugInteractions.push(interaction);
  }

  updateGuidelines(guidelines: ClinicalGuideline[]): void {
    this.guidelines = guidelines;
  }

  addEmergencyContact(contact: EmergencyContact): void {
    this.emergencyContacts.push(contact);
  }
}
