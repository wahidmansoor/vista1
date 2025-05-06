import React from 'react';
import { CancerType } from '../data/followUpTemplates';
import { motion } from 'framer-motion';

interface CancerSelectorProps {
  onSelect: (cancer: CancerType) => void;
  selected: CancerType | null;
}

const cancerTypes: Array<{ type: CancerType; label: string; icon: string }> = [
  { type: 'breast', label: 'Breast Cancer', icon: '🎀' },
  { type: 'lung', label: 'Lung Cancer', icon: '🫁' },
  { type: 'colorectal', label: 'Colorectal Cancer', icon: '🎯' },
];

export const CancerSelector: React.FC<CancerSelectorProps> = ({ onSelect, selected }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {cancerTypes.map(({ type, label, icon }) => (
        <motion.button
          key={type}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-4 rounded-lg ${
            selected === type ? 'bg-blue-100 border-blue-500' : 'bg-gray-50'
          } border-2 flex flex-col items-center`}
          onClick={() => onSelect(type)}
        >
          <span className="text-2xl mb-2">{icon}</span>
          <span className="text-sm font-medium">{label}</span>
        </motion.button>
      ))}
    </div>
  );
};
