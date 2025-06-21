/**
 * Performance Status Form Component
 * Handles performance status assessment input with validation
 */

import React, { useState } from 'react';
import {
  PerformanceStatus,
  PerformanceScale,
  FunctionalStatus,
  QualityOfLife
} from '../../modules/cdu/engine/models';

interface PerformanceStatusFormProps {
  performanceStatus: PerformanceStatus;
  onUpdate: (performanceStatus: PerformanceStatus) => void;
  errors?: Record<string, string>;
}

export const PerformanceStatusForm: React.FC<PerformanceStatusFormProps> = function PerformanceStatusForm({
  performanceStatus,
  onUpdate,
  errors = {}
}) {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...localErrors };
    
    switch (field) {
      case 'assessmentDate':
        if (!value) {
          newErrors[field] = 'Assessment date is required';
        } else if (new Date(value) > new Date()) {
          newErrors[field] = 'Assessment date cannot be in the future';
        } else {
          delete newErrors[field];
        }
        break;
      case 'performanceScore':
        if (!value.trim()) {
          newErrors[field] = 'Performance score is required';
        } else {
          delete newErrors[field];
        }
        break;
      default:
        break;
    }

    setLocalErrors(newErrors);
  };

  const handleInputChange = (field: keyof PerformanceStatus, value: string | PerformanceScale | FunctionalStatus | QualityOfLife) => {
    const updatedStatus = { ...performanceStatus, [field]: value };
    onUpdate(updatedStatus);
  };

const handleFunctionalStatusChange = (field: keyof FunctionalStatus, value: boolean | number | string[]) => {
  const prev = performanceStatus.functionalStatus || {
    independentLiving: false,
    workCapacity: 0,
    socialFunction: 1,
    physicalLimitations: [],
  };
  const updatedFunctionalStatus: FunctionalStatus = {
    ...prev,
    [field]: value,
  };

  onUpdate({ ...performanceStatus, functionalStatus: updatedFunctionalStatus });
};

  const handleQualityOfLifeChange = (field: keyof QualityOfLife, value: number | string[]) => {
const prev = performanceStatus.qualityOfLife || {
  overallScore: 1,
  painLevel: 1,
  fatigueLevel: 1,
  emotionalWellbeing: 1,
  concerns: [],
};
const updatedQualityOfLife: QualityOfLife = {
  ...prev,
  [field]: value,
};

onUpdate({ ...performanceStatus, qualityOfLife: updatedQualityOfLife });
  };

  const fieldError = (field: string) => errors[field] || localErrors[field];

  const getECOGDescription = (score: string) => {
    const descriptions: Record<string, string> = {
      '0': 'Fully active, able to carry on all pre-disease performance without restriction',
      '1': 'Restricted in physically strenuous activity but ambulatory and able to carry out work of a light or sedentary nature',
      '2': 'Ambulatory and capable of all selfcare but unable to carry out any work activities; up and about more than 50% of waking hours',
      '3': 'Capable of only limited selfcare; confined to bed or chair more than 50% of waking hours',
      '4': 'Completely disabled; cannot carry on any selfcare; totally confined to bed or chair',
      '5': 'Dead'
    };
    return descriptions[score] || '';
  };

  const getKarnofskyDescription = (score: string) => {
    const scoreNum = parseInt(score);
    if (scoreNum >= 90) return 'Able to carry on normal activity; minor signs or symptoms of disease';
    if (scoreNum >= 80) return 'Normal activity with effort; some signs or symptoms of disease';
    if (scoreNum >= 70) return 'Cares for self; unable to carry on normal activity or to do active work';
    if (scoreNum >= 60) return 'Requires occasional assistance, but is able to care for most of his personal needs';
    if (scoreNum >= 50) return 'Requires considerable assistance and frequent medical care';
    if (scoreNum >= 40) return 'Disabled; requires special care and assistance';
    if (scoreNum >= 30) return 'Severely disabled; hospital admission is indicated although death not imminent';
    if (scoreNum >= 20) return 'Very sick; hospital admission necessary; active supportive treatment necessary';
    if (scoreNum >= 10) return 'Moribund; fatal processes progressing rapidly';
    return 'Dead';
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Performance Status Assessment</h3>
        <p className="text-sm text-gray-600 mt-1">
          Evaluate the patient's functional capacity and overall performance status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assessment Date */}
        <div>
          <label htmlFor="assessmentDate" className="block text-sm font-medium text-gray-700 mb-2">
            Assessment Date *
          </label>
          <input
            type="date"
            id="assessmentDate"
            value={performanceStatus.assessmentDate}
            onChange={(e) => handleInputChange('assessmentDate', e.target.value)}
            onBlur={(e) => validateField('assessmentDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              fieldError('assessmentDate') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldError('assessmentDate') && (
            <p className="mt-1 text-sm text-red-600">{fieldError('assessmentDate')}</p>
          )}
        </div>

        {/* Performance Scale */}
        <div>
          <label htmlFor="performanceScale" className="block text-sm font-medium text-gray-700 mb-2">
            Performance Scale *
          </label>
          <select
            id="performanceScale"
            value={performanceStatus.performanceScale}
            onChange={(e) => handleInputChange('performanceScale', e.target.value as PerformanceScale)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select scale</option>
            <option value={PerformanceScale.ECOG}>ECOG (0-5)</option>
            <option value={PerformanceScale.KARNOFSKY}>Karnofsky (0-100)</option>
          </select>
        </div>

        {/* Performance Score */}
        <div className="col-span-2">
          <label htmlFor="performanceScore" className="block text-sm font-medium text-gray-700 mb-2">
            Performance Score *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              id="performanceScore"
              value={performanceStatus.performanceScore}
              onChange={(e) => handleInputChange('performanceScore', e.target.value)}
              onBlur={(e) => validateField('performanceScore', e.target.value)}
              className={`px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                fieldError('performanceScore') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={performanceStatus.performanceScale === PerformanceScale.ECOG ? '0-5' : '0-100'}
            />
            {performanceStatus.performanceScore && (
              <div className="col-span-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>Description:</strong>{' '}
                  {performanceStatus.performanceScale === PerformanceScale.ECOG
                    ? getECOGDescription(performanceStatus.performanceScore)
                    : getKarnofskyDescription(performanceStatus.performanceScore)
                  }
                </p>
              </div>
            )}
          </div>
          {fieldError('performanceScore') && (
            <p className="mt-1 text-sm text-red-600">{fieldError('performanceScore')}</p>
          )}
        </div>

        {/* Performance Notes */}
        <div className="col-span-2">
          <label htmlFor="performanceNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Performance Notes
          </label>
          <textarea
            id="performanceNotes"
            rows={3}
            value={performanceStatus.performanceNotes || ''}
            onChange={(e) => handleInputChange('performanceNotes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Additional notes about performance status, limitations, etc."
          />
        </div>
      </div>

      {/* Functional Status Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Functional Status</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Independent Living */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Independent Living
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="independentLiving"
                  checked={performanceStatus.functionalStatus?.independentLiving === true}
                  onChange={() => handleFunctionalStatusChange('independentLiving', true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="independentLiving"
                  checked={performanceStatus.functionalStatus?.independentLiving === false}
                  onChange={() => handleFunctionalStatusChange('independentLiving', false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
          </div>

          {/* Work Capacity */}
          <div>
            <label htmlFor="workCapacity" className="block text-sm font-medium text-gray-700 mb-2">
              Work Capacity (%)
            </label>
            <input
              type="number"
              id="workCapacity"
              min="0"
              max="100"
              value={performanceStatus.functionalStatus?.workCapacity || ''}
              onChange={(e) => handleFunctionalStatusChange('workCapacity', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Social Function */}
          <div>
            <label htmlFor="socialFunction" className="block text-sm font-medium text-gray-700 mb-2">
              Social Function (1-5 scale)
            </label>
            <input
              type="number"
              id="socialFunction"
              min="1"
              max="5"
              value={performanceStatus.functionalStatus?.socialFunction || ''}
              onChange={(e) => handleFunctionalStatusChange('socialFunction', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quality of Life Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Quality of Life Assessment</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Score */}
          <div>
            <label htmlFor="overallScore" className="block text-sm font-medium text-gray-700 mb-2">
              Overall Score (1-10)
            </label>
            <input
              type="number"
              id="overallScore"
              min="1"
              max="10"
              value={performanceStatus.qualityOfLife?.overallScore || ''}
              onChange={(e) => handleQualityOfLifeChange('overallScore', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Pain Level */}
          <div>
            <label htmlFor="painLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Pain Level (1-10)
            </label>
            <input
              type="number"
              id="painLevel"
              min="1"
              max="10"
              value={performanceStatus.qualityOfLife?.painLevel || ''}
              onChange={(e) => handleQualityOfLifeChange('painLevel', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Fatigue Level */}
          <div>
            <label htmlFor="fatigueLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Fatigue Level (1-10)
            </label>
            <input
              type="number"
              id="fatigueLevel"
              min="1"
              max="10"
              value={performanceStatus.qualityOfLife?.fatigueLevel || ''}
              onChange={(e) => handleQualityOfLifeChange('fatigueLevel', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Emotional Wellbeing */}
          <div>
            <label htmlFor="emotionalWellbeing" className="block text-sm font-medium text-gray-700 mb-2">
              Emotional Wellbeing (1-10)
            </label>
            <input
              type="number"
              id="emotionalWellbeing"
              min="1"
              max="10"
              value={performanceStatus.qualityOfLife?.emotionalWellbeing || ''}
              onChange={(e) => handleQualityOfLifeChange('emotionalWellbeing', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
