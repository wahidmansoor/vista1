/**
 * AI Summary Tab Component
 * Displays AI-generated summaries for treatment protocols
 */

import React from 'react';
import { Brain, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AiSummaryTabProps {
  protocol?: any;
}

export const AiSummaryTab: React.FC<AiSummaryTabProps> = ({ protocol }) => {
  if (!protocol) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No protocol selected</p>
      </div>
    );
  }

  const aiNotes = protocol.ai_notes || {};
  const recommendations = aiNotes.recommendations || [];
  const warnings = aiNotes.warnings || [];
  const summary = aiNotes.summary || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Brain className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Generated Summary</h3>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>Summary</span>
          </h4>
          <p className="text-blue-800">{summary}</p>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>AI Recommendations</span>
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec: string, index: number) => (
              <li key={index} className="text-green-800 flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-3 flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>AI Warnings</span>
          </h4>
          <ul className="space-y-2">
            {warnings.map((warning: string, index: number) => (
              <li key={index} className="text-yellow-800 flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">⚠️</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Disclaimer:</strong> AI-generated content is for informational purposes only 
          and should not replace clinical judgment. Always consult current medical guidelines 
          and professional expertise when making treatment decisions.
        </p>
      </div>
    </div>
  );
};

export default AiSummaryTab;
