import React from 'react';
import { X } from 'lucide-react';
import type { Medication } from './../types'; // Corrected import path

interface Props {
  medication: Medication | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MedicationDetailModal({ medication, isOpen, onClose }: Props) {
  if (!isOpen || !medication) return null;

  // Helper function to check if a field is a JSON object
  const isJsonObject = (value: any): boolean => {
    try {
      return typeof value === 'object' && value !== null && !Array.isArray(value);
    } catch {
      return false;
    }
  };

  // Helper function to render any value
  const renderValue = (value: any): JSX.Element => {
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc pl-5 text-gray-600">
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (isJsonObject(value)) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([key, val], index) => (
            <div key={index}>
              <h4 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent capitalize">
                {key.replace(/_/g, ' ')}:
              </h4>
              {renderValue(val)}
            </div>
          ))}
        </div>
      );
    } else {
      return <span className="text-gray-600">{String(value)}</span>;
    }
  };

  // Core fields that have specific rendering requirements
  const renderCoreFields = () => (
    <>
      {/* Header */}
      <div className="bg-white/30 backdrop-blur-md border-b border-white/20 px-6 py-4 flex justify-between items-center shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{medication.name}</h2>
          <p className="text-sm text-gray-500">{medication.brand_names.join(', ')}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-indigo-600 transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Classification */}
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Classification</h3>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 text-sm font-medium border border-gray-200 border-opacity-40">
            {medication.classification}
          </span>
        </div>

        {/* Indications */}
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Indications</h3>
          {renderValue(medication.indications)}
        </div>

        {/* Dosage & Administration */}
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Dosage & Administration</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dosage:</h4>
              {renderValue(medication.dosage)}
            </div>
            <div>
              <h4 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Administration:</h4>
              {renderValue(medication.administration)}
            </div>
          </div>
        </div>

        {/* Side Effects & Interactions */}
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Side Effects & Interactions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Side Effects:</h4>
              {renderValue(medication.side_effects)}
            </div>
            <div>
              <h4 className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Interactions:</h4>
              {renderValue(medication.interactions)}
            </div>
          </div>
        </div>

        {/* Monitoring */}
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Monitoring Guidelines</h3>
          {renderValue(medication.monitoring)}
        </div>

        {/* References */}
        <div>
          <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">References</h3>
          {renderValue(medication.reference_sources)}
        </div>

        {/* Additional Fields */}
        {Object.entries(medication).map(([key, value]) => {
          // Skip core fields that are already rendered
          if ([
            'id', 'name', 'brand_names', 'classification', 'indications',
            'dosage', 'administration', 'side_effects', 'interactions',
            'monitoring', 'reference_sources', 'created_at', 'updated_at'
          ].includes(key)) {
            return null;
          }

          return (
            <div key={key}>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </h3>
              {renderValue(value)}
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/30 backdrop-blur-md border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-lg hover:shadow-xl opacity-80 hover:opacity-100 transition-all duration-300">
        {renderCoreFields()}
      </div>
    </div>
  );
}
