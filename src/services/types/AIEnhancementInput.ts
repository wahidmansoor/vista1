import { ManagementRecommendation, SymptomAssessmentResult, SymptomTrend } from '../symptomAssessment/types';
import { TreatmentProtocol } from '@/types/medical';

export interface AIEnhancementInput {
  recommendations: ManagementRecommendation[];
  symptoms: SymptomAssessmentResult['symptoms'];
  trends: SymptomTrend[];
  currentTreatments?: TreatmentProtocol[];
}
