import React, { useState } from 'react';
import { getPreAdmissionChecklist } from './admissionTemplates';
import { motion } from 'framer-motion';

interface Props {
  cancerType: string;
}

export const PreAdmissionChecklist: React.FC<Props> = ({ cancerType }) => {
  const [open, setOpen] = useState(true);
  const checklist = getPreAdmissionChecklist(cancerType);
  return (
    <motion.div
      className="p-3 bg-green-50 border border-green-200 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-green-800">Pre-admission Checklist</h3>
        <button
          className="text-xs text-green-700 hover:underline"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? '−' : '+'}
        </button>
      </div>
      {open && (
        <ul className="list-disc pl-5 text-green-700 text-sm leading-tight space-y-0.5">
          {checklist.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
