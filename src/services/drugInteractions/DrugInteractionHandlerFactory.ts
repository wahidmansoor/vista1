import { DrugInteractionHandler } from './DrugInteractionHandler';
import { DrugSafetySystem } from './DrugSafetySystem';
import { MedicalAuditLogger } from '../utils/MedicalAuditLogger';
import { ConfidenceService } from '../confidence/ConfidenceService';
import { ConfidenceConfigFactory } from '../confidence/ConfidenceConfigFactory';
import type { DrugInteractionHandlerOptions } from './types';

export class DrugInteractionHandlerFactory {
  static create(options?: Partial<DrugInteractionHandlerOptions>): DrugInteractionHandler {
    const auditLogger = new MedicalAuditLogger();
    const safetySystem = new DrugSafetySystem();
    const confidenceService = new ConfidenceService(
      ConfidenceConfigFactory.createDefaultConfig()
    );

    return new DrugInteractionHandler(
      auditLogger,
      safetySystem,
      confidenceService,
      options
    );
  }
}
