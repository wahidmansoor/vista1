import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CancerType } from '../data/followUpTemplates';

interface SymptomCheckerProps {
  cancerType: CancerType;
  redFlags: string[];
  commonSymptoms: Array<{ symptom: string; severity: 'low' | 'medium' | 'high' }>;
  onSymptomMatch?: (matches: string[]) => void;
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  cancerType,
  redFlags,
  commonSymptoms,
  onSymptomMatch
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [matchedFlags, setMatchedFlags] = useState<string[]>([]);

  const checkSymptoms = (symptom: string) => {
    const updatedSymptoms = new Set(selectedSymptoms);
    if (updatedSymptoms.has(symptom)) {
      updatedSymptoms.delete(symptom);
    } else {
      updatedSymptoms.add(symptom);
    }
    setSelectedSymptoms(updatedSymptoms);

    const matches = redFlags.filter(flag => 
      flag.toLowerCase().includes(symptom.toLowerCase())
    );
    setMatchedFlags(matches);
    onSymptomMatch?.(matches);
  };

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700">Symptom Checker</h4>
      
      <div className="grid grid-cols-2 gap-2">
        {commonSymptoms.map(({ symptom, severity }) => (
          <motion.button
            key={symptom}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-2 rounded-lg text-left ${
              selectedSymptoms.has(symptom)
                ? 'bg-blue-100 border-blue-400'
                : 'bg-gray-50 border-gray-200'
            } border ${
              severity === 'high' ? 'border-l-4 border-l-red-500' : ''
            }`}
            onClick={() => checkSymptoms(symptom)}
          >
            {symptom}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {matchedFlags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 rounded-lg border border-red-200"
          >
            <p className="text-red-700 font-medium">Warning: Potential Red Flags</p>
            <ul className="mt-2 space-y-1">
              {matchedFlags.map((flag, index) => (
                <li key={index} className="text-red-600">• {flag}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
