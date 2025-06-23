import { describe, it, expect } from 'vitest';
import { calculateCancerRisk, PatientProfile } from '../../logic/riskAssessment';
import { CancerType, GeneticMutation, BiologicalSex, Ethnicity } from '../../types/clinical';

describe('Risk Assessment - BRCA/Lynch Tests', () => {
  it('validates BRCA1 mutation returns high risk for breast cancer', () => {
    const patient: PatientProfile = {
      demographics: { age: 35, sex: BiologicalSex.FEMALE, ethnicity: Ethnicity.CAUCASIAN, family_history: [] },
      genetics: { mutations: [{ mutation: GeneticMutation.BRCA1, confirmed: true }], variants: [], penetrance_scores: [] },
      riskFactors: { lifestyle: { current_smoker: false }, environmental: {}, medical_history: {} },
      symptoms: { current_symptoms: [], assessment_date: new Date() },
    };
    
    const riskScores = calculateCancerRisk(patient);
    const breastRisk = riskScores.find(r => r.cancerType === CancerType.BREAST);
    
    console.log('BRCA1 Test Results:');
    console.log('- Breast risk found:', !!breastRisk);
    console.log('- Risk level:', breastRisk?.riskLevel);
    console.log('- Absolute risk:', breastRisk?.absoluteRisk);
    console.log('- Rationale:', breastRisk?.rationale);
    
    expect(breastRisk).toBeDefined();
    expect(breastRisk!.riskLevel).toMatch(/high|very_high/);
    expect(breastRisk!.absoluteRisk).toBeGreaterThan(0.35);
  });

  it('validates Lynch syndrome returns high risk for colorectal cancer', () => {
    const patient: PatientProfile = {
      demographics: { age: 28, sex: BiologicalSex.FEMALE, ethnicity: Ethnicity.CAUCASIAN, family_history: [] },
      genetics: { mutations: [{ mutation: GeneticMutation.LYNCH, confirmed: true }], variants: [], penetrance_scores: [] },
      riskFactors: { lifestyle: { current_smoker: false }, environmental: {}, medical_history: {} },
      symptoms: { current_symptoms: [], assessment_date: new Date() },
    };
    
    const riskScores = calculateCancerRisk(patient);
    const colorectalRisk = riskScores.find(r => r.cancerType === CancerType.COLORECTAL);
    const endometrialRisk = riskScores.find(r => r.cancerType === CancerType.ENDOMETRIAL);
    
    console.log('Lynch Syndrome Test Results:');
    console.log('- Colorectal risk found:', !!colorectalRisk);
    console.log('- Colorectal risk level:', colorectalRisk?.riskLevel);
    console.log('- Colorectal absolute risk:', colorectalRisk?.absoluteRisk);
    console.log('- Endometrial risk found:', !!endometrialRisk);
    console.log('- Endometrial risk level:', endometrialRisk?.riskLevel);
    console.log('- Endometrial absolute risk:', endometrialRisk?.absoluteRisk);
    
    expect(colorectalRisk).toBeDefined();
    expect(colorectalRisk!.riskLevel).toMatch(/high|very_high/);
    expect(endometrialRisk).toBeDefined();
    expect(endometrialRisk!.riskLevel).toMatch(/high|very_high/);
  });
});
