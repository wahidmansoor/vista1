import { DrugSafetySystem } from '../DrugSafetySystem';
import { MedicalAuditLogger } from '../../utils/MedicalAuditLogger';
import { ConfidenceService } from '../../confidence/ConfidenceService';
import type { SafetyValidation } from '../../safety/types';
import { vi } from 'vitest';

export const createMockAuditLogger = () => {
  const mock = {
    logAssessmentStart: vi.fn().mockResolvedValue(undefined),
    logAssessmentComplete: vi.fn().mockResolvedValue(undefined),
    logError: vi.fn().mockResolvedValue(undefined)
  };
  return mock as unknown as MedicalAuditLogger;
};

export const createMockSafetySystem = () => {
  const defaultValidation: SafetyValidation = {
    isValid: true,
    issues: [],
    recommendations: []
  };

  const mock = {
    validateDrugAssessment: vi.fn().mockResolvedValue(defaultValidation)
  };

  return mock as unknown as DrugSafetySystem;
};

export const createMockConfidenceService = () => {
  const mock = {
    calculateConfidence: vi.fn().mockResolvedValue(1.0),
    validateConfidence: vi.fn().mockResolvedValue(true)
  };
  return mock as unknown as ConfidenceService;
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
