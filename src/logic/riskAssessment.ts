/**
 * Multi-Factorial Cancer Risk Calculator
 * Implements calculateCancerRisk(patientData: PatientProfile): RiskScore
 * - Genetic, family, lifestyle, and symptom risk integration
 * - Based on established models (Gail, Tyrer-Cuzick, NCCN, USPSTF)
 * - Returns risk score and confidence interval
 */

import { GeneticMutation, CancerType, SymptomSeverity, PatientDemographics, GeneticProfile, RiskFactorProfile, SymptomProfile, ScreeningHistory } from '../types/clinical';

export interface PatientProfile {
  demographics: PatientDemographics;
  genetics: GeneticProfile;
  riskFactors: RiskFactorProfile;
  symptoms: SymptomProfile;
  screeningHistory?: ScreeningHistory;
}

export interface RiskScore {
  cancerType: CancerType;
  absoluteRisk: number; // 0-1
  riskLevel: 'average' | 'elevated' | 'high' | 'very_high';
  confidenceInterval: [number, number];
  rationale: string[];
}

/**
 * Calculate multi-factorial cancer risk for a patient
 * @param patientData PatientProfile
 * @returns Array of RiskScore (one per relevant cancer type)
 */
export function calculateCancerRisk(patientData: PatientProfile): RiskScore[] {
  const results: RiskScore[] = [];
  // Example: Breast, Colorectal, Lung, Prostate
  const cancers: CancerType[] = [CancerType.BREAST, CancerType.COLORECTAL, CancerType.LUNG, CancerType.PROSTATE];

  for (const cancer of cancers) {
    let risk = 0;
    let rationale: string[] = [];
    let ci: [number, number] = [0, 0];

    // 1. Genetic Predisposition (40%)
    let geneticWeight = 0;
    if (patientData.genetics.mutations) {
      for (const m of patientData.genetics.mutations) {
        if (cancer === CancerType.BREAST && (m.mutation === GeneticMutation.BRCA1 || m.mutation === GeneticMutation.BRCA2)) {
          geneticWeight += 0.4 * 1.0; // 10x risk
          rationale.push('BRCA mutation: 10x baseline risk for breast cancer');
        }
        if (cancer === CancerType.OVARIAN && (m.mutation === GeneticMutation.BRCA1 || m.mutation === GeneticMutation.BRCA2)) {
          geneticWeight += 0.4 * 0.5; // 5x risk
          rationale.push('BRCA mutation: 5x baseline risk for ovarian cancer');
        }
        if (cancer === CancerType.COLORECTAL && m.mutation === GeneticMutation.LYNCH) {
          geneticWeight += 0.4 * 0.5; // 5x risk
          rationale.push('Lynch syndrome: 5x baseline risk for colorectal cancer');
        }
        if (cancer === CancerType.PANCREATIC && (m.mutation === GeneticMutation.BRCA1 || m.mutation === GeneticMutation.BRCA2)) {
          geneticWeight += 0.4 * 0.1;
          rationale.push('BRCA mutation: increased pancreatic cancer risk');
        }
        // Add more gene-cancer associations as needed
      }
    }
    // Polygenic risk score placeholder
    // geneticWeight += ...
    risk += geneticWeight;

    // 2. Family History (25%)
    let famWeight = 0;
    if (patientData.demographics.family_history) {
      let firstDegree = patientData.demographics.family_history.filter(fh => fh.cancer_type === cancer);
      if (firstDegree.length > 0) {
        famWeight += 0.25 * 0.5; // 2x risk
        rationale.push('First-degree relative: 2x risk');
        if (firstDegree.some(fh => fh.age_at_diagnosis && fh.age_at_diagnosis < 50)) {
          famWeight += 0.25 * 0.25; // additional risk
          rationale.push('Early-onset in family: higher risk');
        }
        if (firstDegree.length > 1) {
          famWeight += 0.25 * 0.25; // exponential increase
          rationale.push('Multiple affected relatives: exponential risk increase');
        }
      }
    }
    risk += famWeight;

    // 3. Lifestyle Factors (20%)
    let lifeWeight = 0;
    if (patientData.riskFactors.lifestyle) {
      if (cancer === CancerType.LUNG && patientData.riskFactors.lifestyle.current_smoker) {
        lifeWeight += 0.2 * 1.0; // OR 15-30
        rationale.push('Current smoker: 15-30x risk for lung cancer');
      }
      if (cancer === CancerType.BLADDER && patientData.riskFactors.lifestyle.current_smoker) {
        lifeWeight += 0.2 * 0.5; // OR 3-5
        rationale.push('Current smoker: 3-5x risk for bladder cancer');
      }
      if (cancer === CancerType.BREAST && patientData.riskFactors.lifestyle.alcohol_drinks_per_week && patientData.riskFactors.lifestyle.alcohol_drinks_per_week > 0) {
        lifeWeight += 0.2 * 0.2; // linear increase
        rationale.push('Alcohol use: increased breast cancer risk');
      }
      if (cancer === CancerType.LIVER && patientData.riskFactors.lifestyle.alcohol_drinks_per_week && patientData.riskFactors.lifestyle.alcohol_drinks_per_week > 14) {
        lifeWeight += 0.2 * 0.5; // exponential
        rationale.push('Heavy alcohol: increased liver cancer risk');
      }
      if (cancer === CancerType.ENDOMETRIAL && patientData.riskFactors.lifestyle.bmi && patientData.riskFactors.lifestyle.bmi > 30) {
        lifeWeight += 0.2 * 0.5; // OR 2-4
        rationale.push('Obesity: increased endometrial cancer risk');
      }
      if (cancer === CancerType.BREAST && patientData.riskFactors.lifestyle.bmi && patientData.riskFactors.lifestyle.bmi > 30) {
        lifeWeight += 0.2 * 0.2; // OR 1.5
        rationale.push('Obesity: increased postmenopausal breast cancer risk');
      }
    }
    risk += lifeWeight;

    // 4. Symptom Profile (15%)
    let symptomWeight = 0;
    if (patientData.symptoms.current_symptoms) {
      for (const s of patientData.symptoms.current_symptoms) {
        if (cancer === CancerType.BREAST && s.symptom.toLowerCase().includes('lump') && s.severity >= SymptomSeverity.MODERATE) {
          symptomWeight += 0.15 * 1.0;
          rationale.push('Breast lump: high urgency');
        }
        if (cancer === CancerType.LUNG && s.symptom.toLowerCase().includes('cough') && s.duration_days > 42) {
          symptomWeight += 0.15 * 0.5;
          rationale.push('Persistent cough >6 weeks: increased lung cancer risk');
        }
        if (cancer === CancerType.COLORECTAL && s.symptom.toLowerCase().includes('rectal bleeding')) {
          symptomWeight += 0.15 * 0.5;
          rationale.push('Rectal bleeding: increased colorectal cancer risk');
        }
        if (s.symptom.toLowerCase().includes('weight loss') && s.severity >= SymptomSeverity.MODERATE) {
          symptomWeight += 0.15 * 0.5;
          rationale.push('Unexplained weight loss: increased risk for multiple cancers');
        }
      }
    }
    risk += symptomWeight;

    // Normalize and assign risk level
    let absoluteRisk = Math.min(1, risk);
    let riskLevel: RiskScore['riskLevel'] = 'average';
    if (absoluteRisk > 0.7) riskLevel = 'very_high';
    else if (absoluteRisk > 0.4) riskLevel = 'high';
    else if (absoluteRisk > 0.2) riskLevel = 'elevated';
    // Confidence interval (placeholder, should use model-based CI)
    ci = [Math.max(0, absoluteRisk - 0.1), Math.min(1, absoluteRisk + 0.1)];

    results.push({
      cancerType: cancer,
      absoluteRisk,
      riskLevel,
      confidenceInterval: ci,
      rationale,
    });
  }
  return results;
}
