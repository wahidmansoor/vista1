/**
 * Validation utilities for Disease Progress Tracker
 * Comprehensive field and cross-field validation logic
 */

import {
  PatientDataState,
  FieldValidation,
  ValidationError,
  StageType,
  PerformanceScoreType,
  TreatmentLineType
} from '../types/diseaseProgress.types';

// Medical validation constants
const VALID_DIAGNOSES = [
  "Breast Cancer",
  "Colorectal Cancer", 
  "Lung Cancer",
  "Prostate Cancer",
  "Ovarian Cancer",
  "Lymphoma",
  "Leukemia",
  "Melanoma",
  "Other"
];

const VALID_MUTATIONS = [
  "HER2 Positive",
  "KRAS Mutant",
  "EGFR Mutant",
  "ALK Rearrangement", 
  "MSI-High",
  "PD-L1 Positive",
  "BRAF V600E",
  "TP53 Mutant",
  "Other"
];

const STAGE_COMPATIBILITY: Record<string, StageType[]> = {
  "Breast Cancer": ["I", "II", "III", "IV"],
  "Colorectal Cancer": ["I", "II", "III", "IV"],
  "Lung Cancer": ["I", "II", "III", "IV"],
  "Prostate Cancer": ["I", "II", "III", "IV"],
  "Ovarian Cancer": ["I", "II", "III", "IV"],
  "Lymphoma": ["I", "II", "III", "IV"],
  "Leukemia": ["IV"], // Typically considered systemic
  "Melanoma": ["I", "II", "III", "IV"],
  "Other": ["I", "II", "III", "IV"]
};

// Helper functions
const isValidDate = (dateString: string): boolean => {
  if (!dateString) return true; // Optional fields
  const date = new Date(dateString);
  const now = new Date();
  return !isNaN(date.getTime()) && date <= now;
};

const isValidFutureDate = (dateString: string): boolean => {
  if (!dateString) return true;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const isDateAfter = (laterDate: string, earlierDate: string): boolean => {
  if (!laterDate || !earlierDate) return true;
  return new Date(laterDate) > new Date(earlierDate);
};

const isValidPerformanceScore = (score: string, scale: string): boolean => {
  if (!score) return true;
  
  const numScore = parseInt(score, 10);
  if (isNaN(numScore)) return false;
  
  if (scale === 'ecog') {
    return numScore >= 0 && numScore <= 4;
  } else if (scale === 'karnofsky') {
    return numScore >= 0 && numScore <= 100 && numScore % 10 === 0;
  }
  
  return true;
};

const isValidTumorMarkerValue = (value: string, type: string): boolean => {
  if (!value || !type) return true;
  
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return false;
  
  // Basic ranges for common markers
  const markerRanges: Record<string, { min: number; max: number }> = {
    'CEA': { min: 0, max: 1000 },
    'CA 19-9': { min: 0, max: 10000 },
    'CA 125': { min: 0, max: 5000 },
    'PSA': { min: 0, max: 1000 },
    'AFP': { min: 0, max: 10000 },
    'Beta-hCG': { min: 0, max: 100000 }
  };
  
  const range = markerRanges[type];
  if (range) {
    return numValue >= range.min && numValue <= range.max;
  }
  
  return numValue >= 0; // General positive value check
};

// Main validation function
export const validateField = (
  fieldPath: string,
  value: any,
  state: PatientDataState
): FieldValidation => {
  const [section, fieldName] = fieldPath.split('.');
  
  // Required field validation
  const requiredFields = {
    'diseaseStatus.primaryDiagnosis': 'Primary diagnosis is required',
    'diseaseStatus.stageAtDiagnosis': 'Stage at diagnosis is required',
    'diseaseStatus.dateOfDiagnosis': 'Date of diagnosis is required',
  };
  
  if (requiredFields[fieldPath] && (!value || value.toString().trim() === '')) {
    return {
      isValid: false,
      error: requiredFields[fieldPath]
    };
  }
  
  // Field-specific validation
  switch (fieldPath) {
    case 'diseaseStatus.primaryDiagnosis':
      if (value && !VALID_DIAGNOSES.includes(value)) {
        return {
          isValid: false,
          error: 'Please select a valid diagnosis'
        };
      }
      break;
      
    case 'diseaseStatus.otherPrimaryDiagnosis':
      if (state.diseaseStatus.primaryDiagnosis === 'Other' && (!value || value.trim() === '')) {
        return {
          isValid: false,
          error: 'Please specify the other diagnosis'
        };
      }
      break;
      
    case 'diseaseStatus.stageAtDiagnosis':
      if (value && state.diseaseStatus.primaryDiagnosis) {
        const compatibleStages = STAGE_COMPATIBILITY[state.diseaseStatus.primaryDiagnosis];
        if (compatibleStages && !compatibleStages.includes(value as StageType)) {
          return {
            isValid: false,
            error: `Stage ${value} is not typical for ${state.diseaseStatus.primaryDiagnosis}`
          };
        }
      }
      break;
      
    case 'diseaseStatus.histologyMutation':
      if (value && !VALID_MUTATIONS.includes(value)) {
        return {
          isValid: false,
          error: 'Please select a valid histology/mutation'
        };
      }
      break;
      
    case 'diseaseStatus.otherHistologyMutation':
      if (state.diseaseStatus.histologyMutation === 'Other' && (!value || value.trim() === '')) {
        return {
          isValid: false,
          error: 'Please specify the other histology/mutation'
        };
      }
      break;
      
    case 'diseaseStatus.dateOfDiagnosis':
      if (value && !isValidDate(value)) {
        return {
          isValid: false,
          error: 'Please enter a valid date (not in the future)'
        };
      }
      break;
      
    case 'performanceStatus.assessmentDate':
      if (value && !isValidDate(value)) {
        return {
          isValid: false,
          error: 'Please enter a valid assessment date'
        };
      }
      if (value && state.diseaseStatus.dateOfDiagnosis && 
          !isDateAfter(value, state.diseaseStatus.dateOfDiagnosis)) {
        return {
          isValid: false,
          error: 'Assessment date should be after diagnosis date'
        };
      }
      break;
      
    case 'performanceStatus.performanceScore':
      if (value && !isValidPerformanceScore(value, state.performanceStatus.performanceScale)) {
        return {
          isValid: false,
          error: 'Invalid performance score for selected scale'
        };
      }
      break;
      
    case 'progression.reassessmentDate':
      if (value && !isValidDate(value)) {
        return {
          isValid: false,
          error: 'Please enter a valid reassessment date'
        };
      }
      if (value && state.diseaseStatus.dateOfDiagnosis && 
          !isDateAfter(value, state.diseaseStatus.dateOfDiagnosis)) {
        return {
          isValid: false,
          error: 'Reassessment date should be after diagnosis date'
        };
      }
      break;
      
    case 'progression.markerValue':
      if (!isValidTumorMarkerValue(value, state.progression.markerType || '')) {
        return {
          isValid: false,
          error: 'Invalid tumor marker value'
        };
      }
      break;
      
    case 'treatmentLine.startDate':
      if (value && !isValidDate(value)) {
        return {
          isValid: false,
          error: 'Please enter a valid start date'
        };
      }
      if (value && state.diseaseStatus.dateOfDiagnosis && 
          !isDateAfter(value, state.diseaseStatus.dateOfDiagnosis)) {
        return {
          isValid: false,
          error: 'Treatment start date should be after diagnosis date'
        };
      }
      break;
      
    case 'treatmentLine.endDate':
      if (value && !isValidFutureDate(value)) {
        return {
          isValid: false,
          error: 'Please enter a valid end date'
        };
      }
      if (value && state.treatmentLine.startDate && 
          !isDateAfter(value, state.treatmentLine.startDate)) {
        return {
          isValid: false,
          error: 'End date should be after start date'
        };
      }
      break;
      
    case 'treatmentLine.treatmentRegimen':
      if (value && value.length < 2) {
        return {
          isValid: false,
          error: 'Treatment regimen should be at least 2 characters'
        };
      }
      break;
  }
  
  // Add warnings for specific conditions
  const warnings: Record<string, string> = {};
  
  // Performance score warnings
  if (fieldPath === 'performanceStatus.performanceScore' && value) {
    const score = parseInt(value, 10);
    if (!isNaN(score)) {
      if (score >= 3) {
        warnings.warning = 'High performance score - consider supportive care focus';
      } else if (score === 2) {
        warnings.warning = 'Moderate performance score - consider dose modifications';
      }
    }
  }
  
  // Stage-specific warnings
  if (fieldPath === 'diseaseStatus.stageAtDiagnosis' && value === 'IV') {
    warnings.warning = 'Metastatic disease - palliative intent therapy typically indicated';
  }
  
  return {
    isValid: true,
    ...warnings
  };
};

// Cross-field validation
export const validateCrossFields = (state: PatientDataState): string[] => {
  const errors: string[] = [];
  
  // Date consistency checks
  const diagnosisDate = new Date(state.diseaseStatus.dateOfDiagnosis);
  const assessmentDate = new Date(state.performanceStatus.assessmentDate);
  const reassessmentDate = new Date(state.progression.reassessmentDate);
  const treatmentStartDate = new Date(state.treatmentLine.startDate);
  const treatmentEndDate = new Date(state.treatmentLine.endDate);
  
  // Check date chronology
  if (state.diseaseStatus.dateOfDiagnosis && state.performanceStatus.assessmentDate) {
    if (diagnosisDate > assessmentDate) {
      errors.push('Performance assessment should be after diagnosis');
    }
  }
  
  if (state.diseaseStatus.dateOfDiagnosis && state.progression.reassessmentDate) {
    if (diagnosisDate > reassessmentDate) {
      errors.push('Disease reassessment should be after diagnosis');
    }
  }
  
  if (state.treatmentLine.startDate && state.treatmentLine.endDate) {
    if (treatmentStartDate > treatmentEndDate) {
      errors.push('Treatment end date should be after start date');
    }
  }
  
  // Medical logic validation
  if (state.diseaseStatus.stageAtDiagnosis === 'I' && 
      state.treatmentLine.treatmentLine === '3rd Line') {
    errors.push('Stage I disease rarely requires 3rd line therapy - please verify');
  }
  
  if (state.performanceStatus.performanceScore === '4' && 
      state.treatmentLine.treatmentRegimen && 
      state.treatmentLine.treatmentRegimen.toLowerCase().includes('chemo')) {
    errors.push('Chemotherapy not recommended for PS 4 patients');
  }
  
  // Mutation-specific warnings
  if (state.diseaseStatus.histologyMutation === 'KRAS Mutant' && 
      state.treatmentLine.treatmentRegimen && 
      state.treatmentLine.treatmentRegimen.toLowerCase().includes('cetuximab')) {
    errors.push('KRAS mutation makes anti-EGFR therapy ineffective');
  }
  
  return errors;
};

// Utility function to get validation summary for a section
export const getValidationSummaryForSection = (
  sectionData: any,
  sectionName: string,
  state: PatientDataState
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  Object.keys(sectionData).forEach(fieldName => {
    const fieldPath = `${sectionName}.${fieldName}`;
    const validation = validateField(fieldPath, sectionData[fieldName], state);
    
    if (!validation.isValid && validation.error) {
      errors.push(validation.error);
    }
    
    if (validation.warning) {
      warnings.push(validation.warning);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
