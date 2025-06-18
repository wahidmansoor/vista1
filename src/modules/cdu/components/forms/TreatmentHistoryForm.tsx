/**
 * Treatment History Form Component
 * Handles treatment line data input and validation
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Info, Pill, Calendar, TrendingUp } from 'lucide-react';
import {
  TreatmentLineData,
  ValidationResult,
  TreatmentLine,
  TreatmentResponse
} from '../../engine/models';
import { FormValidators, ValidationUtils } from '../../utils/validators';

interface TreatmentHistoryFormProps {
  data: TreatmentLineData;
  onChange: (updates: Partial<TreatmentLineData>) => void;
  onSave: () => Promise<void>;
  validation?: ValidationResult;
  isLoading?: boolean;
}

const TreatmentHistoryForm: React.FC<TreatmentHistoryFormProps> = ({
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
      const result = FormValidators.validateTreatmentLineData(data);
      setLocalValidation(result);
    }
  }, [data, validation]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
    } catch (error) {
      console.error('Error saving treatment history:', error);
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
              <span className="text-xs text-gray-500 block mt-1">({warning.recommendation})</span>
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

  // Calculate treatment duration
  const calculateDuration = () => {
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;
      
      if (weeks > 0) {
        return `${weeks} week${weeks > 1 ? 's' : ''}${days > 0 ? ` ${days} day${days > 1 ? 's' : ''}` : ''}`;
      } else {
        return `${days} day${days > 1 ? 's' : ''}`;
      }
    }
    return null;
  };

  const duration = calculateDuration();

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

      <form className="space-y-6">
        {/* Treatment Information */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Treatment Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Treatment Line */}
            <div>
              <label htmlFor="treatmentLine" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Treatment Line *
              </label>
              <select
                id="treatmentLine"
                value={data.treatmentLine || ''}
                onChange={(e) => onChange({ treatmentLine: e.target.value as TreatmentLine })}
                className={getInputClassName('treatmentLine')}
                disabled={isLoading}
              >
                <option value="">Select Treatment Line</option>
                <option value={TreatmentLine.FIRST_LINE}>1st Line</option>
                <option value={TreatmentLine.SECOND_LINE}>2nd Line</option>
                <option value={TreatmentLine.THIRD_LINE}>3rd Line</option>
                <option value={TreatmentLine.FOURTH_LINE}>4th Line</option>
                <option value={TreatmentLine.MAINTENANCE}>Maintenance</option>
                <option value={TreatmentLine.SALVAGE}>Salvage</option>
              </select>
              {renderFieldMessages('treatmentLine')}
            </div>

            {/* Treatment Regimen */}
            <div>
              <label htmlFor="treatmentRegimen" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Treatment Regimen *
              </label>
              <input
                type="text"
                id="treatmentRegimen"
                value={data.treatmentRegimen || ''}
                onChange={(e) => onChange({ treatmentRegimen: e.target.value })}
                placeholder="e.g., FOLFOX, Carboplatin/Paclitaxel, Pembrolizumab"
                className={getInputClassName('treatmentRegimen')}
                disabled={isLoading}
              />
              {renderFieldMessages('treatmentRegimen')}
            </div>
          </div>
        </div>

        {/* Treatment Timeline */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Treatment Timeline
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="startDate"
                value={data.startDate || ''}
                onChange={(e) => onChange({ startDate: e.target.value })}
                className={getInputClassName('startDate')}
                disabled={isLoading}
              />
              {renderFieldMessages('startDate')}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={data.endDate || ''}
                onChange={(e) => onChange({ endDate: e.target.value })}
                className={getInputClassName('endDate')}
                disabled={isLoading}
              />
              {renderFieldMessages('endDate')}
              
              {!data.endDate && (
                <div className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                  Leave empty if treatment is ongoing
                </div>
              )}
            </div>
          </div>

          {/* Duration Display */}
          {duration && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Treatment Duration: {duration}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Treatment Response */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Treatment Response
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Treatment Response */}
            <div>
              <label htmlFor="treatmentResponse" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Treatment Response
              </label>
              <select
                id="treatmentResponse"
                value={data.treatmentResponse || ''}
                onChange={(e) => onChange({ treatmentResponse: e.target.value as TreatmentResponse })}
                className={getInputClassName('treatmentResponse')}
                disabled={isLoading}
              >
                <option value="">Select Response</option>
                <option value={TreatmentResponse.COMPLETE_RESPONSE}>Complete Response (CR)</option>
                <option value={TreatmentResponse.PARTIAL_RESPONSE}>Partial Response (PR)</option>
                <option value={TreatmentResponse.STABLE_DISEASE}>Stable Disease (SD)</option>
                <option value={TreatmentResponse.PROGRESSIVE_DISEASE}>Progressive Disease (PD)</option>
                <option value={TreatmentResponse.NOT_EVALUABLE}>Not Evaluable (NE)</option>
              </select>
              {renderFieldMessages('treatmentResponse')}
            </div>

            {/* Reason for Discontinuation */}
            <div>
              <label htmlFor="reasonForDiscontinuation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Discontinuation
              </label>
              <select
                id="reasonForDiscontinuation"
                value={data.reasonForDiscontinuation || ''}
                onChange={(e) => onChange({ reasonForDiscontinuation: e.target.value })}
                className={getInputClassName('reasonForDiscontinuation')}
                disabled={isLoading}
              >
                <option value="">Select Reason</option>
                <option value="Progressive Disease">Progressive Disease</option>
                <option value="Toxicity">Toxicity</option>
                <option value="Patient Preference">Patient Preference</option>
                <option value="Complete Response">Complete Response</option>
                <option value="Surgery">Surgery</option>
                <option value="Other">Other</option>
              </select>
              {renderFieldMessages('reasonForDiscontinuation')}
            </div>
          </div>

          {/* Response Description */}
          {data.treatmentResponse && (
            <div className="mt-4 p-3 rounded-lg">
              {data.treatmentResponse === TreatmentResponse.COMPLETE_RESPONSE && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>Complete Response (CR):</strong> Disappearance of all target lesions and normalization of tumor markers
                  </p>
                </div>
              )}
              {data.treatmentResponse === TreatmentResponse.PARTIAL_RESPONSE && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Partial Response (PR):</strong> At least 30% decrease in sum of diameters of target lesions
                  </p>
                </div>
              )}
              {data.treatmentResponse === TreatmentResponse.STABLE_DISEASE && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Stable Disease (SD):</strong> Neither sufficient shrinkage to qualify for PR nor sufficient increase to qualify for PD
                  </p>
                </div>
              )}
              {data.treatmentResponse === TreatmentResponse.PROGRESSIVE_DISEASE && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    <strong>Progressive Disease (PD):</strong> At least 20% increase in sum of diameters or appearance of new lesions
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Treatment Notes */}
        <div>
          <label htmlFor="treatmentNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Treatment Notes
          </label>
          <textarea
            id="treatmentNotes"
            value={data.treatmentNotes || ''}
            onChange={(e) => onChange({ treatmentNotes: e.target.value })}
            placeholder="Additional notes about treatment tolerability, dose modifications, concurrent medications, patient compliance..."
            rows={4}
            className={getInputClassName('treatmentNotes')}
            disabled={isLoading}
          />
          {renderFieldMessages('treatmentNotes')}
        </div>
      </form>

      {/* Treatment Status Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Treatment Status Summary</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {data.treatmentLine || 'N/A'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Treatment Line</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {duration || 'Ongoing'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {data.treatmentResponse ? 
                data.treatmentResponse.split(' ')[0] + ' ' + data.treatmentResponse.split(' ')[1]?.charAt(0) || 
                data.treatmentResponse.split(' ')[0] 
                : 'N/A'
              }
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Response</div>
          </div>
        </div>
      </div>

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
            <span>Save Treatment History</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default TreatmentHistoryForm;
