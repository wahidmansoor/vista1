import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { EmergencyProtocol } from '../data/emergencyProtocols';
import RedFlagTag from './RedFlagTag';
import { useReactToPrint } from 'react-to-print';

interface EmergencyDetailModalProps {
  protocol: EmergencyProtocol;
  onClose: () => void;
}

const EmergencyDetailModal: React.FC<EmergencyDetailModalProps> = ({ protocol, onClose }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-red-100 p-4 border-b border-red-200 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-red-800">{protocol.title}</h2>
            {protocol.timeToAction && (
              <RedFlagTag timeToAction={protocol.timeToAction} />
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handlePrint}
              className="p-2 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200"
              aria-label="Print protocol"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512 512">
                <path fill="currentColor" d="M448 192V77.25c0-8.49-3.37-16.62-9.37-22.63L393.37 9.37c-6-6-14.14-9.37-22.63-9.37H96C78.33 0 64 14.33 64 32v160c-35.35 0-64 28.65-64 64v112c0 8.84 7.16 16 16 16h48v96c0 17.67 14.33 32 32 32h320c17.67 0 32-14.33 32-32v-96h48c8.84 0 16-7.16 16-16V256c0-35.35-28.65-64-64-64zm-64 256H128v-96h256v96zm0-224H128V64h192v48c0 8.84 7.16 16 16 16h48v96zm48 72c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"/>
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-200"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 352 512">
                <path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div ref={contentRef} className="p-6 print:p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Clinical Presentation</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {protocol.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Diagnostics</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {protocol.diagnostics.map((diagnostic, index) => (
                  <li key={index}>{diagnostic}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Management</h3>
              <ol className="list-decimal ml-5 space-y-2 text-gray-700">
                {protocol.management.map((step, index) => (
                  <li key={index} className="pl-1">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm mt-1">{step.description}</div>
                  </li>
                ))}
              </ol>
              
              {protocol.medications && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Medications</h3>
                  <div className="border-t border-b border-gray-200">
                    {protocol.medications.map((med, index) => (
                      <div 
                        key={index}
                        className={`py-2 px-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                      >
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-gray-600">{med.dosage}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {protocol.additionalNotes && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800 mb-2">Additional Notes</h3>
              <p className="text-yellow-800">{protocol.additionalNotes}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmergencyDetailModal;
