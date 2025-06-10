import { MedicalAuditLogger, AssessmentStartInput, AssessmentCompleteResult } from '../utils/MedicalAuditLogger';
import type { 
  SymptomAssessmentInput, 
  SymptomAssessmentResult,
  Symptom,
  SymptomTrend,
  ManagementRecommendation,
  EducationalResource,
  SymptomSeverity
} from './types';
import { getSeverityDetails } from './utils';

interface SymptomLogInput extends AssessmentStartInput {
  type: 'SYMPTOM_ASSESSMENT';
  symptoms: Symptom[];
  currentTreatments?: SymptomAssessmentInput['currentTreatments'];
  timestamp: string;
  [key: string]: unknown;
}

interface SymptomLogResult extends AssessmentCompleteResult {
  type: 'SYMPTOM_ASSESSMENT';
  symptoms: Symptom[];
  trends: SymptomTrend[];
  recommendations: ManagementRecommendation[];
  requiresMedicalAttention: boolean;
  triageLevel: SymptomAssessmentResult['triageLevel'];
  educationalResources: EducationalResource[];
  timestamp: string;
  [key: string]: unknown;
}

function isSymptomAssessmentInput(input: any): input is SymptomAssessmentInput {
  return Array.isArray(input.symptoms);
}

function isSymptomAssessmentResult(result: any): result is SymptomAssessmentResult {
  return Array.isArray(result.symptoms) && 
         Array.isArray(result.trends) && 
         Array.isArray(result.recommendations) &&
         typeof result.requiresMedicalAttention === 'boolean' &&
         typeof result.triageLevel === 'string';
}

function transformToFullSymptom(input: SymptomAssessmentInput['symptoms'][0]): Symptom {
  return {
    name: input.name,
    severity: getSeverityDetails(input.severity),
    relatedToTreatment: false,
    possibleCauses: []
  };
}

export class SymptomLogger extends MedicalAuditLogger<SymptomLogInput, SymptomLogResult> {
  override async logAssessmentStart(input: SymptomAssessmentInput): Promise<void>;
  override async logAssessmentStart(input: Partial<SymptomLogInput>): Promise<void>;
  override async logAssessmentStart(input: SymptomAssessmentInput | Partial<SymptomLogInput>): Promise<void> {
    const timestamp = new Date().toISOString();
    
    let symptoms: Symptom[] = [];
    if (isSymptomAssessmentInput(input)) {
      symptoms = input.symptoms.map(transformToFullSymptom);
    }
    
    const fullInput: SymptomLogInput = {
      type: 'SYMPTOM_ASSESSMENT',
      symptoms,
      currentTreatments: 'currentTreatments' in input ? input.currentTreatments : undefined,
      timestamp,
      [Symbol.iterator]: undefined
    };

    await super.logAssessmentStart(fullInput);
  }

  override async logAssessmentComplete(result: SymptomAssessmentResult): Promise<void>;
  override async logAssessmentComplete(result: Partial<SymptomLogResult>): Promise<void>;
  override async logAssessmentComplete(result: SymptomAssessmentResult | Partial<SymptomLogResult>): Promise<void> {
    const timestamp = new Date().toISOString();

    const fullResult: SymptomLogResult = {
      type: 'SYMPTOM_ASSESSMENT',
      symptoms: isSymptomAssessmentResult(result) ? result.symptoms : [],
      trends: isSymptomAssessmentResult(result) ? result.trends : [],
      recommendations: isSymptomAssessmentResult(result) ? result.recommendations : [],
      requiresMedicalAttention: isSymptomAssessmentResult(result) ? result.requiresMedicalAttention : false,
      triageLevel: isSymptomAssessmentResult(result) ? result.triageLevel : 'routine',
      educationalResources: isSymptomAssessmentResult(result) ? result.educationalResources : [],
      timestamp,
      [Symbol.iterator]: undefined
    };

    await super.logAssessmentComplete(fullResult);
  }

  async logSymptomAlert(
    symptomName: string, 
    severity: number, 
    requiresImmediate: boolean
  ): Promise<void> {
    const severityDetails = getSeverityDetails(severity);
    
    await this.log('Symptom Alert', {
      timestamp: new Date().toISOString(),
      type: 'SYMPTOM_ALERT',
      symptomName,
      severity: severityDetails,
      requiresImmediate: severityDetails.requiresImmediate
    });
  }
}
