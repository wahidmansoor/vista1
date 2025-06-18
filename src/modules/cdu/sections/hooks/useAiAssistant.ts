/**
 * Custom hook for AI treatment assistant
 * Provides intelligent treatment suggestions based on patient data
 */

import { useState, useCallback, useMemo } from 'react';
import {
  AiSuggestionContext,
  AiSuggestionResponse,
  PatientDataState
} from '../types/diseaseProgress.types';

export const useAiAssistant = (patientData: PatientDataState) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate AI suggestions based on patient data
  const generateSuggestions = useCallback(async (userInput?: string): Promise<string> => {
    const mutationContext = patientData.diseaseStatus.histologyMutation === 'Other' 
      ? patientData.diseaseStatus.otherHistologyMutation 
      : patientData.diseaseStatus.histologyMutation;
    
    let suggestions = '🧠 Smart Treatment Suggestions:\n';

    // Use histology to suggest targeted therapies
    if (mutationContext) {
      switch(mutationContext) {
        case 'HER2 Positive':
          suggestions += '- Consider T-DM1 or Trastuzumab-based therapy\n';
          suggestions += '- Dual HER2 blockade may be appropriate\n';
          suggestions += '- Monitor for cardiotoxicity with echocardiograms\n';
          break;
        case 'KRAS Mutant':
          suggestions += '- KRAS mutation limits anti-EGFR therapy options\n';
          suggestions += '- Consider MEK inhibitor clinical trials\n';
          suggestions += '- KRAS G12C inhibitors if specific mutation present\n';
          break;
        case 'EGFR Mutant':
          suggestions += '- EGFR TKI therapy recommended as first-line\n';
          suggestions += '- Monitor for T790M resistance mutation\n';
          suggestions += '- Consider osimertinib for sensitive mutations\n';
          break;
        case 'PD-L1 Positive':
          suggestions += '- Consider immunotherapy as monotherapy\n';
          suggestions += '- Evaluate combination chemo-immunotherapy\n';
          suggestions += '- Monitor for immune-related adverse events\n';
          break;
        case 'ALK Rearrangement':
          suggestions += '- ALK inhibitor therapy indicated\n';
          suggestions += '- Consider alectinib or brigatinib as first-line\n';
          suggestions += '- Monitor for CNS progression\n';
          break;
        case 'BRAF V600E':
          suggestions += '- BRAF/MEK inhibitor combination recommended\n';
          suggestions += '- Monitor for skin toxicity and pyrexia\n';
          suggestions += '- Regular ophthalmologic examinations\n';
          break;
        case 'MSI-High':
          suggestions += '- Immunotherapy highly effective\n';
          suggestions += '- Consider pembrolizumab or nivolumab\n';
          suggestions += '- Excellent response rates expected\n';
          break;
        default:
          suggestions += '- Consider comprehensive genomic profiling\n';
          suggestions += '- Look for targetable mutations\n';
          suggestions += '- Evaluate for clinical trial eligibility\n';
      }
    }

    // Add performance status based recommendations
    if (patientData.performanceStatus.performanceScore) {
      suggestions += '\n💪 Performance Status Considerations:\n';
      const score = parseInt(patientData.performanceStatus.performanceScore, 10);
      
      if (isNaN(score)) {
        suggestions += '- Performance score invalid, please reassess\n';
      } else if (score === 0) {
        suggestions += '- Excellent performance status - candidate for intensive therapy\n';
        suggestions += '- Consider clinical trial participation\n';
      } else if (score === 1) {
        suggestions += '- Good performance status - standard therapy appropriate\n';
        suggestions += '- Full dose regimens generally tolerated\n';
      } else if (score === 2) {
        suggestions += '- Moderate performance status - consider dose modifications\n';
        suggestions += '- Weekly regimens may be better tolerated\n';
        suggestions += '- Close monitoring for toxicity needed\n';
      } else if (score >= 3) {
        suggestions += '- Poor performance status - best supportive care priority\n';
        suggestions += '- Avoid aggressive therapy\n';
        suggestions += '- Consider palliative care consultation\n';
      }
    }

    // Treatment line specific suggestions
    if (patientData.treatmentLine.treatmentLine) {
      suggestions += '\n🎯 Line of Therapy Recommendations:\n';
      switch(patientData.treatmentLine.treatmentLine) {
        case '1st Line':
          suggestions += '- Standard first-line protocols preferred\n';
          suggestions += '- Consider clinical trial enrollment\n';
          suggestions += '- Establish baseline assessments\n';
          break;
        case '2nd Line':
          suggestions += '- Review first-line response duration\n';
          suggestions += '- Consider alternative drug class\n';
          suggestions += '- Reassess molecular profile if indicated\n';
          break;
        case '3rd Line':
          suggestions += '- Molecular profiling guided therapy essential\n';
          suggestions += '- Early palliative care integration\n';
          suggestions += '- Consider investigational agents\n';
          break;
        case 'Maintenance':
          suggestions += '- Less intensive continuation approach\n';
          suggestions += '- Monitor tolerability closely\n';
          suggestions += '- Regular quality of life assessments\n';
          break;
      }
    }

    // Stage-specific recommendations
    if (patientData.diseaseStatus.stageAtDiagnosis) {
      suggestions += '\n📊 Stage-Based Considerations:\n';
      switch(patientData.diseaseStatus.stageAtDiagnosis) {
        case 'I':
        case 'II':
          suggestions += '- Early-stage disease - curative intent\n';
          suggestions += '- Consider adjuvant therapy\n';
          suggestions += '- Long-term survivorship planning\n';
          break;
        case 'III':
          suggestions += '- Locally advanced disease\n';
          suggestions += '- Multimodal therapy approach\n';
          suggestions += '- Consider neoadjuvant options\n';
          break;
        case 'IV':
          suggestions += '- Metastatic disease - palliative intent\n';
          suggestions += '- Quality of life considerations paramount\n';
          suggestions += '- Regular restaging assessments\n';
          break;
      }
    }

    // Add user input context if provided
    if (userInput && userInput.trim()) {
      suggestions += '\n🔍 Specific Case Considerations:\n';
      suggestions += `- Based on case details: "${userInput.trim()}"\n`;
      suggestions += '- Consider multidisciplinary team consultation\n';
      suggestions += '- Review latest treatment guidelines\n';
    }

    // Add general recommendations
    suggestions += '\n⚠️ General Recommendations:\n';
    suggestions += '- Regular monitoring for treatment response\n';
    suggestions += '- Proactive symptom management\n';
    suggestions += '- Patient education and shared decision-making\n';
    suggestions += '- Consider genetic counseling if hereditary factors\n';

    return suggestions;
  }, [patientData]);

  // Main function to ask AI for suggestions
  const askAi = useCallback(async (userInput?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const suggestions = await generateSuggestions(userInput);
      setResponse(suggestions);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate AI suggestions';
      setError(errorMessage);
      console.error("AI Suggestion Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [generateSuggestions]);

  // Clear response
  const clearResponse = useCallback(() => {
    setResponse(null);
    setError(null);
  }, []);

  // Check if we have sufficient data for good suggestions
  const hasInsufficientData = useMemo(() => {
    return !patientData.diseaseStatus.primaryDiagnosis || 
           !patientData.diseaseStatus.stageAtDiagnosis;
  }, [patientData.diseaseStatus.primaryDiagnosis, patientData.diseaseStatus.stageAtDiagnosis]);

  return {
    response,
    isLoading,
    error,
    askAi,
    clearResponse,
    hasInsufficientData
  };
};
