import { DrugInteractionHandler } from '../DrugInteractionHandler';
import { TestDrugInteractionHandlerFactory } from './DrugInteractionHandlerFactory';
import type { DrugInfo } from '../types';
import {
  createTestDrugInfo,
  createMockAuditLogger,
  createMockSafetySystem,
  createMockConfidenceService
} from './setup';

jest.mock('../../utils/MedicalAuditLogger');
jest.mock('../../confidence/ConfidenceService');

describe('DrugInteractionHandler', () => {
  let handler: DrugInteractionHandler;
  let mockAuditLogger: ReturnType<typeof createMockAuditLogger>;
  let mockSafetySystem: ReturnType<typeof createMockSafetySystem>;
  let mockConfidenceService: ReturnType<typeof createMockConfidenceService>;

  beforeEach(() => {
    handler = TestDrugInteractionHandlerFactory.createForTesting();
    
    // Extract mocks from the handler for verification
    mockAuditLogger = (handler as any).auditLogger;
    mockSafetySystem = (handler as any).safetySystem;
    mockConfidenceService = (handler as any).confidenceService;
  });

  describe('analyzeDrugInteractions', () => {
    it('should handle empty drug list', async () => {
      await expect(handler.analyzeDrugInteractions([])).rejects.toThrow('No drugs provided for analysis');
      expect(mockAuditLogger.logError).toHaveBeenCalled();
    });

    it('should analyze interactions between two drugs', async () => {
      const drugs: DrugInfo[] = [
        createTestDrugInfo({
          name: 'Warfarin',
          genericName: 'warfarin',
          drugClass: 'anticoagulant',
          isSupportiveCare: true
        }),
        createTestDrugInfo({
          id: '2',
          name: 'Aspirin',
          genericName: 'acetylsalicylic acid',
          drugClass: 'NSAID',
          isSupportiveCare: true
        })
      ];

      mockSafetySystem.validateDrugAssessment.mockResolvedValueOnce({
        isValid: false,
        issues: [{
          severity: 'critical',
          message: 'Known interaction between warfarin and aspirin',
          code: 'CRITICAL_INTERACTION'
        }],
        recommendations: ['Pharmacist consultation required']
      });

      const result = await handler.analyzeDrugInteractions(drugs);

      expect(result).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.overallRiskLevel).toBe('Major');
      expect(result.consultationRequired).toBe(true);
      expect(mockAuditLogger.logAssessmentStart).toHaveBeenCalled();
      expect(mockAuditLogger.logAssessmentComplete).toHaveBeenCalled();
    });

    it('should consider patient factors when enabled', async () => {
      const drugs: DrugInfo[] = [
        createTestDrugInfo({
          name: 'Methotrexate',
          genericName: 'methotrexate',
          drugClass: 'antimetabolite',
          isChemotherapy: true
        })
      ];

      const patientFactors = {
        age: 65,
        weight: 70,
        height: 170,
        gfr: 45,
        hepaticFunction: 'Normal' as const
      };

      mockSafetySystem.validateDrugAssessment.mockResolvedValueOnce({
        isValid: false,
        issues: [{
          severity: 'warning',
          message: 'Dose adjustment needed due to reduced renal function',
          code: 'DOSE_ADJUSTMENT'
        }],
        recommendations: ['Reduce dose by 50%']
      });

      const result = await handler.analyzeDrugInteractions(drugs, patientFactors);

      expect(result.patientSpecificWarnings).toContain('Reduce dose by 50%');
      expect(mockSafetySystem.validateDrugAssessment).toHaveBeenCalled();
    });
  });

  describe('safety system integration', () => {
    it('should handle safety system errors gracefully', async () => {
      const drugs: DrugInfo[] = [
        createTestDrugInfo({ name: 'Test Drug' })
      ];

      mockSafetySystem.validateDrugAssessment.mockRejectedValueOnce(
        new Error('Safety system unavailable')
      );

      await expect(handler.analyzeDrugInteractions(drugs)).rejects.toThrow('Safety system unavailable');
      expect(mockAuditLogger.logError).toHaveBeenCalled();
    });

    it('should respect safety system configuration options', async () => {
      const handler = TestDrugInteractionHandlerFactory.createForTesting({
        safetySystemEnabled: false
      });

      const drugs: DrugInfo[] = [createTestDrugInfo()];
      
      const result = await handler.analyzeDrugInteractions(drugs);
      
      expect(result).toBeDefined();
      expect((handler as any).safetySystem.validateDrugAssessment).not.toHaveBeenCalled();
    });
  });
});
