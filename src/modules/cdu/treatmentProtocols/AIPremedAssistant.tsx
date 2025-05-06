import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import type { Protocol } from '../../../types/protocol';
import type { Medication } from "../../../types/medications";
import { generateSummary } from '@/services/aiAssistant';

interface Props {
  protocol: Protocol;
  onSuggestionsReady: (suggestions: Medication[]) => void;
}

const AIPremedAssistant: React.FC<Props> = ({ protocol, onSuggestionsReady }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function analyzeProtocol() {
      if (!protocol.treatment?.drugs) return;
      
      setLoading(true);
      setError(null);

      try {
        const context = `
Protocol: ${protocol.code}
Cancer Type: ${protocol.tumour_group}
Drugs:
${protocol.treatment.drugs.map(drug => `- ${drug.name} (${drug.dose})`).join('\n')}
        `;

        const response = await generateSummary({
          prompt: "Analyze this chemotherapy protocol and suggest appropriate premedications based on the drugs, dosing, and cancer type. Format as a JSON array of medication objects with id, name, standard_dose, timing, and category properties.",
          context
        });

        try {
          const suggestions = JSON.parse(response) as Medication[];
          onSuggestionsReady(suggestions);
        } catch (parseError) {
          console.error('Failed to parse AI suggestions:', parseError);
          setError('Invalid response format from AI service');
        }
      } catch (error: any) {
        console.error('AI Analysis Error:', error);
        setError(error.message || 'Failed to analyze protocol');
      } finally {
        setLoading(false);
      }
    }

    analyzeProtocol();
  }, [protocol, onSuggestionsReady]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-indigo-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        AI analyzing protocol for premedication recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return null;
};

export default AIPremedAssistant;