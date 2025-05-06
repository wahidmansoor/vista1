import React from 'react';
import { motion } from 'framer-motion';
import { RegimensLibrary } from './RegimensLibrary';

const TreatmentProtocols: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
    >
      <RegimensLibrary />
    </motion.div>
  );
};

export default TreatmentProtocols;
