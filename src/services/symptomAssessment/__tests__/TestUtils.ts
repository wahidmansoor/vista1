import { SymptomAssessmentHandler } from '../SymptomAssessmentHandler';
import type { ILogger, IEmergencyService } from '../interfaces';

/**
 * Test utilities to expose private members of SymptomAssessmentHandler for testing
 */
export class TestUtils {
  static getMockedDependencies(handler: SymptomAssessmentHandler): {
    logger: ILogger;
    emergency: IEmergencyService;
  } {
    const privateMembers = handler as any;
    return {
      logger: privateMembers.auditLogger,
      emergency: privateMembers.emergencyService
    };
  }
}
