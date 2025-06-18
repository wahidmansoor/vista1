import type { ILogger } from './interfaces';
import type { IEmergencyService } from '../emergency/interfaces';
import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import { EmergencyService } from '../emergency/EmergencyService';
import { SymptomAssessmentHandler } from './SymptomAssessmentHandler';
import { DEFAULT_EMERGENCY_CONFIG } from '../emergency/config';
import { vi } from 'vitest';

export class SymptomAssessmentFactory {
  static create(
    auditLogger?: MedicalAuditLogger,
    emergencyService?: IEmergencyService
  ): SymptomAssessmentHandler {
    // Use provided logger or create a new one
    const logger = auditLogger || new MedicalAuditLogger();
    
    // Use provided emergency service or create a new one
    const emergency = emergencyService || (new EmergencyService(
      logger,
      DEFAULT_EMERGENCY_CONFIG
    ) as unknown as IEmergencyService);

    return new SymptomAssessmentHandler(logger, emergency);
  }
  static createForTesting(): SymptomAssessmentHandler {
    const mockLogger = new MedicalAuditLogger();
    mockLogger.logAssessmentStart = vi.fn().mockImplementation(async () => {});
    mockLogger.logAssessmentComplete = vi.fn().mockImplementation(async () => {});
    mockLogger.logError = vi.fn().mockImplementation(async () => {});

    const mockEmergency: IEmergencyService = {
      notifyEmergencyCondition: vi.fn().mockImplementation(async () => {}),
      triageEmergency: vi.fn().mockImplementation(async () => ({} as any)),
      getEmergencyCase: vi.fn().mockImplementation(async () => ({} as any)),
      updateEmergencyStatus: vi.fn().mockImplementation(async () => {}),
      assignEmergencyCase: vi.fn().mockImplementation(async () => {})
    };

    return new SymptomAssessmentHandler(mockLogger, mockEmergency);
  }
}
