import React from 'react';
import { motion } from 'framer-motion';
import { EmergencyProtocol } from '../data/emergencyProtocols';
import RedFlagTag from './RedFlagTag';

interface EmergencyCardProps {
  protocol: EmergencyProtocol;
  onClick: () => void;
}

const EmergencyCard: React.FC<EmergencyCardProps> = ({ protocol, onClick }) => {
  return (
    <motion.div
      className="p-4 bg-red-50 border border-red-200 rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold text-red-800 mb-2">{protocol.title}</h3>
        {protocol.timeToAction && (
          <RedFlagTag timeToAction={protocol.timeToAction} />
        )}
      </div>
      
      <div className="mb-3">
        <p className="text-red-700 font-medium">Key Signs:</p>
        <ul className="list-disc ml-5 text-red-700">
          {protocol.symptoms.slice(0, 3).map((symptom, index) => (
            <li key={index}>{symptom}</li>
          ))}
          {protocol.symptoms.length > 3 && <li>+ more...</li>}
        </ul>
      </div>
      
      <div className="text-sm text-gray-600 mt-2 flex items-center justify-end">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Click for full protocol</span>
      </div>
    </motion.div>
  );
};

export default EmergencyCard;
