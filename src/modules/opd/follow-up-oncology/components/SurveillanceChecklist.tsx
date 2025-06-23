import React from 'react';
import { motion } from 'framer-motion';

interface SurveillanceItem {
  title: string;
  frequency: string;
  isDue: boolean;
}

interface SurveillanceChecklistProps {
  investigations: SurveillanceItem[];
  examinations: SurveillanceItem[];
}

export const SurveillanceChecklist: React.FC<SurveillanceChecklistProps> = ({
  investigations,
  examinations
}) => {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700">Surveillance Checklist</h4>
      {[
        { title: 'Investigations', items: investigations },
        { title: 'Examinations', items: examinations }
      ].map((section) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h5 className="text-sm font-medium text-gray-600">{section.title}</h5>
          <ul className="space-y-2">
            {section.items.map((item, index) => (
              <li
                key={index}
                className={`flex items-center p-2 rounded ${
                  item.isDue ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                }`}
              >
                <span className="flex-1">{item.title}</span>
                <span className="text-sm text-gray-500">{item.frequency}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};
