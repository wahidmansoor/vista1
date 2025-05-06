import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { generateSummary } from '@/services/aiAssistant';
import type { CancerType, Stage, Intent } from '../data/followUpTemplates';
import type { FollowUpPlan } from '../logic/generateFollowUpPlan';

interface Props {
  cancerType: CancerType;
  stage: Stage;
  intent: Intent;
  plan: FollowUpPlan;
  onInsightsReady?: (insights: string) => void;
}

const AIFollowUpAssistant: React.FC<Props> = ({ cancerType, stage, intent, plan, onInsightsReady }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function analyzePlan() {
      if (!plan) return;
      
      setLoading(true);
      setError(null);

      try {
        const context = `
Cancer Type: ${cancerType}
Disease Stage: ${stage}
Treatment Intent: ${intent}

Follow-up Plan:
Timeline: ${plan.timeline.map(t => `${t.interval}: ${t.actions.join(', ')}`).join('\n')}

Surveillance:
Investigations: ${plan.surveillance.investigations.map(i => i.title).join(', ')}
Examinations: ${plan.surveillance.examinations.map(e => e.title).join(', ')}

Red Flags to Monitor: ${plan.redFlags.join(', ')}
Urgent Flags: ${plan.urgentFlags.join(', ')}

Quality of Life Topics: ${plan.qolTopics.map(t => t.topic).join(', ')}
Common Symptoms to Monitor: ${plan.commonSymptoms.map(s => s.symptom).join(', ')}
`;

        const aiResponse = await generateSummary({
          prompt: "Review this oncology follow-up plan and provide enhanced recommendations. Consider surveillance frequency, symptom monitoring, quality of life aspects, and potential areas needing closer monitoring. Suggest any additional screenings or monitoring based on current guidelines.",
          context
        });

        if (onInsightsReady) {
          onInsightsReady(aiResponse);
        }

        toast({
          title: "AI Follow-up Insights",
          description: aiResponse,
          duration: 10000
        });

      } catch (error: any) {
        console.error('AI Analysis Error:', error);
        setError(error.message || 'Failed to analyze follow-up plan');
        toast({
          title: "AI Analysis Failed",
          description: "Unable to provide AI insights at this time. Using standard follow-up plan.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    analyzePlan();
  }, [cancerType, stage, intent, plan, onInsightsReady]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-indigo-600">
        <Loader2 className="w-4 h-4 animate-spin" />
        AI analyzing follow-up plan...
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

export default AIFollowUpAssistant;