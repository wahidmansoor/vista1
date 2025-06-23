import type { LabValueUnit } from '../labInterpretation/types';

export interface UrgentLabNotification {
  testName: string;
  value: number;
  unit: LabValueUnit;
  timestamp: string;
  patientId?: string;
  providerId?: string;
  facilityId?: string;
  urgencyLevel: 'immediate' | 'urgent' | 'routine';
  requiresEmergencyCare: boolean;
  recommendations: string[];
}

export interface LabEmergencyResponse {
  notificationId: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  escalationLevel: number;
  responseActions: string[];
}

// Add these methods to EmergencyService
export interface LabEmergencyHandler {
  notifyUrgentLabResults(results: UrgentLabNotification[]): Promise<LabEmergencyResponse>;
  acknowledgeLabNotification(notificationId: string, userId: string): Promise<void>;
  getLabNotificationStatus(notificationId: string): Promise<LabEmergencyResponse>;
}
