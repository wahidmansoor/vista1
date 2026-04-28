import { PatientData } from '../types/diseaseProgress.types';

export interface SavedCase {
  caseId: string;
  patientName?: string; // Optional for internal tracking
  createdAt: string;
  updatedAt: string;
  data: PatientData;
  latestSummaryText?: string;
}

const STORAGE_KEY = 'vista_clinical_cases';

export const caseStorageService = {
  saveCase: (data: PatientData, patientName?: string, summaryText?: string): SavedCase => {
    const cases = caseStorageService.loadCases();
    const existingIndex = cases.findIndex(c => c.caseId === data.id);
    
    const now = new Date().toISOString();
    
    const caseToSave: SavedCase = {
      caseId: data.id,
      patientName,
      createdAt: existingIndex >= 0 ? cases[existingIndex].createdAt : now,
      updatedAt: now,
      data,
      latestSummaryText: summaryText
    };

    if (existingIndex >= 0) {
      cases[existingIndex] = caseToSave;
    } else {
      cases.push(caseToSave);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
    return caseToSave;
  },

  loadCases: (): SavedCase[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse cases', e);
      return [];
    }
  },

  loadCaseById: (caseId: string): SavedCase | undefined => {
    const cases = caseStorageService.loadCases();
    return cases.find(c => c.caseId === caseId);
  },

  deleteCase: (caseId: string): void => {
    const cases = caseStorageService.loadCases();
    const filtered = cases.filter(c => c.caseId !== caseId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
