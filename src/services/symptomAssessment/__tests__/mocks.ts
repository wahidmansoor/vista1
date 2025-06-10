import type { EmergencyCase, EmergencyTriage } from '../../emergency/types';
import type { LabEmergencyResponse } from '../../emergency/labEmergency.types';
import type { ILogger, IEmergencyService } from '../interfaces';

export class MockLogger implements ILogger {
  logAssessmentStart = jest.fn().mockImplementation(async () => {});
  logAssessmentComplete = jest.fn().mockImplementation(async () => {});
  logError = jest.fn().mockImplementation(async () => {});
}

export class MockEmergencyService implements IEmergencyService {
  notifyEmergencyCondition = jest.fn().mockImplementation(async () => {});
  triageEmergency = jest.fn().mockImplementation(async () => ({} as EmergencyTriage));
  notifyUrgentLabResults = jest.fn().mockImplementation(async () => ({} as LabEmergencyResponse));
  acknowledgeLabNotification = jest.fn().mockImplementation(async () => {});
  getLabNotificationStatus = jest.fn().mockImplementation(async () => ({} as LabEmergencyResponse));
  getEmergencyCase = jest.fn().mockResolvedValue({} as EmergencyCase);
  updateEmergencyStatus = jest.fn().mockImplementation(async () => {});
  assignEmergencyCase = jest.fn().mockImplementation(async () => {});
}

export function createMockDependencies() {
  return {
    logger: new MockLogger(),
    emergencyService: new MockEmergencyService()
  };
}
