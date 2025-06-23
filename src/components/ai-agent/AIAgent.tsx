import React, { useState, useCallback } from 'react';
import { useAIResponseHistory } from '@/hooks/useAIResponseHistory';
import { callAIAgent } from '@/lib/api/aiAgentAPI';
import { ModuleType, PromptIntent } from '@/components/ai-agent/types';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle } from 'lucide-react';
import { FeedbackPanel } from './feedbackPanel';
import { agentLogger } from './agentLogger';

interface AIAgentProps {
  module: ModuleType;
  intent: PromptIntent;
  initialContext?: string;
  mockMode?: boolean;
}

const suggestions: Record<ModuleType, string[]> = {
  OPD: ['What screening tests are needed?', 'Evaluate triage for fatigue'],
  CDU: ['Dose adjustment for AUC 5?', 'Manage grade 3 neutropenia'],
  Inpatient: ['Check discharge criteria', 'Evaluate fever workup'],
  Palliative: ['Pain management options', 'End of life care planning'],
  RadOnc: ['Treatment plan review', 'Calculate fractions']
};

export function AIAgent({ module, intent, initialContext = '', mockMode }: AIAgentProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterationCount, setIterationCount] = useState(0);
  const { history, addResponse } = useAIResponseHistory();

  const handleSubmit = useCallback(async (feedbackType?: 'refine' | 'elaborate' | 'correct') => {
    if (!prompt.trim() && !feedbackType) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await callAIAgent({
        module,
        intent,
        prompt,
        context: initialContext,
        mockMode,
        iterationCount,
        previousResponse: history[0]?.content,
        feedbackType,
        history: history.map(h => h.content)
      });

      addResponse(response);
      setIterationCount(i => i + 1);
      setPrompt('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to get AI response',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [prompt, module, intent, initialContext, mockMode, iterationCount, history, addResponse]);

  const handleFeedback = useCallback((responseId: string, isPositive: boolean) => {
    agentLogger.logFeedback({
      module,
      intent,
      responseId,
      isPositive,
      timestamp: new Date().toISOString()
    });
  }, [module, intent]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        {error && (
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
        
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question..."
          className="w-full min-h-[100px] p-2 border rounded-md"
          disabled={isLoading}
        />

        <div className="flex gap-2">
          <Button onClick={() => handleSubmit()} disabled={isLoading || !prompt.trim()}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              'Submit'
            )}
          </Button>

          {history.length > 0 && !isLoading && (
            <>
              <Button variant="outline" onClick={() => handleSubmit('refine')}>
                Refine
              </Button>
              <Button variant="outline" onClick={() => handleSubmit('elaborate')}>
                Elaborate
              </Button>
              <Button variant="outline" onClick={() => handleSubmit('correct')}>
                Correct
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {history.map((response) => (
          <div key={response.id} className="p-4 border rounded-md">
            <div className="prose dark:prose-invert max-w-none">
              {response.content}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(response.timestamp).toLocaleString()}
            </div>
            <FeedbackPanel onFeedback={(isPositive) => handleFeedback(response.id, isPositive)} />
          </div>
        ))}
      </div>

      {!history.length && !isLoading && (
        <div className="flex flex-wrap gap-2">
          {suggestions[module]?.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              onClick={() => {
                setPrompt(suggestion);
              }}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}