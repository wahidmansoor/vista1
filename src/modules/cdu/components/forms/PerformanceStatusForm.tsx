/**
 * Performance Status Form Component
 * Handles performance status assessment input and validation
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Info, HelpCircle } from 'lucide-react';
import {
  PerformanceStatus,
  ValidationResult,
  PerformanceScale,
  FunctionalStatus,
  QualityOfLife
} from '../../engine/models';
import { FormValidators, ValidationUtils } from '../../utils/validators';

interface PerformanceStatusFormProps {
  data: PerformanceStatus;
  onChange: (updates: Partial<PerformanceStatus>) => void;
  onSave: () => Promise<void>;
  validation?: ValidationResult;
  isLoading?: boolean;
}

const PerformanceStatusForm: React.FC<PerformanceStatusFormProps> = ({
  data,
  onChange,
  onSave,
  validation,
  isLoading = false
}) => {
  const [localValidation, setLocalValidation] = useState<ValidationResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Use provided validation or generate local validation
  const currentValidation = validation || localValidation;

  // Validate form when data changes
  useEffect(() => {
    if (!validation) {
      const result = FormValidators.validatePerformanceStatus(data);
      setLocalValidation(result);
    }
  }, [data, validation]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
    } catch (error) {
      console.error('Error saving performance status:', error);
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

  const getECOGScoreDescription = (score: string) => {
    const descriptions = {
      '0': 'Fully active, able to carry on all pre-disease performance without restriction',
      '1': 'Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature',
      '2': 'Ambulatory and capable of all self-care but unable to carry out any work activities',
      '3': 'Capable of only limited self-care, confined to bed or chair >50% of waking hours',
      '4': 'Completely disabled, cannot carry on any self-care, totally confined to bed or chair'
    };
    return descriptions[score as keyof typeof descriptions] || '';
  };

  const getKarnofskyScoreDescription = (score: string) => {
    const karnofskyScore = parseInt(score);
    if (karnofskyScore >= 90) return 'Normal activity, minor symptoms';
    if (karnofskyScore >= 80) return 'Normal activity with effort, some symptoms';
    if (karnofskyScore >= 70) return 'Cares for self, unable to carry on normal activity';
    if (karnofskyScore >= 60) return 'Requires occasional assistance, cares for most needs';
    if (karnofskyScore >= 50) return 'Requires considerable assistance and frequent care';
    if (karnofskyScore >= 40) return 'Disabled, requires special care and assistance';
    if (karnofskyScore >= 30) return 'Severely disabled, hospitalization indicated';
    if (karnofskyScore >= 20) return 'Very sick, hospitalization necessary';
    if (karnofskyScore >= 10) return 'Moribund, fatal processes progressing rapidly';
    return 'Dead';
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
        {/* Assessment Date */}
        <div>
          <label htmlFor="assessmentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Assessment Date *
          </label>
          <input
            type="date"
            id="assessmentDate"
            value={data.assessmentDate || ''}
            onChange={(e) => onChange({ assessmentDate: e.target.value })}
            className={getInputClassName('assessmentDate')}
            disabled={isLoading}
          />
          {renderFieldMessages('assessmentDate')}
        </div>

        {/* Performance Scale */}
        <div>
          <label htmlFor="performanceScale" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance Scale *
            <button
              type="button"
              onMouseEnter={() => setShowTooltip('performanceScale')}
              onMouseLeave={() => setShowTooltip(null)}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <HelpCircle className="w-4 h-4 inline" />
            </button>
          </label>
          <select
            id="performanceScale"
            value={data.performanceScale || ''}
            onChange={(e) => onChange({ performanceScale: e.target.value as PerformanceScale })}
            className={getInputClassName('performanceScale')}
            disabled={isLoading}
          >
            <option value="">Select Scale</option>
            <option value={PerformanceScale.ECOG}>ECOG (0-4 scale)</option>
            <option value={PerformanceScale.KARNOFSKY}>Karnofsky (0-100 scale)</option>
          </select>
          {showTooltip === 'performanceScale' && (
            <div className="absolute z-10 bg-gray-800 text-white p-2 rounded text-sm mt-1 shadow-lg">
              ECOG: Eastern Cooperative Oncology Group scale (0-4)<br/>
              Karnofsky: Karnofsky Performance Status scale (0-100)
            </div>
          )}
          {renderFieldMessages('performanceScale')}
        </div>

        {/* Performance Score */}
        <div className="md:col-span-2">
          <label htmlFor="performanceScore" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance Score *
          </label>
          
          {data.performanceScale === PerformanceScale.ECOG ? (
            <div className="space-y-3">
              <select
                id="performanceScore"
                value={data.performanceScore || ''}
                onChange={(e) => onChange({ performanceScore: e.target.value })}
                className={getInputClassName('performanceScore')}
                disabled={isLoading}
              >
                <option value="">Select ECOG Score</option>
                <option value="0">0 - Fully active</option>
                <option value="1">1 - Restricted in strenuous activity</option>
                <option value="2">2 - Ambulatory but unable to work</option>
                <option value="3">3 - Limited self-care</option>
                <option value="4">4 - Completely disabled</option>
              </select>
              
              {data.performanceScore && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>ECOG {data.performanceScore}:</strong> {getECOGScoreDescription(data.performanceScore)}
                  </p>
                </div>
              )}
            </div>
          ) : data.performanceScale === PerformanceScale.KARNOFSKY ? (
            <div className="space-y-3">
              <select
                id="performanceScore"
                value={data.performanceScore || ''}
                onChange={(e) => onChange({ performanceScore: e.target.value })}
                className={getInputClassName('performanceScore')}
                disabled={isLoading}
              >
                <option value="">Select Karnofsky Score</option>
                <option value="100">100 - Normal, no complaints</option>
                <option value="90">90 - Normal activity, minor symptoms</option>
                <option value="80">80 - Normal activity with effort</option>
                <option value="70">70 - Cares for self, normal activity impossible</option>
                <option value="60">60 - Requires occasional assistance</option>
                <option value="50">50 - Requires considerable assistance</option>
                <option value="40">40 - Disabled, special care required</option>
                <option value="30">30 - Severely disabled</option>
                <option value="20">20 - Very sick</option>
                <option value="10">10 - Moribund</option>
                <option value="0">0 - Dead</option>
              </select>
              
              {data.performanceScore && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Karnofsky {data.performanceScore}:</strong> {getKarnofskyScoreDescription(data.performanceScore)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-gray-500 dark:text-gray-400">
              Please select a performance scale first
            </div>
          )}
          
          {renderFieldMessages('performanceScore')}
        </div>

        {/* Performance Notes */}
        <div className="md:col-span-2">
          <label htmlFor="performanceNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Performance Notes
          </label>
          <textarea
            id="performanceNotes"
            value={data.performanceNotes || ''}
            onChange={(e) => onChange({ performanceNotes: e.target.value })}
            placeholder="Additional notes about functional status, limitations, activities of daily living..."
            rows={4}
            className={getInputClassName('performanceNotes')}
            disabled={isLoading}
          />
          {renderFieldMessages('performanceNotes')}
        </div>
      </form>

      {/* Performance Status Guide */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Performance Status Quick Reference</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* ECOG Guide */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">ECOG Performance Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-green-600 min-w-[20px]">0</span>
                <span className="text-gray-600 dark:text-gray-400">Fully active</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-[20px]">1</span>
                <span className="text-gray-600 dark:text-gray-400">Restricted in strenuous activity</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-yellow-600 min-w-[20px]">2</span>
                <span className="text-gray-600 dark:text-gray-400">Unable to work, up &gt;50% of day</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-orange-600 min-w-[20px]">3</span>
                <span className="text-gray-600 dark:text-gray-400">Limited self-care</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-red-600 min-w-[20px]">4</span>
                <span className="text-gray-600 dark:text-gray-400">Completely disabled</span>
              </div>
            </div>
          </div>

          {/* Karnofsky Guide */}
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Karnofsky Performance Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-green-600 min-w-[40px]">90-100</span>
                <span className="text-gray-600 dark:text-gray-400">Normal activity</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-[40px]">70-80</span>
                <span className="text-gray-600 dark:text-gray-400">Independent, some difficulty</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-yellow-600 min-w-[40px]">50-60</span>
                <span className="text-gray-600 dark:text-gray-400">Requires assistance</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-orange-600 min-w-[40px]">30-40</span>
                <span className="text-gray-600 dark:text-gray-400">Disabled, special care</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-red-600 min-w-[40px]">10-20</span>
                <span className="text-gray-600 dark:text-gray-400">Very sick</span>
              </div>
            </div>
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
            <span>Save Performance Status</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default PerformanceStatusForm;
