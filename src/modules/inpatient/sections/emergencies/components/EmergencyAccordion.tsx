import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmergencyProtocol } from '../data/emergencyProtocols';
import RedFlagTag from './RedFlagTag';
import { FaChevronDown, FaExternalLinkAlt } from 'react-icons/fa';

interface EmergencyAccordionProps {
  protocol: EmergencyProtocol;
  onViewDetails: () => void;
}

const EmergencyAccordion: React.FC<EmergencyAccordionProps> = ({ protocol, onViewDetails }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get category badges
  const renderCategoryBadges = () => {
    const categories = Array.isArray(protocol.category) ? protocol.category : [protocol.category];
    return categories.map(category => (
      <span 
        key={category}
        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2"
      >
        {category}
      </span>
    ));
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Header - always visible */}
      <button
        className="w-full flex justify-between items-center p-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <h3 className="text-lg font-semibold text-gray-800">{protocol.title}</h3>
          {protocol.timeToAction && (
            <RedFlagTag timeToAction={protocol.timeToAction} />
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-500" />
        </motion.div>
      </button>
      
      {/* Preview of symptoms even when closed */}
      <div className="px-4 pb-3 border-t border-gray-100">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          {renderCategoryBadges()}
          <span className="truncate">
            Key signs: {protocol.symptoms.slice(0, 2).join(', ')}
            {protocol.symptoms.length > 2 && '...'}
          </span>
        </div>
      </div>
      
      {/* Expandable content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Key Symptoms</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {protocol.symptoms.slice(0, 3).map((symptom, index) => (
                    <li key={index} className="text-sm">{symptom}</li>
                  ))}
                  {protocol.symptoms.length > 3 && (
                    <li className="text-sm text-gray-500">+ {protocol.symptoms.length - 3} more symptoms</li>
                  )}
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-1">Initial Management</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {protocol.management.slice(0, 2).map((step, index) => (
                    <li key={index} className="text-sm">{step.title}</li>
                  ))}
                  {protocol.management.length > 2 && (
                    <li className="text-sm text-gray-500">+ {protocol.management.length - 2} more steps</li>
                  )}
                </ul>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
                className="mt-2 inline-flex items-center px-3 py-2 border border-red-300 text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Full Protocol <FaExternalLinkAlt className="ml-2 h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyAccordion;
