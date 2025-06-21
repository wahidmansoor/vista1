/**
 * Progression Assessment Form Component
 * Handles disease progression and response assessment input
 */

import React, { useState } from 'react';
import {
  ProgressionData,
  ImagingType,
  ResponseAssessment,
  TreatmentResponse,
  TargetLesion,
  NonTargetLesion,
  AdverseEvent
} from '../../modules/cdu/engine/models';

interface ProgressionAssessmentFormProps {
  progressionData: ProgressionData;
  onUpdate: (progressionData: ProgressionData) => void;
  errors?: Record<string, string>;
}

export const ProgressionAssessmentForm: React.FC<ProgressionAssessmentFormProps> = ({
  progressionData,
  onUpdate,
  errors = {}
}) => {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const validateField = (field: string, value: string) => {
    const newErrors = { ...localErrors };
    
    switch (field) {
      case 'reassessmentDate':
        if (!value) {
          newErrors[field] = 'Reassessment date is required';
        } else if (new Date(value) > new Date()) {
          newErrors[field] = 'Reassessment date cannot be in the future';
        } else {
          delete newErrors[field];
        }
        break;
      case 'imagingType':
        if (!value) {
          newErrors[field] = 'Imaging type is required';
        } else {
          delete newErrors[field];
        }
        break;
      default:
        break;
    }

    setLocalErrors(newErrors);
  };

  const handleInputChange = (field: keyof ProgressionData, value: string | ImagingType | ResponseAssessment | AdverseEvent[]) => {
    const updatedData = { ...progressionData, [field]: value };
    onUpdate(updatedData);
  };

  const handleResponseAssessmentChange = (field: keyof ResponseAssessment, value: string | TreatmentResponse | TargetLesion[] | NonTargetLesion[] | boolean) => {
    const updatedResponseAssessment = {
      ...progressionData.responseAssessment,
      [field]: value
    } as ResponseAssessment;
    
    onUpdate({ ...progressionData, responseAssessment: updatedResponseAssessment });
  };

  const handleTargetLesionAdd = () => {
const newLesion = {
      id: `lesion_${Date.now()}`,
      location: '',
      size: 0,
      previousSize: undefined,
      percentChange: undefined
    };
    
    const currentLesions = progressionData.responseAssessment?.targetLesions || [];
    const updatedLesions = [...currentLesions, newLesion];
    handleResponseAssessmentChange('targetLesions', updatedLesions);
  };

  const handleTargetLesionUpdate = (index: number, field: keyof TargetLesion, value: string | number) => {
    const currentLesions = progressionData.responseAssessment?.targetLesions || [];
    const updatedLesions = [...currentLesions];
    updatedLesions[index] = { ...updatedLesions[index], [field]: value };
    
    // Calculate percent change if both current and previous sizes are available
    if (field === 'size' || field === 'previousSize') {
      const lesion = updatedLesions[index];
      if (lesion.size && lesion.previousSize) {
        lesion.percentChange = Math.round(((lesion.size - lesion.previousSize) / lesion.previousSize) * 100);
      }
    }
    
    handleResponseAssessmentChange('targetLesions', updatedLesions);
  };

  const handleTargetLesionRemove = (index: number) => {
    const currentLesions = progressionData.responseAssessment?.targetLesions || [];
    const updatedLesions = currentLesions.filter((_: TargetLesion, i: number) => i !== index);
    handleResponseAssessmentChange('targetLesions', updatedLesions);
  };
  const handleAdverseEventAdd = () => {
const newEvent: AdverseEvent = {
      event: '',
      grade: 1,
      startDate: new Date().toISOString().split('T')[0],
      causality: 'possible',
      action: 'none'
    };
    
    const currentEvents = progressionData.adverseEvents || [];
    const updatedEvents = [...currentEvents, newEvent];
    onUpdate({ ...progressionData, adverseEvents: updatedEvents });
  };

  const handleAdverseEventUpdate = (index: number, field: keyof AdverseEvent, value: string | number) => {
    const currentEvents = progressionData.adverseEvents || [];
    const updatedEvents = [...currentEvents];
    updatedEvents[index] = { ...updatedEvents[index], [field]: value };
    onUpdate({ ...progressionData, adverseEvents: updatedEvents });
  };

  const handleAdverseEventRemove = (index: number) => {
    const currentEvents = progressionData.adverseEvents || [];
    const updatedEvents = currentEvents.filter((_: AdverseEvent, i: number) => i !== index);
    onUpdate({ ...progressionData, adverseEvents: updatedEvents });
  };

  const fieldError = (field: string) => errors[field] || localErrors[field];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Progression Assessment</h3>
        <p className="text-sm text-gray-600 mt-1">
          Document disease progression, response to treatment, and adverse events.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reassessment Date */}
        <div>
          <label htmlFor="reassessmentDate" className="block text-sm font-medium text-gray-700 mb-2">
            Reassessment Date *
          </label>
          <input
            type="date"
            id="reassessmentDate"
            value={progressionData.reassessmentDate}
            onChange={(e) => handleInputChange('reassessmentDate', e.target.value)}
            onBlur={(e) => validateField('reassessmentDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              fieldError('reassessmentDate') ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {fieldError('reassessmentDate') && (
            <p className="mt-1 text-sm text-red-600">{fieldError('reassessmentDate')}</p>
          )}
        </div>

        {/* Imaging Type */}
        <div>
          <label htmlFor="imagingType" className="block text-sm font-medium text-gray-700 mb-2">
            Imaging Type *
          </label>
          <select
            id="imagingType"
            value={progressionData.imagingType}
            onChange={(e) => handleInputChange('imagingType', e.target.value as ImagingType)}
            onBlur={(e) => validateField('imagingType', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              fieldError('imagingType') ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select imaging type</option>
            {Object.values(ImagingType).map((type: string) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          {fieldError('imagingType') && (
            <p className="mt-1 text-sm text-red-600">{fieldError('imagingType')}</p>
          )}
        </div>

        {/* Marker Type */}
        <div>
          <label htmlFor="markerType" className="block text-sm font-medium text-gray-700 mb-2">
            Tumor Marker Type
          </label>
          <input
            type="text"
            id="markerType"
            value={progressionData.markerType || ''}
            onChange={(e) => handleInputChange('markerType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., CEA, CA 19-9, PSA"
          />
        </div>

        {/* Marker Value */}
        <div>
          <label htmlFor="markerValue" className="block text-sm font-medium text-gray-700 mb-2">
            Marker Value
          </label>
          <input
            type="text"
            id="markerValue"
            value={progressionData.markerValue || ''}
            onChange={(e) => handleInputChange('markerValue', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="e.g., 12.5 ng/mL"
          />
        </div>

        {/* Findings Summary */}
        <div className="col-span-2">
          <label htmlFor="findingsSummary" className="block text-sm font-medium text-gray-700 mb-2">
            Findings Summary
          </label>
          <textarea
            id="findingsSummary"
            rows={3}
            value={progressionData.findingsSummary || ''}
            onChange={(e) => handleInputChange('findingsSummary', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Summary of imaging findings and overall assessment"
          />
        </div>

        {/* Progression Notes */}
        <div className="col-span-2">
          <label htmlFor="progressionNotes" className="block text-sm font-medium text-gray-700 mb-2">
            Progression Notes
          </label>
          <textarea
            id="progressionNotes"
            rows={3}
            value={progressionData.progressionNotes || ''}
            onChange={(e) => handleInputChange('progressionNotes', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Additional notes about disease progression, clinical status, etc."
          />
        </div>
      </div>

      {/* Response Assessment Section */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-4">Response Assessment (RECIST/WHO)</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Assessment Method */}
          <div>
            <label htmlFor="assessmentMethod" className="block text-sm font-medium text-gray-700 mb-2">
              Assessment Method
            </label>
            <select
              id="assessmentMethod"
              value={progressionData.responseAssessment?.method || ''}
              onChange={(e) => handleResponseAssessmentChange('method', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select method</option>
              <option value="RECIST">RECIST 1.1</option>
              <option value="iRECIST">iRECIST</option>
              <option value="WHO">WHO</option>
              <option value="Clinical">Clinical Assessment</option>
            </select>
          </div>

          {/* Overall Response */}
          <div>
            <label htmlFor="overallResponse" className="block text-sm font-medium text-gray-700 mb-2">
              Overall Response
            </label>
            <select
              id="overallResponse"
              value={progressionData.responseAssessment?.overallResponse || ''}
              onChange={(e) => handleResponseAssessmentChange('overallResponse', e.target.value as TreatmentResponse)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select response</option>
              {Object.values(TreatmentResponse).map((response: string) => (
                <option key={response} value={response}>{response}</option>
              ))}
            </select>
          </div>

          {/* New Lesions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Lesions
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="newLesions"
                  checked={progressionData.responseAssessment?.newLesions === false}
                  onChange={() => handleResponseAssessmentChange('newLesions', false)}
                  className="mr-2"
                />
                No
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="newLesions"
                  checked={progressionData.responseAssessment?.newLesions === true}
                  onChange={() => handleResponseAssessmentChange('newLesions', true)}
                  className="mr-2"
                />
                Yes
              </label>
            </div>
          </div>

          {/* Assessor Name */}
          <div>
            <label htmlFor="assessorName" className="block text-sm font-medium text-gray-700 mb-2">
              Assessor Name
            </label>
            <input
              type="text"
              id="assessorName"
              value={progressionData.responseAssessment?.assessorName || ''}
              onChange={(e) => handleResponseAssessmentChange('assessorName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Name of the clinician/radiologist"
            />
          </div>
        </div>

        {/* Target Lesions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h5 className="text-sm font-medium text-gray-900">Target Lesions</h5>
            <button
              type="button"
              onClick={handleTargetLesionAdd}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Target Lesion
            </button>
          </div>

          {progressionData.responseAssessment?.targetLesions && progressionData.responseAssessment.targetLesions.length > 0 && (
            <div className="space-y-4">
              {progressionData.responseAssessment.targetLesions.map((lesion: TargetLesion, index: number) => (
                <div key={lesion.id} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={lesion.location}
                        onChange={(e) => handleTargetLesionUpdate(index, 'location', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., Liver segment V"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Size (mm)
                      </label>
                      <input
                        type="number"
                        value={lesion.size || ''}
                        onChange={(e) => handleTargetLesionUpdate(index, 'size', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Previous Size (mm)
                      </label>
                      <input
                        type="number"
                        value={lesion.previousSize || ''}
                        onChange={(e) => handleTargetLesionUpdate(index, 'previousSize', parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Change (%)
                      </label>
                      <input
                        type="text"
                        value={lesion.percentChange !== undefined ? `${lesion.percentChange}%` : ''}
                        readOnly
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded bg-gray-100"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleTargetLesionRemove(index)}
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

      {/* Adverse Events Section */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-md font-medium text-gray-900">Adverse Events</h4>
          <button
            type="button"
            onClick={handleAdverseEventAdd}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Adverse Event
          </button>
        </div>

        {progressionData.adverseEvents && progressionData.adverseEvents.length > 0 && (
          <div className="space-y-4">
            {progressionData.adverseEvents.map((event: AdverseEvent, index: number) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event
                    </label>
                    <input
                      type="text"
                      value={event.event}
                      onChange={(e) => handleAdverseEventUpdate(index, 'event', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Nausea, Fatigue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grade (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={event.grade}
                      onChange={(e) => handleAdverseEventUpdate(index, 'grade', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={event.startDate}
                      onChange={(e) => handleAdverseEventUpdate(index, 'startDate', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleAdverseEventRemove(index)}
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
