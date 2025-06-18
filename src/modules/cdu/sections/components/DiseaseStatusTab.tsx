/**
 * Disease Status Tab Component
 * Handles primary diagnosis, stage, histology, and related data entry
 */

import React from 'react';
import {
  DiseaseStatus,
  FieldValidation,
  StageType
} from '../types/diseaseProgress.types';

interface DiseaseStatusTabProps {
  data: DiseaseStatus;
  onChange: (data: Partial<DiseaseStatus>) => void;
  onSave: () => void;
  validation?: Record<keyof DiseaseStatus, FieldValidation>;
  isLoading?: boolean;
}

const PRIMARY_DIAGNOSES = [
  "Breast Cancer",
  "Colorectal Cancer",
  "Lung Cancer",
  "Prostate Cancer",
  "Ovarian Cancer",
  "Lymphoma",
  "Leukemia",
  "Melanoma",
  "Other"
] as const;

const HISTOLOGY_MUTATIONS = [
  "HER2 Positive",
  "KRAS Mutant",
  "EGFR Mutant",
  "ALK Rearrangement",
  "MSI-High",
  "PD-L1 Positive",
  "BRAF V600E",
  "TP53 Mutant",
  "Other"
] as const;

// Field component with validation
const ValidatedField: React.FC<{
  label: string;
  error?: string;
  warning?: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, error, warning, required, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-sm text-red-600 flex items-center">
        <span className="mr-1">⚠️</span>
        {error}
      </p>
    )}
    {warning && !error && (
      <p className="text-sm text-amber-600 flex items-center">
        <span className="mr-1">⚠️</span>
        {warning}
      </p>
    )}
  </div>
);

export const DiseaseStatusTab: React.FC<DiseaseStatusTabProps> = ({
  data,
  onChange,
  onSave,
  validation = {} as Record<keyof DiseaseStatus, FieldValidation>,
  isLoading = false
}) => {
  const handleFieldChange = (field: keyof DiseaseStatus, value: string) => {
    onChange({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Diagnosis */}
        <ValidatedField
          label="Primary Diagnosis"
          required
          error={validation.primaryDiagnosis?.error}
          warning={validation.primaryDiagnosis?.warning}
        >
          <select 
            value={data.primaryDiagnosis} 
            onChange={(e) => handleFieldChange('primaryDiagnosis', e.target.value)} 
            className={`w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              validation.primaryDiagnosis?.error ? 'border-red-500' : ''
            }`}
            aria-label="Primary Diagnosis"
            disabled={isLoading}
          >
            <option value="">Select Primary Diagnosis</option>
            {PRIMARY_DIAGNOSES.map((diagnosis) => (
              <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
            ))}
          </select>
        </ValidatedField>

        {/* Other Primary Diagnosis - Conditional */}
        {data.primaryDiagnosis === 'Other' && (
          <ValidatedField
            label="Specify Other Diagnosis"
            required
            error={validation.otherPrimaryDiagnosis?.error}
            warning={validation.otherPrimaryDiagnosis?.warning}
          >
            <input
              type="text"
              value={data.otherPrimaryDiagnosis || ''}
              onChange={(e) => handleFieldChange('otherPrimaryDiagnosis', e.target.value)}
              placeholder="Specify Other Primary Diagnosis"
              className={`w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                validation.otherPrimaryDiagnosis?.error ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
          </ValidatedField>
        )}

        {/* Stage at Diagnosis */}
        <ValidatedField
          label="Stage at Diagnosis"
          required
          error={validation.stageAtDiagnosis?.error}
          warning={validation.stageAtDiagnosis?.warning}
        >
          <select 
            value={data.stageAtDiagnosis} 
            onChange={(e) => handleFieldChange('stageAtDiagnosis', e.target.value as StageType)} 
            className={`input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              validation.stageAtDiagnosis?.error ? 'border-red-500' : ''
            }`}
            aria-label="Stage at Diagnosis"
            disabled={isLoading}
          >
            <option value="">Select Stage</option>
            <option value="I">Stage I</option>
            <option value="II">Stage II</option>
            <option value="III">Stage III</option>
            <option value="IV">Stage IV</option>
          </select>
        </ValidatedField>

        {/* Histology/Mutation */}
        <ValidatedField
          label="Histology/Mutation"
          error={validation.histologyMutation?.error}
          warning={validation.histologyMutation?.warning}
        >
          <select 
            value={data.histologyMutation} 
            onChange={(e) => handleFieldChange('histologyMutation', e.target.value)} 
            className={`w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              validation.histologyMutation?.error ? 'border-red-500' : ''
            }`}
            aria-label="Histology or Mutation"
            disabled={isLoading}
          >
            <option value="">Select Histology/Mutation</option>
            {HISTOLOGY_MUTATIONS.map((mutation) => (
              <option key={mutation} value={mutation}>{mutation}</option>
            ))}
          </select>
        </ValidatedField>

        {/* Other Histology/Mutation - Conditional */}
        {data.histologyMutation === 'Other' && (
          <ValidatedField
            label="Specify Other Mutation"
            required
            error={validation.otherHistologyMutation?.error}
            warning={validation.otherHistologyMutation?.warning}
          >
            <input
              type="text"
              value={data.otherHistologyMutation || ''}
              onChange={(e) => handleFieldChange('otherHistologyMutation', e.target.value)}
              placeholder="Specify Other Histology/Mutation"
              className={`w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                validation.otherHistologyMutation?.error ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
          </ValidatedField>
        )}

        {/* Date of Diagnosis */}
        <ValidatedField
          label="Date of Diagnosis"
          required
          error={validation.dateOfDiagnosis?.error}
          warning={validation.dateOfDiagnosis?.warning}
        >
          <input 
            type="date" 
            value={data.dateOfDiagnosis} 
            onChange={(e) => handleFieldChange('dateOfDiagnosis', e.target.value)} 
            className={`input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
              validation.dateOfDiagnosis?.error ? 'border-red-500' : ''
            }`}
            aria-label="Date of Diagnosis"
            disabled={isLoading}
            max={new Date().toISOString().split('T')[0]} // Prevent future dates
          />
        </ValidatedField>
        
        {/* Disease Notes */}
        <div className="md:col-span-2">
          <ValidatedField
            label="Disease Notes"
            error={validation.diseaseNotes?.error}
            warning={validation.diseaseNotes?.warning}
          >
            <textarea 
              value={data.diseaseNotes || ''} 
              onChange={(e) => handleFieldChange('diseaseNotes', e.target.value)} 
              placeholder="Additional disease notes, pathology details, staging information..." 
              rows={4} 
              className={`textarea-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                validation.diseaseNotes?.error ? 'border-red-500' : ''
              }`}
              disabled={isLoading}
            />
          </ValidatedField>
        </div>
      </form>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <button 
          type="button" 
          onClick={onSave} 
          disabled={isLoading}
          className={`save-button bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <span className="mr-2">💾</span>
              Save Disease Status
            </>
          )}
        </button>
      </div>
    </div>
  );
};