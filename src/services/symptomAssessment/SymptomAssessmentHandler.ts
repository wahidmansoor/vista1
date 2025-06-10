import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import type { IEmergencyService } from '../emergency/interfaces';
import type { EmergencyCase } from '../emergency/types';
import type { SymptomAssessmentInput, SymptomAssessmentResult } from './types';
import { 
  mapScoreToTriageLevel,
  calculateSeverityScore,
  getSeverityDetails 
} from './utils';

export class SymptomAssessmentHandler {
  private logger: MedicalAuditLogger;
  private emergencyService: IEmergencyService;

  constructor(auditLogger: MedicalAuditLogger, emergencyService: IEmergencyService) {
    this.logger = auditLogger;
    this.emergencyService = emergencyService;
  }

  async assessSymptoms(input: SymptomAssessmentInput): Promise<SymptomAssessmentResult> {
    try {
      await this.logger.logAssessmentStart({
        type: 'SYMPTOM_ASSESSMENT',
        ...input
      });

      const result: SymptomAssessmentResult = {
        timestamp: new Date().toISOString(),
        symptoms: input.symptoms.map(symptom => ({
          name: symptom.name,
          severity: getSeverityDetails(symptom.severity),
          relatedToTreatment: this.checkTreatmentRelation(symptom, input.currentTreatments),
          possibleCauses: []
        })),
        trends: [],
        recommendations: [],
        requiresMedicalAttention: false,
        triageLevel: 'routine',
        educationalResources: []
      };

      // Calculate overall severity and determine if medical attention is needed
      const maxSeverity = Math.max(...input.symptoms.map(s => s.severity));
      result.triageLevel = mapScoreToTriageLevel(maxSeverity);
      result.requiresMedicalAttention = maxSeverity >= 8;

      // Handle emergency notifications if needed
      if (result.requiresMedicalAttention) {
        const emergencyCase: EmergencyCase = {
          id: crypto.randomUUID(),
          type: 'SYMPTOM',
          severity: result.triageLevel,
          details: {
            symptoms: result.symptoms.filter(s => s.severity.requiresImmediate)
          },
          timestamp: result.timestamp,
          status: 'PENDING',
          patientId: input.patientId,
          response: {
            status: 'PENDING',
            assignedTo: null,
            actions: []
          }
        };

        await this.emergencyService.notifyEmergencyCondition(emergencyCase);
      }

      // Generate recommendations and education resources
      result.recommendations = this.generateRecommendations(result.symptoms);
      result.educationalResources = this.generateEducationPoints(result.symptoms);

      await this.logger.logAssessmentComplete({
        type: 'SYMPTOM_ASSESSMENT',
        ...result
      });

      return result;
      
    } catch (error) {
      await this.logger.logError(
        'Symptom assessment error',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }

  private checkTreatmentRelation(
    symptom: SymptomAssessmentInput['symptoms'][0],
    treatments?: SymptomAssessmentInput['currentTreatments']
  ): boolean {
    if (!treatments?.length) return false;
    // Implementation for checking treatment relation
    return false;
  }

  private generateRecommendations(symptoms: SymptomAssessmentResult['symptoms']) {
    return symptoms.map(symptom => ({
      action: `Monitor ${symptom.name}`,
      priority: mapScoreToTriageLevel(symptom.severity.score),
      rationale: `Based on ${symptom.severity.level} severity`,
      evidenceLevel: 'moderate' as const
    }));
  }

  private generateEducationPoints(symptoms: SymptomAssessmentResult['symptoms']) {
    return symptoms.map(symptom => ({
      topic: `Understanding ${symptom.name}`,
      url: `/education/symptoms/${symptom.name.toLowerCase()}`,
      type: 'article' as const
    }));
  }
}
