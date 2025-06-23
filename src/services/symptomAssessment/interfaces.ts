import type { EmergencyCondition, EmergencyCase } from '../emergency/types';
import type { LabEmergencyResponse, UrgentLabNotification } from '../emergency/labEmergency.types';
import type { EmergencyTriage } from '../emergency/types';
import type { SymptomAssessmentInput, SymptomAssessmentResult } from './types';

export interface ILogger {
  logAssessmentStart(input: SymptomAssessmentInput): Promise<void>;
  logAssessmentComplete(result: SymptomAssessmentResult): Promise<void>;
  logError(message: string, error: unknown): Promise<void>;
}

export interface IEmergencyService {
  notifyEmergencyCondition(condition: EmergencyCondition): Promise<void>;
  triageEmergency(condition: EmergencyCondition): Promise<EmergencyTriage>;
  notifyUrgentLabResults(results: UrgentLabNotification[]): Promise<LabEmergencyResponse>;
  acknowledgeLabNotification(notificationId: string, userId: string): Promise<void>;
  getLabNotificationStatus(notificationId: string): Promise<LabEmergencyResponse>;
  getEmergencyCase(id: string): Promise<EmergencyCase>;
  updateEmergencyStatus(id: string, status: EmergencyCase['response']['status']): Promise<void>;
  assignEmergencyCase(id: string, userId: string): Promise<void>;
}
