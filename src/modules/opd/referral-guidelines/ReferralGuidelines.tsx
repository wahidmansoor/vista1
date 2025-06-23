import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, AlertTriangle, Loader2 } from 'lucide-react';
import ReferralCard from './ReferralCard'; // Assuming this exists and is styled
import ReferralForm from './ReferralForm';
import TriageResult from './TriageResult';
import { referralTemplates, ReferralTemplate } from './data/referralTemplates';
import { determineTriageResult, TriageInput, TriageResult as TriageResultType } from './logic/triageEngine';
import { generateSummary } from '@/services/aiAssistant';
import { toast } from '@/components/ui/use-toast';
import { callAIAgent } from '@/lib/api/aiAgentAPI';

export default function ReferralGuidelines() {
  const [mockMode, setMockMode] = useState(false);
  const [selectedCancerType, setSelectedCancerType] = useState<string>('');
  const [formData, setFormData] = useState({
    age: '',
    symptoms: '',
    duration: '',
    clinicalFindings: '',
  });
  const [aiTriageResult, setAiTriageResult] = useState<TriageResultType | null>(null);
  const [redFlagAlerts, setRedFlagAlerts] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  
  const cancerTypes = useMemo(() => [...new Set(referralTemplates.map(t => t.cancerType))], []);

  const selectedTemplate = useMemo(() => {
    return referralTemplates.find(t => t.cancerType === selectedCancerType);
  }, [selectedCancerType]);

  const handleTriage = async () => {
    if (!selectedTemplate) return;

    // Local triage engine
    const input: TriageInput = {
      age: parseInt(formData.age) || 0,
      symptoms: formData.symptoms,
      duration: formData.duration,
      clinicalFindings: formData.clinicalFindings,
      highRiskFactors: selectedTemplate.aiTriageFactors.highRiskFactors,
      moderateRiskFactors: selectedTemplate.aiTriageFactors.moderateRiskFactors,
    };

    const slaTimeframes = {
      urgent: selectedTemplate.slaTimeframes.urgent,
      routine: selectedTemplate.slaTimeframes.routine,
    };

    // Get local triage result
    const localResult = determineTriageResult(input, slaTimeframes);
    setAiTriageResult(localResult);

    // Check for Red Flags
    const triggeredFlags: string[] = [];
    const combinedInput = `${formData.symptoms.toLowerCase()} ${formData.clinicalFindings.toLowerCase()}`;
    selectedTemplate.aiTriageFactors.redFlags.forEach(flag => {
      const allTriggersPresent = flag.trigger.every(trigger => 
        combinedInput.includes(trigger.toLowerCase())
      );
      if (allTriggersPresent) {
        triggeredFlags.push(flag.message);
      }
    });
    setRedFlagAlerts(triggeredFlags);

    // Get AI-enhanced insights
    getAIInsights();
  };

  // Update getAIInsights to handle optional values
  const getAIInsights = async () => {
    if (!selectedTemplate || !aiTriageResult) return;
    setIsLoadingAI(true);
    try {
      const context = `
Cancer Type: ${selectedTemplate.pathwayName}
Patient Age: ${formData.age}
Presenting Symptoms: ${formData.symptoms}
Duration: ${formData.duration}
Clinical Findings: ${formData.clinicalFindings}

Initial Triage Result: ${aiTriageResult.urgency}
Red Flags Present: ${redFlagAlerts.length > 0 ? redFlagAlerts.join(', ') : 'None'}

High Risk Factors to Consider:
${selectedTemplate.aiTriageFactors.highRiskFactors.join('\n')}

Moderate Risk Factors to Consider:
${selectedTemplate.aiTriageFactors.moderateRiskFactors.join('\n')}
`;

      const aiResponse = await callAIAgent({
        module: 'OPD',
        intent: 'triage',
        prompt: "Analyze this oncology referral and provide additional insights. Consider the urgency level, risk factors, and any concerning features that might need immediate attention. Suggest additional workup if needed.",
        context,
        mockMode
      });

      toast({
        title: "AI Clinical Insights",
        description: aiResponse.content,
        duration: 10000
      });

    } catch (error: any) {
      console.error('AI Analysis Error:', error);
      toast({
        title: "AI Analysis Error",
        description: "Unable to get AI insights at this time. Using local triage results only.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <h2 className="text-2xl font-bold">📋 Referral Guidelines</h2>
          <button
            onClick={() => setMockMode(!mockMode)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              mockMode ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}
          >
            {mockMode ? '🧪 Mock Mode' : '🤖 Gemini Mode'}
          </button>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg shadow-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Referral Guideline Assistant
        </h2>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Referral Input Section */}
        <div className="space-y-4 p-6 backdrop-blur-sm bg-white bg-opacity-40 rounded-xl shadow-lg border border-gray-200 border-opacity-40 transition-all duration-300 hover:shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800">Clinical Information</h3>

          {/* Cancer Type Selector */}
          <div>
            <label htmlFor="cancerType" className="block text-sm font-medium text-gray-700">
              Select Cancer Type / Pathway
            </label>
            <select
              id="cancerType"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedCancerType}
              onChange={(e) => {
                setSelectedCancerType(e.target.value);
                setAiTriageResult(null); // Reset triage on pathway change
                setRedFlagAlerts([]); // Reset alerts
              }}
            >
              <option value="">Please select</option>
              {cancerTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {selectedCancerType && (
            <>
              {/* Dynamic Referral Form */}
              <ReferralForm formData={formData} setFormData={setFormData} />

              {/* Triage Button */}
              <button
                onClick={handleTriage}
                disabled={!selectedCancerType || isLoadingAI}
                className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoadingAI && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoadingAI ? "Analyzing..." : "Determine Suggested Action"}
              </button>

              {/* Red Flag Alerts */}
              {redFlagAlerts.length > 0 && (
                <div className="space-y-2">
                  {redFlagAlerts.map((alert, index) => (
                    <div key={index} className="p-3 bg-red-100 border border-red-300 rounded-md flex items-center gap-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="text-sm font-medium">{alert}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggested Action / Triage Result */}
              {aiTriageResult && (
                <div className="mt-4 space-y-4">
                   <h4 className="text-md font-semibold text-gray-700">Suggested Action:</h4>
                   <TriageResult aiTriageResult={aiTriageResult} />
                   {/* Optional: Add Print/Export button here later */}
                </div>
              )}
            </>
          )}
        </div>

        {/* Guideline Information Display */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Guideline Details</h3>
          {selectedTemplate ? (
             <ReferralCard
                key={selectedTemplate.id}
                guideline={{
                  condition: selectedTemplate.pathwayName,
                  urgency: selectedTemplate.urgencyLevel, // Or derive from triage result
                  criteria: selectedTemplate.requiredInformation.clinical,
                  workup: [ // Combine risk factors for display if needed
                    ...selectedTemplate.aiTriageFactors.highRiskFactors.map(f => `High Risk: ${f}`),
                    ...selectedTemplate.aiTriageFactors.moderateRiskFactors.map(f => `Moderate Risk: ${f}`),
                  ],
                }}
              />
          ) : (
            <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
              Select a cancer type to view guideline details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
