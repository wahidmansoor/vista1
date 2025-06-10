import type { 
  SymptomAssessmentInput, 
  SymptomAssessmentResult, 
  ManagementRecommendation 
} from '../symptomAssessment/types';

export interface DrugInteractionAssessmentInput extends SymptomAssessmentInput {
  medications: {
    name: string;
    dose: string;
    frequency: string;
    route: string;
  }[];
}

export interface DrugInteractionAssessmentResult extends SymptomAssessmentResult {
  medications: {
    name: string;
    interactions: {
      withDrug: string;
      severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
      description: string;
      mechanism: string;
    }[];
  }[];
  interactionRecommendations: ManagementRecommendation[];
}
