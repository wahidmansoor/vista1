import type { ILogger, IEmergencyService } from './interfaces';
import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import { EmergencyService } from '../emergency/EmergencyService';
import { SymptomAssessmentHandler } from './SymptomAssessmentHandler';
import { DEFAULT_EMERGENCY_CONFIG } from '../emergency/config';

export class SymptomAssessmentFactory {
  static create(
    auditLogger?: ILogger,
    emergencyService?: IEmergencyService
  ): SymptomAssessmentHandler {
    // Use provided logger or create a new one
    const logger = auditLogger || new MedicalAuditLogger();
    
    // Use provided emergency service or create a new one
    const emergency = emergencyService || new EmergencyService(
      logger as MedicalAuditLogger, // Safe cast since MedicalAuditLogger implements ILogger
      DEFAULT_EMERGENCY_CONFIG
    );

    return new SymptomAssessmentHandler(logger, emergency);
  }

  static createForTesting(): SymptomAssessmentHandler {
    const mockLogger: ILogger = {
      logAssessmentStart: jest.fn().mockImplementation(async () => {}),
      logAssessmentComplete: jest.fn().mockImplementation(async () => {}),
      logError: jest.fn().mockImplementation(async () => {})
    };

    const mockEmergency: IEmergencyService = {
      notifyEmergencyCondition: jest.fn().mockImplementation(async () => {}),
      triageEmergency: jest.fn().mockImplementation(async () => ({} as any)),
      notifyUrgentLabResults: jest.fn().mockImplementation(async () => ({} as any)),
      acknowledgeLabNotification: jest.fn().mockImplementation(async () => {}),
      getLabNotificationStatus: jest.fn().mockImplementation(async () => ({} as any)),
      getEmergencyCase: jest.fn().mockImplementation(async () => ({} as any)),
      updateEmergencyStatus: jest.fn().mockImplementation(async () => {}),
      assignEmergencyCase: jest.fn().mockImplementation(async () => {})
    };

    return new SymptomAssessmentHandler(mockLogger, mockEmergency);
  }
}
