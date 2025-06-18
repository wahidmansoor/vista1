/**
 * Validation utilities for the Disease Progress Tracker
 * Provides form validation and data integrity checks
 */

import {
  DiseaseStatus,
  PerformanceStatus,
  ProgressionData,
  TreatmentLineData,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  FormState,
  CancerType,
  PerformanceScale,
  TreatmentLine,
  TreatmentResponse,
  ImagingType
} from '../engine/models';

export class FormValidators {
  
  /**
   * Validate disease status form
   */
  static validateDiseaseStatus(data: DiseaseStatus): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required field validation
    if (!data.primaryDiagnosis || data.primaryDiagnosis.trim() === '') {
      errors.push({
        field: 'primaryDiagnosis',
        message: 'Primary diagnosis is required',
        severity: 'error',
        suggestion: 'Please select a primary diagnosis from the dropdown'
      });
    }

    if (!data.stageAtDiagnosis || data.stageAtDiagnosis.trim() === '') {
      errors.push({
        field: 'stageAtDiagnosis',
        message: 'Stage at diagnosis is required',
        severity: 'error',
        suggestion: 'Please specify the cancer stage'
      });
    }

    if (!data.dateOfDiagnosis || data.dateOfDiagnosis.trim() === '') {
      errors.push({
        field: 'dateOfDiagnosis',
        message: 'Date of diagnosis is required',
        severity: 'error',
        suggestion: 'Please provide the date when cancer was diagnosed'
      });
    }

    // Date validation
    if (data.dateOfDiagnosis) {
      const diagnosisDate = new Date(data.dateOfDiagnosis);
      const today = new Date();
      
      if (diagnosisDate > today) {
        errors.push({
          field: 'dateOfDiagnosis',
          message: 'Diagnosis date cannot be in the future',
          severity: 'error',
          suggestion: 'Please check the diagnosis date'
        });
      }

      if (diagnosisDate < new Date('1900-01-01')) {
        errors.push({
          field: 'dateOfDiagnosis',
          message: 'Diagnosis date seems too early',
          severity: 'warning',
          suggestion: 'Please verify the diagnosis date'
        });
      }

      // Warning for very recent diagnosis
      const daysSinceDiagnosis = Math.floor((today.getTime() - diagnosisDate.getTime()) / (1000 * 3600 * 24));
      if (daysSinceDiagnosis < 7) {
        warnings.push({
          field: 'dateOfDiagnosis',
          message: 'Very recent diagnosis - staging may still be in progress',
          recommendation: 'Consider completing staging workup before treatment planning'
        });
      }
    }

    // Other diagnosis validation
    if (data.primaryDiagnosis === 'Other' && (!data.otherPrimaryDiagnosis || data.otherPrimaryDiagnosis.trim() === '')) {
      errors.push({
        field: 'otherPrimaryDiagnosis',
        message: 'Please specify the other diagnosis',
        severity: 'error',
        suggestion: 'Provide details about the specific cancer type'
      });
    }

    // Biomarker validation
    if (data.biomarkers && data.biomarkers.length > 0) {
      data.biomarkers.forEach((biomarker, index) => {
        if (!biomarker.name || biomarker.name.trim() === '') {
          errors.push({
            field: `biomarkers[${index}].name`,
            message: `Biomarker ${index + 1} name is required`,
            severity: 'error'
          });
        }

        if (!biomarker.value || biomarker.value.trim() === '') {
          errors.push({
            field: `biomarkers[${index}].value`,
            message: `Biomarker ${index + 1} value is required`,
            severity: 'error'
          });
        }

        if (!biomarker.testDate || biomarker.testDate.trim() === '') {
          warnings.push({
            field: `biomarkers[${index}].testDate`,
            message: `Test date for ${biomarker.name} is missing`,
            recommendation: 'Consider adding test date for better tracking'
          });
        }
      });
    }

    const completionPercentage = this.calculateDiseaseStatusCompletion(data);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completionPercentage
    };
  }

  /**
   * Validate performance status form
   */
  static validatePerformanceStatus(data: PerformanceStatus): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required field validation
    if (!data.assessmentDate || data.assessmentDate.trim() === '') {
      errors.push({
        field: 'assessmentDate',
        message: 'Assessment date is required',
        severity: 'error',
        suggestion: 'Please provide the date of performance status assessment'
      });
    }

    if (!data.performanceScale) {
      errors.push({
        field: 'performanceScale',
        message: 'Performance scale is required',
        severity: 'error',
        suggestion: 'Please select either ECOG or Karnofsky scale'
      });
    }

    if (!data.performanceScore || data.performanceScore.trim() === '') {
      errors.push({
        field: 'performanceScore',
        message: 'Performance score is required',
        severity: 'error',
        suggestion: 'Please provide the performance status score'
      });
    }

    // Date validation
    if (data.assessmentDate) {
      const assessmentDate = new Date(data.assessmentDate);
      const today = new Date();
      
      if (assessmentDate > today) {
        errors.push({
          field: 'assessmentDate',
          message: 'Assessment date cannot be in the future',
          severity: 'error'
        });
      }

      // Warning for old assessments
      const daysSinceAssessment = Math.floor((today.getTime() - assessmentDate.getTime()) / (1000 * 3600 * 24));
      if (daysSinceAssessment > 30) {
        warnings.push({
          field: 'assessmentDate',
          message: 'Performance status assessment is more than 30 days old',
          recommendation: 'Consider updating performance status for current treatment decisions'
        });
      }
    }

    // Score validation
    if (data.performanceScore) {
      const score = parseInt(data.performanceScore);
      
      if (data.performanceScale === PerformanceScale.ECOG) {
        if (score < 0 || score > 4) {
          errors.push({
            field: 'performanceScore',
            message: 'ECOG score must be between 0 and 4',
            severity: 'error'
          });
        }
        
        if (score >= 3) {
          warnings.push({
            field: 'performanceScore',
            message: 'Poor performance status may limit treatment options',
            recommendation: 'Consider supportive care consultation'
          });
        }
      } else if (data.performanceScale === PerformanceScale.KARNOFSKY) {
        if (score < 0 || score > 100 || score % 10 !== 0) {
          errors.push({
            field: 'performanceScore',
            message: 'Karnofsky score must be between 0-100 in increments of 10',
            severity: 'error'
          });
        }
        
        if (score < 70) {
          warnings.push({
            field: 'performanceScore',
            message: 'Low Karnofsky score may limit treatment options',
            recommendation: 'Consider supportive care consultation'
          });
        }
      }
    }

    const completionPercentage = this.calculatePerformanceStatusCompletion(data);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completionPercentage
    };
  }

  /**
   * Validate progression data form
   */
  static validateProgressionData(data: ProgressionData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Date validation
    if (data.reassessmentDate) {
      const reassessmentDate = new Date(data.reassessmentDate);
      const today = new Date();
      
      if (reassessmentDate > today) {
        errors.push({
          field: 'reassessmentDate',
          message: 'Reassessment date cannot be in the future',
          severity: 'error'
        });
      }
    }

    // Imaging type validation
    if (data.imagingType && !Object.values(ImagingType).includes(data.imagingType)) {
      errors.push({
        field: 'imagingType',
        message: 'Invalid imaging type selected',
        severity: 'error'
      });
    }

    // Tumor marker validation
    if (data.markerType && data.markerType.trim() !== '' && (!data.markerValue || data.markerValue.trim() === '')) {
      warnings.push({
        field: 'markerValue',
        message: 'Tumor marker value is missing',
        recommendation: 'Consider adding the marker value for better tracking'
      });
    }

    if (data.markerValue && data.markerValue.trim() !== '') {
      const numericValue = parseFloat(data.markerValue);
      if (isNaN(numericValue) || numericValue < 0) {
        errors.push({
          field: 'markerValue',
          message: 'Tumor marker value must be a positive number',
          severity: 'error'
        });
      }
    }

    // Findings summary validation
    if (data.imagingType && (!data.findingsSummary || data.findingsSummary.trim() === '')) {
      warnings.push({
        field: 'findingsSummary',
        message: 'Imaging findings summary is missing',
        recommendation: 'Consider adding findings summary for better documentation'
      });
    }

    const completionPercentage = this.calculateProgressionDataCompletion(data);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completionPercentage
    };
  }

  /**
   * Validate treatment line data form
   */
  static validateTreatmentLineData(data: TreatmentLineData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Required field validation
    if (!data.treatmentLine) {
      errors.push({
        field: 'treatmentLine',
        message: 'Treatment line is required',
        severity: 'error',
        suggestion: 'Please select the treatment line'
      });
    }

    if (!data.treatmentRegimen || data.treatmentRegimen.trim() === '') {
      errors.push({
        field: 'treatmentRegimen',
        message: 'Treatment regimen is required',
        severity: 'error',
        suggestion: 'Please specify the treatment regimen'
      });
    }

    if (!data.startDate || data.startDate.trim() === '') {
      errors.push({
        field: 'startDate',
        message: 'Start date is required',
        severity: 'error',
        suggestion: 'Please provide the treatment start date'
      });
    }

    // Date validation
    if (data.startDate) {
      const startDate = new Date(data.startDate);
      const today = new Date();
      
      if (startDate > today) {
        errors.push({
          field: 'startDate',
          message: 'Start date cannot be in the future',
          severity: 'error'
        });
      }
    }

    if (data.endDate) {
      const endDate = new Date(data.endDate);
      const today = new Date();
      
      if (endDate > today) {
        warnings.push({
          field: 'endDate',
          message: 'End date is in the future',
          recommendation: 'This treatment appears to be ongoing'
        });
      }

      if (data.startDate) {
        const startDate = new Date(data.startDate);
        if (endDate < startDate) {
          errors.push({
            field: 'endDate',
            message: 'End date cannot be before start date',
            severity: 'error'
          });
        }
      }
    }

    // Treatment response validation
    if (data.treatmentResponse && !Object.values(TreatmentResponse).includes(data.treatmentResponse)) {
      errors.push({
        field: 'treatmentResponse',
        message: 'Invalid treatment response selected',
        severity: 'error'
      });
    }

    // Warning for missing response in completed treatment
    if (data.endDate && (!data.treatmentResponse || data.treatmentResponse === TreatmentResponse.NOT_EVALUABLE)) {
      warnings.push({
        field: 'treatmentResponse',
        message: 'Treatment response is missing for completed treatment',
        recommendation: 'Consider documenting the treatment response'
      });
    }

    const completionPercentage = this.calculateTreatmentLineDataCompletion(data);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      completionPercentage
    };
  }

  /**
   * Validate complete form state
   */
  static validateCompleteForm(formState: FormState): ValidationResult {
    const diseaseValidation = this.validateDiseaseStatus(formState.diseaseStatus);
    const performanceValidation = this.validatePerformanceStatus(formState.performanceStatus);
    const progressionValidation = this.validateProgressionData(formState.progression);
    const treatmentValidation = this.validateTreatmentLineData(formState.treatmentLine);

    const allErrors = [
      ...diseaseValidation.errors,
      ...performanceValidation.errors,
      ...progressionValidation.errors,
      ...treatmentValidation.errors
    ];

    const allWarnings = [
      ...diseaseValidation.warnings,
      ...performanceValidation.warnings,
      ...progressionValidation.warnings,
      ...treatmentValidation.warnings
    ];

    const overallCompletion = Math.round(
      (diseaseValidation.completionPercentage +
       performanceValidation.completionPercentage +
       progressionValidation.completionPercentage +
       treatmentValidation.completionPercentage) / 4
    );

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      completionPercentage: overallCompletion
    };
  }

  // Completion calculation methods
  private static calculateDiseaseStatusCompletion(data: DiseaseStatus): number {
    const totalFields = 6;
    let completedFields = 0;

    if (data.primaryDiagnosis && data.primaryDiagnosis.trim() !== '') completedFields++;
    if (data.stageAtDiagnosis && data.stageAtDiagnosis.trim() !== '') completedFields++;
    if (data.dateOfDiagnosis && data.dateOfDiagnosis.trim() !== '') completedFields++;
    if (data.histologyMutation && data.histologyMutation.trim() !== '') completedFields++;
    if (data.diseaseNotes && data.diseaseNotes.trim() !== '') completedFields++;
    if (data.organSystem) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  private static calculatePerformanceStatusCompletion(data: PerformanceStatus): number {
    const totalFields = 4;
    let completedFields = 0;

    if (data.assessmentDate && data.assessmentDate.trim() !== '') completedFields++;
    if (data.performanceScale) completedFields++;
    if (data.performanceScore && data.performanceScore.trim() !== '') completedFields++;
    if (data.performanceNotes && data.performanceNotes.trim() !== '') completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  private static calculateProgressionDataCompletion(data: ProgressionData): number {
    const totalFields = 6;
    let completedFields = 0;

    if (data.reassessmentDate && data.reassessmentDate.trim() !== '') completedFields++;
    if (data.imagingType) completedFields++;
    if (data.findingsSummary && data.findingsSummary.trim() !== '') completedFields++;
    if (data.markerType && data.markerType.trim() !== '') completedFields++;
    if (data.markerValue && data.markerValue.trim() !== '') completedFields++;
    if (data.progressionNotes && data.progressionNotes.trim() !== '') completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  private static calculateTreatmentLineDataCompletion(data: TreatmentLineData): number {
    const totalFields = 6;
    let completedFields = 0;

    if (data.treatmentLine) completedFields++;
    if (data.treatmentRegimen && data.treatmentRegimen.trim() !== '') completedFields++;
    if (data.startDate && data.startDate.trim() !== '') completedFields++;
    if (data.endDate && data.endDate.trim() !== '') completedFields++;
    if (data.treatmentResponse) completedFields++;
    if (data.treatmentNotes && data.treatmentNotes.trim() !== '') completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }
}

/**
 * Field-level validators for real-time validation
 */
export class FieldValidators {
  
  static validateRequired(value: string, fieldName: string): ValidationError | null {
    if (!value || value.trim() === '') {
      return {
        field: fieldName,
        message: `${fieldName} is required`,
        severity: 'error'
      };
    }
    return null;
  }

  static validateDate(value: string, fieldName: string): ValidationError | null {
    if (!value || value.trim() === '') return null;
    
    const date = new Date(value);
    const today = new Date();
    
    if (isNaN(date.getTime())) {
      return {
        field: fieldName,
        message: 'Invalid date format',
        severity: 'error'
      };
    }
    
    if (date > today) {
      return {
        field: fieldName,
        message: 'Date cannot be in the future',
        severity: 'error'
      };
    }
    
    return null;
  }

  static validateNumber(value: string, fieldName: string, min?: number, max?: number): ValidationError | null {
    if (!value || value.trim() === '') return null;
    
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return {
        field: fieldName,
        message: 'Must be a valid number',
        severity: 'error'
      };
    }
    
    if (min !== undefined && num < min) {
      return {
        field: fieldName,
        message: `Must be at least ${min}`,
        severity: 'error'
      };
    }
    
    if (max !== undefined && num > max) {
      return {
        field: fieldName,
        message: `Must be at most ${max}`,
        severity: 'error'
      };
    }
    
    return null;
  }

  static validateEmail(value: string, fieldName: string): ValidationError | null {
    if (!value || value.trim() === '') return null;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      return {
        field: fieldName,
        message: 'Invalid email format',
        severity: 'error'
      };
    }
    
    return null;
  }

  static validatePhone(value: string, fieldName: string): ValidationError | null {
    if (!value || value.trim() === '') return null;
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return {
        field: fieldName,
        message: 'Invalid phone number format',
        severity: 'error'
      };
    }
    
    return null;
  }
}

/**
 * Utility functions for form validation
 */
export const ValidationUtils = {
  
  /**
   * Get validation summary for display
   */
  getValidationSummary(validation: ValidationResult) {
    const criticalErrors = validation.errors.filter(e => e.severity === 'error').length;
    const warnings = validation.warnings.length;
    
    return {
      isValid: validation.isValid,
      criticalErrors,
      warnings,
      completionPercentage: validation.completionPercentage,
      canProceed: criticalErrors === 0
    };
  },

  /**
   * Get field-specific errors
   */
  getFieldErrors(validation: ValidationResult, fieldName: string) {
    return validation.errors.filter(error => error.field === fieldName);
  },

  /**
   * Get field-specific warnings
   */
  getFieldWarnings(validation: ValidationResult, fieldName: string) {
    return validation.warnings.filter(warning => warning.field === fieldName);
  },

  /**
   * Check if field has any issues
   */
  hasFieldIssues(validation: ValidationResult, fieldName: string) {
    return this.getFieldErrors(validation, fieldName).length > 0 || 
           this.getFieldWarnings(validation, fieldName).length > 0;
  },

  /**
   * Get field validation state for styling
   */
  getFieldState(validation: ValidationResult, fieldName: string): 'error' | 'warning' | 'success' | 'default' {
    const errors = this.getFieldErrors(validation, fieldName);
    const warnings = this.getFieldWarnings(validation, fieldName);
    
    if (errors.length > 0) return 'error';
    if (warnings.length > 0) return 'warning';
    if (validation.completionPercentage > 0) return 'success';
    return 'default';
  }
};
