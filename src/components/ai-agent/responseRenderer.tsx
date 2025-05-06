import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Loader2 } from 'lucide-react';
import type { AIResponse } from './types';

export function ResponseRenderer({ response }: { response: AIResponse }): JSX.Element {
  if (response.loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600 animate-pulse p-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>AI is thinking...</span>
      </div>
    );
  }

  if (response.error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <span className="font-medium">Error</span>
        </div>
        <p className="text-red-600 text-sm">{response.error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">AI Response</h3>
      </div>
      <div className="prose prose-indigo max-w-none">
        {response.content}
      </div>
      {response.metadata && (
        <div className="mt-3 pt-3 border-t border-indigo-100">
          <div className="text-xs text-gray-500">
            {Object.entries(response.metadata).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="font-medium">{key}:</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}