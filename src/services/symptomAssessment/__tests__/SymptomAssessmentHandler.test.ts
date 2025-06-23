import { SymptomAssessmentHandler } from '../SymptomAssessmentHandler';
import { SymptomAssessmentFactory } from '../SymptomAssessmentFactory';
import { TestUtils } from './TestUtils';
import type { EmergencyCondition } from '../../emergency/types';
import type { SymptomAssessmentInput } from '../types';

describe('SymptomAssessmentHandler', () => {
  let handler: SymptomAssessmentHandler;
  let mocks: ReturnType<typeof TestUtils.getMockedDependencies>;

  beforeEach(() => {
    handler = SymptomAssessmentFactory.createForTesting();
    mocks = TestUtils.getMockedDependencies(handler);
  });

  describe('assessSymptoms', () => {
    it('should assess single symptom correctly', async () => {
const input: SymptomAssessmentInput = {
        patientId: 'test-patient',
        symptoms: [
          {
            name: 'Fever',
            description: 'High temperature',
            duration: '2 days',
            severity: 7,
            frequency: 'constant'
          }
        ]
      };

      const result = await handler.assessSymptoms(input);

      expect(result).toBeDefined();
      expect(result.symptoms).toHaveLength(1);
      expect(result.symptoms[0].name).toBe('Fever');
      expect(result.triageLevel).toBe('urgent');
      expect(result.requiresMedicalAttention).toBe(false);
      expect(mocks.logger.logAssessmentStart).toHaveBeenCalledWith(input);
      expect(mocks.logger.logAssessmentComplete).toHaveBeenCalled();
    });

    it('should trigger emergency notification for severe symptoms', async () => {
const input: SymptomAssessmentInput = {
        patientId: 'test-patient',
        symptoms: [
          {
            name: 'Chest Pain',
            description: 'Severe chest pain',
            duration: '1 hour',
            severity: 9,
            frequency: 'constant'
          }
        ]
      };

      const result = await handler.assessSymptoms(input);

      expect(result.requiresMedicalAttention).toBe(true);
      expect(result.triageLevel).toBe('immediate');
      expect(mocks.emergency.notifyEmergencyCondition).toHaveBeenCalledWith(
        expect.objectContaining<Partial<EmergencyCondition>>({
          type: 'SYMPTOM',
          severity: 'immediate',
          requiresEmergencyCare: true
        })
      );
    });

    it('should handle multiple symptoms with varying severities', async () => {
const input: SymptomAssessmentInput = {
        patientId: 'test-patient',
        symptoms: [
          {
            name: 'Headache',
            description: 'Mild headache',
            duration: '1 day',
            severity: 3,
            frequency: 'intermittent'
          },
          {
            name: 'Nausea',
            description: 'Moderate nausea',
            duration: '2 hours',
            severity: 5,
            frequency: 'constant'
          }
        ]
      };

      const result = await handler.assessSymptoms(input);

      expect(result.symptoms).toHaveLength(2);
      expect(result.triageLevel).toBe('routine');
      expect(result.requiresMedicalAttention).toBe(false);
      expect(mocks.emergency.notifyEmergencyCondition).not.toHaveBeenCalled();
    });

    it('should handle errors and log them properly', async () => {
const input: SymptomAssessmentInput = {
        patientId: 'test-patient',
        symptoms: [
          {
            name: 'Invalid',
            description: '',
            duration: '',
            severity: -1, // Invalid severity
            frequency: ''
          }
        ]
      };

      await expect(handler.assessSymptoms(input)).rejects.toThrow();
      expect(mocks.logger.logError).toHaveBeenCalled();
    });
  });
});
