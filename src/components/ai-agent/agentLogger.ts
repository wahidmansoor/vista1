import LogRocket from 'logrocket';
import { ModuleType, PromptIntent } from './types';
import { isBrowser, getEnvVar } from '@/utils/environment';

/**
 * Logger utility for tracking AI agent interactions and user feedback
 * Integrates with LogRocket for production monitoring
 */
export const agentLogger = {
  logInteraction({
    module,
    intent,
    prompt,
    success,
    error,
    metadata = {}
  }: {
    module: ModuleType;
    intent: PromptIntent;
    prompt: string;
    success: boolean;
    error?: string;
    metadata?: Record<string, any>;
  }): void {
    // Development logging
    if (getEnvVar('NODE_ENV') === 'development') {
      console.group('AI Agent Interaction:');
      console.log({
        module,
        intent,
        prompt,
        success,
        error,
        timestamp: new Date().toISOString(),
        ...metadata
      });
      console.groupEnd();
    }

    // Production logging
    LogRocket.track('AI_AGENT_INTERACTION', {
      module,
      intent,
      promptLength: prompt.length,
      success,
      error: error || null,
      timestamp: new Date().toISOString(),
      environment: getEnvVar('NODE_ENV'),
      ...metadata
    });

    // Log errors separately for better tracking
    if (!success && error) {
      LogRocket.captureException(new Error(error), {
        tags: {
          module,
          intent,
          type: 'ai_agent_error'
        },
        extra: {
          prompt,
          timestamp: new Date().toISOString()
        }
      });
    }
  },

  logFeedback({
    module,
    intent,
    responseId,
    isPositive,
    timestamp,
    iterationCount = 0,
    feedbackType
  }: {
    module: ModuleType;
    intent: PromptIntent;
    responseId: string;
    isPositive: boolean;
    timestamp: string;
    iterationCount?: number;
    feedbackType?: 'refine' | 'elaborate' | 'correct';
  }): void {
    // Development logging
    if (getEnvVar('NODE_ENV') === 'development') {
      console.group('AI Response Feedback:');
      console.log({
        module,
        intent,
        responseId,
        isPositive,
        timestamp,
        iterationCount,
        feedbackType
      });
      console.groupEnd();
    }

    // Production logging
    LogRocket.track('AI_RESPONSE_FEEDBACK', {
      module,
      intent,
      responseId,
      feedback: isPositive ? 'positive' : 'negative',
      timestamp,
      environment: getEnvVar('NODE_ENV'),
      iterationCount,
      feedbackType: feedbackType || 'initial'
    });

    // Track feedback metrics separately
    LogRocket.track('AI_FEEDBACK_METRICS', {
      module,
      intent,
      metricType: 'satisfaction',
      value: isPositive ? 1 : 0,
      iterationCount,
      feedbackType: feedbackType || 'initial',
      timestamp
    });
  }
};