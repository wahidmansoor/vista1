import { useMemo } from 'react';
import { EmergencyService } from '../services/emergency/EmergencyService';
import { SafetySystem } from '../services/safety/SafetySystem';
import { DisclaimerService } from '../services/disclaimers/DisclaimerService';
import { MedicalAuditLogger, LogLevel } from '../services/utils/MedicalAuditLogger';

export function useEmergencyService() {
  return useMemo(() => {
    const auditLogger = MedicalAuditLogger.getInstance({
      retentionDays: 90,
      logLevel: LogLevel.INFO,
      enableAnonymization: true
    });

    const disclaimerService = new DisclaimerService(auditLogger);
    const safetySystem = new SafetySystem();

    return new EmergencyService(
      safetySystem,
      disclaimerService,
      auditLogger
    );
  }, []);
}
