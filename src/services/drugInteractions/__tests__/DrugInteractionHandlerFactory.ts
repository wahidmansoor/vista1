import { DrugInteractionHandler } from '../DrugInteractionHandler';
import type { DrugInteractionHandlerOptions } from '../types';
import {
  createMockAuditLogger,
  createMockSafetySystem,
  createMockConfidenceService
} from './setup';

export class TestDrugInteractionHandlerFactory {
  static createForTesting(options?: Partial<DrugInteractionHandlerOptions>): DrugInteractionHandler {
    const mockAuditLogger = createMockAuditLogger();
    const mockSafetySystem = createMockSafetySystem();
    const mockConfidenceService = createMockConfidenceService();

    return new DrugInteractionHandler(
      mockAuditLogger,
      mockSafetySystem,
      mockConfidenceService,
      options
    );
  }
}
