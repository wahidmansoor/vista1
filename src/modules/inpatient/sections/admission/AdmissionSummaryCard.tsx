import React from 'react';
import { getSummaryForCancerType } from './admissionUtils';
import { motion } from 'framer-motion';

interface Props {
  cancerType: string;
}

export const AdmissionSummaryCard: React.FC<Props> = ({ cancerType }) => {
  const summary = getSummaryForCancerType(cancerType);

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      className="p-4 bg-white border border-gray-200 rounded-lg shadow"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Admission Summary</h3>
      <div className="mb-2">
        <div><span className="font-semibold">Cancer Type:</span> {summary.cancerType}</div>
        <div><span className="font-semibold">Admission Reason:</span> {summary.reason}</div>
        <div><span className="font-semibold">Urgency:</span> {summary.urgency}</div>
        <div><span className="font-semibold">Checklist:</span> {summary.checklistStatus}</div>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handlePrint}
      >
        🖨️ Export
      </button>
    </motion.div>
  );
};
