import React from 'react';
import { motion } from 'framer-motion';
import { FollowUpInterval } from '../data/followUpTemplates';

interface TimelineProps {
  intervals: Array<{
    interval: FollowUpInterval;
    actions: string[];
  }>;
}

export const FollowUpTimeline: React.FC<TimelineProps> = ({ intervals }) => {
  return (
    <div className="relative">
      <div className="absolute left-4 h-full w-0.5 bg-blue-200"/>
      {intervals.map((interval, index) => (
        <motion.div
          key={interval.interval}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="ml-8 mb-4 relative"
        >
          <div className="absolute -left-6 w-3 h-3 rounded-full bg-blue-500"/>
          <h4 className="font-medium">{interval.interval}</h4>
          <ul className="text-sm text-gray-600">
            {interval.actions.map((action, i) => (
              <li key={i}>{action}</li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};
