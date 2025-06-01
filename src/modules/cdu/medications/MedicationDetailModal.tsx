import React from 'react';

interface MedicationDetailModalProps {
  medication?: any;
  onClose?: () => void;
  isOpen?: boolean;
}

// TODO: Implement full MedicationDetailModal component
const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({ medication, onClose, isOpen }) => {
  if (!isOpen || !medication) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Medication Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <div className="space-y-4">
          <p><strong>Name:</strong> {medication.name || 'Unknown'}</p>
          <p><strong>Type:</strong> {medication.type || 'Unknown'}</p>
          {/* TODO: Add complete medication details */}
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailModal;
