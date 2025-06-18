/**
 * Treatment History Form Component
 * Handles treatment line data input and management
 */

import React, { useState } from 'react';
import {
  TreatmentLineData,
  TreatmentLine,
  TreatmentResponse,
  DosageModification,
  Toxicity
} from '../../modules/cdu/engine/models';

interface TreatmentHistoryFormProps {
  treatmentHistory: TreatmentLineData[];
  onUpdate: (treatmentHistory: TreatmentLineData[]) => void;
  errors?: Record<string, string>;
}

export const TreatmentHistoryForm: React.FC<TreatmentHistoryFormProps> = ({
  treatmentHistory,
  onUpdate,
  errors = {}
}) => {
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [expandedTreatments, setExpandedTreatments] = useState<Set<number>>(new Set([0]));

  const validateTreatmentLine = (treatment: TreatmentLineData, index: number) => {
    const newErrors = { ...localErrors };
    const prefix = `treatment_${index}`;
    
    if (!treatment.treatmentLine) {
      newErrors[`${prefix}_line`] = 'Treatment line is required';
    } else {
      delete newErrors[`${prefix}_line`];
    }

    if (!treatment.treatmentRegimen.trim()) {
      newErrors[`${prefix}_regimen`] = 'Treatment regimen is required';
    } else {
      delete newErrors[`${prefix}_regimen`];
    }

    if (!treatment.startDate) {
      newErrors[`${prefix}_startDate`] = 'Start date is required';
    } else if (new Date(treatment.startDate) > new Date()) {
      newErrors[`${prefix}_startDate`] = 'Start date cannot be in the future';
    } else {
      delete newErrors[`${prefix}_startDate`];
    }

    if (treatment.endDate && new Date(treatment.endDate) < new Date(treatment.startDate)) {
      newErrors[`${prefix}_endDate`] = 'End date cannot be before start date';
    } else {
      delete newErrors[`${prefix}_endDate`];
    }

    setLocalErrors(newErrors);
  };

  const handleTreatmentAdd = () => {
    const newTreatment: TreatmentLineData = {
      treatmentLine: TreatmentLine.FIRST_LINE,
      treatmentRegimen: '',
      startDate: '',
      treatmentResponse: TreatmentResponse.NOT_EVALUABLE,
      treatmentNotes: '',
      dosageModifications: [],
      toxicities: []
    };
    
    const updatedHistory = [...treatmentHistory, newTreatment];
    onUpdate(updatedHistory);
    
    // Expand the new treatment by default
    setExpandedTreatments(prev => new Set([...prev, updatedHistory.length - 1]));
  };

  const handleTreatmentUpdate = (index: number, field: keyof TreatmentLineData, value: any) => {
    const updatedHistory = [...treatmentHistory];
    updatedHistory[index] = { ...updatedHistory[index], [field]: value };
    onUpdate(updatedHistory);
    
    // Validate after update
    validateTreatmentLine(updatedHistory[index], index);
  };

  const handleTreatmentRemove = (index: number) => {
    const updatedHistory = treatmentHistory.filter((_: TreatmentLineData, i: number) => i !== index);
    onUpdate(updatedHistory);
    
    // Remove from expanded set
    setExpandedTreatments(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      // Adjust indices for remaining items
      const adjustedSet = new Set<number>();
      Array.from(newSet).forEach(expandedIndex => {
        if (expandedIndex > index) {
          adjustedSet.add(expandedIndex - 1);
        } else if (expandedIndex < index) {
          adjustedSet.add(expandedIndex);
        }
      });
      return adjustedSet;
    });
  };

  const toggleExpanded = (index: number) => {
    setExpandedTreatments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleDosageModificationAdd = (treatmentIndex: number) => {
    const newModification: DosageModification = {
      date: new Date().toISOString().split('T')[0],
      reason: '',
      oldDose: '',
      newDose: '',
      drugName: ''
    };
    
    const currentModifications = treatmentHistory[treatmentIndex].dosageModifications || [];
    const updatedModifications = [...currentModifications, newModification];
    handleTreatmentUpdate(treatmentIndex, 'dosageModifications', updatedModifications);
  };

  const handleDosageModificationUpdate = (treatmentIndex: number, modIndex: number, field: keyof DosageModification, value: string) => {
    const currentModifications = [...(treatmentHistory[treatmentIndex].dosageModifications || [])];
    currentModifications[modIndex] = { ...currentModifications[modIndex], [field]: value };
    handleTreatmentUpdate(treatmentIndex, 'dosageModifications', currentModifications);
  };

  const handleDosageModificationRemove = (treatmentIndex: number, modIndex: number) => {
    const currentModifications = treatmentHistory[treatmentIndex].dosageModifications || [];
    const updatedModifications = currentModifications.filter((_: DosageModification, i: number) => i !== modIndex);
    handleTreatmentUpdate(treatmentIndex, 'dosageModifications', updatedModifications);
  };

  const handleToxicityAdd = (treatmentIndex: number) => {
    const newToxicity: Toxicity = {
      type: '',
      grade: 1,
      onset: new Date().toISOString().split('T')[0],
      management: ''
    };
    
    const currentToxicities = treatmentHistory[treatmentIndex].toxicities || [];
    const updatedToxicities = [...currentToxicities, newToxicity];
    handleTreatmentUpdate(treatmentIndex, 'toxicities', updatedToxicities);
  };

  const handleToxicityUpdate = (treatmentIndex: number, toxIndex: number, field: keyof Toxicity, value: string | number | string[]) => {
    const currentToxicities = [...(treatmentHistory[treatmentIndex].toxicities || [])];
    currentToxicities[toxIndex] = { ...currentToxicities[toxIndex], [field]: value };
    handleTreatmentUpdate(treatmentIndex, 'toxicities', currentToxicities);
  };

  const handleToxicityRemove = (treatmentIndex: number, toxIndex: number) => {
    const currentToxicities = treatmentHistory[treatmentIndex].toxicities || [];
    const updatedToxicities = currentToxicities.filter((_: Toxicity, i: number) => i !== toxIndex);
    handleTreatmentUpdate(treatmentIndex, 'toxicities', updatedToxicities);
  };

  const fieldError = (field: string) => errors[field] || localErrors[field];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Treatment History</h3>
            <p className="text-sm text-gray-600 mt-1">
              Document all previous and current treatment lines with detailed information.
            </p>
          </div>
          <button
            type="button"
            onClick={handleTreatmentAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add Treatment Line
          </button>
        </div>
      </div>

      {treatmentHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No treatment history recorded. Click "Add Treatment Line" to begin.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {treatmentHistory.map((treatment: TreatmentLineData, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg bg-gray-50">
              {/* Treatment Header */}
              <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(index)}
                      className="flex items-center space-x-2 text-left focus:outline-none"
                    >
                      <span className={`transform transition-transform ${expandedTreatments.has(index) ? 'rotate-90' : ''}`}>
                        ▶
                      </span>
                      <span className="font-medium text-gray-900">
                        {treatment.treatmentLine || 'New Treatment'} - {treatment.treatmentRegimen || 'Untitled Regimen'}
                      </span>
                    </button>
                    {treatment.startDate && (
                      <span className="text-sm text-gray-500">
                        Started: {new Date(treatment.startDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTreatmentRemove(index)}
                    className="text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Treatment Details */}
              {expandedTreatments.has(index) && (
                <div className="p-4 space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Treatment Line */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Treatment Line *
                      </label>
                      <select
                        value={treatment.treatmentLine}
                        onChange={(e) => handleTreatmentUpdate(index, 'treatmentLine', e.target.value as TreatmentLine)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          fieldError(`treatment_${index}_line`) ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select treatment line</option>
                        {Object.values(TreatmentLine).map((line: string) => (
                          <option key={line} value={line}>{line}</option>
                        ))}
                      </select>
                      {fieldError(`treatment_${index}_line`) && (
                        <p className="mt-1 text-sm text-red-600">{fieldError(`treatment_${index}_line`)}</p>
                      )}
                    </div>

                    {/* Treatment Response */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Treatment Response
                      </label>
                      <select
                        value={treatment.treatmentResponse}
                        onChange={(e) => handleTreatmentUpdate(index, 'treatmentResponse', e.target.value as TreatmentResponse)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {Object.values(TreatmentResponse).map((response: string) => (
                          <option key={response} value={response}>{response}</option>
                        ))}
                      </select>
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={treatment.startDate}
                        onChange={(e) => handleTreatmentUpdate(index, 'startDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          fieldError(`treatment_${index}_startDate`) ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {fieldError(`treatment_${index}_startDate`) && (
                        <p className="mt-1 text-sm text-red-600">{fieldError(`treatment_${index}_startDate`)}</p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={treatment.endDate || ''}
                        onChange={(e) => handleTreatmentUpdate(index, 'endDate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          fieldError(`treatment_${index}_endDate`) ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {fieldError(`treatment_${index}_endDate`) && (
                        <p className="mt-1 text-sm text-red-600">{fieldError(`treatment_${index}_endDate`)}</p>
                      )}
                    </div>
                  </div>

                  {/* Treatment Regimen */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Treatment Regimen *
                    </label>
                    <input
                      type="text"
                      value={treatment.treatmentRegimen}
                      onChange={(e) => handleTreatmentUpdate(index, 'treatmentRegimen', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                        fieldError(`treatment_${index}_regimen`) ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., FOLFOX, AC-T, Pembrolizumab"
                    />
                    {fieldError(`treatment_${index}_regimen`) && (
                      <p className="mt-1 text-sm text-red-600">{fieldError(`treatment_${index}_regimen`)}</p>
                    )}
                  </div>

                  {/* Reason for Discontinuation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Discontinuation
                    </label>
                    <input
                      type="text"
                      value={treatment.reasonForDiscontinuation || ''}
                      onChange={(e) => handleTreatmentUpdate(index, 'reasonForDiscontinuation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Disease progression, Toxicity, Patient request"
                    />
                  </div>

                  {/* Treatment Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Treatment Notes
                    </label>
                    <textarea
                      rows={3}
                      value={treatment.treatmentNotes || ''}
                      onChange={(e) => handleTreatmentUpdate(index, 'treatmentNotes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Additional notes about the treatment course, efficacy, tolerability, etc."
                    />
                  </div>

                  {/* Dosage Modifications */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-medium text-gray-900">Dosage Modifications</h5>
                      <button
                        type="button"
                        onClick={() => handleDosageModificationAdd(index)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Add Modification
                      </button>
                    </div>

                    {treatment.dosageModifications && treatment.dosageModifications.length > 0 && (
                      <div className="space-y-3">
                        {treatment.dosageModifications.map((modification: DosageModification, modIndex: number) => (
                          <div key={modIndex} className="p-3 border border-gray-200 rounded-md bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
                                <input
                                  type="date"
                                  value={modification.date}
                                  onChange={(e) => handleDosageModificationUpdate(index, modIndex, 'date', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Drug</label>
                                <input
                                  type="text"
                                  value={modification.drugName}
                                  onChange={(e) => handleDosageModificationUpdate(index, modIndex, 'drugName', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="Drug name"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Old Dose</label>
                                <input
                                  type="text"
                                  value={modification.oldDose}
                                  onChange={(e) => handleDosageModificationUpdate(index, modIndex, 'oldDose', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g., 100mg"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">New Dose</label>
                                <input
                                  type="text"
                                  value={modification.newDose}
                                  onChange={(e) => handleDosageModificationUpdate(index, modIndex, 'newDose', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g., 80mg"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() => handleDosageModificationRemove(index, modIndex)}
                                  className="w-full px-2 py-1 text-xs text-red-600 hover:text-red-800 focus:outline-none"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Reason</label>
                              <input
                                type="text"
                                value={modification.reason}
                                onChange={(e) => handleDosageModificationUpdate(index, modIndex, 'reason', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Reason for modification"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Toxicities */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-medium text-gray-900">Toxicities</h5>
                      <button
                        type="button"
                        onClick={() => handleToxicityAdd(index)}
                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        Add Toxicity
                      </button>
                    </div>

                    {treatment.toxicities && treatment.toxicities.length > 0 && (
                      <div className="space-y-3">
                        {treatment.toxicities.map((toxicity: Toxicity, toxIndex: number) => (
                          <div key={toxIndex} className="p-3 border border-gray-200 rounded-md bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                                <input
                                  type="text"
                                  value={toxicity.type}
                                  onChange={(e) => handleToxicityUpdate(index, toxIndex, 'type', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="e.g., Nausea, Neuropathy"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Grade (1-5)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={toxicity.grade}
                                  onChange={(e) => handleToxicityUpdate(index, toxIndex, 'grade', parseInt(e.target.value) || 1)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Onset</label>
                                <input
                                  type="date"
                                  value={toxicity.onset}
                                  onChange={(e) => handleToxicityUpdate(index, toxIndex, 'onset', e.target.value)}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex items-end">
                                <button
                                  type="button"
                                  onClick={() => handleToxicityRemove(index, toxIndex)}
                                  className="w-full px-2 py-1 text-xs text-red-600 hover:text-red-800 focus:outline-none"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                            <div className="mt-2">
                              <label className="block text-xs font-medium text-gray-700 mb-1">Management</label>
                              <input
                                type="text"
                                value={toxicity.management}
                                onChange={(e) => handleToxicityUpdate(index, toxIndex, 'management', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Management approach taken"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
