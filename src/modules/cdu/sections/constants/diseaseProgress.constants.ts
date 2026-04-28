/**
 * Disease Progress Constants
 */

export const INITIAL_PATIENT_STATE = {
  diseaseStatus: {
    primaryDiagnosis: '',
    otherPrimaryDiagnosis: '',
    stageAtDiagnosis: '',
    biomarkers: [],
    dateOfDiagnosis: '',
    diseaseNotes: '',
  },
  performanceStatus: {
    assessmentDate: '',
    performanceScale: 'ecog',
    performanceScore: '',
    performanceNotes: '',
  },
  progression: {
    reassessmentDate: '',
    imagingType: '',
    findingsSummary: '',
    markerType: '',
    markerValue: '',
    progressionNotes: '',
  },
  treatmentLine: {
    treatmentLine: '',
    treatmentRegimen: '',
    agents: [],
    startDate: '',
    endDate: '',
    treatmentResponse: '',
    treatmentNotes: '',
  },
  treatmentHistory: [],
  validationErrors: {},
  isLoading: false,
};

export const SECTION_HELP_TEXT = {
  diseaseStatus: 'Enter primary diagnosis and relevant biomarkers to see matched protocols.',
  performanceStatus: 'Assess patient functional status using ECOG or Karnofsky scales.',
  treatmentLine: 'Review locally matched protocols based on current disease status.',
};
