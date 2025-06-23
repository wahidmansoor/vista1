import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { generateSummary } from '@/services/aiAssistant';
import type { CancerType } from '../data/followUpTemplates';
import type { FollowUpPlan } from '../logic/generateFollowUpPlan';
import type { TNMStage } from '../../types/evaluation';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface Props {
  cancerType: CancerType;
  stage: TNMStage;
  intent: 'follow-up';
  plan: FollowUpPlan;
  onInsightsReady?: (insights: string) => void;
}

const AIFollowUpAssistant: React.FC<Props> = ({ cancerType, stage, intent, plan, onInsightsReady }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string | null>(null);

  useEffect(() => {
    async function analyzePlan() {
      if (!plan) return;
      
      setLoading(true);
      setError(null);
      setInsights(null);

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

        setInsights(aiResponse);

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

  const handleExport = () => {
    if (!insights) return;
    const blob = new Blob([insights], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `followup-summary-${cancerType}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300 animate-pulse">
        <Loader2 className="w-4 h-4 animate-spin" />
        AI analyzing follow-up plan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (insights) {
    return (
      <div className="mt-2 flex flex-col gap-2">
        <div className="prose prose-sm dark:prose-invert max-w-none border rounded p-2 bg-gray-50 dark:bg-gray-800">
          <pre className="whitespace-pre-wrap text-xs">{insights}</pre>
        </div>
        {/* Fallback: Remove Tooltip if API is unknown or not compatible */}
        <Button variant="outline" size="sm" onClick={handleExport} className="self-end flex items-center gap-1" title="Export summary as Markdown">
          <Download className="w-4 h-4" /> Export Markdown
        </Button>
      </div>
    );
  }

  return null;
};

export default AIFollowUpAssistant;
