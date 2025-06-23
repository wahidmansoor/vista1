import React from 'react';
import { motion } from 'framer-motion';

interface QolTopic {
  topic: string;
  description: string;
  recommendations: string[];
}

interface QualityOfLifePanelProps {
  topics: QolTopic[];
}

export const QualityOfLifePanel: React.FC<QualityOfLifePanelProps> = ({ topics }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700">Quality of Life Considerations</h4>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {topics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-green-50 rounded-lg"
          >
            <h5 className="font-medium text-green-700">{topic.topic}</h5>
            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
            <ul className="mt-2 space-y-1">
              {topic.recommendations.map((rec, i) => (
                <li key={i} className="text-sm text-gray-700">• {rec}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
