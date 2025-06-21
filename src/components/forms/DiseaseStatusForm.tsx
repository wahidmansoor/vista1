/**
 * Disease Status Form Component
 * Handles disease-related information input with validation
 */

import React, { useState } from 'react';
import {
  DiseaseStatus,
  CancerType,
  OrganSystem,
  RiskLevel,
  Biomarker,
  GeneticMutation
} from '../../modules/cdu/engine/models';

interface DiseaseStatusFormProps {
  diseaseStatus: DiseaseStatus;
  onUpdate: (diseaseStatus: DiseaseStatus) => void;
  errors?: Record<string, string>;
}

export const DiseaseStatusForm: React.FC<DiseaseStatusFormProps> = ({
  diseaseStatus,
  onUpdate,
  errors = {}
}) => {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...localErrors };
    
    switch (field) {
      case 'primaryDiagnosis':
        if (!value.trim()) {
          newErrors[field] = 'Primary diagnosis is required';
        } else {
          delete newErrors[field];
        }
        break;
      case 'stageAtDiagnosis':
        if (!value.trim()) {
          newErrors[field] = 'Stage at diagnosis is required';
        } else {
          delete newErrors[field];
        }
        break;
      case 'dateOfDiagnosis':
        if (!value) {
          newErrors[field] = 'Date of diagnosis is required';
        } else if (new Date(value) > new Date()) {
          newErrors[field] = 'Date cannot be in the future';
        } else {
          delete newErrors[field];
        }
        break;
      default:
        break;
    }

    setLocalErrors(newErrors);
  };

  const handleInputChange = (field: keyof DiseaseStatus, value: string | OrganSystem | RiskLevel) => {
    const updatedStatus = { ...diseaseStatus, [field]: value };
    onUpdate(updatedStatus);
  };

  const handleBiomarkerAdd = () => {
const newBiomarker = {
      name: '',
      value: '',
      testDate: new Date().toISOString().split('T')[0],
      unit: '',
      referenceRange: '',
      significance: ''
    };
    
    const updatedBiomarkers = [...(diseaseStatus.biomarkers || []), newBiomarker];
    onUpdate({ ...diseaseStatus, biomarkers: updatedBiomarkers });
  };

  const handleBiomarkerUpdate = (index: number, field: keyof Biomarker, value: string) => {
    const updatedBiomarkers = [...(diseaseStatus.biomarkers || [])];
    updatedBiomarkers[index] = { ...updatedBiomarkers[index], [field]: value };
    onUpdate({ ...diseaseStatus, biomarkers: updatedBiomarkers });
  };
  const handleBiomarkerRemove = (index: number) => {
    const updatedBiomarkers = diseaseStatus.biomarkers?.filter((_: Biomarker, i: number) => i !== index) || [];
    onUpdate({ ...diseaseStatus, biomarkers: updatedBiomarkers });
  };

  const fieldError = (field: string) => errors[field] || localErrors[field];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Disease Status Information</h3>
        <p className="text-sm text-gray-600 mt-1">
          Enter detailed information about the patient's cancer diagnosis and current status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Diagnosis */}
        <div className="col-span-2">
          <label htmlFor="primaryDiagnosis" className="block text-sm font-medium text-gray-700 mb-2">
            Primary Diagnosis *
          </label>
          <input
            type="text"
            id="primaryDiagnosis"
            value={diseaseStatus.primaryDiagnosis}
            onChange={(e) => handleInputChange('primaryDiagnosis', e.target.value)}
            onBlur={(e) => validateField('primaryDiagnosis', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              fieldError('primaryDiagnosis') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Invasive ductal carcinoma of the breast"
          />
          {fieldError('primaryDiagnosis') && (
            <p className="mt-1 text-sm text-red-600">{fieldError('primaryDiagnosis')}</p>
          )}
        </div>

        {/* Other Primary Diagnosis */}
        <div className="col-span-2">
          <label htmlFor="otherPrimaryDiagnosis" className="block text-sm font-medium text-gray-700 mb-2">
            Other Primary Diagnosis
          </label>
          <input
            type="text"
            id="otherPrimaryDiagnosis"
            value={diseaseStatus.otherPrimaryDiagnosis || ''}
            onChange={(e) => handleInputChange('otherPrimaryDiagnosis', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Additional primary diagnoses, if any"
          />
        </div>

        {/* Stage at Diagnosis */}
        <div>
          <label htmlFor="stageAtDiagnosis" className="block text-sm font-medium text-gray-700 mb-2">
            Stage at Diagnosis *
          </label>
          <input
            type="text"
            id="stageAtDiagnosis"
            value={diseaseStatus.stageAtDiagnosis}
            onChange={(e) => handleInputChange('stageAtDiagnosis', e.target.value)}
            onBlur={(e) => validateField('stageAtDiagnosis', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              fieldError('stageAtDiagnosis') ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., T2N1M0, Stage IIB"
          />
          {fieldError('stageAtDiagnosis') && (
            <p className="mt-1 text-sm text-red-600">{fieldError('stageAtDiagnosis')}</p>
          )}
        </div>

        {/* Date of Diagnosis */}
        <div>
          <label htmlFor="dateOfDiagnosis" className="block text-sm font-medium text-gray-700 mb-2">
            Date of Diagnosis *
          </label>
          <input
            type="date"
            id="dateOfDiagnosis"
            value={diseaseStatus.dateOfDiagnosis}
            onChange={(e) => handleInputChange('dateOfDiagnosis', e.target.value)}
            onBlur={(e) => validateField('dateOfDiagnosis', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              fieldError('dateOfDiagnosis') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldError('dateOfDiagnosis') && (
            <p className="mt-1 text-sm text-red-600">{fieldError('dateOfDiagnosis')}</p>
          )}
        </div>

        {/* Histology/Mutation */}
        <div>
          <label htmlFor="histologyMutation" className="block text-sm font-medium text-gray-700 mb-2">
            Histology/Mutation
          </label>
          <input
            type="text"
            id="histologyMutation"
            value={diseaseStatus.histologyMutation || ''}
            onChange={(e) => handleInputChange('histologyMutation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., ER+/PR+/HER2-, IDH1 mutant"
          />
        </div>

        {/* Organ System */}
        <div>
          <label htmlFor="organSystem" className="block text-sm font-medium text-gray-700 mb-2">
            Organ System
          </label>
          <select
            id="organSystem"
            value={diseaseStatus.organSystem || ''}
            onChange={(e) => handleInputChange('organSystem', e.target.value as OrganSystem)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select organ system</option>            {Object.values(OrganSystem).map((system: string) => (
              <option key={system} value={system}>
                {system.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Cell Type */}
        <div>
          <label htmlFor="cellType" className="block text-sm font-medium text-gray-700 mb-2">
            Cell Type
          </label>
          <input
            type="text"
            id="cellType"
            value={diseaseStatus.cellType || ''}
            onChange={(e) => handleInputChange('cellType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Adenocarcinoma, Squamous cell carcinoma"
          />
        </div>

        {/* Grade/Differentiation */}
        <div>
          <label htmlFor="gradeDifferentiation" className="block text-sm font-medium text-gray-700 mb-2">
            Grade/Differentiation
          </label>
          <input
            type="text"
            id="gradeDifferentiation"
            value={diseaseStatus.gradeDifferentiation || ''}
            onChange={(e) => handleInputChange('gradeDifferentiation', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., Grade 2, Well differentiated"
          />
        </div>

        {/* Risk Stratification */}
        <div>
          <label htmlFor="riskStratification" className="block text-sm font-medium text-gray-700 mb-2">
            Risk Stratification
          </label>
          <select
            id="riskStratification"
            value={diseaseStatus.riskStratification || ''}
            onChange={(e) => handleInputChange('riskStratification', e.target.value as RiskLevel)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select risk level</option>            {Object.values(RiskLevel).map((level: string) => (
              <option key={level} value={level}>
                {level.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        {/* Disease Notes */}
        <div className="col-span-2">
          <label htmlFor="diseaseNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Disease Notes
          </label>
          <textarea
            id="diseaseNotes"
            rows={3}
            value={diseaseStatus.diseaseNotes || ''}
            onChange={(e) => handleInputChange('diseaseNotes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Additional notes about the disease status, pathology findings, etc."
          />
        </div>
      </div>

      {/* Biomarkers Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium text-gray-900">Biomarkers</h4>
          <button
            type="button"
            onClick={handleBiomarkerAdd}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Biomarker
          </button>
        </div>

        {diseaseStatus.biomarkers && diseaseStatus.biomarkers.length > 0 && (
          <div className="space-y-4">
            {diseaseStatus.biomarkers.map((biomarker: Biomarker, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biomarker Name
                    </label>
                    <input
                      type="text"
                      value={biomarker.name}
                      onChange={(e) => handleBiomarkerUpdate(index, 'name', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., PD-L1, ER"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <input
                      type="text"
                      value={biomarker.value}
                      onChange={(e) => handleBiomarkerUpdate(index, 'value', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., 80%, Positive"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Test Date
                    </label>
                    <input
                      type="date"
                      value={biomarker.testDate}
                      onChange={(e) => handleBiomarkerUpdate(index, 'testDate', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleBiomarkerRemove(index)}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
