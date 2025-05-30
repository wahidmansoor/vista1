import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface AiSummaryTabProps {
  protocol: {
    id?: string;
    code: string;
    name?: string;
    tumour_group: string;
    treatment_intent?: string;
    regimen_details?: string;
  };
}

const AiSummaryTab: React.FC<AiSummaryTabProps> = ({ protocol }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSummary = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call an AI service
      // For now, we'll simulate a response after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const simulatedSummary = `
        Protocol ${protocol.code} is a ${protocol.treatment_intent || 'treatment'} regimen 
        for ${protocol.tumour_group} patients. ${protocol.regimen_details || ''}
        
        Key considerations:
        - Monitor for myelosuppression and adjust doses accordingly
        - Ensure adequate hydration before and during treatment
        - Assess renal function before each cycle
        - Consider prophylactic antiemetics
      `;
      
      setSummary(simulatedSummary.trim());
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setError('Failed to generate summary. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">AI-Generated Protocol Summary</h3>
          <Button 
            onClick={generateSummary} 
            disabled={loading}
            size="sm"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Summary'
            )}
          </Button>
        </div>
        
        {summary ? (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md whitespace-pre-line">
            {summary}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-md">
            {error}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md text-gray-500 dark:text-gray-400 text-center">
            Click "Generate Summary" to create an AI-powered overview of this protocol.
          </div>
        )}
        
        {summary && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Note: This summary is AI-generated and should be verified against the official protocol documentation.
          </p>
        )}
      </div>
    </Card>
  );
};

export default AiSummaryTab;
