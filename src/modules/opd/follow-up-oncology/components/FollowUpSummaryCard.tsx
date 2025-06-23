import React, { useRef, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { FollowUpPlan } from '../logic/generateFollowUpPlan';
import { generatePDF } from '../utils/pdfGenerator';

interface FollowUpSummaryCardProps {
  plan: FollowUpPlan;
  cancerType: string;
  stage: string;
  intent: string;
}

export const FollowUpSummaryCard: React.FC<FollowUpSummaryCardProps> = ({
  plan,
  cancerType,
  stage,
  intent
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!printRef.current) return;
    
    setIsExporting(true);
    setError(null);
    
    try {
      await generatePDF(printRef.current, {
        filename: `Follow-Up_Plan_${cancerType}_${stage}`
      });
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg ${
          isExporting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() => {
          try {
            handleExport();
          } catch (error) {
            setError('Unexpected error during export. Please try again.');
            setIsExporting(false);
          }
        }}
        disabled={isExporting}
      >
        {isExporting ? 'Generating PDF...' : '📄 Export Follow-Up Plan'}
      </motion.button>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-2 text-red-600 bg-red-50 rounded"
        >
          {error}
        </motion.div>
      )}

      <div ref={printRef} className="print-content">
        <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Follow-Up Care Plan</h2>
          <div className="grid gap-6">
            <div className="metadata p-4 bg-gray-50 rounded">
              <h3 className="font-semibold mb-2">Plan Details</h3>
              <p>Cancer Type: {cancerType}</p>
              <p>Stage: {stage}</p>
              <p>Intent: {intent}</p>
              <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
            </div>
            
            {/* Plan Content */}
            <div className="timeline">
              <h3 className="font-semibold mb-2">Follow-Up Timeline</h3>
              {plan.timeline.map((interval, index) => (
                <div key={index} className="mb-2">
                  <p className="font-medium">{interval.interval}</p>
                  <ul className="pl-4">
                    {interval.actions.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Additional sections */}
            <div className="red-flags">
              <h3 className="font-semibold mb-2">Important Warning Signs</h3>
              <ul className="pl-4">
                {plan.redFlags.map((flag, index) => (
                  <li key={index} className="text-red-600">{flag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
