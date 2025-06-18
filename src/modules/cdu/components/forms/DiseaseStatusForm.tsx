/**
 * Disease Status Form Component
 * Handles disease-related information input and validation
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Info } from 'lucide-react';
import {
  DiseaseStatus,
  ValidationResult,
  CancerType,
  OrganSystem,
  RiskLevel
} from '../../engine/models';
import { FormValidators, ValidationUtils } from '../../utils/validators';

interface DiseaseStatusFormProps {
  data: DiseaseStatus;
  onChange: (updates: Partial<DiseaseStatus>) => void;
  onSave: () => Promise<void>;
  validation?: ValidationResult;
  isLoading?: boolean;
}

const DiseaseStatusForm: React.FC<DiseaseStatusFormProps> = ({
  data,
  onChange,
  onSave,
  validation,
  isLoading = false
}) => {
  const [localValidation, setLocalValidation] = useState<ValidationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Use provided validation or generate local validation
  const currentValidation = validation || localValidation;

  // Validate form when data changes
  useEffect(() => {
    if (!validation) {
      const result = FormValidators.validateDiseaseStatus(data);
      setLocalValidation(result);
    }
  }, [data, validation]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
    } catch (error) {
      console.error('Error saving disease status:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const getFieldState = (fieldName: string) => {
    return currentValidation ? ValidationUtils.getFieldState(currentValidation, fieldName) : 'default';
  };

  const getFieldErrors = (fieldName: string) => {
    return currentValidation ? ValidationUtils.getFieldErrors(currentValidation, fieldName) : [];
  };

  const getFieldWarnings = (fieldName: string) => {
    return currentValidation ? ValidationUtils.getFieldWarnings(currentValidation, fieldName) : [];
  };

  const renderFieldMessages = (fieldName: string) => {
    const errors = getFieldErrors(fieldName);
    const warnings = getFieldWarnings(fieldName);

    return (
      <>
        {errors.map((error, index) => (
          <div key={`error-${index}`} className="flex items-center gap-1 mt-1 text-sm text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4" />
            <span>{error.message}</span>
          </div>
        ))}
        {warnings.map((warning, index) => (
          <div key={`warning-${index}`} className="flex items-center gap-1 mt-1 text-sm text-amber-600 dark:text-amber-400">
            <Info className="w-4 h-4" />
            <span>{warning.message}</span>
            {warning.recommendation && (
              <span className="text-xs text-gray-500">({warning.recommendation})</span>
            )}
          </div>
        ))}
      </>
    );
  };

  const getInputClassName = (fieldName: string) => {
    const state = getFieldState(fieldName);
    const baseClasses = "w-full px-4 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 transition-all duration-200";
    
    switch (state) {
      case 'error':
        return `${baseClasses} border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/10 focus:ring-red-500 focus:border-red-500`;
      case 'warning':
        return `${baseClasses} border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/10 focus:ring-amber-500 focus:border-amber-500`;
      case 'success':
        return `${baseClasses} border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10 focus:ring-green-500 focus:border-green-500`;
      default:
        return `${baseClasses} border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      {currentValidation && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Form Completion</span>
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
              {currentValidation.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${currentValidation.completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Primary Diagnosis */}
        <div className="md:col-span-2">
          <label htmlFor="primaryDiagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Diagnosis *
          </label>
          <select
            id="primaryDiagnosis"
            value={data.primaryDiagnosis || ''}
            onChange={(e) => onChange({ primaryDiagnosis: e.target.value })}
            className={getInputClassName('primaryDiagnosis')}
            disabled={isLoading}
          >
            <option value="">Select Primary Diagnosis</option>
            {Object.values(CancerType).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
          {renderFieldMessages('primaryDiagnosis')}
        </div>

        {/* Other Primary Diagnosis */}
        {data.primaryDiagnosis === 'Other' && (
          <div className="md:col-span-2">
            <label htmlFor="otherPrimaryDiagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Specify Other Diagnosis *
            </label>
            <input
              type="text"
              id="otherPrimaryDiagnosis"
              value={data.otherPrimaryDiagnosis || ''}
              onChange={(e) => onChange({ otherPrimaryDiagnosis: e.target.value })}
              placeholder="Enter specific cancer type"
              className={getInputClassName('otherPrimaryDiagnosis')}
              disabled={isLoading}
            />
            {renderFieldMessages('otherPrimaryDiagnosis')}
          </div>
        )}

        {/* Stage at Diagnosis */}
        <div>
          <label htmlFor="stageAtDiagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Stage at Diagnosis *
          </label>
          <select
            id="stageAtDiagnosis"
            value={data.stageAtDiagnosis || ''}
            onChange={(e) => onChange({ stageAtDiagnosis: e.target.value })}
            className={getInputClassName('stageAtDiagnosis')}
            disabled={isLoading}
          >
            <option value="">Select Stage</option>
            <option value="0">Stage 0 (In situ)</option>
            <option value="I">Stage I</option>
            <option value="II">Stage II</option>
            <option value="III">Stage III</option>
            <option value="IV">Stage IV</option>
            <option value="Limited">Limited (SCLC)</option>
            <option value="Extensive">Extensive (SCLC)</option>
            <option value="Early">Early Stage</option>
            <option value="Advanced">Advanced Stage</option>
            <option value="Metastatic">Metastatic</option>
            <option value="Recurrent">Recurrent</option>
          </select>
          {renderFieldMessages('stageAtDiagnosis')}
        </div>

        {/* Date of Diagnosis */}
        <div>
          <label htmlFor="dateOfDiagnosis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date of Diagnosis *
          </label>
          <input
            type="date"
            id="dateOfDiagnosis"
            value={data.dateOfDiagnosis || ''}
            onChange={(e) => onChange({ dateOfDiagnosis: e.target.value })}
            className={getInputClassName('dateOfDiagnosis')}
            disabled={isLoading}
          />
          {renderFieldMessages('dateOfDiagnosis')}
        </div>

        {/* Organ System */}
        <div>
          <label htmlFor="organSystem" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Organ System
          </label>
          <select
            id="organSystem"
            value={data.organSystem || ''}
            onChange={(e) => onChange({ organSystem: e.target.value as OrganSystem })}
            className={getInputClassName('organSystem')}
            disabled={isLoading}
          >
            <option value="">Select Organ System</option>
            {Object.values(OrganSystem).map((system) => (
              <option key={system} value={system}>
                {system.charAt(0).toUpperCase() + system.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
          {renderFieldMessages('organSystem')}
        </div>

        {/* Risk Stratification */}
        <div>
          <label htmlFor="riskStratification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Risk Stratification
          </label>
          <select
            id="riskStratification"
            value={data.riskStratification || ''}
            onChange={(e) => onChange({ riskStratification: e.target.value as RiskLevel })}
            className={getInputClassName('riskStratification')}
            disabled={isLoading}
          >
            <option value="">Select Risk Level</option>
            <option value={RiskLevel.LOW}>Low Risk</option>
            <option value={RiskLevel.INTERMEDIATE}>Intermediate Risk</option>
            <option value={RiskLevel.HIGH}>High Risk</option>
            <option value={RiskLevel.VERY_HIGH}>Very High Risk</option>
          </select>
          {renderFieldMessages('riskStratification')}
        </div>

        {/* Histology/Mutation */}
        <div className="md:col-span-2">
          <label htmlFor="histologyMutation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Histology/Mutation Details
          </label>
          <input
            type="text"
            id="histologyMutation"
            value={data.histologyMutation || ''}
            onChange={(e) => onChange({ histologyMutation: e.target.value })}
            placeholder="e.g., Adenocarcinoma, EGFR mutation, HER2 positive"
            className={getInputClassName('histologyMutation')}
            disabled={isLoading}
          />
          {renderFieldMessages('histologyMutation')}
        </div>

        {/* Cell Type */}
        <div>
          <label htmlFor="cellType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cell Type
          </label>
          <input
            type="text"
            id="cellType"
            value={data.cellType || ''}
            onChange={(e) => onChange({ cellType: e.target.value })}
            placeholder="e.g., Squamous cell, Adenocarcinoma"
            className={getInputClassName('cellType')}
            disabled={isLoading}
          />
          {renderFieldMessages('cellType')}
        </div>

        {/* Grade/Differentiation */}
        <div>
          <label htmlFor="gradeDifferentiation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Grade/Differentiation
          </label>
          <select
            id="gradeDifferentiation"
            value={data.gradeDifferentiation || ''}
            onChange={(e) => onChange({ gradeDifferentiation: e.target.value })}
            className={getInputClassName('gradeDifferentiation')}
            disabled={isLoading}
          >
            <option value="">Select Grade</option>
            <option value="G1">G1 - Well differentiated</option>
            <option value="G2">G2 - Moderately differentiated</option>
            <option value="G3">G3 - Poorly differentiated</option>
            <option value="G4">G4 - Undifferentiated</option>
            <option value="GX">GX - Cannot be assessed</option>
          </select>
          {renderFieldMessages('gradeDifferentiation')}
        </div>

        {/* Disease Notes */}
        <div className="md:col-span-2">
          <label htmlFor="diseaseNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Disease Notes
          </label>
          <textarea
            id="diseaseNotes"
            value={data.diseaseNotes || ''}
            onChange={(e) => onChange({ diseaseNotes: e.target.value })}
            placeholder="Additional clinical notes, pathology details, staging information..."
            rows={4}
            className={getInputClassName('diseaseNotes')}
            disabled={isLoading}
          />
          {renderFieldMessages('diseaseNotes')}
        </div>
      </form>

      {/* Action Bar */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {currentValidation?.isValid && (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <Check className="w-4 h-4" />
              <span className="text-sm">All required fields completed</span>
            </div>
          )}
          {currentValidation && !currentValidation.isValid && (
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">
                {currentValidation.errors.length} error(s) need attention
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {(isLoading || isSaving) ? (
            <>
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Disease Status</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default DiseaseStatusForm;
