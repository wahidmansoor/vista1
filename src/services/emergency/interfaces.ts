import type { EmergencyCase, EmergencyTriage } from './types';
import type { LabEmergencyResponse } from './labEmergency.types';

export interface IEmergencyService {
  notifyEmergencyCondition(condition: EmergencyCase): Promise<void>;
  triageEmergency(condition: EmergencyCase): Promise<EmergencyTriage>;
  getEmergencyCase(id: string): Promise<EmergencyCase>;
  updateEmergencyStatus(id: string, status: EmergencyCase['response']['status']): Promise<void>;
  assignEmergencyCase(id: string, userId: string): Promise<void>;
}
