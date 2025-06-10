import { DrugSafetySystem } from '../DrugSafetySystem';
import { MedicalAuditLogger } from '../../utils/MedicalAuditLogger';
import { ConfidenceService } from '../../confidence/ConfidenceService';
import type { SafetyValidation } from '../../safety/types';

export const createMockAuditLogger = () => {
  const mock = {
    logAssessmentStart: jest.fn().mockResolvedValue(undefined),
    logAssessmentComplete: jest.fn().mockResolvedValue(undefined),
    logError: jest.fn().mockResolvedValue(undefined)
  };
  return mock as unknown as jest.Mocked<MedicalAuditLogger>;
};

export const createMockSafetySystem = () => {
  const defaultValidation: SafetyValidation = {
    isValid: true,
    issues: [],
    recommendations: []
  };

  const mock = {
    validateDrugAssessment: jest.fn().mockResolvedValue(defaultValidation)
  };

  return mock as unknown as jest.Mocked<DrugSafetySystem>;
};

export const createMockConfidenceService = () => {
  const mock = {
    calculateConfidence: jest.fn().mockResolvedValue(1.0),
    validateConfidence: jest.fn().mockResolvedValue(true)
  };
  return mock as unknown as jest.Mocked<ConfidenceService>;
};

export const createTestDrugInfo = (overrides = {}) => ({
  id: '1',
  name: 'Test Drug',
  genericName: 'test',
  drugClass: 'test',
  isChemotherapy: false,
  isTargetedTherapy: false,
  isImmunoTherapy: false,
  isSupportiveCare: false,
  ...overrides
});
