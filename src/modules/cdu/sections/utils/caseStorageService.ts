import { PatientData } from '../types/diseaseProgress.types';

export interface CaseSnapshot {
  id: string;                // unique snapshot ID
  caseId: string;            // parent case
  version: number;           // incremental
  timestamp: string;         // ISO string
  clinicalData: PatientData; // full input at time
  summary: string;           // clinical summary text
  protocolResults: {         // persisted eligibility IDs
    protocolId: string;
    protocolName?: string;
    status: string;
  }[];
}

export interface CaseRecord {
  caseId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  snapshots: CaseSnapshot[];
}

/**
 * Legacy SavedCase interface for migration if needed.
 * Will be superseded by CaseRecord.
 */
export interface SavedCase {
  caseId: string;
  patientName?: string; 
  createdAt: string;
  updatedAt: string;
  data: PatientData;
  latestSummaryText?: string;
}

const STORAGE_KEY = 'vista_clinical_cases_v2'; // New storage key for versioned cases

export const caseStorageService = {
  /**
   * Creates a new CaseRecord or adds a snapshot to an existing one.
   */
  saveCase: (
    data: PatientData, 
    title: string, 
    summaryText: string = '', 
    protocolResults: { protocolId: string; protocolName?: string; status: string }[] = []
  ): CaseRecord => {
    const records = caseStorageService.loadCases();
    let recordIndex = records.findIndex(r => r.caseId === data.id);
    
    const now = new Date().toISOString();
    
    let record: CaseRecord;
    
    if (recordIndex >= 0) {
      record = records[recordIndex];
      const nextVersion = record.snapshots.length + 1;
      
      const newSnapshot: CaseSnapshot = {
        id: crypto.randomUUID(),
        caseId: data.id,
        version: nextVersion,
        timestamp: now,
        clinicalData: JSON.parse(JSON.stringify(data)), // Ensure deep copy
        summary: summaryText,
        protocolResults: protocolResults
      };
      
      record.snapshots.push(newSnapshot);
      record.updatedAt = now;
      record.title = title || record.title;
      records[recordIndex] = record;
    } else {
      const newSnapshot: CaseSnapshot = {
        id: crypto.randomUUID(),
        caseId: data.id,
        version: 1,
        timestamp: now,
        clinicalData: JSON.parse(JSON.stringify(data)),
        summary: summaryText,
        protocolResults: protocolResults
      };
      
      record = {
        caseId: data.id,
        title: title || data.diseaseStatus.primaryDiagnosis || "Unnamed Case",
        createdAt: now,
        updatedAt: now,
        snapshots: [newSnapshot]
      };
      
      records.push(record);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return record;
  },

  /**
   * Safe version of saveCase that handles localStorage quota and read/write errors.
   */
  safeSaveCase: (
    data: PatientData, 
    title: string, 
    summaryText: string = '', 
    protocolResults: { protocolId: string; protocolName?: string; status: string }[] = []
  ): { success: boolean, record?: CaseRecord, error?: string } => {
    try {
      const record = caseStorageService.saveCase(data, title, summaryText, protocolResults);
      return { success: true, record };
    } catch (e: any) {
      console.error('Storage Error:', e);
      let errorMessage = 'Unable to save case locally. Please export your case summary and reduce stored case history.';
      if (e.name === 'QuotaExceededError') {
        errorMessage = 'Storage quota exceeded. ' + errorMessage;
      }
      return { success: false, error: errorMessage };
    }
  },

  loadCases: (): CaseRecord[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse cases', e);
      return [];
    }
  },

  loadCaseById: (caseId: string): CaseRecord | undefined => {
    const cases = caseStorageService.loadCases();
    return cases.find(c => c.caseId === caseId);
  },

  getLatestSnapshot: (caseId: string): CaseSnapshot | undefined => {
    const record = caseStorageService.loadCaseById(caseId);
    if (!record || record.snapshots.length === 0) return undefined;
    return record.snapshots[record.snapshots.length - 1];
  },

  deleteCase: (caseId: string): void => {
    const records = caseStorageService.loadCases();
    const filtered = records.filter(r => r.caseId !== caseId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
