import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Brain } from 'lucide-react';

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection?: string;
}

const defaultTips = {
  'Chief Complaint': [
    'Consider duration and pattern of symptoms',
    'Note any associated symptoms',
    'Document severity and impact on daily life'
  ],
  'History of Present Illness': [
    'Include timeline of symptom progression',
    'Note previous treatments and responses',
    'Document diagnostic tests already done'
  ],
  'Physical Examination': [
    'Always document ECOG/PS score',
    'Note lymph node regions systematically',
    'Document any B symptoms',
    'Consider paraneoplastic manifestations'
  ],
  'Performance Status': [
    'Patients with ECOG ≥2 may need early palliative consult',
    'Document any recent changes in performance',
    'Consider impact on treatment choices'
  ],
  'Past Medical History': [
    'Note any contraindications to therapy',
    'Document previous malignancies',
    'Include relevant surgeries and procedures'
  ]
};

export const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onClose, currentSection }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed right-0 top-0 h-screen w-80 bg-white/95 backdrop-blur-sm shadow-xl border-l border-gray-200 z-50"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-900">AI Assistant Tips</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
            {currentSection && defaultTips[currentSection as keyof typeof defaultTips] ? (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  Tips for: {currentSection}
                </h4>
                <ul className="space-y-2">
                  {defaultTips[currentSection as keyof typeof defaultTips].map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 bg-indigo-50 rounded-lg text-sm text-indigo-700"
                    >
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Brain className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>Select a section to see relevant AI tips</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};