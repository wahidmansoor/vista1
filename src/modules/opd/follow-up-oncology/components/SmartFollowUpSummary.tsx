import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Brain } from 'lucide-react';
import { TNMStage } from '../../types/evaluation';

interface SmartFollowUpSummaryProps {
  cancerType: string;
  stage: string;
  tnmStage: TNMStage;
  diagnosisDate: string;
  currentECOG: number;
  currentKPS: number;
  onGenerate: () => Promise<string>;
  followUpPlan?: any;
}

export const SmartFollowUpSummary: React.FC<SmartFollowUpSummaryProps> = ({
  cancerType,
  stage,
  tnmStage,
  diagnosisDate,
  currentECOG,
  currentKPS,
  onGenerate,
  followUpPlan
}) => {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const generatedSummary = await onGenerate();
      setSummary(generatedSummary);
    } catch (error) {
      console.error('Error generating summary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    const element = document.createElement('a');
    const file = new Blob([summary], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `follow-up-summary-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div 
      className="p-4 bg-white rounded-lg border shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Smart Follow-Up Summary
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateSummary}
            disabled={isGenerating}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </button>
          {summary && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-600">Cancer Type: <span className="font-medium text-gray-900">{cancerType}</span></p>
          <p className="text-gray-600">Stage: <span className="font-medium text-gray-900">{stage}</span></p>
          <p className="text-gray-600">TNM: <span className="font-medium text-gray-900">T{tnmStage.t}N{tnmStage.n}M{tnmStage.m}</span></p>
        </div>
        <div>
          <p className="text-gray-600">Diagnosis Date: <span className="font-medium text-gray-900">{new Date(diagnosisDate).toLocaleDateString()}</span></p>
          <p className="text-gray-600">Current ECOG: <span className="font-medium text-gray-900">{currentECOG}</span></p>
          <p className="text-gray-600">Current KPS: <span className="font-medium text-gray-900">{currentKPS}</span></p>
        </div>
      </div>

      {summary && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: summary }} />
        </div>
      )}

      {!summary && !isGenerating && (
        <div className="text-center py-8 text-gray-500">
          Click "Generate Summary" to create a comprehensive follow-up summary based on current patient data
        </div>
      )}

      {isGenerating && (
        <div className="text-center py-8 text-gray-500 animate-pulse">
          Generating comprehensive follow-up summary...
        </div>
      )}
    </motion.div>
  );
};