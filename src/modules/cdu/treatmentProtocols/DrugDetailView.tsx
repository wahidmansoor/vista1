import React from 'react';
import { ProtocolDrug } from '@/types/protocol';

interface DrugDetailViewProps {
  drug: ProtocolDrug;
  onBack: () => void;
}

const DrugDetailView: React.FC<DrugDetailViewProps> = ({ drug, onBack }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-md shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{drug.name}</h3>
      
      <div className="space-y-3">
        {drug.dose && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Dosage</h4>
            <p className="text-gray-600 dark:text-gray-400">{drug.dose}</p>
          </div>
        )}
        
        {drug.route && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Route</h4>
            <p className="text-gray-600 dark:text-gray-400">{drug.route}</p>
          </div>
        )}
        
        {drug.schedule && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule</h4>
            <p className="text-gray-600 dark:text-gray-400">{drug.schedule}</p>
          </div>
        )}
        
        {drug.premedication && drug.premedication.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Premedication</h4>
            <ul className="list-disc ml-5">
              {drug.premedication.map((med, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-400">{med}</li>
              ))}
            </ul>
          </div>
        )}
        
        {drug.special_notes && drug.special_notes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Special Instructions</h4>
            <ul className="list-disc ml-5">
              {drug.special_notes.map((note, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-400">{note}</li>
              ))}
            </ul>
          </div>
        )}
        
        {drug.pharmacology && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pharmacology</h4>
            {drug.pharmacology.mechanism && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Mechanism</h5>
                <p className="text-gray-600 dark:text-gray-400">{drug.pharmacology.mechanism}</p>
              </div>
            )}
            {drug.pharmacology.classification && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Classification</h5>
                <p className="text-gray-600 dark:text-gray-400">{drug.pharmacology.classification}</p>
              </div>
            )}
            {drug.pharmacology.pharmacokinetics && drug.pharmacology.pharmacokinetics.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Pharmacokinetics</h5>
                <ul className="list-disc ml-5">
                  {drug.pharmacology.pharmacokinetics.map((pk, index) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400">{pk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrugDetailView;
