import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export function FeedbackPanel({ onFeedback }: { onFeedback: (isPositive: boolean) => void }): JSX.Element {
  const [hasFeedback, setHasFeedback] = useState(false);
  const [feedbackValue, setFeedbackValue] = useState<boolean | null>(null);

  const handleFeedback = (isPositive: boolean) => {
    if (hasFeedback) return;
    setHasFeedback(true);
    setFeedbackValue(isPositive);
    onFeedback(isPositive);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="mt-4 pt-4 border-t border-indigo-100 flex items-center justify-between"
    >
      <p className="text-sm text-gray-600">Was this response helpful?</p>
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleFeedback(true)}
          disabled={hasFeedback}
          className={`p-2 rounded-lg transition-all ${
            hasFeedback 
              ? feedbackValue === true
                ? 'bg-green-50 text-green-600'
                : 'opacity-50 cursor-not-allowed'
              : 'hover:bg-green-50 active:scale-95'
          }`}
          aria-label="Yes, this was helpful"
        >
          <ThumbsUp className="w-4 h-4" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleFeedback(false)}
          disabled={hasFeedback}
          className={`p-2 rounded-lg transition-all ${
            hasFeedback 
              ? feedbackValue === false
                ? 'bg-red-50 text-red-600'
                : 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-50 active:scale-95'
          }`}
          aria-label="No, this was not helpful"
        >
          <ThumbsDown className="w-4 h-4" />
        </motion.button>
      </div>

      {hasFeedback && (
        <motion.p
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-sm text-indigo-600 ml-2"
        >
          Thank you for your feedback!
        </motion.p>
      )}
    </motion.div>
  );
}