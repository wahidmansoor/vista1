import React, { useState } from 'react';
import { getAdmissionProcessSteps } from './admissionTemplates';
import { motion } from 'framer-motion';

interface Props {
  cancerType: string;
}

export const AdmissionProcessSteps: React.FC<Props> = ({ cancerType }) => {
  const [open, setOpen] = useState(true);
  const steps = getAdmissionProcessSteps(cancerType);
  return (
    <motion.div
      className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-yellow-800">Admission Process Steps</h3>
        <button
          className="text-xs text-yellow-700 hover:underline"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? '−' : '+'}
        </button>
      </div>      {open && (
        <ol className="list-decimal pl-5 text-yellow-700 text-sm leading-tight space-y-0.5">
          {steps.map((step, i) => (
            <li key={i}>
              <strong>{step.step}:</strong> {step.description} ({step.timeframe})
            </li>
          ))}
        </ol>
      )}
    </motion.div>
  );
};
