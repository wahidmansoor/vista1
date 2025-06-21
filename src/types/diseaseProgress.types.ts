// src/types/diseaseProgress.types.ts
// Stub file to resolve missing module errors. Please update with actual types as needed.

export interface TabConfig {
  id: string;
  label: string;
}

export interface TreatmentProtocol {
  id: string;
  name: string;
  description?: string;
  responseRate?: number;
  // Add other properties as needed to match usage in codebase
}

export type StageType = 'I' | 'II' | 'III' | 'IV';

export type PerformanceScoreType = '0' | '1' | '2' | '3' | '4';

export interface StorageData {
  [key: string]: any;
}

export interface DataMigration {
  fromVersion: string;
  toVersion: string;
  migrate: (oldData: any) => StorageData;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PatientDataState {
  [key: string]: any;
}

export interface FieldValidation {
  error?: string;
  warning?: string;
  required?: boolean;
}

export type TreatmentLineType = 'first' | 'second' | 'third' | 'other';

// Add any other types used in imports from this file
