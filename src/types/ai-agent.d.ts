/**
 * Type definitions for the OncoVista AI Agent System
 */

export type ModuleType = 
  | 'OPD'      // Outpatient Department
  | 'CDU'      // Chemotherapy Day Unit
  | 'Inpatient'
  | 'Palliative'
  | 'RadOnc';   // Radiation Oncology

export type PromptIntent = 
  | 'screening'        // For cancer screening recommendations
  | 'triage'          // For patient triage decisions
  | 'toxicity'        // For toxicity management
  | 'follow-up'       // For follow-up planning
  | 'evaluation';     // For patient evaluation

export type FeedbackType = 'refine' | 'elaborate' | 'correct';

export interface AIResponse {
  id: string;
  content: string;
  timestamp: string;
  metadata?: {
    module: ModuleType;
    intent: PromptIntent;
    model?: string;
    iterationCount?: number;
    feedbackType?: FeedbackType;
  };
}

export interface AIRequestBody {
  prompt: string;
  module: ModuleType;
  intent: PromptIntent;
  context?: string;
  mockMode?: boolean;
  history?: string[];
  iterationCount?: number;
  previousResponse?: string;
  feedbackType?: FeedbackType;
}

export interface AIError extends Error {
  code: string;
  details?: string;
  statusCode?: number;
}

export interface AILogEntry {
  id: string;
  timestamp: string;
  module: ModuleType;
  intent: PromptIntent;
  prompt: string;
  success: boolean;
  error?: string;
  metadata?: Record<string, any>;
}

export interface ChatMessage extends AIResponse {
  type: 'user' | 'assistant';
  feedback?: 'positive' | 'negative';
}

export interface AIAgentLogger {
  logInteraction(entry: Omit<AILogEntry, 'id' | 'timestamp'>): void;
  logFeedback(params: {
    module: ModuleType;
    intent: PromptIntent;
    responseId: string;
    isPositive: boolean;
    timestamp: string;
  }): void;
}