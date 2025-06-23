import { calculateCancerRisk } from './src/logic/riskAssessment';
import { CancerType, GeneticMutation, BiologicalSex, Ethnicity } from './src/types/clinical';

// Test the BRCA1 case
const patient = {
  demographics: { age: 35, sex: BiologicalSex.FEMALE, ethnicity: Ethnicity.CAUCASIAN, family_history: [] },
  genetics: { mutations: [{ mutation: GeneticMutation.BRCA1, confirmed: true }], variants: [], penetrance_scores: [] },
  riskFactors: { lifestyle: { current_smoker: false }, environmental: {}, medical_history: {} },
  symptoms: { current_symptoms: [], assessment_date: new Date() },
};

console.log('Testing BRCA1 case...');
const riskScores = calculateCancerRisk(patient);
const breastRisk = riskScores.find(r => r.cancerType === CancerType.BREAST);

console.log('Breast cancer risk:', breastRisk);
console.log('Risk level:', breastRisk?.riskLevel);
console.log('Absolute risk:', breastRisk?.absoluteRisk);

// Test Lynch syndrome case  
const lynchPatient = {
  demographics: { age: 28, sex: BiologicalSex.FEMALE, ethnicity: Ethnicity.CAUCASIAN, family_history: [] },
  genetics: { mutations: [{ mutation: GeneticMutation.LYNCH, confirmed: true }], variants: [], penetrance_scores: [] },
  riskFactors: { lifestyle: { current_smoker: false }, environmental: {}, medical_history: {} },
  symptoms: { current_symptoms: [], assessment_date: new Date() },
};

console.log('\nTesting Lynch syndrome case...');
const lynchRiskScores = calculateCancerRisk(lynchPatient);
const colorectalRisk = lynchRiskScores.find(r => r.cancerType === CancerType.COLORECTAL);
const endometrialRisk = lynchRiskScores.find(r => r.cancerType === CancerType.ENDOMETRIAL);

console.log('Colorectal cancer risk:', colorectalRisk);
console.log('Endometrial cancer risk:', endometrialRisk);
console.log('Has endometrial risk?', !!endometrialRisk);
console.log('Colorectal high risk?', colorectalRisk?.riskLevel !== 'average');
