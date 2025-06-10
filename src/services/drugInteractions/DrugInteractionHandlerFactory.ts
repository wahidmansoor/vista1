import { DrugInteractionHandler } from './DrugInteractionHandler';
import { DrugSafetySystem } from './DrugSafetySystem';
import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import { ConfidenceService } from '../confidence/ConfidenceService';
import type { DrugInteractionHandlerOptions } from './types';

export class DrugInteractionHandlerFactory {
  static create(options?: Partial<DrugInteractionHandlerOptions>): DrugInteractionHandler {
    const auditLogger = new MedicalAuditLogger();
    const safetySystem = new DrugSafetySystem();
    const confidenceService = new ConfidenceService();

    return new DrugInteractionHandler(
      auditLogger,
      safetySystem,
      confidenceService,
      options
    );
  }
}
