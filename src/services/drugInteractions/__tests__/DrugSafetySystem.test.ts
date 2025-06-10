import { DrugSafetySystem } from '../DrugSafetySystem';
import { createTestDrugInfo } from './setup';
import type { DrugAssessmentResult } from '../types';

describe('DrugSafetySystem', () => {
  let safetySystem: DrugSafetySystem;

  beforeEach(() => {
    safetySystem = new DrugSafetySystem();
  });

  describe('validateDrugAssessment', () => {
    it('should validate safe drug combinations', async () => {
      const assessment: DrugAssessmentResult = {
        timestamp: new Date().toISOString(),
        symptoms: [],
        trends: [],
        recommendations: [],
        requiresMedicalAttention: false,
        triageLevel: 'routine',
        educationalResources: [],
        medications: [
          {
            name: 'Safe Drug 1',
            interactions: []
          },
          {
            name: 'Safe Drug 2',
            interactions: []
          }
        ]
      };

      const result = await safetySystem.validateDrugAssessment(assessment);

      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect critical drug interactions', async () => {
      const assessment: DrugAssessmentResult = {
        timestamp: new Date().toISOString(),
        symptoms: [],
        trends: [],
        recommendations: [],
        requiresMedicalAttention: true,
        triageLevel: 'immediate',
        educationalResources: [],
        medications: [
          {
            name: 'Drug A',
            interactions: [
              {
                withDrug: 'Drug B',
                severity: 'life-threatening',
                description: 'Critical interaction',
                mechanism: 'Unknown'
              }
            ]
          }
        ]
      };

      const result = await safetySystem.validateDrugAssessment(assessment);

      expect(result.isValid).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].severity).toBe('critical');
    });

    it('should identify timing adjustment requirements', async () => {
      const assessment: DrugAssessmentResult = {
        timestamp: new Date().toISOString(),
        symptoms: [],
        trends: [],
        recommendations: [],
        requiresMedicalAttention: false,
        triageLevel: 'routine',
        educationalResources: [],
        medications: [
          {
            name: 'Drug A',
            interactions: [
              {
                withDrug: 'Drug B',
                severity: 'severe',
                description: 'Timing-dependent interaction',
                mechanism: 'Absorption interference'
              }
            ]
          }
        ]
      };

      const result = await safetySystem.validateDrugAssessment(assessment);

      expect(result.issues).toContainEqual(
        expect.objectContaining({
          severity: 'warning',
          code: 'TIMING_ADJUSTMENT_NEEDED'
        })
      );
    });

    it('should provide appropriate recommendations for issues', async () => {
      const assessment: DrugAssessmentResult = {
        timestamp: new Date().toISOString(),
        symptoms: [],
        trends: [],
        recommendations: [],
        requiresMedicalAttention: true,
        triageLevel: 'immediate',
        educationalResources: [],
        medications: [
          {
            name: 'Drug A',
            interactions: [
              {
                withDrug: 'Drug B',
                severity: 'life-threatening',
                description: 'Critical interaction',
                mechanism: 'Unknown'
              }
            ]
          }
        ]
      };

      const result = await safetySystem.validateDrugAssessment(assessment);

      expect(result.recommendations).toContainEqual(
        expect.stringContaining('REQUIRED:')
      );
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});
