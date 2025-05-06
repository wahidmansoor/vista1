import React from 'react';
import { motion } from 'framer-motion';
import { formatTimeToAction } from '../utils/emergencyUtils';

interface RedFlagTagProps {
  timeToAction: string;
}

const RedFlagTag: React.FC<RedFlagTagProps> = ({ timeToAction }) => {
  // Determine urgency level color
  const getUrgencyColor = (): { bg: string, text: string } => {
    // Extract minutes from timeToAction
    const timeMatch = timeToAction.match(/(\d+)\s*(minutes?|hours?|days?)/i);
    if (!timeMatch) return { bg: 'bg-yellow-600', text: 'text-white' };
    
    const value = parseInt(timeMatch[1], 10);
    const unit = timeMatch[2].toLowerCase();
    
    // Convert to minutes
    let minutes = value;
    if (unit.startsWith('hour')) minutes = value * 60;
    if (unit.startsWith('day')) minutes = value * 24 * 60;
    
    // Critical: 15 minutes or less
    if (minutes <= 15) return { bg: 'bg-red-600', text: 'text-white' };
    
    // Urgent: 60 minutes or less
    if (minutes <= 60) return { bg: 'bg-orange-500', text: 'text-white' };
    
    // Semi-urgent: 6 hours or less
    if (minutes <= 360) return { bg: 'bg-yellow-500', text: 'text-white' };
    
    // Standard: more than 6 hours
    return { bg: 'bg-blue-500', text: 'text-white' };
  };
  
  const { bg, text } = getUrgencyColor();
  const formattedTime = formatTimeToAction(timeToAction);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text}`}
      whileHover={{ scale: 1.05 }}
    >
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
      </svg>
      Act within {formattedTime}
    </motion.div>
  );
};

export default RedFlagTag;
