import React, { useState } from 'react';
import { getAdmissionAlerts } from './admissionTemplates';
import { motion } from 'framer-motion';

interface Props {
  cancerType: string;
}

export const AdmissionAlertTriggers: React.FC<Props> = ({ cancerType }) => {
  const [open, setOpen] = useState(true);
  const alerts = getAdmissionAlerts(cancerType, 'general');
  return (
    <motion.div
      className="p-3 bg-red-50 border border-red-200 rounded-lg"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-red-800">Red-Flag Emergencies</h3>
        <button
          className="text-xs text-red-700 hover:underline"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Collapse' : 'Expand'}
        >
          {open ? '−' : '+'}
        </button>
      </div>
      {open && (
        <ul className="list-disc pl-5 text-red-700 text-sm leading-tight space-y-0.5">        {alerts.map((alert, i) => (
            <li key={i}>
              <strong>{alert.title}:</strong> {alert.message}
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
