import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAIResponseHistory } from '@/hooks/useAIResponseHistory';
import { callAIAgent } from '@/lib/api/aiAgentAPI';
import { ModuleType, PromptIntent } from '@/components/ai-agent/types';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Plus, Minus, Send, RefreshCcw, AlertTriangle, ThumbsUp, ThumbsDown, CornerDownLeft } from 'lucide-react';
import { agentLogger } from '@/components/ai-agent/agentLogger';
import { cn } from '@/lib/utils';

interface AIChatAssistantProps {
  module: ModuleType;
  intent: PromptIntent;
  mockMode?: boolean;
  initialContext?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'assistant';
  feedback?: 'positive' | 'negative';
}

export function AIChatAssistant({ module, intent, initialContext = '', mockMode = false }: AIChatAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterationCount, setIterationCount] = useState(0);
  const { history, addResponse, clearHistory } = useAIResponseHistory();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history, scrollToBottom]);

  const enhancePrompt = (feedbackType?: 'refine' | 'elaborate' | 'correct') => {
    if (!feedbackType || history.length === 0) return prompt;
    const previousResponse = history[0].content;
    
    switch (feedbackType) {
      case 'refine':
        return `Refine this: ${previousResponse}`;
      case 'elaborate':
        return `Elaborate on this: ${previousResponse}`;
      case 'correct':
        return `Correct this: ${previousResponse}`;
      default:
        return prompt;
    }
  };

  const handleSubmit = useCallback(async (feedbackType?: 'refine' | 'elaborate' | 'correct') => {
    if ((!prompt.trim() && !feedbackType) || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const enhancedPrompt = enhancePrompt(feedbackType);
      
      const response = await callAIAgent({
        module,
        intent,
        prompt: enhancedPrompt,
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
      scrollToBottom();

      // Log successful interaction
      agentLogger.logInteraction({
        module,
        intent,
        prompt: enhancedPrompt,
        success: true,
        metadata: { iterationCount, feedbackType }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI response';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });

      // Log failed interaction
      agentLogger.logInteraction({
        module,
        intent,
        prompt: prompt.trim(),
        success: false,
        error: errorMessage,
        metadata: { iterationCount, feedbackType }
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

    toast({
      title: 'Feedback Received',
      description: `Thank you for your feedback!`,
      duration: 2000
    });
  }, [module, intent]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto p-4 h-[600px] bg-background rounded-lg border">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {history.map((msg, idx) => (
            <Card key={msg.id} className="p-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="font-medium mb-1">
                    {msg.type === 'assistant' ? 'AI Assistant' : 'You'}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
                {msg.type === 'assistant' && (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(msg.id, true)}
                      title="This was helpful"
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback(msg.id, false)}
                      title="This was not helpful"
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              {idx === 0 && msg.type === 'assistant' && (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmit('elaborate')}
                  >
                    Elaborate
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmit('refine')}
                  >
                    Refine
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSubmit('correct')}
                  >
                    Correct
                  </Button>
                </div>
              )}
            </Card>
          ))}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      {error && (
        <div className="flex items-center gap-2 text-destructive px-4 py-2 rounded bg-destructive/10">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex flex-col gap-2 sticky bottom-0 bg-background pt-2 border-t">
        <Textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="min-h-[60px] resize-none"
          disabled={isLoading}
        />
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearHistory()}
            title="Clear chat history"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Clear Chat
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={isLoading || !prompt.trim()}
            className={cn(
              "min-w-[100px]",
              isLoading && "cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CornerDownLeft className="w-4 h-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}