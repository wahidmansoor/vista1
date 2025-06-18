/**
 * Progression Assessment Form Component
 * Handles disease progression and response assessment data
 */

import React, { useEffect, useState } from 'react';
import { AlertCircle, Check, Info, Calendar, Scan, TrendingUp } from 'lucide-react';
import {
  ProgressionData,
  ValidationResult,
  ImagingType,
  ResponseAssessment,
  TreatmentResponse
} from '../../engine/models';
import { FormValidators, ValidationUtils } from '../../utils/validators';

interface ProgressionAssessmentFormProps {
  data: ProgressionData;
  onChange: (updates: Partial<ProgressionData>) => void;
  onSave: () => Promise<void>;
  validation?: ValidationResult;
  isLoading?: boolean;
}

const ProgressionAssessmentForm: React.FC<ProgressionAssessmentFormProps> = ({
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
      const result = FormValidators.validateProgressionData(data);
      setLocalValidation(result);
    }
  }, [data, validation]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave();
    } catch (error) {
      console.error('Error saving progression data:', error);
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
        {/* Assessment Information */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Assessment Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reassessment Date */}
            <div>
              <label htmlFor="reassessmentDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reassessment Date
              </label>
              <input
                type="date"
                id="reassessmentDate"
                value={data.reassessmentDate || ''}
                onChange={(e) => onChange({ reassessmentDate: e.target.value })}
                className={getInputClassName('reassessmentDate')}
                disabled={isLoading}
              />
              {renderFieldMessages('reassessmentDate')}
            </div>

            {/* Imaging Type */}
            <div>
              <label htmlFor="imagingType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imaging Type
              </label>
              <select
                id="imagingType"
                value={data.imagingType || ''}
                onChange={(e) => onChange({ imagingType: e.target.value as ImagingType })}
                className={getInputClassName('imagingType')}
                disabled={isLoading}
              >
                <option value="">Select Imaging Type</option>
                <option value={ImagingType.CT}>CT Scan</option>
                <option value={ImagingType.MRI}>MRI</option>
                <option value={ImagingType.PET}>PET Scan</option>
                <option value={ImagingType.PET_CT}>PET-CT</option>
                <option value={ImagingType.XRAY}>X-Ray</option>
                <option value={ImagingType.ULTRASOUND}>Ultrasound</option>
                <option value={ImagingType.BONE_SCAN}>Bone Scan</option>
              </select>
              {renderFieldMessages('imagingType')}
            </div>
          </div>
        </div>

        {/* Imaging Findings */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Scan className="w-5 h-5" />
            Imaging Findings
          </h3>
          
          <div>
            <label htmlFor="findingsSummary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Findings Summary
            </label>
            <textarea
              id="findingsSummary"
              value={data.findingsSummary || ''}
              onChange={(e) => onChange({ findingsSummary: e.target.value })}
              placeholder="Describe imaging findings, lesion measurements, new lesions, response to treatment..."
              rows={5}
              className={getInputClassName('findingsSummary')}
              disabled={isLoading}
            />
            {renderFieldMessages('findingsSummary')}
            
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Include RECIST measurements, lesion locations, and comparison to prior studies
            </div>
          </div>
        </div>

        {/* Tumor Markers */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Tumor Markers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Marker Type */}
            <div>
              <label htmlFor="markerType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tumor Marker Type
              </label>
              <select
                id="markerType"
                value={data.markerType || ''}
                onChange={(e) => onChange({ markerType: e.target.value })}
                className={getInputClassName('markerType')}
                disabled={isLoading}
              >
                <option value="">Select Marker Type</option>
                <option value="CEA">CEA (Carcinoembryonic Antigen)</option>
                <option value="CA19-9">CA 19-9</option>
                <option value="CA125">CA 125</option>
                <option value="CA15-3">CA 15-3</option>
                <option value="PSA">PSA (Prostate Specific Antigen)</option>
                <option value="AFP">AFP (Alpha-fetoprotein)</option>
                <option value="Beta-hCG">Beta-hCG</option>
                <option value="LDH">LDH (Lactate Dehydrogenase)</option>
                <option value="Thyroglobulin">Thyroglobulin</option>
                <option value="Calcitonin">Calcitonin</option>
                <option value="Other">Other</option>
              </select>
              {renderFieldMessages('markerType')}
            </div>

            {/* Marker Value */}
            <div>
              <label htmlFor="markerValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Marker Value
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="markerValue"
                  value={data.markerValue || ''}
                  onChange={(e) => onChange({ markerValue: e.target.value })}
                  placeholder="Enter value with units (e.g., 25.5 ng/mL)"
                  className={getInputClassName('markerValue')}
                  disabled={isLoading}
                />
              </div>
              {renderFieldMessages('markerValue')}
              
              {data.markerType && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {data.markerType === 'CEA' && 'Normal: <2.5 ng/mL (nonsmoker), <5.0 ng/mL (smoker)'}
                  {data.markerType === 'CA19-9' && 'Normal: <37 U/mL'}
                  {data.markerType === 'CA125' && 'Normal: <35 U/mL'}
                  {data.markerType === 'CA15-3' && 'Normal: <30 U/mL'}
                  {data.markerType === 'PSA' && 'Normal: <4.0 ng/mL (varies by age)'}
                  {data.markerType === 'AFP' && 'Normal: <10 ng/mL'}
                  {data.markerType === 'Beta-hCG' && 'Normal: <1 mIU/mL (non-pregnant)'}
                  {data.markerType === 'LDH' && 'Normal: 140-280 U/L'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Assessment */}
        {data.responseAssessment && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
              Response Assessment (RECIST)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment Method
                </label>                <select
                  value={data.responseAssessment?.method || ''}
                  onChange={(e) => {
                    const method = e.target.value as 'RECIST' | 'iRECIST' | 'WHO' | 'Clinical';
                    if (method) {
                      onChange({ 
                        responseAssessment: { 
                          method,
                          targetLesions: data.responseAssessment?.targetLesions || [],
                          nonTargetLesions: data.responseAssessment?.nonTargetLesions || [],
                          newLesions: data.responseAssessment?.newLesions || false,
                          overallResponse: data.responseAssessment?.overallResponse || TreatmentResponse.NOT_EVALUABLE
                        } 
                      });
                    }
                  }}
                  className={getInputClassName('responseMethod')}
                  disabled={isLoading}
                >
                  <option value="">Select Method</option>
                  <option value="RECIST">RECIST 1.1</option>
                  <option value="iRECIST">iRECIST</option>
                  <option value="WHO">WHO Criteria</option>
                  <option value="Clinical">Clinical Assessment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overall Response
                </label>                <select
                  value={data.responseAssessment?.overallResponse || ''}
                  onChange={(e) => {
                    const overallResponse = e.target.value as TreatmentResponse;
                    if (overallResponse && data.responseAssessment?.method) {
                      onChange({ 
                        responseAssessment: { 
                          ...data.responseAssessment,
                          overallResponse
                        } 
                      });
                    }
                  }}
                  className={getInputClassName('overallResponse')}
                  disabled={isLoading}
                >
                  <option value="">Select Response</option>
                  <option value={TreatmentResponse.COMPLETE_RESPONSE}>Complete Response (CR)</option>
                  <option value={TreatmentResponse.PARTIAL_RESPONSE}>Partial Response (PR)</option>
                  <option value={TreatmentResponse.STABLE_DISEASE}>Stable Disease (SD)</option>
                  <option value={TreatmentResponse.PROGRESSIVE_DISEASE}>Progressive Disease (PD)</option>
                  <option value={TreatmentResponse.NOT_EVALUABLE}>Not Evaluable (NE)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label htmlFor="progressionNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Progression Notes
          </label>
          <textarea
            id="progressionNotes"
            value={data.progressionNotes || ''}
            onChange={(e) => onChange({ progressionNotes: e.target.value })}
            placeholder="Additional clinical notes, correlations with symptoms, recommendations for follow-up..."
            rows={4}
            className={getInputClassName('progressionNotes')}
            disabled={isLoading}
          />
          {renderFieldMessages('progressionNotes')}
        </div>
      </form>

      {/* RECIST Guidelines Reference */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">RECIST 1.1 Quick Reference</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Response Criteria</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-green-600 min-w-[25px]">CR</span>
                <span className="text-gray-600 dark:text-gray-400">Complete disappearance of all target lesions</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-[25px]">PR</span>
                <span className="text-gray-600 dark:text-gray-400">≥30% decrease in sum of diameters</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-yellow-600 min-w-[25px]">SD</span>
                <span className="text-gray-600 dark:text-gray-400">Neither PR nor PD criteria met</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-red-600 min-w-[25px]">PD</span>
                <span className="text-gray-600 dark:text-gray-400">≥20% increase or new lesions</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Measurement Guidelines</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>• Target lesions: ≤5 total, ≤2 per organ</div>
              <div>• Minimum size: 10mm (CT), 20mm (clinical)</div>
              <div>• Lymph nodes: ≥15mm short axis</div>
              <div>• Sum of longest diameters for target lesions</div>
              <div>• New lesions = progressive disease</div>
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
              <span className="text-sm">Form validation passed</span>
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
            <span>Save Progression Assessment</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProgressionAssessmentForm;
