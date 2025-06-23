import React from 'react';
import { motion } from 'framer-motion';

interface RedFlagsProps {
  redFlags: string[];
  urgentFlags?: string[];
}

export const RecurrenceRedFlags: React.FC<RedFlagsProps> = ({
  redFlags,
  urgentFlags = []
}) => {
  return (
    <div className="p-4 bg-red-50 rounded-lg">
      <h4 className="font-semibold text-red-700 mb-3">Recurrence Red Flags</h4>
      <ul className="space-y-2">
        {redFlags.map((flag, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center ${
              urgentFlags.includes(flag)
                ? 'text-red-600 font-medium'
                : 'text-gray-700'
            }`}
          >
            <span className="mr-2">⚠️</span>
            {flag}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};
