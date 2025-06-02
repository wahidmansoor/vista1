import React from 'react';
import { ProtocolDrug } from '@/types/protocol';

interface DrugDetailViewProps {
  drug: ProtocolDrug;
  onBack: () => void;
}

// Schedule and premedication are not part of ProtocolDrug type, but we'll handle them gracefully
interface ExtendedProtocolDrug extends ProtocolDrug {
  schedule?: string;
  premedication?: string[];
  pharmacology?: {
    half_life?: string;
    metabolism?: string;
    protein_binding?: string;
    bioavailability?: string;
    excretion?: string;
    [key: string]: string | undefined;
  };
}

const DrugDetailView: React.FC<DrugDetailViewProps> = ({ drug, onBack }) => {
  // Treat the drug as ExtendedProtocolDrug to handle potential extra properties
  const extendedDrug = drug as ExtendedProtocolDrug;

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
        
        {extendedDrug.schedule && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Schedule</h4>
            <p className="text-gray-600 dark:text-gray-400">{extendedDrug.schedule}</p>
          </div>
        )}
        
        {extendedDrug.premedication && extendedDrug.premedication.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Premedication</h4>
            <ul className="list-disc ml-5">
              {extendedDrug.premedication.map((med: string, index: number) => (
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
        
        {extendedDrug.pharmacology && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pharmacology</h4>
            {extendedDrug.pharmacology.mechanism && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Mechanism</h5>
                <p className="text-gray-600 dark:text-gray-400">{extendedDrug.pharmacology.mechanism}</p>
              </div>
            )}
            {extendedDrug.pharmacology.classification && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Classification</h5>
                <p className="text-gray-600 dark:text-gray-400">{extendedDrug.pharmacology.classification}</p>
              </div>
            )}
            {extendedDrug.pharmacology.pharmacokinetics && Array.isArray(extendedDrug.pharmacology.pharmacokinetics) && 
             extendedDrug.pharmacology.pharmacokinetics.length > 0 && (
              <div className="mt-2">
                <h5 className="text-xs font-medium text-gray-600 dark:text-gray-400">Pharmacokinetics</h5>
                <ul className="list-disc ml-5">
                  {extendedDrug.pharmacology.pharmacokinetics.map((pk: string, index: number) => (
                    <li key={index} className="text-gray-600 dark:text-gray-400">{pk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      <button 
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
      >
        Back to Drug List
      </button>
    </div>
  );
};

export default DrugDetailView;
