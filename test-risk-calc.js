// Simple JavaScript test for risk calculation
console.log('Testing Risk Calculation...');

// Mock data structures
const mockPatientBRCA1 = {
  age: 45,
  familyHistory: [
    { cancerType: 'BREAST', age: 40, relationship: 'mother' },
    { cancerType: 'OVARIAN', age: 45, relationship: 'sister' }
  ],
  geneticMarkers: [
    { marker: 'BRCA1', variant: 'pathogenic', significance: 'pathogenic' }
  ],
  previousCancers: [],
  lifestyle: {
    smoking: false,
    alcohol: 'moderate',
    exercise: 'regular',
    diet: 'balanced'
  }
};

const mockPatientLynch = {
  age: 50,
  familyHistory: [
    { cancerType: 'COLORECTAL', age: 45, relationship: 'father' },
    { cancerType: 'ENDOMETRIAL', age: 48, relationship: 'mother' }
  ],
  geneticMarkers: [
    { marker: 'MLH1', variant: 'pathogenic', significance: 'pathogenic' }
  ],
  previousCancers: [],
  lifestyle: {
    smoking: false,
    alcohol: 'none',
    exercise: 'regular',
    diet: 'balanced'
  }
};

// Simple risk calculation logic (extracted from the actual file)
function calculateRiskScore(patient) {
  let riskScore = 0;
  
  // Age factor (10% of total score)
  if (patient.age > 65) riskScore += 15;
  else if (patient.age > 50) riskScore += 10;
  else if (patient.age > 40) riskScore += 5;
  
  // Family history (30% of total score) - increased weight
  if (patient.familyHistory && patient.familyHistory.length > 0) {
    patient.familyHistory.forEach(history => {
      let historyScore = 0;
      
      // Base score by cancer type
      switch (history.cancerType) {
        case 'BREAST':
        case 'OVARIAN':
        case 'COLORECTAL':
        case 'ENDOMETRIAL':
        case 'PANCREATIC':
          historyScore = 15; // Increased from 10
          break;
        case 'PROSTATE':
        case 'LUNG':
          historyScore = 10; // Increased from 8
          break;
        default:
          historyScore = 8; // Increased from 5
      }
      
      // Early onset bonus
      if (history.age && history.age < 50) {
        historyScore += 8; // Increased from 5
      }
      
      // Relationship proximity
      if (history.relationship === 'mother' || history.relationship === 'father') {
        historyScore *= 1.5; // Increased from 1.2
      } else if (history.relationship === 'sibling' || history.relationship === 'sister' || history.relationship === 'brother') {
        historyScore *= 1.3; // Increased from 1.1
      }
      
      riskScore += historyScore;
    });
  }
  
  // Genetic markers (40% of total score) - significantly increased weight
  if (patient.geneticMarkers && patient.geneticMarkers.length > 0) {
    patient.geneticMarkers.forEach(marker => {
      if (marker.significance === 'pathogenic' || marker.variant === 'pathogenic') {
        // High-penetrance genes get massive scores
        if (['BRCA1', 'BRCA2', 'MLH1', 'MSH2', 'MSH6', 'PMS2', 'EPCAM'].includes(marker.marker)) {
          riskScore += 40; // Increased from 25
        }
        // Medium-penetrance genes
        else if (['CHEK2', 'ATM', 'PALB2', 'NBN'].includes(marker.marker)) {
          riskScore += 20; // Increased from 15
        }
        // Other pathogenic variants
        else {
          riskScore += 15; // Increased from 10
        }
      } else if (marker.significance === 'likely_pathogenic') {
        if (['BRCA1', 'BRCA2', 'MLH1', 'MSH2', 'MSH6', 'PMS2', 'EPCAM'].includes(marker.marker)) {
          riskScore += 30; // Increased from 20
        } else {
          riskScore += 15; // Increased from 10
        }
      }
    });
  }
  
  // Previous cancers (20% of total score)
  if (patient.previousCancers && patient.previousCancers.length > 0) {
    riskScore += patient.previousCancers.length * 15; // Increased from 12
  }
  
  return Math.round(riskScore);
}

function getRiskLevel(score) {
  if (score >= 70) return 'very_high'; // Lowered from 80
  if (score >= 50) return 'high';      // Lowered from 60
  if (score >= 30) return 'moderate';   // Lowered from 40
  if (score >= 15) return 'low';       // Lowered from 20
  return 'very_low';
}

// Test BRCA1 patient
console.log('\n=== BRCA1 Patient Test ===');
const brca1Score = calculateRiskScore(mockPatientBRCA1);
const brca1Risk = getRiskLevel(brca1Score);
console.log('Score:', brca1Score);
console.log('Risk Level:', brca1Risk);
console.log('Expected: high or very_high');
console.log('Test Result:', (brca1Risk === 'high' || brca1Risk === 'very_high') ? 'PASS' : 'FAIL');

// Test Lynch syndrome patient
console.log('\n=== Lynch Syndrome Patient Test ===');
const lynchScore = calculateRiskScore(mockPatientLynch);
const lynchRisk = getRiskLevel(lynchScore);
console.log('Score:', lynchScore);
console.log('Risk Level:', lynchRisk);
console.log('Expected: high or very_high');
console.log('Test Result:', (lynchRisk === 'high' || lynchRisk === 'very_high') ? 'PASS' : 'FAIL');

// Score breakdown for BRCA1
console.log('\n=== BRCA1 Score Breakdown ===');
let brca1Breakdown = 0;
console.log('Age (45):', 5); brca1Breakdown += 5;
console.log('Family History:');
console.log('  - BREAST cancer at 40 (mother): 15 * 1.5 + 8 =', 15 * 1.5 + 8); brca1Breakdown += 15 * 1.5 + 8;
console.log('  - OVARIAN cancer at 45 (sister): 15 * 1.3 =', 15 * 1.3); brca1Breakdown += 15 * 1.3;
console.log('BRCA1 pathogenic:', 40); brca1Breakdown += 40;
console.log('Total calculated:', brca1Breakdown);
