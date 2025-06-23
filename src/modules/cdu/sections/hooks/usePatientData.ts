/**
 * Custom hook for managing patient data state
 * Implements useReducer pattern with comprehensive state management
 */

import { useReducer, useCallback, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast";
import {
  PatientDataState,
  PatientDataAction,
  DiseaseStatus,
  PerformanceStatus,
  ProgressionData,
  TreatmentLine,
  StorageData,
  ValidationError,
  FieldValidation,
  UsePatientDataReturn,
  FormValidationState
} from '../types/diseaseProgress.types';
import { validateField, validateCrossFields } from '../utils/validation';
// Note: storageService will be imported when available
// import { storageService } from '../utils/storageService';

// Initial state
const createInitialState = (): PatientDataState => ({
  diseaseStatus: {
    primaryDiagnosis: '',
    otherPrimaryDiagnosis: '',
    stageAtDiagnosis: '' as any,
    histologyMutation: '',
    otherHistologyMutation: '',
    dateOfDiagnosis: '',
    diseaseNotes: '',
  },
  performanceStatus: {
    assessmentDate: '',
    performanceScale: '' as any,
    performanceScore: '' as any,
    performanceNotes: '',
  },
  progression: {
    reassessmentDate: '',
    imagingType: '' as any,
    findingsSummary: '',
    markerType: '',
    markerValue: '',
    progressionNotes: '',
  },
  treatmentLine: {
    treatmentLine: '' as any,
    treatmentRegimen: '',
    startDate: '',
    endDate: '',
    treatmentResponse: '' as any,
    treatmentNotes: '',
  },
  treatmentHistory: [],
  validationErrors: {},
  isLoading: false,
  lastSaved: undefined,
});

// Reducer function
const patientDataReducer = (
  state: PatientDataState,
  action: PatientDataAction
): PatientDataState => {
  switch (action.type) {
    case 'SET_DISEASE_STATUS':
      return {
        ...state,
        diseaseStatus: { ...state.diseaseStatus, ...action.payload },
      };

    case 'SET_PERFORMANCE_STATUS':
      return {
        ...state,
        performanceStatus: { ...state.performanceStatus, ...action.payload },
      };

    case 'SET_PROGRESSION':
      return {
        ...state,
        progression: { ...state.progression, ...action.payload },
      };

    case 'SET_TREATMENT_LINE':
      return {
        ...state,
        treatmentLine: { ...state.treatmentLine, ...action.payload },
      };

    case 'ADD_TREATMENT_LINE':
      return {
        ...state,
        treatmentHistory: [...state.treatmentHistory, action.payload],
        treatmentLine: createInitialState().treatmentLine, // Reset current form
      };

    case 'UPDATE_TREATMENT_LINE':
      const updatedHistory = [...state.treatmentHistory];
      updatedHistory[action.payload.index] = {
        ...updatedHistory[action.payload.index],
        ...action.payload.data,
      };
      return {
        ...state,
        treatmentHistory: updatedHistory,
      };

    case 'REMOVE_TREATMENT_LINE':
      return {
        ...state,
        treatmentHistory: state.treatmentHistory.filter((_, index) => index !== action.payload),
      };

    case 'LOAD_DATA':
      return {
        ...state,
        diseaseStatus: action.payload.diseaseStatus || createInitialState().diseaseStatus,
        performanceStatus: action.payload.performanceStatus || createInitialState().performanceStatus,
        progression: action.payload.progression || createInitialState().progression,
        treatmentLine: action.payload.linesOfTreatment || createInitialState().treatmentLine,
        treatmentHistory: Array.isArray(action.payload.linesOfTreatment) 
          ? action.payload.linesOfTreatment 
          : [],
        isLoading: false,
        lastSaved: action.payload.metadata?.lastSaved ? new Date(action.payload.metadata.lastSaved) : undefined,
      };

    case 'RESET_ALL':
      return createInitialState();

    case 'SET_VALIDATION_ERROR':
      return {
        ...state,
        validationErrors: {
          ...state.validationErrors,
          [action.payload.field]: action.payload.error,
        },
      };

    case 'CLEAR_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: {},
      };

    default:
      return state;
  }
};

// Main hook
export const usePatientData = (): UsePatientDataReturn => {
  const { toast } = useToast();
  const [state, dispatch] = useReducer(patientDataReducer, createInitialState());

  // Action creators
  const updateDiseaseStatus = useCallback((data: Partial<DiseaseStatus>) => {
    dispatch({ type: 'SET_DISEASE_STATUS', payload: data });
  }, []);

  const updatePerformanceStatus = useCallback((data: Partial<PerformanceStatus>) => {
    dispatch({ type: 'SET_PERFORMANCE_STATUS', payload: data });
  }, []);

  const updateProgression = useCallback((data: Partial<ProgressionData>) => {
    dispatch({ type: 'SET_PROGRESSION', payload: data });
  }, []);

  const updateTreatmentLine = useCallback((data: Partial<TreatmentLine>) => {
    dispatch({ type: 'SET_TREATMENT_LINE', payload: data });
  }, []);

  const addTreatmentLine = useCallback((data: TreatmentLine) => {
    dispatch({ type: 'ADD_TREATMENT_LINE', payload: data });
  }, []);

  const removeTreatmentLine = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_TREATMENT_LINE', payload: index });
  }, []);

  // Storage operations
  const saveToStorage = useCallback(async () => {
    try {
      const storageData: StorageData = {
        diseaseStatus: state.diseaseStatus,
        performanceStatus: state.performanceStatus,
        progression: state.progression,
        linesOfTreatment: state.treatmentLine,
        metadata: {
          version: '2.0.0',
          lastSaved: new Date().toISOString(),
        },
      };

      await storageService.save(storageData);
      
      toast({
        title: "Success",
        description: "Patient data saved successfully!",
        variant: "default"
      });
    } catch (error) {
      console.error("Failed to save patient data:", error);
      toast({
        title: "Error",
        description: "Failed to save patient data. Please try again.",
        variant: "destructive"
      });
    }
  }, [state, toast]);

  const loadFromStorage = useCallback(async () => {
    try {
      const data = await storageService.load();
      if (data) {
        dispatch({ type: 'LOAD_DATA', payload: data });
        toast({
          title: "Success",
          description: "Previous session data loaded!",
          variant: "default"
        });
      }
    } catch (error) {
      console.error("Failed to load patient data:", error);
      toast({
        title: "Warning",
        description: "Failed to load previous data",
        variant: "destructive"
      });
    }
  }, [toast]);

  const resetAll = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
    storageService.clear();
    toast({
      title: "Success",
      description: "All data cleared!",
      variant: "default"
    });
  }, [toast]);

  // Validation
  const validateFieldData = useCallback((field: string, value: any): FieldValidation => {
    return validateField(field, value, state);
  }, [state]);

  // Computed values
  const getSuggestedProtocols = useMemo(() => {
    return () => {
      // This will be implemented in the protocol suggestions hook
      return [];
    };
  }, []);

  const getSuggestedPremeds = useMemo(() => {
    return () => {
      // This will be implemented in the protocol suggestions hook
      return [];
    };
  }, []);

  const getValidationSummary = useMemo((): (() => FormValidationState) => {
    return () => {
      const diseaseStatusValidation = Object.keys(state.diseaseStatus).reduce((acc, key) => {
        acc[key as keyof DiseaseStatus] = validateField(
          `diseaseStatus.${key}`,
          state.diseaseStatus[key as keyof DiseaseStatus],
          state
        );
        return acc;
      }, {} as Record<keyof DiseaseStatus, FieldValidation>);

      const performanceStatusValidation = Object.keys(state.performanceStatus).reduce((acc, key) => {
        acc[key as keyof PerformanceStatus] = validateField(
          `performanceStatus.${key}`,
          state.performanceStatus[key as keyof PerformanceStatus],
          state
        );
        return acc;
      }, {} as Record<keyof PerformanceStatus, FieldValidation>);

      const progressionValidation = Object.keys(state.progression).reduce((acc, key) => {
        acc[key as keyof ProgressionData] = validateField(
          `progression.${key}`,
          state.progression[key as keyof ProgressionData],
          state
        );
        return acc;
      }, {} as Record<keyof ProgressionData, FieldValidation>);

      const treatmentLineValidation = Object.keys(state.treatmentLine).reduce((acc, key) => {
        acc[key as keyof TreatmentLine] = validateField(
          `treatmentLine.${key}`,
          state.treatmentLine[key as keyof TreatmentLine],
          state
        );
        return acc;
      }, {} as Record<keyof TreatmentLine, FieldValidation>);

      // Cross-field validation
      const crossFieldErrors = validateCrossFields(state);

      const isFormValid = 
        Object.values(diseaseStatusValidation).every(v => v.isValid) &&
        Object.values(performanceStatusValidation).every(v => v.isValid) &&
        Object.values(progressionValidation).every(v => v.isValid) &&
        Object.values(treatmentLineValidation).every(v => v.isValid) &&
        crossFieldErrors.length === 0;

      return {
        diseaseStatus: diseaseStatusValidation,
        performanceStatus: performanceStatusValidation,
        progression: progressionValidation,
        treatmentLine: treatmentLineValidation,
        isFormValid,
        globalErrors: crossFieldErrors,
      };
    };
  }, [state]);

  const canSave = useMemo(() => {
    return () => {
      const validation = getValidationSummary();
      return validation.isFormValid && (
        state.diseaseStatus.primaryDiagnosis !== '' ||
        state.performanceStatus.assessmentDate !== '' ||
        state.progression.reassessmentDate !== '' ||
        state.treatmentLine.treatmentRegimen !== ''
      );
    };
  }, [state, getValidationSummary]);

  return {
    state,
    actions: {
      updateDiseaseStatus,
      updatePerformanceStatus,
      updateProgression,
      updateTreatmentLine,
      addTreatmentLine,
      removeTreatmentLine,
      saveToStorage,
      loadFromStorage,
      resetAll,
      validateField: validateFieldData,
    },
    computed: {
      getSuggestedProtocols,
      getSuggestedPremeds,
      getValidationSummary,
      canSave,
    },
  };
};
