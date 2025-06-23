import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import { ConfidenceService } from '../confidence/ConfidenceService';
import type { 
  DrugInfo,
  DrugInteraction,
  DrugInteractionAnalysis,
  DrugInteractionHandlerOptions,
  PatientFactors,
  DoseAdjustment,
  DrugInteractionSeverity,
  DrugAssessmentResult,
  TriageLevel
} from './types';
import { DrugSafetySystem } from './DrugSafetySystem';

export class DrugInteractionHandler {
  private safetySystem: DrugSafetySystem;
  private confidenceService: ConfidenceService;
  private auditLogger: MedicalAuditLogger;
  private options: DrugInteractionHandlerOptions;

  constructor(
    auditLogger: MedicalAuditLogger,
    safetySystem: DrugSafetySystem,
    confidenceService: ConfidenceService,
    options: Partial<DrugInteractionHandlerOptions> = {}
  ) {
    this.options = {
      enableLocalDatabase: true,
      includePatientFactors: true,
      checkFoodInteractions: true,
      checkSupplementInteractions: true,
      includeEducationPoints: true,
      confidenceThreshold: 0.85,
      safetySystemEnabled: true,
      ...options
    };

    this.safetySystem = safetySystem;
    this.confidenceService = confidenceService;
    this.auditLogger = auditLogger;
  }

  public async analyzeDrugInteractions(
    drugs: DrugInfo[],
    patientFactors?: PatientFactors
  ): Promise<DrugInteractionAnalysis> {
    try {
      // Validate input
      if (!drugs.length) {
        throw new Error('No drugs provided for analysis');
      }

      const interactions: DrugInteraction[] = [];
      const patientSpecificWarnings: string[] = [];
      const doseAdjustments: DoseAdjustment[] = [];
      const educationPoints: string[] = [];
      let overallRiskLevel: DrugInteractionSeverity = 'Minor';

      // Check each drug pair for interactions
      for (let i = 0; i < drugs.length; i++) {
        for (let j = i + 1; j < drugs.length; j++) {
          const interaction = await this.checkDrugPairInteraction(drugs[i], drugs[j]);
          if (interaction) {
            interactions.push(interaction);
            
            // Update overall risk level if needed
            const interactionSeverity = this.calculateInteractionSeverity(interaction);
            if (this.isHigherSeverity(interactionSeverity, overallRiskLevel)) {
              overallRiskLevel = interactionSeverity;
            }
          }
        }
      }

      // Include patient-specific analysis if enabled
      if (this.options.includePatientFactors && patientFactors) {
        const patientAnalysis = this.analyzePatientFactors(drugs, patientFactors);
        patientSpecificWarnings.push(...patientAnalysis.warnings);
        doseAdjustments.push(...patientAnalysis.doseAdjustments);
      }

      // Generate education points if enabled
      if (this.options.includeEducationPoints) {
        educationPoints.push(...this.generateEducationPoints(drugs, interactions));
      }

      // Safety system verification
      if (this.options.safetySystemEnabled) {
        const assessmentResult: DrugAssessmentResult = {
          timestamp: new Date().toISOString(),
          symptoms: drugs.map(d => ({
            name: d.name,
            severity: {
              level: this.mapSeverityToAssessmentSeverity(overallRiskLevel),
              score: 0,
              requiresImmediate: overallRiskLevel === 'Major' || overallRiskLevel === 'Contraindicated'
            },
            relatedToTreatment: true,
            possibleCauses: []
          })),
          trends: [],
          recommendations: [],
          requiresMedicalAttention: overallRiskLevel === 'Major' || overallRiskLevel === 'Contraindicated',
          triageLevel: this.mapSeverityToTriageLevel(overallRiskLevel),
          educationalResources: [],
          medications: drugs.map(d => ({
            name: d.name,
            interactions: interactions
              .filter(i => i.drug1.name === d.name || i.drug2.name === d.name)
              .map(i => ({
                withDrug: i.drug1.name === d.name ? i.drug2.name : i.drug1.name,
                severity: this.mapSeverityToAssessmentSeverity(i.effects[0]?.severity || 'Minor'),
                description: i.effects[0]?.description || '',
                mechanism: i.effects[0]?.mechanism || 'Unknown'
              }))
          }))
        };

        const safetyValidation = await this.safetySystem.validateDrugAssessment(assessmentResult);
        if (!safetyValidation.isValid) {
          patientSpecificWarnings.push(...safetyValidation.recommendations);
          if (safetyValidation.issues.some(i => i.severity === 'critical')) {
            overallRiskLevel = 'Major';
          }
        }
      }

      return {
        interactions,
        patientSpecificWarnings,
        doseAdjustments,
        consultationRequired: this.determineIfConsultationRequired(interactions),
        adherenceRecommendations: this.generateAdherenceRecommendations(drugs, interactions),
        educationPoints,
        overallRiskLevel,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      await this.auditLogger.logError(
        'Error in drug interaction analysis',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  private async checkDrugPairInteraction(drug1: DrugInfo, drug2: DrugInfo): Promise<DrugInteraction | null> {
    // Implementation would include:
    // 1. Check local database
    // 2. Query external APIs if needed
    // 3. Apply confidence scoring
    // 4. Generate timing recommendations
    return null; // Placeholder
  }

  private calculateInteractionSeverity(interaction: DrugInteraction): DrugInteractionSeverity {
    const severityOrder: DrugInteractionSeverity[] = ['Minor', 'Moderate', 'Major', 'Contraindicated'];
    return interaction.effects.reduce((highest, effect) => {
      const highestIndex = severityOrder.indexOf(highest);
      const currentIndex = severityOrder.indexOf(effect.severity);
      return currentIndex > highestIndex ? effect.severity : highest;
    }, 'Minor' as DrugInteractionSeverity);
  }

  private isHigherSeverity(severity1: DrugInteractionSeverity, severity2: DrugInteractionSeverity): boolean {
    const severityOrder = {
      'Minor': 0,
      'Moderate': 1,
      'Major': 2,
      'Contraindicated': 3
    };
    return severityOrder[severity1] > severityOrder[severity2];
  }

  private analyzePatientFactors(drugs: DrugInfo[], factors: PatientFactors) {
    return {
      warnings: [] as string[],
      doseAdjustments: [] as DoseAdjustment[]
    };
  }

  private generateEducationPoints(drugs: DrugInfo[], interactions: DrugInteraction[]): string[] {
    return [];
  }

  private determineIfConsultationRequired(interactions: DrugInteraction[]): boolean {
    return interactions.some(interaction =>
      interaction.effects.some(effect =>
        effect.requiresPharmacistConsult || effect.requiresPhysicianConsult
      )
    );
  }

  private generateAdherenceRecommendations(drugs: DrugInfo[], interactions: DrugInteraction[]): string[] {
    return [];
  }

  private mapSeverityToTriageLevel(severity: DrugInteractionSeverity): TriageLevel {
    switch (severity) {
      case 'Contraindicated':
      case 'Major':
        return 'immediate';
      case 'Moderate':
        return 'urgent';
      default:
        return 'routine';
    }
  }

  private mapSeverityToAssessmentSeverity(
    severity: DrugInteractionSeverity
  ): 'mild' | 'moderate' | 'severe' | 'life-threatening' {
    switch (severity) {
      case 'Contraindicated':
        return 'life-threatening';
      case 'Major':
        return 'severe';
      case 'Moderate':
        return 'moderate';
      default:
        return 'mild';
    }
  }
}
