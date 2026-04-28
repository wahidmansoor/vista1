/**
 * Disease Status Tab Component
 * Handles primary diagnosis, stage, biomarkers, and related data entry
 */

import React from 'react';
import {
  DiseaseStatus,
  FieldValidation,
  StageType,
  PatientBiomarker,
  BiomarkerStatus
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

const HISTOLOGIES = [
  "Adenocarcinoma",
  "Squamous Cell Carcinoma",
  "Large Cell Carcinoma",
  "Ductal Carcinoma",
  "Lobular Carcinoma",
  "Serous Carcinoma",
  "Clear Cell Carcinoma",
  "Small Cell Carcinoma",
  "Other"
] as const;

const BIOMARKER_NAMES = [
  "HER2",
  "ER",
  "PR",
  "EGFR",
  "ALK",
  "ROS1",
  "BRAF",
  "KRAS",
  "NRAS",
  "MSI",
  "PD-L1",
  "BRCA1",
  "BRCA2"
] as const;

const BIOMARKER_STATUSES: BiomarkerStatus[] = [
  "Positive",
  "Negative",
  "Mutant",
  "Wild-type",
  "Amplified",
  "Non-amplified",
  "High",
  "Low",
  "Unknown"
];

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
  const handleFieldChange = (field: keyof DiseaseStatus, value: any) => {
    onChange({ [field]: value });
  };

  const handleAddBiomarker = () => {
    const newBiomarker: PatientBiomarker = { name: '', status: 'Unknown' };
    handleFieldChange('biomarkers', [...(data.biomarkers || []), newBiomarker]);
  };

  const handleUpdateBiomarker = (index: number, updates: Partial<PatientBiomarker>) => {
    const updated = [...(data.biomarkers || [])];
    updated[index] = { ...updated[index], ...updates };
    handleFieldChange('biomarkers', updated);
  };

  const handleRemoveBiomarker = (index: number) => {
    handleFieldChange('biomarkers', data.biomarkers.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValidatedField
          label="Primary Diagnosis"
          required
          error={validation.primaryDiagnosis?.error}
          warning={validation.primaryDiagnosis?.warning}
        >
          <select 
            value={data.primaryDiagnosis} 
            onChange={(e) => handleFieldChange('primaryDiagnosis', e.target.value)} 
            className={`w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${validation.primaryDiagnosis?.error ? 'border-red-500' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select Primary Diagnosis</option>
            {PRIMARY_DIAGNOSES.map((diagnosis) => (
              <option key={diagnosis} value={diagnosis}>{diagnosis}</option>
            ))}
          </select>
        </ValidatedField>

        <ValidatedField
          label="Histology"
          error={validation.histology?.error}
          warning={validation.histology?.warning}
        >
          <select 
            value={data.histology || ''} 
            onChange={(e) => handleFieldChange('histology', e.target.value)} 
            className="w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200"
            disabled={isLoading}
            title="Histology"
          >
            <option value="">Select Histology</option>
            {HISTOLOGIES.map((hist) => (
              <option key={hist} value={hist}>{hist}</option>
            ))}
          </select>
        </ValidatedField>

        <ValidatedField
          label="Stage at Diagnosis"
          required
          error={validation.stageAtDiagnosis?.error}
          warning={validation.stageAtDiagnosis?.warning}
        >
          <select 
            value={data.stageAtDiagnosis} 
            onChange={(e) => handleFieldChange('stageAtDiagnosis', e.target.value as StageType)} 
            className={`w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${validation.stageAtDiagnosis?.error ? 'border-red-500' : ''}`}
            disabled={isLoading}
          >
            <option value="">Select Stage</option>
            <option value="I">Stage I</option>
            <option value="II">Stage II</option>
            <option value="III">Stage III</option>
            <option value="IV">Stage IV</option>
          </select>
        </ValidatedField>

        <div className="md:col-span-2 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-semibold text-gray-700 dark:text-gray-300">Biomarkers & Mutations</h5>
            <button 
              type="button" 
              onClick={handleAddBiomarker}
              className="text-xs bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition"
            >
              + Add Biomarker
            </button>
          </div>
          
          <div className="space-y-3">
            {data.biomarkers?.map((bm, index) => (
              <div key={index} className="flex flex-wrap gap-3 items-center p-3 bg-white dark:bg-gray-800 rounded shadow-sm">
                <select 
                  value={bm.name}
                  onChange={(e) => handleUpdateBiomarker(index, { name: e.target.value })}
                  className="input-field text-sm flex-1 min-w-[120px]"
                >
                  <option value="">Select Marker</option>
                  {BIOMARKER_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
                <select 
                  value={bm.status}
                  onChange={(e) => handleUpdateBiomarker(index, { status: e.target.value as BiomarkerStatus })}
                  className="input-field text-sm flex-1 min-w-[120px]"
                >
                  {BIOMARKER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                </select>
                <button 
                  type="button"
                  onClick={() => handleRemoveBiomarker(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  🗑️
                </button>
              </div>
            ))}
            {(!data.biomarkers || data.biomarkers.length === 0) && (
              <p className="text-xs text-gray-400 italic text-center py-2">No biomarkers added</p>
            )}
          </div>
        </div>

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
            className={`w-full input-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${validation.dateOfDiagnosis?.error ? 'border-red-500' : ''}`}
            disabled={isLoading}
            max={new Date().toISOString().split('T')[0]}
          />
        </ValidatedField>
        
        <div className="md:col-span-2">
          <ValidatedField
            label="Disease Notes"
            error={validation.diseaseNotes?.error}
            warning={validation.diseaseNotes?.warning}
          >
            <textarea 
              value={data.diseaseNotes || ''} 
              onChange={(e) => handleFieldChange('diseaseNotes', e.target.value)} 
              placeholder="Additional disease notes..." 
              rows={4} 
              className={`w-full textarea-field focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${validation.diseaseNotes?.error ? 'border-red-500' : ''}`}
              disabled={isLoading}
            />
          </ValidatedField>
        </div>
      </form>

      <div className="flex justify-end mt-6">
        <button 
          type="button" 
          onClick={onSave} 
          disabled={isLoading}
          className={`save-button bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
        >
          {isLoading ? "Saving..." : "Save Disease Status"}
        </button>
      </div>
    </div>
  );
};
