import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

interface AISummaryProps {
  patientData?: Record<string, any>;
  isEnabled?: boolean;
}

const AISummary: React.FC<AISummaryProps> = ({ 
  patientData,
  isEnabled = process.env.NODE_ENV === 'production' 
}) => {
  const [summaryState, setSummaryState] = useState<'loading' | 'generated' | 'error' | 'disabled'>('loading');
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      setSummaryState('disabled');
      return;
    }

    if (!patientData) {
      setSummaryState('disabled');
      setSummary('No patient data available to generate a summary.');
      return;
    }

    // Simulating an API call for the AI summary
    const generateSummary = async () => {
      try {
        setSummaryState('loading');
        
        // In real implementation, this would be an API call
        // await fetch('/api/generate-summary', { ... })
        
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock summary generation based on available data
        const mockSummary = generateMockSummary(patientData);
        
        setSummary(mockSummary);
        setSummaryState('generated');
      } catch (err) {
        console.error('Failed to generate AI summary:', err);
        setError('Failed to generate summary. Please try again later.');
        setSummaryState('error');
      }
    };

    generateSummary();
  }, [patientData, isEnabled]);

  // Function to generate a mock summary based on patient data
  const generateMockSummary = (data: Record<string, any>): string => {
    // This would be replaced by actual AI-generated content
    return `This 58-year-old patient presents with symptoms suggestive of possible oncological condition. Based on the available data, recommend further investigation including appropriate imaging and possibly tissue diagnosis. Consider referral to specialized oncology service for comprehensive evaluation.`;
  };

  if (summaryState === 'disabled' && !summary) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <svg
          className="w-6 h-6 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <h3 className="text-lg font-semibold text-blue-800">AI Summary</h3>
      </div>
      
      {summaryState === 'loading' && (
        <div className="space-y-2">
          <div className="flex items-center text-blue-600">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            <span>Generating clinical summary...</span>
          </div>
          <div className="h-4 bg-blue-100 rounded animate-pulse"></div>
          <div className="h-4 bg-blue-100 rounded animate-pulse w-5/6"></div>
          <div className="h-4 bg-blue-100 rounded animate-pulse w-4/6"></div>
        </div>
      )}

      {summaryState === 'generated' && summary && (
        <div className="space-y-2">
          <div className="flex items-center text-green-600 mb-2">
            <Check className="w-5 h-5 mr-2" />
            <span>Summary generated</span>
          </div>
          <p className="text-gray-700">{summary}</p>
        </div>
      )}

      {summaryState === 'error' && (
        <div className="space-y-2">
          <div className="flex items-center text-red-600">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error || 'Failed to generate summary'}</span>
          </div>
          <button 
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mt-2"
            onClick={() => {
              if (patientData) {
                setSummaryState('loading');
                // In real implementation, retry logic would go here
                setTimeout(() => {
                  setSummary(generateMockSummary(patientData));
                  setSummaryState('generated');
                }, 1500);
              }
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {summaryState === 'disabled' && summary && (
        <div className="text-sm text-gray-500">
          {summary}
        </div>
      )}
    </div>
  );
};

export default AISummary; 