import { useState, useCallback } from 'react';
import { AIResponse } from '@/lib/api/aiAgentAPI';

export function useAIResponseHistory(maxHistory: number = 10) {
  const [history, setHistory] = useState<AIResponse[]>([]);

  const addResponse = useCallback((response: AIResponse) => {
    setHistory(prev => [response, ...prev.slice(0, maxHistory - 1)]);
  }, [maxHistory]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    history,
    addResponse,
    clearHistory
  };
}